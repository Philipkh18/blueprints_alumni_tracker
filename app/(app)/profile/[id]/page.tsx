import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import {
  getProfileById,
  getProfileByClerkId,
  getInternshipsByProfileId,
  getClubsByProfileId,
} from '@/lib/notion'
import InternshipList from '@/components/InternshipList'
import ClubList from '@/components/ClubList'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()

  const [profile, internships, clubs, viewer] = await Promise.all([
    getProfileById(id),
    getInternshipsByProfileId(id),
    getClubsByProfileId(id),
    getProfileByClerkId(userId!),
  ])

  if (!profile) notFound()

  const isOwner = profile.clerk_id === userId
  const isAdmin = viewer?.is_admin ?? false
  const canEdit = isOwner || isAdmin

  const initials = profile.full_name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-start gap-6">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-20 h-20 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary shrink-0">
            {initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              {profile.graduation_year && (
                <p className="text-muted-foreground">Class of {profile.graduation_year}</p>
              )}
            </div>
            {canEdit && (
              <Link href={`/profile/edit?id=${profile.id}`}>
                <Button variant="outline" size="sm">Edit Profile</Button>
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {profile.major && <Badge variant="secondary">{profile.major}</Badge>}
            {profile.minor && <Badge variant="outline">Minor: {profile.minor}</Badge>}
          </div>

          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline mt-2 inline-block"
            >
              LinkedIn →
            </a>
          )}
        </div>
      </div>

      {profile.bio && (
        <section>
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
        </section>
      )}

      <InternshipList internships={internships} />
      <ClubList clubs={clubs} />
    </div>
  )
}
