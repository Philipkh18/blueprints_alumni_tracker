import {
  Cog,
  Code2,
  Megaphone,
  Globe2,
  Wallet,
  Users,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

// Team names MUST match the Notion `team` select options exactly (character for character).
// If you rename a team here, also rename the matching option in the Profiles and Team Updates DBs.
export type TeamSlug =
  | 'operations'
  | 'technology'
  | 'development'
  | 'expansion'
  | 'finance'
  | 'internal'
  | 'new-analysts'

export type TeamDef = {
  slug: TeamSlug
  name: string
  description: string
  mission: string
  icon: LucideIcon
  accent: string
}

const LEGACY_TEAM_NAME_MAP: Record<string, string> = {
  Tech: 'Technology',
  'Tech Team': 'Technology',
}

export const TEAMS: readonly TeamDef[] = [
  {
    slug: 'operations',
    name: 'Operations',
    description: 'Keeps the chapter running — logistics, meetings, and rhythm.',
    mission: 'Coordinate meetings, attendance, and the operational backbone of the chapter.',
    icon: Cog,
    accent: 'linear-gradient(135deg, oklch(0.58 0.17 257), oklch(0.72 0.16 230))',
  },
  {
    slug: 'technology',
    name: 'Technology',
    description: 'Builds the tools, data pipelines, and internal products.',
    mission: 'Ship internal tooling, dashboards, and research infrastructure for client projects.',
    icon: Code2,
    accent: 'linear-gradient(135deg, oklch(0.68 0.17 210), oklch(0.78 0.14 195))',
  },
  {
    slug: 'development',
    name: 'Development',
    description: 'Brand, outreach, and the public voice of Blueprints.',
    mission: 'Run social, marketing, and events that grow the Blueprints brand on campus.',
    icon: Megaphone,
    accent: 'linear-gradient(135deg, oklch(0.66 0.17 160), oklch(0.74 0.14 145))',
  },
  {
    slug: 'expansion',
    name: 'Expansion',
    description: 'Opens new chapters and external partnerships.',
    mission: 'Source, vet, and launch new chapters; maintain partner and sponsor relationships.',
    icon: Globe2,
    accent: 'linear-gradient(135deg, oklch(0.72 0.17 60), oklch(0.78 0.15 45))',
  },
  {
    slug: 'finance',
    name: 'Finance',
    description: 'Budgeting, dues, and financial reporting.',
    mission: 'Own budget, dues collection, reimbursements, and monthly reporting.',
    icon: Wallet,
    accent: 'linear-gradient(135deg, oklch(0.6 0.18 300), oklch(0.7 0.15 285))',
  },
  {
    slug: 'internal',
    name: 'Internal',
    description: 'Member experience, culture, and retention.',
    mission: 'Design socials, mentorship programming, and the member lifecycle from onboarding to alumni.',
    icon: Users,
    accent: 'linear-gradient(135deg, oklch(0.66 0.18 15), oklch(0.74 0.15 30))',
  },
  {
    slug: 'new-analysts',
    name: 'New Analysts',
    description: 'This semester\u2019s cohort finding their footing.',
    mission: 'Learn the stack, ship a first project, and pick a permanent team by end of semester.',
    icon: Sparkles,
    accent: 'linear-gradient(135deg, oklch(0.56 0.18 265), oklch(0.7 0.16 250))',
  },
] as const

export const PROFILE_TEAM_OPTIONS = [
  'Technology',
  'Operations',
  'Finance',
  'Development',
  'Internal',
  'Expansion',
] as const

export function normalizeTeamName(name: string | null): string | null {
  if (!name) return null
  return LEGACY_TEAM_NAME_MAP[name] ?? name
}

export function getTeamByName(name: string | null): TeamDef | null {
  const normalized = normalizeTeamName(name)
  if (!normalized) return null
  return TEAMS.find((t) => t.name === normalized) ?? null
}
