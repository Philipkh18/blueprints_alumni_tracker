import { getQuickLinks } from '@/lib/notion-home'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { QuickLink } from '@/lib/types'
import {
  Palette,
  Code2,
  BookOpen,
  Users,
  Wrench,
  ExternalLink,
  Globe,
  FileText,
  Star,
} from 'lucide-react'

// Map Notion category names to Lucide icons.
// Falls back to ExternalLink for anything not listed.
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Design: Palette,
  Engineering: Code2,
  Resources: BookOpen,
  Social: Users,
  Tools: Wrench,
  Website: Globe,
  Docs: FileText,
  Featured: Star,
}

function LinkCard({ link }: { link: QuickLink }) {
  const Icon = (link.category && CATEGORY_ICONS[link.category]) ?? ExternalLink
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:border-foreground/20 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-muted group-hover:bg-background transition-colors">
        <Icon className="size-4 text-foreground/70" />
      </div>
      <div className="min-w-0">
        <p className="font-medium leading-snug truncate">{link.label}</p>
        {link.category && (
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{link.category}</p>
        )}
      </div>
    </a>
  )
}

// Group links by category for optional display — returned as ordered array of groups.
function groupByCategory(links: QuickLink[]): Array<{ category: string; links: QuickLink[] }> {
  const map = new Map<string, QuickLink[]>()
  for (const link of links) {
    const key = link.category ?? 'Other'
    const existing = map.get(key)
    if (existing) existing.push(link)
    else map.set(key, [link])
  }
  return Array.from(map.entries()).map(([category, links]) => ({ category, links }))
}

export default async function QuickLinksSection() {
  let links: QuickLink[] = []
  let error = false

  try {
    links = await getQuickLinks()
  } catch {
    error = true
  }

  const groups = groupByCategory(links)

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Quick Links &amp; Resources
      </h2>

      {error ? (
        <p className="text-sm text-muted-foreground">Could not load links. Try refreshing.</p>
      ) : links.length === 0 ? (
        <p className="text-sm text-muted-foreground">No links added yet.</p>
      ) : (
        <div className="space-y-4">
          {groups.map(({ category, links: groupLinks }) => (
            <div key={category} className="space-y-2">
              {groups.length > 1 && (
                <p className="text-xs text-muted-foreground font-medium">{category}</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {groupLinks.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
