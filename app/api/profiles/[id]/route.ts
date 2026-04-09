import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  getProfileById,
  getProfileByClerkId,
  updateProfile,
  syncInternships,
  syncClubs,
} from '@/lib/notion'

export async function PATCH(
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

  const body = await req.json()
  const { profile: profileData, internships, clubs } = body

  await Promise.all([
    updateProfile(id, profileData),
    syncInternships(id, internships ?? []),
    syncClubs(id, clubs ?? []),
  ])

  return NextResponse.json({ success: true })
}
