import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createProfile } from '@/lib/notion'

export async function POST(req: Request) {
  const WEBHOOK_SECRET =
    process.env.CLERK_WEBHOOK_SIGNING_SECRET ?? process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return new Response('Missing Clerk webhook signing secret', { status: 500 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const body = await req.text()

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (error) {
    console.error('[POST /api/webhooks/clerk] Webhook signature verification failed.', { svix_id, error })
    return new Response('Invalid signature', { status: 400 })
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data
    const email = email_addresses?.[0]?.email_address ?? null
    const full_name =
      [first_name, last_name].filter(Boolean).join(' ') ||
      email?.split('@')[0] ||
      'New Member'

    console.log('[POST /api/webhooks/clerk] user.created — creating Notion profile.', { clerkId: id, full_name, email })

    try {
      await createProfile(id, full_name)
      console.log('[POST /api/webhooks/clerk] Notion profile created.', { clerkId: id })
    } catch (err) {
      console.error('[POST /api/webhooks/clerk] Failed to create Notion profile.', { clerkId: id, full_name, error: err })
      return new Response('Error creating profile', { status: 500 })
    }
  }

  return new Response('OK', { status: 200 })
}
