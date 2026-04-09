import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { getAllProfiles, getProfileByClerkId } from '@/lib/notion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AdminActions from './AdminActions'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const { userId } = await auth()
  const viewer = await getProfileByClerkId(userId!)
  if (!viewer?.is_admin) redirect('/dashboard')

  const profiles = await getAllProfiles()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">{profiles.length} members</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Major</th>
              <th className="text-left px-4 py-3 font-medium">Grad Year</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {profiles.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/profile/${p.id}`} className="font-medium hover:underline">
                    {p.full_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.major ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.graduation_year ?? '—'}</td>
                <td className="px-4 py-3">
                  {p.is_admin ? (
                    <Badge>Admin</Badge>
                  ) : (
                    <Badge variant="secondary">Member</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/profile/edit?id=${p.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <AdminActions
                      profileId={p.id}
                      isAdmin={p.is_admin}
                      clerkId={p.clerk_id}
                      currentUserId={userId!}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
