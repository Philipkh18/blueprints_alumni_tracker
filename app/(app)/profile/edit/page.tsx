import { redirect, notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import {
  getProfileById,
  getProfileByClerkId,
  getInternshipsByProfileId,
  getClubsByProfileId,
} from '@/lib/notion'
import ProfileForm from '@/components/ProfileForm'

export const dynamic = 'force-dynamic'

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { userId } = await auth()
  const { id } = await searchParams

  let profileId = id

  if (!profileId) {
    const own = await getProfileByClerkId(userId!)
    profileId = own?.id
  }

  if (!profileId) redirect('/dashboard')

  const [profile, internships, clubs, viewer] = await Promise.all([
    getProfileById(profileId),
    getInternshipsByProfileId(profileId),
    getClubsByProfileId(profileId),
    getProfileByClerkId(userId!),
  ])

  if (!profile) notFound()

  const isOwner = profile.clerk_id === userId
  const isAdmin = viewer?.is_admin ?? false
  if (!isOwner && !isAdmin) redirect('/dashboard')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <ProfileForm
        profile={profile}
        internships={internships}
        clubs={clubs}
        isAdminEdit={isAdmin && !isOwner}
      />
    </div>
  )
}
