import { getAllWorkExperiences, getAllProfiles } from '@/lib/notion'
import type { WorkExperience, Profile } from '@/lib/types'
import { Briefcase } from 'lucide-react'
import CareersExplorer from '@/components/careers/CareersExplorer'

export const metadata = { title: 'Careers — Blueprints for Pangaea' }
export const dynamic = 'force-dynamic'

export type ExperienceWithMember = WorkExperience & {
  member_name: string
  member_avatar: string | null
  member_id: string
  graduation_year: number | null
}

function buildExperiencesWithMembers(
  experiences: WorkExperience[],
  profiles: Profile[]
): ExperienceWithMember[] {
  const profileMap = new Map(profiles.map((p) => [p.id, p]))

  return experiences
    .filter((exp) => exp.company && exp.role)
    .map((exp) => {
      const member = profileMap.get(exp.profile_id)
      return {
        ...exp,
        member_name: member?.full_name ?? 'Unknown member',
        member_avatar: member?.avatar_url ?? null,
        member_id: exp.profile_id,
        graduation_year: member?.graduation_year ?? null,
      }
    })
}

export type CompanyGroup = {
  company: string
  experiences: ExperienceWithMember[]
  uniqueMembers: number
  industries: string[]
}

function groupByCompany(experiences: ExperienceWithMember[]): CompanyGroup[] {
  const map = new Map<string, ExperienceWithMember[]>()

  for (const exp of experiences) {
    const key = exp.company.trim().toLowerCase()
    const existing = map.get(key)
    if (existing) {
      existing.push(exp)
    } else {
      map.set(key, [exp])
    }
  }

  return Array.from(map.values())
    .map((exps) => ({
      company: exps[0].company,
      experiences: exps.sort((a, b) => b.start_date.localeCompare(a.start_date)),
      uniqueMembers: new Set(exps.map((e) => e.profile_id)).size,
      industries: [...new Set(exps.map((e) => e.industry).filter(Boolean))] as string[],
    }))
    .sort((a, b) => b.uniqueMembers - a.uniqueMembers || a.company.localeCompare(b.company))
}

function computeStats(experiences: ExperienceWithMember[]) {
  const companyCount = new Map<string, number>()
  const industryCount = new Map<string, number>()
  const roleCount = new Map<string, number>()

  for (const exp of experiences) {
    const companyKey = exp.company.trim().toLowerCase()
    companyCount.set(companyKey, (companyCount.get(companyKey) ?? 0) + 1)

    if (exp.industry) {
      industryCount.set(exp.industry, (industryCount.get(exp.industry) ?? 0) + 1)
    }

    const roleKey = exp.role.trim().toLowerCase()
    roleCount.set(roleKey, (roleCount.get(roleKey) ?? 0) + 1)
  }

  const topCompanies = [...companyCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([, count], i, arr) => {
      // Find original casing from experiences
      const key = [...companyCount.entries()][i]?.[0]
      const original = experiences.find((e) => e.company.trim().toLowerCase() === key)?.company
      return { name: original ?? arr[i][0], count }
    })

  const topIndustries = [...industryCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  const topRoles = [...roleCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([, count], i) => {
      const key = [...roleCount.entries()][i]?.[0]
      const original = experiences.find((e) => e.role.trim().toLowerCase() === key)?.role
      return { name: original ?? '', count }
    })

  return { topCompanies, topIndustries, topRoles }
}

export default async function CareersPage() {
  let experiences: WorkExperience[] = []
  let profiles: Profile[] = []
  let error = false

  try {
    ;[experiences, profiles] = await Promise.all([
      getAllWorkExperiences(),
      getAllProfiles(),
    ])
  } catch {
    error = true
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader count={0} />
        <div className="brand-panel flex flex-col items-center justify-center rounded-[2rem] py-16">
          <Briefcase className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">Could not load career data.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Try refreshing the page.</p>
        </div>
      </div>
    )
  }

  const withMembers = buildExperiencesWithMembers(experiences, profiles)
  const companyGroups = groupByCompany(withMembers)
  const stats = computeStats(withMembers)

  const employmentTypes = [
    ...new Set(withMembers.map((e) => e.employment_type).filter(Boolean)),
  ] as string[]
  const industries = [
    ...new Set(withMembers.map((e) => e.industry).filter(Boolean)),
  ].sort() as string[]

  return (
    <div className="space-y-6">
      <PageHeader count={withMembers.length} />
      <CareersExplorer
        companyGroups={companyGroups}
        stats={stats}
        employmentTypes={employmentTypes}
        industries={industries}
      />
    </div>
  )
}

function PageHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-brand-ocean),var(--color-brand-bright))] text-primary-foreground shadow-[0_12px_24px_oklch(0.5_0.18_257/0.22)]">
        <Briefcase className="size-4" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Career Explorer</h1>
        <p className="text-sm text-muted-foreground">
          {count} work experience{count !== 1 ? 's' : ''} across the Blueprints network
        </p>
      </div>
    </div>
  )
}
