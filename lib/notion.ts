import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Profile, MemberStatus, WorkExperience, EmploymentType, Club } from './types'

export const notion = new Client({ auth: process.env.NOTION_TOKEN })

const PROFILES_DB = process.env.NOTION_PROFILES_DB_ID!
const INTERNSHIPS_DB = process.env.NOTION_INTERNSHIPS_DB_ID!
const CLUBS_DB = process.env.NOTION_CLUBS_DB_ID!

// ─── Property helpers ────────────────────────────────────────────────────────

function getText(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop]
  if (!p) return ''
  if (p.type === 'title') return p.title[0]?.plain_text ?? ''
  if (p.type === 'rich_text') return p.rich_text[0]?.plain_text ?? ''
  return ''
}

function getNumber(page: PageObjectResponse, prop: string): number | null {
  const p = page.properties[prop]
  return p?.type === 'number' ? p.number : null
}

function getBool(page: PageObjectResponse, prop: string): boolean {
  const p = page.properties[prop]
  return p?.type === 'checkbox' ? p.checkbox : false
}

function getUrl(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop]
  return p?.type === 'url' ? p.url : null
}

function getDate(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop]
  return p?.type === 'date' ? (p.date?.start ?? null) : null
}

function getSelect(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop]
  return p?.type === 'select' ? (p.select?.name ?? null) : null
}

function getMultiSelect(page: PageObjectResponse, prop: string): string[] {
  const p = page.properties[prop]
  return p?.type === 'multi_select' ? p.multi_select.map((s) => s.name) : []
}

function getRelationId(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop]
  return p?.type === 'relation' ? (p.relation[0]?.id ?? null) : null
}

function getPageIconUrl(page: PageObjectResponse): string | null {
  if (!page.icon) return null
  if (page.icon.type === 'external') return page.icon.external.url
  if (page.icon.type === 'file') return page.icon.file.url
  return null
}

function getPageCoverUrl(page: PageObjectResponse): string | null {
  if (!page.cover) return null
  if (page.cover.type === 'external') return page.cover.external.url
  if (page.cover.type === 'file') return page.cover.file.url
  return null
}

// ─── Page → Type converters ──────────────────────────────────────────────────

export function pageToProfile(page: PageObjectResponse): Profile {
  return {
    id: page.id,
    clerk_id: getText(page, 'clerk_id'),
    full_name: getText(page, 'Name'),
    graduation_year: getNumber(page, 'graduation_year'),
    major: getText(page, 'major') || null,
    minor: getText(page, 'minor') || null,
    bio: getText(page, 'bio') || null,
    linkedin_url: getUrl(page, 'linkedin_url'),
    github_url: getUrl(page, 'github_url'),
    instagram_url: getUrl(page, 'instagram_url'),
    contact_email: getText(page, 'contact_email') || null,
    avatar_url: getPageIconUrl(page) ?? getUrl(page, 'avatar_url'),
    banner_url: getPageCoverUrl(page) ?? getUrl(page, 'banner_url'),
    is_admin: getBool(page, 'is_admin'),
    created_at: page.created_time,
    status: (getSelect(page, 'status') as MemberStatus) ?? null,
    team: getSelect(page, 'team') ?? null,
    role_title: getText(page, 'role_title') || null,
    location: getText(page, 'location') || null,
    hometown: getText(page, 'hometown') || null,
    skills: getMultiSelect(page, 'skills'),
    hobbies: getMultiSelect(page, 'hobbies'),
    current_classes: getMultiSelect(page, 'current_classes'),
    chapter_role: getText(page, 'chapter_role') || null,
    fun_fact: getText(page, 'fun_fact') || null,
  }
}

export function pageToWorkExperience(page: PageObjectResponse): WorkExperience {
  return {
    id: page.id,
    profile_id: getRelationId(page, 'Profile') ?? '',
    company: getText(page, 'company'),
    role: getText(page, 'Name'),
    start_date: getDate(page, 'start_date') ?? '',
    end_date: getDate(page, 'end_date'),
    description: getText(page, 'description') || null,
    employment_type: (getSelect(page, 'employment_type') as EmploymentType) ?? null,
    industry: getSelect(page, 'industry') ?? null,
    location: getText(page, 'location') || null,
    company_website: getUrl(page, 'company_website'),
    is_current: getBool(page, 'is_current'),
  }
}

