import { currentUser } from '@clerk/nextjs/server'
import { getProfileByClerkId } from '@/lib/notion'
import AppShell from '@/components/layout/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  let isAdmin = false
  let profileHref = '/profile/edit'

  if (user) {
    try {
      const profile = await getProfileByClerkId(user.id)
      isAdmin = profile?.is_admin ?? false
      profileHref = profile ? `/profile/${profile.id}` : '/profile/edit'
    } catch (error) {
      console.error('Failed to load current user profile for app layout.', error)
    }
  }

  return (
    <AppShell isAdmin={isAdmin} profileHref={profileHref}>
      {children}
    </AppShell>
  )
}
