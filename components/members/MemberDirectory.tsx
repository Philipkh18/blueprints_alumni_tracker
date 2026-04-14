'use client'

import { useMemo, useState } from 'react'
import type { Profile } from '@/lib/types'
import MemberGrid from './MemberGrid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  profiles: Profile[]
}

const STATUS_OPTIONS = ['Current Member', 'Alumni'] as const

export default function MemberDirectory({ profiles }: Props) {
  const [q, setQ] = useState('')
  const [year, setYear] = useState('')
  const [major, setMajor] = useState('')
  const [status, setStatus] = useState('')
  const [team, setTeam] = useState('')

  const years = useMemo(
    () =>
      [...new Set(profiles.map((p) => p.graduation_year).filter(Boolean))].sort(
        (a, b) => b! - a!
      ) as number[],
    [profiles]
  )
  const majors = useMemo(
    () => [...new Set(profiles.map((p) => p.major).filter(Boolean))].sort() as string[],
    [profiles]
  )
  const teams = useMemo(
    () => [...new Set(profiles.map((p) => p.team).filter(Boolean))].sort() as string[],
    [profiles]
  )

  const filtered = useMemo(() => {
    const query = q.toLowerCase()
    return profiles.filter((p) => {
      if (query && !p.full_name.toLowerCase().includes(query)) return false
      if (year && p.graduation_year !== parseInt(year)) return false
      if (major && p.major !== major) return false
      if (status && p.status !== status) return false
      if (team && p.team !== team) return false
      return true
    })
  }, [profiles, q, year, major, status, team])

  const hasFilters = q || year || major || status || team

  function clearAll() {
    setQ('')
    setYear('')
    setMajor('')
    setStatus('')
    setTeam('')
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="brand-panel rounded-[1.5rem] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-8 h-8 bg-white/60 border-[oklch(0.8_0.05_252/0.45)]"
            />
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setStatus(status === opt ? '' : opt)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-all duration-150',
                  status === opt
                    ? 'bg-[linear-gradient(135deg,var(--color-brand-ocean),var(--color-brand-bright))] text-primary-foreground shadow-[0_4px_12px_oklch(0.5_0.18_257/0.2)]'
                    : 'brand-chip text-muted-foreground hover:text-foreground'
                )}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Dropdowns */}
          <FilterSelect
            value={year}
            onChange={setYear}
            placeholder="Year"
            options={years.map((y) => ({ value: String(y), label: String(y) }))}
          />

          {majors.length > 0 && (
            <FilterSelect
              value={major}
              onChange={setMajor}
              placeholder="Major"
              options={majors.map((m) => ({ value: m, label: m }))}
            />
          )}

          {teams.length > 0 && (
            <FilterSelect
              value={team}
              onChange={setTeam}
              placeholder="Team"
              options={teams.map((t) => ({ value: t, label: t }))}
            />
          )}

          {/* Clear */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs gap-1"
            >
              <X className="size-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} member{filtered.length !== 1 ? 's' : ''}
        {hasFilters && ' matching filters'}
        {' '}· {profiles.length} total
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="brand-panel flex flex-col items-center justify-center rounded-[2rem] py-16">
          <Search className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No members found</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <MemberGrid profiles={filtered} />
      )}
    </div>
  )
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-8 rounded-xl border border-[oklch(0.8_0.05_252/0.45)] bg-white/60 px-2.5 text-xs font-medium transition-colors outline-none',
        'focus:border-ring focus:ring-2 focus:ring-ring/20',
        value ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