/** @deprecated Use pageToWorkExperience */
export const pageToInternship = pageToWorkExperience

export function pageToClub(page: PageObjectResponse): Club {
  return {
    id: page.id,
    profile_id: getRelationId(page, 'Profile') ?? '',
    club_name: getText(page, 'Name'),
    role: getText(page, 'role') || null,
    start_year: getNumber(page, 'start_year'),
    end_year: getNumber(page, 'end_year'),
  }
}

// ─── Query helpers ───────────────────────────────────────────────────────────

export async function getProfileByClerkId(clerkId: string): Promise<Profile | null> {
  const res = await notion.databases.query({
    database_id: PROFILES_DB,
    filter: { property: 'clerk_id', rich_text: { equals: clerkId } },
  })
  const page = res.results[0]
  return page ? pageToProfile(page as PageObjectResponse) : null
}

export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id })
    return pageToProfile(page as PageObjectResponse)
  } catch {
    return null
  }
}

export async function getAllProfiles(filters?: {
  q?: string
  year?: number
  major?: string
  status?: string
  team?: string
}): Promise<Profile[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: any[] = []

  if (filters?.q) {
    conditions.push({ property: 'Name', title: { contains: filters.q } })
  }
  if (filters?.year) {
    conditions.push({ property: 'graduation_year', number: { equals: filters.year } })
  }
  if (filters?.major) {
    conditions.push({ property: 'major', rich_text: { contains: filters.major } })
  }
  if (filters?.status) {
    conditions.push({ property: 'status', select: { equals: filters.status } })
  }
  if (filters?.team) {
    conditions.push({ property: 'team', select: { equals: filters.team } })
  }

  const res = await notion.databases.query({
    database_id: PROFILES_DB,
    filter:
      conditions.length > 1
        ? { and: conditions }
        : conditions.length === 1
          ? conditions[0]
          : undefined,
    sorts: [{ property: 'Name', direction: 'ascending' }],
  })

  return res.results.map((p) => pageToProfile(p as PageObjectResponse))
}

export async function getInternshipsByProfileId(profileId: string): Promise<WorkExperience[]> {
  const res = await notion.databases.query({
    database_id: INTERNSHIPS_DB,
    filter: { property: 'Profile', relation: { contains: profileId } },
  })
  return res.results.map((p) => pageToWorkExperience(p as PageObjectResponse))
}

