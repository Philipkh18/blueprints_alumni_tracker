import type { Profile } from '@/lib/types'
import MemberCard from './MemberCard'

export default function MemberGrid({ profiles }: { profiles: Profile[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {profiles.map((profile) => (
        <MemberCard key={profile.id} profile={profile} />
      ))}
    </div>
  )
}
