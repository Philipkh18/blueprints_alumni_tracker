import { Suspense } from 'react'
import { getAllProfiles } from '@/lib/notion'
import MemberGrid from '@/components/members/MemberGrid'
import MemberFilters from '@/components/members/MemberFilters'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'

export const metadata = { title: 'Members — Blueprints for Pangaea' }
export const dynamic = 'force-dynamic'

type SearchParams = {
  q?: string
  year?: string
  major?: string
  status?: string
  team?: string
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const [profiles, all] = await Promise.all([
    getAllProfiles({
      q: params.q,
      year: params.year ? parseInt(params.year) : undefined,
      major: params.major,
      status: params.status,
      team: params.team,
    }),
    getAllProfiles(),
  ])

  const years = [...new Set(all.map((p) => p.graduation_year).filter(Boolean))].sort(
    (a, b) => b! - a!
  ) as number[]
  const majors = [...new Set(all.map((p) => p.major).filter(Boolean))].sort() as string[]
  const teams = [...new Set(all.map((p) => p.team).filter(Boolean))].sort() as string[]

  const hasFilters = !!(params.q || params.year || params.major || params.status || params.team)

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
            <p className="text-sm text-muted-foreground">
              {profiles.length} member{profiles.length !== 1 ? 's' : ''}
              {hasFilters && ' matching filters'}
              {' '}· {all.length} total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px]">
            {all.filter((p) => p.status === 'Current Member').length} active
          </Badge>
          <Badge variant="outline" className="text-[11px]">
            {all.filter((p) => p.status === 'Alumni').length} alumni
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Suspense>
        <MemberFilters years={years} majors={majors} teams={teams} />
      </Suspense>

      {/* Results */}
      {profiles.length === 0 ? (
        <div className="brand-panel flex flex-col items-center justify-center rounded-[2rem] py-16">
          <Users className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No members found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <MemberGrid profiles={profiles} />
      )}
    </div>
  )
}
