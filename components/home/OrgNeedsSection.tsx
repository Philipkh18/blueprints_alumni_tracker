import { getOrgNeeds } from '@/lib/notion-home'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { OrgNeed } from '@/lib/types'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const URGENCY_CONFIG: Record<
  OrgNeed['urgency'],
  { label: string; variant: 'destructive' | 'secondary' | 'outline'; dot: string }
> = {
  high: { label: 'Urgent', variant: 'destructive', dot: 'bg-destructive' },
  medium: { label: 'Medium', variant: 'secondary', dot: 'bg-muted-foreground' },
  low: { label: 'Low', variant: 'outline', dot: 'bg-muted-foreground/50' },
}

function OrgNeedItem({ need }: { need: OrgNeed }) {
  const { label, variant, dot } = URGENCY_CONFIG[need.urgency]
  return (
    <div className="py-3 border-b border-border last:border-0 space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', dot)} />
          <p className="text-sm font-medium leading-snug">{need.title}</p>
        </div>
        <Badge variant={variant} className="text-[10px] shrink-0">
          {label}
        </Badge>
      </div>
      {need.description && (
        <p className="text-xs text-muted-foreground line-clamp-3 pl-3.5">{need.description}</p>
      )}
      <div className="flex items-center gap-3 pl-3.5 flex-wrap">
        {need.team && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Users className="size-3" />
            <span>{need.team}</span>
          </div>
        )}
        {need.point_person && (
          <span className="text-[11px] text-muted-foreground">
            Contact: {need.point_person}
          </span>
        )}
      </div>
    </div>
  )
}

export default async function OrgNeedsSection() {
  let needs: OrgNeed[] = []
  let error = false

  try {
    needs = await getOrgNeeds()
  } catch {
    error = true
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle>Org Needs</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {error ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Could not load org needs. Try refreshing.
          </p>
        ) : needs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No open needs right now.
          </p>
        ) : (
          <div>
            {needs.map((need) => (
              <OrgNeedItem key={need.id} need={need} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
