'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Profile, Internship, Club } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  profile: Profile
  internships: Internship[]
  clubs: Club[]
  isAdminEdit?: boolean
}

type InternshipDraft = Omit<Internship, 'id' | 'profile_id'> & { id?: string }
type ClubDraft = Omit<Club, 'id' | 'profile_id'> & { id?: string }

export default function ProfileForm({ profile, internships, clubs }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState(profile.full_name)
  const [gradYear, setGradYear] = useState(profile.graduation_year?.toString() ?? '')
  const [major, setMajor] = useState(profile.major ?? '')
  const [minor, setMinor] = useState(profile.minor ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [linkedin, setLinkedin] = useState(profile.linkedin_url ?? '')

  const [internshipList, setInternshipList] = useState<InternshipDraft[]>(
    internships.map(({ id, profile_id, ...rest }) => ({ id, ...rest }))
  )
  const [clubList, setClubList] = useState<ClubDraft[]>(
    clubs.map(({ id, profile_id, ...rest }) => ({ id, ...rest }))
  )

  function addInternship() {
    setInternshipList((prev) => [
      ...prev,
      { company: '', role: '', start_date: '', end_date: null, description: null },
    ])
  }

  function removeInternship(idx: number) {
    setInternshipList((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateInternship(idx: number, field: keyof InternshipDraft, value: string) {
    setInternshipList((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value || null } : item))
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
            linkedin_url: linkedin || null,
          },
          internships: internshipList,
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
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </div>
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

      {/* Internships */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Internships</h2>
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
              <Label>Description</Label>
              <Textarea
                value={item.description ?? ''}
                onChange={(e) => updateInternship(idx, 'description', e.target.value)}
                rows={2}
                placeholder="Brief description (optional)"
              />
            </div>
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
