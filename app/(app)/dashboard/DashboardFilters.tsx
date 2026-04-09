'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Props = {
  years: number[]
  majors: string[]
}

export default function DashboardFilters({ years, majors }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const year = searchParams.get('year') ?? ''
  const major = searchParams.get('major') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/dashboard?${params.toString()}`)
    },
    [router, searchParams]
  )

  const hasFilters = q || year || major

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        placeholder="Search by name..."
        value={q}
        onChange={(e) => updateParam('q', e.target.value)}
        className="max-w-xs"
      />

      <select
        value={year}
        onChange={(e) => updateParam('year', e.target.value)}
        className="border rounded-md px-3 py-2 text-sm bg-background"
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        value={major}
        onChange={(e) => updateParam('major', e.target.value)}
        className="border rounded-md px-3 py-2 text-sm bg-background"
      >
        <option value="">All Majors</option>
        {majors.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
        >
          Clear filters
        </Button>
      )}
    </div>
  )
}
