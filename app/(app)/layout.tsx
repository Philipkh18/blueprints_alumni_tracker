import { currentUser } from '@clerk/nextjs/server'
import { getProfileByClerkId } from '@/lib/notion'
import AppShell from '@/components/layout/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  let isAdmin = false

  if (user) {
    const profile = await getProfileByClerkId(user.id)
    isAdmin = profile?.is_admin ?? false
  }

  return (
    <AppShell isAdmin={isAdmin}>
      {children}
    </AppShell>
  )
}
