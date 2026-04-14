import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Announcement, HomeEvent, QuickLink, Idea, OrgNeed } from './types'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const ANNOUNCEMENTS_DB = process.env.NOTION_ANNOUNCEMENTS_DB_ID!
const EVENTS_DB = process.env.NOTION_EVENTS_DB_ID!
const QUICK_LINKS_DB = process.env.NOTION_QUICK_LINKS_DB_ID!
const IDEAS_DB = process.env.NOTION_IDEAS_DB_ID!
const ORG_NEEDS_DB = process.env.NOTION_ORG_NEEDS_DB_ID!

// ─── Priority ordering ────────────────────────────────────────────────────────
// Notion sorts selects alphabetically; we re-sort in TS using a weight map.
const PRIORITY_WEIGHT: Record<string, number> = { high: 0, medium: 1, low: 2 }

// ─── Property helpers ─────────────────────────────────────────────────────────

function getText(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop]
  if (!p) return ''
  if (p.type === 'title') return p.title[0]?.plain_text ?? ''
  if (p.type === 'rich_text') return p.rich_text[0]?.plain_text ?? ''
  return ''
}

function getSelect(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop]
  return p?.type === 'select' ? (p.select?.name ?? null) : null
}

function getMultiSelect(page: PageObjectResponse, prop: string): string[] {
  const p = page.properties[prop]
  return p?.type === 'multi_select' ? p.multi_select.map((s) => s.name) : []
}

function getBool(page: PageObjectResponse, prop: string): boolean {
  const p = page.properties[prop]
  return p?.type === 'checkbox' ? p.checkbox : false
}

function getUrl(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop]
  return p?.type === 'url' ? p.url : null
}

function getDateRange(
  page: PageObjectResponse,
  prop: string
): { start: string | null; end: string | null } {
  const p = page.properties[prop]
  if (p?.type !== 'date') return { start: null, end: null }
  return { start: p.date?.start ?? null, end: p.date?.end ?? null }
}

// ─── Page → Type converters ───────────────────────────────────────────────────

function pageToAnnouncement(page: PageObjectResponse): Announcement {
  return {
    id: page.id,
    title: getText(page, 'Name'),
    body: getText(page, 'body'),
    author: getText(page, 'author'),
    priority: (getSelect(page, 'priority') ?? 'low') as Announcement['priority'],
    tags: getMultiSelect(page, 'tags'),
    type: (getSelect(page, 'type') ?? 'announcement') as Announcement['type'],
    created_at: page.created_time,
    published: getBool(page, 'published'),
  }
}

function pageToEvent(page: PageObjectResponse): HomeEvent {
  const { start, end } = getDateRange(page, 'date')
  return {
    id: page.id,
    title: getText(page, 'Name'),
    description: getText(page, 'description') || null,
    date: start ?? '',
    end_date: end,
    location: getText(page, 'location') || null,
    event_type: getSelect(page, 'event_type'),
  }
}

function pageToQuickLink(page: PageObjectResponse): QuickLink {
  return {
    id: page.id,
    label: getText(page, 'Name'),
    url: getUrl(page, 'url') ?? '',
    category: getSelect(page, 'category'),
    icon: getText(page, 'icon') || null,
  }
}

function pageToIdea(page: PageObjectResponse): Idea {
  return {
    id: page.id,
    title: getText(page, 'Name'),
    description: getText(page, 'description') || null,
    submitted_by: getText(page, 'submitted_by'),
    status: (getSelect(page, 'status') ?? 'open') as Idea['status'],
    created_at: page.created_time,
  }
}

function pageToOrgNeed(page: PageObjectResponse): OrgNeed {
  return {
    id: page.id,
    title: getText(page, 'Name'),
    description: getText(page, 'description') || null,
    team: getSelect(page, 'team'),
    urgency: (getSelect(page, 'urgency') ?? 'medium') as OrgNeed['urgency'],
    point_person: getText(page, 'point_person') || null,
  }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getAnnouncements(): Promise<Announcement[]> {
  const res = await notion.databases.query({
    database_id: ANNOUNCEMENTS_DB,
    filter: { property: 'published', checkbox: { equals: true } },
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
  })
  const items = res.results.map((p) => pageToAnnouncement(p as PageObjectResponse))
  return items.sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority])
}

export async function getUpcomingEvents(limit = 6): Promise<HomeEvent[]> {
  const today = new Date().toISOString().split('T')[0]
  const res = await notion.databases.query({
    database_id: EVENTS_DB,
    filter: { property: 'date', date: { on_or_after: today } },
    sorts: [{ property: 'date', direction: 'ascending' }],
    page_size: limit,
  })
  return res.results.map((p) => pageToEvent(p as PageObjectResponse))
}

export async function getQuickLinks(): Promise<QuickLink[]> {
  const res = await notion.databases.query({
    database_id: QUICK_LINKS_DB,
    sorts: [{ property: 'category', direction: 'ascending' }],
  })
  return res.results.map((p) => pageToQuickLink(p as PageObjectResponse))
}

export async function getActiveIdeas(): Promise<Idea[]> {
  const res = await notion.databases.query({
    database_id: IDEAS_DB,
    filter: {
      or: [
        { property: 'status', select: { equals: 'open' } },
        { property: 'status', select: { equals: 'under_review' } },
      ],
    },
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
  })
  return res.results.map((p) => pageToIdea(p as PageObjectResponse))
}

export async function getOrgNeeds(): Promise<OrgNeed[]> {
  const res = await notion.databases.query({
    database_id: ORG_NEEDS_DB,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
  })
  const items = res.results.map((p) => pageToOrgNeed(p as PageObjectResponse))
  return items.sort((a, b) => PRIORITY_WEIGHT[a.urgency] - PRIORITY_WEIGHT[b.urgency])
}

export async function createIdea(data: {
  title: string
  description: string
  submitted_by: string
}): Promise<void> {
  await notion.pages.create({
    parent: { database_id: IDEAS_DB },
    properties: {
      Name: { title: [{ text: { content: data.title } }] },
      description: { rich_text: [{ text: { content: data.description } }] },
      submitted_by: { rich_text: [{ text: { content: data.submitted_by } }] },
      status: { select: { name: 'open' } },
    },
  })
}
