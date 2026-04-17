'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Profile, Internship, Club } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { normalizeUrlInput } from '@/lib/company-brand'
import ProfileMediaEditor from '@/components/profile/ProfileMediaEditor'

type Props = {
  profile: Profile
  allProfiles: Profile[]
  internships: Internship[]
  clubs: Club[]
  isAdminEdit?: boolean
}

type InternshipDraft = Omit<Internship, 'id' | 'profile_id'> & { id?: string }
type ClubDraft = Omit<Club, 'id' | 'profile_id'> & { id?: string }

const STATUS_OPTIONS = ['', 'Current Member', 'Alumni'] as const
const EMPLOYMENT_TYPE_OPTIONS = ['', 'Internship', 'Full-Time', 'Part-Time', 'Contract'] as const

export default function ProfileForm({ profile, allProfiles, internships, clubs, isAdminEdit }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState(profile.full_name)
  const [gradYear, setGradYear] = useState(profile.graduation_year?.toString() ?? '')
  const [major, setMajor] = useState(profile.major ?? '')
  const [minor, setMinor] = useState(profile.minor ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number ?? '')
  const [linkedin, setLinkedin] = useState(profile.linkedin_url ?? '')
  const [status, setStatus] = useState(profile.status ?? '')
  const [team, setTeam] = useState(profile.team ?? '')
  const [roleTitle, setRoleTitle] = useState(profile.role_title ?? '')
  const [location, setLocation] = useState(profile.location ?? '')
  const [skillsRaw, setSkillsRaw] = useState(profile.skills.join(', '))
  const [bigId, setBigId] = useState(profile.big_id ?? '')
  const [funFact, setFunFact] = useState(profile.fun_fact ?? '')

  const [internshipList, setInternshipList] = useState<InternshipDraft[]>(
    internships.map(({ id, profile_id, ...rest }) => ({ id, ...rest }))
  )
  const [clubList, setClubList] = useState<ClubDraft[]>(
    clubs.map(({ id, profile_id, ...rest }) => ({ id, ...rest }))
  )
  const bigOptions = allProfiles
    .filter((candidate) => candidate.id !== profile.id)
    .sort((a, b) => a.full_name.localeCompare(b.full_name))

  function addInternship() {
    setInternshipList((prev) => [
      ...prev,
      {
        company: '', role: '', start_date: '', end_date: null, description: null,
        employment_type: null, industry: null, location: null, company_website: null,
        is_current: false,
      },
    ])
  }

  function removeInternship(idx: number) {
    setInternshipList((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateInternship(idx: number, field: keyof InternshipDraft, value: string | boolean) {
    setInternshipList((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item
        if (field === 'is_current') return { ...item, is_current: value as boolean }
        return { ...item, [field]: (value as string) || null }
      })
    )
  }

  function addClub() {
    setClubList((prev) => [
      ...prev,
      { club_name: '', role: null, start_year: null, end_year: null },
    ])
  }

  function removeClub(idx: number) {
    setClubList((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateClub(idx: number, field: keyof ClubDraft, value: string) {
    setClubList((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              [field]:
                field === 'start_year' || field === 'end_year'
                  ? value ? parseInt(value) : null
                  : value || null,
            }
          : item
      )
    )
  }

  async function handleSave() {
    setSaving(true)
    setError(null)

    const skills = skillsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const normalizedInternships = internshipList.map((item) => ({
      ...item,
      company_website: normalizeUrlInput(item.company_website),
    }))

    try {
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            full_name: fullName,
            graduation_year: gradYear ? parseInt(gradYear) : null,
            major: major || null,
            minor: minor || null,
            bio: bio || null,
            phone_number: phoneNumber || null,
            linkedin_url: linkedin || null,
            status: status || null,
            team: team || null,
            role_title: roleTitle || null,
            location: location || null,
            skills,
            big_id: bigId || null,
            fun_fact: funFact || null,
          },
          internships: normalizedInternships,
          clubs: clubList,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to save')
      }

      router.push(`/profile/${profile.id}`)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Info</h2>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grad_year">Graduation Year</Label>
            <Input
              id="grad_year"
              type="number"
              min={2000}
              max={2040}
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              placeholder="e.g. 2025"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Member Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt || 'Not set'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minor">Minor</Label>
            <Input
              id="minor"
              value={minor}
              onChange={(e) => setMinor(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role_title">Role / Title</Label>
            <Input
              id="role_title"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. VP of Engineering"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="e.g. Product"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Francisco, CA"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell others about yourself..."
          />
        </div>

        <ProfileMediaEditor
          profileId={profile.id}
          fullName={profile.full_name}
          initialAvatarUrl={profile.avatar_url}
          initialBannerUrl={profile.banner_url}
        />

        <div className="space-y-2">
          <Label htmlFor="skills">Skills & Interests</Label>
          <Input
            id="skills"
            value={skillsRaw}
            onChange={(e) => setSkillsRaw(e.target.value)}
            placeholder="Comma-separated, e.g. React, Python, Design"
          />
          <p className="text-[11px] text-muted-foreground">Separate with commas</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="big_id">Big / Mentor</Label>
          <select
            id="big_id"
            value={bigId}
            onChange={(e) => setBigId(e.target.value)}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">No big selected</option>
            {bigOptions.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.full_name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground">
            Pick the person who mentored you or brought you into the org. The Connections page
            uses this to build mentor and mentee trees automatically.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fun_fact">Fun Fact</Label>
          <Input
            id="fun_fact"
            value={funFact}
            onChange={(e) => setFunFact(e.target.value)}
            placeholder="Something fun about you"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>
      </section>

      {/* Work Experience */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Work Experience</h2>
          <Button type="button" variant="outline" size="sm" onClick={addInternship}>
            + Add
          </Button>
        </div>

        {internshipList.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-4 space-y-3 relative">
            <button
              type="button"
              onClick={() => removeInternship(idx)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive text-sm"
            >
              Remove
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Company *</Label>
                <Input
                  value={item.company}
                  onChange={(e) => updateInternship(idx, 'company', e.target.value)}
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-1">
                <Label>Role *</Label>
                <Input
                  value={item.role}
                  onChange={(e) => updateInternship(idx, 'role', e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Type</Label>
                <select
                  value={item.employment_type ?? ''}
                  onChange={(e) => updateInternship(idx, 'employment_type', e.target.value)}
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt || 'Not set'}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Industry</Label>
                <Input
                  value={item.industry ?? ''}
                  onChange={(e) => updateInternship(idx, 'industry', e.target.value)}
                  placeholder="e.g. Technology, Finance"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={item.start_date}
                  onChange={(e) => updateInternship(idx, 'start_date', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={item.end_date ?? ''}
                  onChange={(e) => updateInternship(idx, 'end_date', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Location</Label>
              <Input
                value={item.location ?? ''}
                onChange={(e) => updateInternship(idx, 'location', e.target.value)}
                placeholder="e.g. New York, NY"
              />
            </div>

            <div className="space-y-1">
              <Label>Company Website</Label>
              <Input
                value={item.company_website ?? ''}
                onChange={(e) => updateInternship(idx, 'company_website', e.target.value)}
                placeholder="company.com or https://company.com"
              />
              <p className="text-[11px] text-muted-foreground">
                Used to pull the company icon automatically.
              </p>
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                value={item.description ?? ''}
                onChange={(e) => updateInternship(idx, 'description', e.target.value)}
                rows={2}
                placeholder="Brief description (optional)"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.is_current}
                onChange={(e) => updateInternship(idx, 'is_current', e.target.checked)}
                className="rounded border-input"
              />
              This is my current role
            </label>
          </div>
        ))}
      </section>

      {/* Clubs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Clubs & Activities</h2>
          <Button type="button" variant="outline" size="sm" onClick={addClub}>
            + Add
          </Button>
        </div>

        {clubList.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-4 space-y-3 relative">
            <button
              type="button"
              onClick={() => removeClub(idx)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive text-sm"
            >
              Remove
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Club Name *</Label>
                <Input
                  value={item.club_name}
                  onChange={(e) => updateClub(idx, 'club_name', e.target.value)}
                  placeholder="e.g. Blueprints"
                />
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Input
                  value={item.role ?? ''}
                  onChange={(e) => updateClub(idx, 'role', e.target.value)}
                  placeholder="e.g. President"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Start Year</Label>
                <Input
                  type="number"
                  min={2000}
                  max={2040}
                  value={item.start_year ?? ''}
                  onChange={(e) => updateClub(idx, 'start_year', e.target.value)}
                  placeholder="e.g. 2022"
                />
              </div>
              <div className="space-y-1">
                <Label>End Year</Label>
                <Input
                  type="number"
                  min={2000}
                  max={2040}
                  value={item.end_year ?? ''}
                  onChange={(e) => updateClub(idx, 'end_year', e.target.value)}
                  placeholder="Leave blank if active"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving || !fullName.trim()}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(`/profile/${profile.id}`)}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
