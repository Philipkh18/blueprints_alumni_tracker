import { getAllProfiles } from '@/lib/notion'
import MemberDirectory from '@/components/members/MemberDirectory'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'

export const metadata = { title: 'Members — Blueprints for Pangaea' }
export const dynamic = 'force-dynamic'

export default async function MembersPage() {
  const profiles = await getAllProfiles()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-brand-ocean),var(--color-brand-bright))] text-primary-foreground shadow-[0_12px_24px_oklch(0.5_0.18_257/0.22)]">
            <Users className="size-4" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Member Directory</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px]">
            {profiles.filter((p) => p.status === 'Current Member').length} active
          </Badge>
          <Badge variant="outline" className="text-[11px]">
            {profiles.filter((p) => p.status === 'Alumni').length} alumni
          </Badge>
        </div>
      </div>

      {/* Client-side filtering */}
      <MemberDirectory profiles={profiles} />
    </div>
  )
}
