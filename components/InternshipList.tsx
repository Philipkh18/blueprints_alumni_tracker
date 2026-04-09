import { Internship } from '@/lib/types'

type Props = { internships: Internship[] }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function InternshipList({ internships }: Props) {
  if (internships.length === 0) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Internships</h2>
      <div className="space-y-4">
        {internships.map((i) => (
          <div key={i.id} className="border-l-2 border-muted pl-4">
            <p className="font-medium">{i.role}</p>
            <p className="text-sm text-muted-foreground">{i.company}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(i.start_date)} — {i.end_date ? formatDate(i.end_date) : 'Present'}
            </p>
            {i.description && <p className="text-sm mt-1">{i.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
