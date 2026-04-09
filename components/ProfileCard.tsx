import Link from 'next/link'
import { Profile } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

type Props = { profile: Profile }

export default function ProfileCard({ profile }: Props) {
  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Link href={`/profile/${profile.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold text-primary">
              {initials}
            </div>
          )}
          <div>
            <p className="font-semibold">{profile.full_name}</p>
            {profile.graduation_year && (
              <p className="text-sm text-muted-foreground">Class of {profile.graduation_year}</p>
            )}
          </div>
          {profile.major && (
            <Badge variant="secondary" className="text-xs">
              {profile.major}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
