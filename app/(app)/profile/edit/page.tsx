import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import {
  createProfile,
  getProfileById,
  getProfileByClerkId,
  getAllProfiles,
  getInternshipsByProfileId,
  getClubsByProfileId,
} from '@/lib/notion'
import ProfileForm from '@/components/ProfileForm'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const { id } = await searchParams

  let profileId = id

  if (!profileId) {
    let own = await getProfileByClerkId(userId)

    if (!own) {
      const user = await currentUser()
      const fullName =
        [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
        user?.emailAddresses[0]?.emailAddress?.split('@')[0] ||
        'New Member'

      try {
        await createProfile(userId, fullName)
        own = await getProfileByClerkId(userId)
      } catch (error) {
        console.error('Failed to create missing profile during edit flow.', error)
      }
    }

    profileId = own?.id
  }

  if (!profileId) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Set Up Your Profile</h1>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t find a profile linked to your account, so there isn&apos;t anything to
            edit yet.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile link missing</CardTitle>
            <CardDescription>
              We tried to create your profile automatically. If you already appear in the member
              directory, ask an admin to link your account to that existing record.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/dashboard" className={buttonVariants({ size: 'sm' })}>
              Open Member Directory
            </Link>
            <Link
              href="/home"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              Back Home
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [profile, allProfiles, internships, clubs, viewer] = await Promise.all([
    getProfileById(profileId),
    getAllProfiles(),
    getInternshipsByProfileId(profileId),
    getClubsByProfileId(profileId),
    getProfileByClerkId(userId),
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
        allProfiles={allProfiles}
        internships={internships}
        clubs={clubs}
        isAdminEdit={isAdmin && !isOwner}
      />
    </div>
  )
}
