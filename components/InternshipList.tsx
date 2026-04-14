import type { WorkExperience } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { MapPin, Building2 } from 'lucide-react'
import { getCompanyLogoUrl } from '@/lib/company-brand'

type Props = { internships: WorkExperience[] }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function InternshipList({ internships }: Props) {
  if (internships.length === 0) return null

  return (
    <div className="space-y-4">
      {internships.map((i) => (
        <div key={i.id} className="border-l-2 border-muted pl-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                {getCompanyLogoUrl(i.company_website) ? (
                  <img
                    src={getCompanyLogoUrl(i.company_website)!}
                    alt={`${i.company} logo`}
                    className="size-7 object-contain"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Building2 className="size-4 text-muted-foreground" />
                )}
              </div>
              <div>
              <p className="font-medium">{i.role}</p>
              <p className="text-sm text-muted-foreground">{i.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {i.is_current && (
                <Badge variant="default" className="text-[10px]">Current</Badge>
              )}
              {i.employment_type && (
                <Badge variant="outline" className="text-[10px]">{i.employment_type}</Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(i.start_date)} — {i.end_date ? formatDate(i.end_date) : 'Present'}
          </p>
          {(i.location || i.industry) && (
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              {i.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {i.location}
                </span>
              )}
              {i.industry && <span>{i.industry}</span>}
            </div>
          )}
          {i.description && <p className="text-sm mt-1">{i.description}</p>}
        </div>
      ))}
    </div>
  )
}
