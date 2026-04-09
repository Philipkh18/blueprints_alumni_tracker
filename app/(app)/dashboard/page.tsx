import { getAllProfiles } from '@/lib/notion'
import ProfileCard from '@/components/ProfileCard'
import DashboardFilters from './DashboardFilters'

export const dynamic = 'force-dynamic'

type SearchParams = { q?: string; year?: string; major?: string }

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const profiles = await getAllProfiles({
    q: params.q,
    year: params.year ? parseInt(params.year) : undefined,
    major: params.major,
  })

  // Derive filter options from all profiles (unfiltered)
  const all = await getAllProfiles()
  const years = [...new Set(all.map((p) => p.graduation_year).filter(Boolean))].sort(
    (a, b) => b! - a!
  ) as number[]
  const majors = [...new Set(all.map((p) => p.major).filter(Boolean))].sort() as string[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alumni Directory</h1>
        <p className="text-muted-foreground mt-1">
          {profiles.length} member{profiles.length !== 1 ? 's' : ''}
        </p>
      </div>

      <DashboardFilters years={years} majors={majors} />

      {profiles.length === 0 ? (
        <p className="text-muted-foreground">No members found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      )}
    </div>
  )
}
