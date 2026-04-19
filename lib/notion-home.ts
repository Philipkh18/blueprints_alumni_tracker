import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type {
  Announcement,
  HomeEvent,
  QuickLink,
  Idea,
  OrgNeed,
} from "./types";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const ANNOUNCEMENTS_DB = process.env.NOTION_ANNOUNCEMENTS_DB_ID!;
const EVENTS_DB = process.env.NOTION_EVENTS_DB_ID!;
const QUICK_LINKS_DB = process.env.NOTION_QUICK_LINKS_DB_ID!;
const IDEAS_DB = process.env.NOTION_IDEAS_DB_ID!;
const ORG_NEEDS_DB = process.env.NOTION_ORG_NEEDS_DB_ID!;

// ─── Priority ordering ────────────────────────────────────────────────────────
// Notion sorts selects alphabetically; we re-sort in TS using a weight map.
const PRIORITY_WEIGHT: Record<string, number> = { high: 0, medium: 1, low: 2 };

// ─── Demo data fallbacks ──────────────────────────────────────────────────────

const DEMO_QUICK_LINKS: QuickLink[] = [
  {
    id: "demo-link-1",
    label: "Final Project Presentation Slides",
    url: "https://www.canva.com/design/DAHGlgQALXk/pB80XYB7EbJDxVjA40KHwg/edit",
    category: "Resources",
    icon: null,
  },
  {
    id: "demo-link-2",
    label: "Member Points",
    url: "https://docs.google.com/spreadsheets/d/1p5KVpSpLlXjuqTNpZYKepLA2IcMUzPFEpobHvLzH71g/edit?usp=drive_web&ouid=105008881481143424628",
    category: "Resources",
    icon: null,
  },
  {
    id: "demo-link-3",
    label: "Org Constitution",
    url: "https://drive.google.com/file/d/1tH1g-pnFU25znRDQwIFMiWYCBXVkTGUB/view?usp=sharing",
    category: "Resources",
    icon: null,
  },
];

const DEMO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "demo-announcement-1",
    title: "Day Of Service Today",
    body: "Please report to BSB 1020 at 12:15 sharp for Day Of Service.",
    author: "Aakash Gummidela [CEO]",
    priority: "high",
    tags: ["Event", "Reminder"],
    type: "announcement",
    created_at: "2026-04-17T15:00:00.000Z",
    published: true,
  },
  {
    id: "demo-announcement-2",
    title: "Member Points",
    body: "Please make sure you reach the requirement of 10 POINTS by the end of the semester. If there are any errors with your attendance, please reach out to me!.",
    author: "Romel Patel [CFO]",
    priority: "medium",
    tags: ["Member", "Points"],
    type: "update",
    created_at: "2026-04-15T13:20:00.000Z",
    published: true,
  },
  {
    id: "demo-announcement-3",
    title: "MDST Winners",
    body: "2026 MDST Best Project (Blueprints) Winners...sensational.",
    author: "Rohan Kolli",
    priority: "low",
    tags: ["Tech"],
    type: "announcement",
    created_at: "2026-04-12T10:45:00.000Z",
    published: true,
  },
];

const DEMO_IDEAS: Idea[] = [
  {
    id: "demo-idea-1",
    title: "Alumni coffee chats by industry",
    description:
      "Match current members with alumni in consulting, product, and finance for short virtual chats each month.",
    submitted_by: "Jordan Kim",
    status: "under_review",
    created_at: "2026-04-11T14:30:00.000Z",
  },
  {
    id: "demo-idea-2",
    title: "Resume review sprint before recruiting season",
    description:
      "Host a one-week feedback push where alumni volunteers claim resumes and leave comments asynchronously.",
    submitted_by: "Avery Patel",
    status: "open",
    created_at: "2026-04-09T18:10:00.000Z",
  },
  {
    id: "demo-idea-3",
    title: "Member spotlight posts",
    description:
      "Share one short story each week about internships, projects, or campus wins to keep the community active.",
    submitted_by: "Sam Rivera",
    status: "open",
    created_at: "2026-04-06T12:00:00.000Z",
  },
];

const DEMO_ORG_NEEDS: OrgNeed[] = [
  {
    id: "demo-need-1",
    title: "Final Project Presentations",
    description: "Please submit the final project presentation slides.",
    team: "E-Board",
    urgency: "high",
    point_person: "Aakash Gummidela",
  },
  {
    id: "demo-need-2",
    title: "Photographer for Headshots",
    description: "Looking for someone to be a photographer for headshots.",
    team: "Development",
    urgency: "medium",
    point_person: "Belinda Chang",
  },
  {
    id: "demo-need-3",
    title: "Day Of Service Volunteers",
    description:
      "Need members to repost Day Of Service on their social media platforms.",
    team: "Development",
    urgency: "low",
    point_person: "Mia Zhong",
  },
];

// ─── Property helpers ─────────────────────────────────────────────────────────

function getText(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop];
  if (!p) return "";
  if (p.type === "title") return p.title[0]?.plain_text ?? "";
  if (p.type === "rich_text") return p.rich_text[0]?.plain_text ?? "";
  return "";
}

function getSelect(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop];
  return p?.type === "select" ? (p.select?.name ?? null) : null;
}

function getMultiSelect(page: PageObjectResponse, prop: string): string[] {
  const p = page.properties[prop];
  return p?.type === "multi_select" ? p.multi_select.map((s) => s.name) : [];
}

function getBool(page: PageObjectResponse, prop: string): boolean {
  const p = page.properties[prop];
  return p?.type === "checkbox" ? p.checkbox : false;
}

