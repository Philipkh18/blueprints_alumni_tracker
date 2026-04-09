import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { notion, getProfileByClerkId, deleteProfileAndRelated } from '@/lib/notion'

async function requireAdmin(userId: string) {
  const viewer = await getProfileByClerkId(userId)
  return viewer?.is_admin ?? false
}

// PATCH — toggle is_admin
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await requireAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { is_admin } = await req.json()

  await notion.pages.update({
    page_id: id,
    properties: { is_admin: { checkbox: is_admin } },
  })

  return NextResponse.json({ success: true })
}

// DELETE — archive profile + related data
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await requireAdmin(userId))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await deleteProfileAndRelated(id)

  return NextResponse.json({ success: true })
}
