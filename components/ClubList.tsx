import { Club } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

type Props = { clubs: Club[] }

export default function ClubList({ clubs }: Props) {
  if (clubs.length === 0) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Clubs & Activities</h2>
      <div className="space-y-2">
        {clubs.map((c) => (
          <div key={c.id} className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-medium">{c.club_name}</p>
              {c.role && <p className="text-sm text-muted-foreground">{c.role}</p>}
              {(c.start_year || c.end_year) && (
                <p className="text-xs text-muted-foreground">
                  {c.start_year ?? '?'} — {c.end_year ?? 'Present'}
                </p>
              )}
            </div>
            {!c.end_year && (
              <Badge variant="outline" className="text-xs shrink-0">Active</Badge>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