export async function getAllWorkExperiences(): Promise<WorkExperience[]> {
  const pages: PageObjectResponse[] = []
  let cursor: string | undefined

  // Paginate through all results
  do {
    const res = await notion.databases.query({
      database_id: INTERNSHIPS_DB,
      start_cursor: cursor,
      page_size: 100,
      sorts: [{ property: 'company', direction: 'ascending' }],
    })
    pages.push(...(res.results as PageObjectResponse[]))
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return pages.map(pageToWorkExperience)
}

export async function getClubsByProfileId(profileId: string): Promise<Club[]> {
  const res = await notion.databases.query({
    database_id: CLUBS_DB,
    filter: { property: 'Profile', relation: { contains: profileId } },
  })
  return res.results.map((p) => pageToClub(p as PageObjectResponse))
}

// ─── Mutation helpers ────────────────────────────────────────────────────────

export async function createProfile(clerkId: string, fullName: string): Promise<void> {
  await notion.pages.create({
    parent: { database_id: PROFILES_DB },
    properties: {
      Name: { title: [{ text: { content: fullName } }] },
      clerk_id: { rich_text: [{ text: { content: clerkId } }] },
      is_admin: { checkbox: false },
    },
  })
}

export async function updateProfile(
  profileId: string,
  data: {
    full_name: string
    graduation_year: number | null
    major: string | null
    minor: string | null
    bio: string | null
    linkedin_url: string | null
    avatar_url?: string | null
    banner_url?: string | null
    status?: string | null
    team?: string | null
    role_title?: string | null
    location?: string | null
    skills?: string[]
    fun_fact?: string | null
  }
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: Record<string, any> = {
    Name: { title: [{ text: { content: data.full_name } }] },
    graduation_year: { number: data.graduation_year },
    major: { rich_text: [{ text: { content: data.major ?? '' } }] },
    minor: { rich_text: [{ text: { content: data.minor ?? '' } }] },
    bio: { rich_text: [{ text: { content: data.bio ?? '' } }] },
    linkedin_url: { url: data.linkedin_url },
  }

  if (data.avatar_url !== undefined) {
    properties.avatar_url = { url: data.avatar_url }
  }
  if (data.banner_url !== undefined) {
    properties.banner_url = { url: data.banner_url }
  }
  if (data.role_title !== undefined) {
    properties.role_title = { rich_text: [{ text: { content: data.role_title ?? '' } }] }
  }
  if (data.location !== undefined) {
    properties.location = { rich_text: [{ text: { content: data.location ?? '' } }] }
  }
  if (data.fun_fact !== undefined) {
    properties.fun_fact = { rich_text: [{ text: { content: data.fun_fact ?? '' } }] }
  }
  if (data.status !== undefined) {
    properties.status = data.status ? { select: { name: data.status } } : { select: null }
  }
  if (data.team !== undefined) {
    properties.team = data.team ? { select: { name: data.team } } : { select: null }
  }
  if (data.skills !== undefined) {
    properties.skills = {
      multi_select: data.skills.map((s) => ({ name: s })),
    }
  }

  await notion.pages.update({ page_id: profileId, properties })
}

export async function syncInternships(
  profileId: string,
  internships: Array<{
    company: string
    role: string
    start_date: string
    end_date: string | null
    description: string | null
    employment_type?: string | null
    industry?: string | null
    location?: string | null
    company_website?: string | null
    is_current?: boolean
  }>
): Promise<void> {
  const existing = await getInternshipsByProfileId(profileId)
  await Promise.all(existing.map((i) => notion.pages.update({ page_id: i.id, archived: true })))
  await Promise.all(
    internships
      .filter((i) => i.company && i.role && i.start_date)
      .map((i) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const properties: Record<string, any> = {
          Name: { title: [{ text: { content: i.role } }] },
          company: { rich_text: [{ text: { content: i.company } }] },
          Profile: { relation: [{ id: profileId }] },
          start_date: { date: { start: i.start_date } },
          end_date: i.end_date ? { date: { start: i.end_date } } : { date: null },
          description: { rich_text: [{ text: { content: i.description ?? '' } }] },
          is_current: { checkbox: i.is_current ?? false },
        }
        if (i.employment_type) {
          properties.employment_type = { select: { name: i.employment_type } }
        }
        if (i.industry) {
          properties.industry = { select: { name: i.industry } }
        }
        if (i.location) {
          properties.location = { rich_text: [{ text: { content: i.location } }] }
        }
        if (i.company_website) {
          properties.company_website = { url: i.company_website }
        }
        return notion.pages.create({ parent: { database_id: INTERNSHIPS_DB }, properties })
      })
  )
}

export async function syncClubs(
  profileId: string,
  clubs: Array<{
    club_name: string
    role: string | null
    start_year: number | null
    end_year: number | null
  }>
): Promise<void> {
  const existing = await getClubsByProfileId(profileId)
  await Promise.all(existing.map((c) => notion.pages.update({ page_id: c.id, archived: true })))
  await Promise.all(
    clubs
      .filter((c) => c.club_name)
      .map((c) =>
        notion.pages.create({
          parent: { database_id: CLUBS_DB },
          properties: {
            Name: { title: [{ text: { content: c.club_name } }] },
            role: { rich_text: [{ text: { content: c.role ?? '' } }] },
            Profile: { relation: [{ id: profileId }] },
            start_year: { number: c.start_year },
            end_year: { number: c.end_year },
          },
        })
      )
  )
}

export async function deleteProfileAndRelated(profileId: string): Promise<void> {
  const [internships, clubs] = await Promise.all([
    getInternshipsByProfileId(profileId),
    getClubsByProfileId(profileId),
  ])
  await Promise.all([
    ...internships.map((i) => notion.pages.update({ page_id: i.id, archived: true })),
    ...clubs.map((c) => notion.pages.update({ page_id: c.id, archived: true })),
  ])
  await notion.pages.update({ page_id: profileId, archived: true })
}
