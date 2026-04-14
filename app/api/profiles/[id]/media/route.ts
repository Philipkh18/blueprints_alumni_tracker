import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getProfileByClerkId, getProfileById, notion, pageToProfile } from '@/lib/notion'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const NOTION_API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = '2026-03-11'
const MAX_UPLOAD_SIZE = 20 * 1024 * 1024

function notionHeaders() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
  }
}

async function createFileUpload(filename: string, contentType: string) {
  const res = await fetch(`${NOTION_API_BASE}/file_uploads`, {
    method: 'POST',
    headers: {
      ...notionHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'single_part',
      filename,
      content_type: contentType,
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to create Notion file upload.')
  }

  return res.json() as Promise<{ id: string; upload_url: string }>
}

async function sendFileToUpload(uploadUrl: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: notionHeaders(),
    body: formData,
  })

  if (!res.ok) {
    throw new Error('Failed to send file to Notion upload URL.')
  }
}

async function attachFileToPage(pageId: string, target: 'avatar' | 'banner', fileUploadId: string) {
  const res = await fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      ...notionHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      target === 'avatar'
        ? {
            icon: {
              type: 'file_upload',
              file_upload: { id: fileUploadId },
            },
          }
        : {
            cover: {
              type: 'file_upload',
              file_upload: { id: fileUploadId },
            },
          }
    ),
  })

  if (!res.ok) {
    throw new Error('Failed to attach uploaded file to page.')
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const [profile, viewer] = await Promise.all([
    getProfileById(id),
    getProfileByClerkId(userId),
  ])

  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwner = profile.clerk_id === userId
  const isAdmin = viewer?.is_admin ?? false
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const formData = await req.formData()
  const target = formData.get('target')
  const file = formData.get('file')

  if (target !== 'avatar' && target !== 'banner') {
    return NextResponse.json({ error: 'Invalid target' }, { status: 400 })
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image uploads are supported' }, { status: 400 })
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return NextResponse.json({ error: 'Images must be 20 MB or smaller' }, { status: 400 })
  }

  try {
    const upload = await createFileUpload(file.name, file.type || 'application/octet-stream')
    await sendFileToUpload(upload.upload_url, file)
    await attachFileToPage(id, target, upload.id)

    const updated = await notion.pages.retrieve({ page_id: id })
    const nextProfile = pageToProfile(updated as PageObjectResponse)
    return NextResponse.json({
      success: true,
      profile: {
        avatar_url: nextProfile.avatar_url,
        banner_url: nextProfile.banner_url,
      },
    })
  } catch (error) {
    console.error('Failed to upload profile media.', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
