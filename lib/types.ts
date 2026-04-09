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