function getUrl(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop];
  return p?.type === "url" ? p.url : null;
}

function getDateRange(
  page: PageObjectResponse,
  prop: string,
): { start: string | null; end: string | null } {
  const p = page.properties[prop];
  if (p?.type !== "date") return { start: null, end: null };
  return { start: p.date?.start ?? null, end: p.date?.end ?? null };
}

// ─── Page → Type converters ───────────────────────────────────────────────────

function pageToAnnouncement(page: PageObjectResponse): Announcement {
  return {
    id: page.id,
    title: getText(page, "Name"),
    body: getText(page, "body"),
    author: getText(page, "author"),
    priority: (getSelect(page, "priority") ??
      "low") as Announcement["priority"],
    tags: getMultiSelect(page, "tags"),
    type: (getSelect(page, "type") ?? "announcement") as Announcement["type"],
    created_at: page.created_time,
    published: getBool(page, "published"),
  };
}

function pageToEvent(page: PageObjectResponse): HomeEvent {
  const { start, end } = getDateRange(page, "date");
  return {
    id: page.id,
    title: getText(page, "Name"),
    description: getText(page, "description") || null,
    date: start ?? "",
    end_date: end,
    location: getText(page, "location") || null,
    event_type: getSelect(page, "event_type"),
  };
}

function pageToQuickLink(page: PageObjectResponse): QuickLink {
  return {
    id: page.id,
    label: getText(page, "Name"),
    url: getUrl(page, "url") ?? "",
    category: getSelect(page, "category"),
    icon: getText(page, "icon") || null,
  };
}

function pageToIdea(page: PageObjectResponse): Idea {
  return {
    id: page.id,
    title: getText(page, "Name"),
    description: getText(page, "description") || null,
    submitted_by: getText(page, "submitted_by"),
    status: (getSelect(page, "status") ?? "open") as Idea["status"],
    created_at: page.created_time,
  };
}

function pageToOrgNeed(page: PageObjectResponse): OrgNeed {
  return {
    id: page.id,
    title: getText(page, "Name"),
    description: getText(page, "description") || null,
    team: getSelect(page, "team"),
    urgency: (getSelect(page, "urgency") ?? "medium") as OrgNeed["urgency"],
    point_person: getText(page, "point_person") || null,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getAnnouncements(): Promise<Announcement[]> {
  if (!ANNOUNCEMENTS_DB) return DEMO_ANNOUNCEMENTS;

  try {
    const res = await notion.databases.query({
      database_id: ANNOUNCEMENTS_DB,
      filter: { property: "published", checkbox: { equals: true } },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });
    const items = res.results.map((p) =>
      pageToAnnouncement(p as PageObjectResponse),
    );
    return items.length > 0
      ? items.sort(
          (a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority],
        )
      : DEMO_ANNOUNCEMENTS;
  } catch {
    return DEMO_ANNOUNCEMENTS;
  }
}

export async function getUpcomingEvents(limit = 6): Promise<HomeEvent[]> {
  const today = new Date().toISOString().split("T")[0];
  const res = await notion.databases.query({
    database_id: EVENTS_DB,
    filter: { property: "date", date: { on_or_after: today } },
    sorts: [{ property: "date", direction: "ascending" }],
    page_size: limit,
  });
  return res.results.map((p) => pageToEvent(p as PageObjectResponse));
}

export async function getQuickLinks(): Promise<QuickLink[]> {
  if (!QUICK_LINKS_DB) return DEMO_QUICK_LINKS;

  try {
    const res = await notion.databases.query({
      database_id: QUICK_LINKS_DB,
      sorts: [{ property: "category", direction: "ascending" }],
    });
    const links = res.results.map((p) => pageToQuickLink(p as PageObjectResponse));
    return links.length > 0 ? links : DEMO_QUICK_LINKS;
  } catch {
    return DEMO_QUICK_LINKS;
  }
}

export async function getActiveIdeas(): Promise<Idea[]> {
  if (!IDEAS_DB) return DEMO_IDEAS;

  try {
    const res = await notion.databases.query({
      database_id: IDEAS_DB,
      filter: {
        or: [
          { property: "status", select: { equals: "open" } },
          { property: "status", select: { equals: "under_review" } },
        ],
      },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });
    const ideas = res.results.map((p) => pageToIdea(p as PageObjectResponse));
    return ideas.length > 0 ? ideas : DEMO_IDEAS;
  } catch {
    return DEMO_IDEAS;
  }
}

export async function getOrgNeeds(): Promise<OrgNeed[]> {
  if (!ORG_NEEDS_DB) return DEMO_ORG_NEEDS;

  try {
    const res = await notion.databases.query({
      database_id: ORG_NEEDS_DB,
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    });
    const items = res.results.map((p) =>
      pageToOrgNeed(p as PageObjectResponse),
    );
    const needs = items.sort(
      (a, b) => PRIORITY_WEIGHT[a.urgency] - PRIORITY_WEIGHT[b.urgency],
    );
    return needs.length > 0 ? needs : DEMO_ORG_NEEDS;
  } catch {
    return DEMO_ORG_NEEDS;
  }
}

export async function createIdea(data: {
  title: string;
  description: string;
  submitted_by: string;
}): Promise<void> {
  await notion.pages.create({
    parent: { database_id: IDEAS_DB },
    properties: {
      Name: { title: [{ text: { content: data.title } }] },
      description: { rich_text: [{ text: { content: data.description } }] },
      submitted_by: { rich_text: [{ text: { content: data.submitted_by } }] },
      status: { select: { name: "open" } },
    },
  });
}
