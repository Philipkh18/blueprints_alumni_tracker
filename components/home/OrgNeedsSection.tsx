import { getOrgNeeds } from '@/lib/notion-home'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { OrgNeed } from '@/lib/types'
import { Handshake, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const URGENCY_CONFIG: Record<
  OrgNeed['urgency'],
  { label: string; variant: 'destructive' | 'secondary' | 'outline'; dot: string }
> = {
  high: { label: 'Urgent', variant: 'destructive', dot: 'bg-destructive' },
  medium: { label: 'Medium', variant: 'secondary', dot: 'bg-primary/60' },
  low: { label: 'Low', variant: 'outline', dot: 'bg-muted-foreground/40' },
}

function OrgNeedItem({ need }: { need: OrgNeed }) {
  const { label, variant, dot } = URGENCY_CONFIG[need.urgency]
  return (
    <div className="group py-3 border-b border-border last:border-0 space-y-1.5 transition-colors duration-150 hover:bg-accent/30 -mx-4 px-4 first:rounded-t-lg last:rounded-b-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'mt-0.5 size-2 shrink-0 rounded-full ring-2 ring-background',
              dot
            )}
          />
          <p className="text-sm font-semibold leading-snug">{need.title}</p>
        </div>
        <Badge variant={variant} className="text-[10px] shrink-0">
          {label}
        </Badge>
      </div>
      {need.description && (
        <p className="text-xs text-muted-foreground line-clamp-3 pl-4 leading-relaxed">
          {need.description}
        </p>
      )}
      <div className="flex items-center gap-3 pl-4 flex-wrap">
        {need.team && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
            <Users className="size-3" />
            <span>{need.team}</span>
          </div>
        )}
        {need.point_person && (
          <span className="text-[11px] text-muted-foreground/70">
            Contact: <span className="text-foreground/70 font-medium">{need.point_person}</span>
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
    <Card className="h-full shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Handshake className="size-4 text-primary" />
          Org Needs
        </CardTitle>
        <CardDescription>How you can help right now</CardDescription>
      </CardHeader>
      <CardContent className="pt-1">
        {error ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Could not load org needs.</p>
          </div>
        ) : needs.length === 0 ? (
          <div className="py-6 text-center">
            <Handshake className="mx-auto size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No open needs right now.</p>
          </div>
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
