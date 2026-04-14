import { getQuickLinks } from '@/lib/notion-home'
import type { QuickLink } from '@/lib/types'
import { Link2 } from 'lucide-react'
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
  type LucideIcon,
} from 'lucide-react'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Design: Palette,
  Engineering: Code2,
  Resources: BookOpen,
  Social: Users,
  Tools: Wrench,
  Website: Globe,
  Docs: FileText,
  Featured: Star,
}

function LinkCard({ link, index }: { link: QuickLink; index: number }) {
  const Icon: LucideIcon =
    (link.category ? CATEGORY_ICONS[link.category] : undefined) ?? ExternalLink
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover group flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:border-primary/20"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/[0.06] transition-colors duration-200 group-hover:bg-primary/[0.1]">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold leading-snug truncate text-foreground">{link.label}</p>
        {link.category && (
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{link.category}</p>
        )}
      </div>
      <ExternalLink className="size-3 text-muted-foreground/40 group-hover:text-primary/60 transition-colors ml-auto mt-auto" />
    </a>
  )
}

function groupByCategory(
  links: QuickLink[]
): Array<{ category: string; links: QuickLink[] }> {
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
    <div className="brand-panel brand-grid relative overflow-hidden rounded-[1.75rem] p-4 sm:p-5">
      <div className="relative space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Quick Links & Resources</h2>
        </div>

        {error ? (
          <p className="text-sm text-muted-foreground">Could not load links. Try refreshing.</p>
        ) : links.length === 0 ? (
          <div className="py-6 text-center">
            <Link2 className="mx-auto mb-2 size-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No links added yet.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {groups.map(({ category, links: groupLinks }) => (
              <div key={category} className="space-y-2.5">
                {groups.length > 1 && (
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {category}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {groupLinks.map((link, i) => (
                    <LinkCard key={link.id} link={link} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
