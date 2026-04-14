import { getActiveIdeas } from '@/lib/notion-home'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Idea } from '@/lib/types'
import IdeaSubmitForm from './IdeaSubmitForm'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(iso)
  )
}

const STATUS_BADGE: Record<
  Idea['status'],
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'ghost' }
> = {
  open: { label: 'Open', variant: 'outline' },
  under_review: { label: 'Under Review', variant: 'secondary' },
  implemented: { label: 'Implemented', variant: 'default' },
  closed: { label: 'Closed', variant: 'ghost' },
}

function IdeaItem({ idea }: { idea: Idea }) {
  const { label, variant } = STATUS_BADGE[idea.status]
  return (
    <div className="space-y-1 py-3 border-b border-border last:border-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{idea.title}</p>
        <Badge variant={variant} className="text-[10px] shrink-0">
          {label}
        </Badge>
      </div>
      {idea.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{idea.description}</p>
      )}
      <p className="text-[11px] text-muted-foreground">
        {idea.submitted_by} · {formatDate(idea.created_at)}
      </p>
    </div>
  )
}

export default async function IdeaBoardSection() {
  let ideas: Idea[] = []
  let error = false

  try {
    ideas = await getActiveIdeas()
  } catch {
    error = true
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Idea Board</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {error ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Could not load ideas. Try refreshing.
          </p>
        ) : ideas.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No active ideas yet. Be the first!
          </p>
        ) : (
          <div>
            {ideas.map((idea) => (
              <IdeaItem key={idea.id} idea={idea} />
            ))}
          </div>
        )}
        <IdeaSubmitForm />
      </CardContent>
    </Card>
  )
}
