import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'
import { getProfileByClerkId } from '@/lib/notion'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  let isAdmin = false

  if (user) {
    const profile = await getProfileByClerkId(user.id)
    isAdmin = profile?.is_admin ?? false
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/home" className="font-semibold text-lg">
              Blueprints
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/home" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Members
              </Link>
              {isAdmin && (
                <Link href="/admin" className="hover:text-foreground transition-colors">
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <UserButton />
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  )
}
