import { getActiveIdeas } from '@/lib/notion-home'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Idea } from '@/lib/types'
import { Lightbulb } from 'lucide-react'
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
    <div className="group space-y-1 py-3 border-b border-border last:border-0 transition-colors duration-150 hover:bg-accent/30 -mx-4 px-4 first:rounded-t-lg last:rounded-b-lg">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug">{idea.title}</p>
        <Badge variant={variant} className="text-[10px] shrink-0">
          {label}
        </Badge>
      </div>
      {idea.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {idea.description}
        </p>
      )}
      <p className="text-[11px] text-muted-foreground/70">
        {idea.submitted_by} &middot; {formatDate(idea.created_at)}
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
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="size-4 text-primary" />
          Idea Board
        </CardTitle>
        <CardDescription>Suggestions from the community</CardDescription>
      </CardHeader>
      <CardContent className="pt-1">
        {error ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Could not load ideas.</p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="py-6 text-center">
            <Lightbulb className="mx-auto size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No active ideas yet. Be the first!</p>
          </div>
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
