import { Client } from '@notionhq/client'
import { unstable_cache } from 'next/cache'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { TeamUpdate, TeamUpdateStatus } from './types'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const TEAM_UPDATES_DB = process.env.NOTION_TEAM_UPDATES_DB_ID

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

function getDate(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop]
  return p?.type === 'date' ? (p.date?.start ?? null) : null
}

function pageToTeamUpdate(page: PageObjectResponse): TeamUpdate {
  return {
    id: page.id,
    title: getText(page, 'Name'),
    body: getText(page, 'body') || null,
    team: getSelect(page, 'team'),
    author: getText(page, 'author') || null,
    date: getDate(page, 'date') ?? page.created_time,
    tags: getMultiSelect(page, 'tags'),
    status: (getSelect(page, 'status') as TeamUpdateStatus) ?? null,
    published: getBool(page, 'published'),
  }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getTeamUpdates = unstable_cache(
  async (): Promise<TeamUpdate[]> => {
    if (!TEAM_UPDATES_DB) return []

    try {
      const res = await notion.databases.query({
        database_id: TEAM_UPDATES_DB,
        filter: { property: 'published', checkbox: { equals: true } },
        sorts: [{ property: 'date', direction: 'descending' }],
      })
      return res.results.map((p) => pageToTeamUpdate(p as PageObjectResponse))
    } catch {
      return []
    }
  },
  ['getTeamUpdates'],
  { tags: ['team-updates'], revalidate: 60 }
)
