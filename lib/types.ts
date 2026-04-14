export type MemberStatus = 'Current Member' | 'Alumni'

export type Profile = {
  id: string
  clerk_id: string
  full_name: string
  graduation_year: number | null
  major: string | null
  minor: string | null
  bio: string | null
  linkedin_url: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  status: MemberStatus | null
  team: string | null
  role_title: string | null
  location: string | null
  skills: string[]
  fun_fact: string | null
}

export type Internship = {
  id: string
  profile_id: string
  company: string
  role: string
  start_date: string
  end_date: string | null
  description: string | null
}

export type Club = {
  id: string
  profile_id: string
  club_name: string
  role: string | null
  start_year: number | null
  end_year: number | null
}

export type ProfileWithDetails = Profile & {
  internships: Internship[]
  clubs: Club[]
}

// ─── Home page types ──────────────────────────────────────────────────────────

export type Announcement = {
  id: string
  title: string
  body: string
  author: string
  priority: 'high' | 'medium' | 'low'
  tags: string[]
  type: 'announcement' | 'update'
  created_at: string
  published: boolean
}

export type HomeEvent = {
  id: string
  title: string
  description: string | null
  date: string
  end_date: string | null
  location: string | null
  event_type: string | null
}

export type QuickLink = {
  id: string
  label: string
  url: string
  category: string | null
  icon: string | null
}

export type Idea = {
  id: string
  title: string
  description: string | null
  submitted_by: string
  status: 'open' | 'under_review' | 'implemented' | 'closed'
  created_at: string
}

export type OrgNeed = {
  id: string
  title: string
  description: string | null
  team: string | null
  urgency: 'high' | 'medium' | 'low'
  point_person: string | null
}

// ─── Events page types ────────────────────────────────────────────────────────

export type CalendarEvent = {
  id: string
  title: string
  description: string | null
  start: string
  end: string
  allDay: boolean
  location: string | null
  organizer: string | null
  type: string
}
