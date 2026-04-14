'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import {
  Home,
  Users,
  Calendar,
  Briefcase,
  FolderKanban,
  Network,
  Shield,
  PanelLeftClose,
  PanelLeft,
  Menu,
  Search,
  Globe,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Members', icon: Users },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/careers', label: 'Careers', icon: Briefcase },
  { href: '/teams', label: 'Teams', icon: FolderKanban },
  { href: '/connections', label: 'Connections', icon: Network },
]

export default function AppShell({
  children,
  isAdmin,
}: {
  children: React.ReactNode
  isAdmin: boolean
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <div className="flex h-dvh bg-background">
      {/* ── Mobile Backdrop ──────────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:relative lg:z-auto',
          // Desktop width
          collapsed ? 'lg:w-[68px]' : 'lg:w-60',
          // Mobile: translate off-screen
          mobileOpen ? 'w-64 translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex h-14 items-center border-b border-sidebar-border shrink-0 transition-all',
            collapsed ? 'justify-center px-3' : 'gap-3 px-4'
          )}
        >
          <div className="relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.55_0.22_260)] shadow-sm">
            <Globe className="size-4 text-primary-foreground" />
          </div>
          <span
            className={cn(
              'font-bold text-[15px] tracking-tight text-foreground transition-all duration-200',
              collapsed ? 'lg:hidden' : ''
            )}
          >
            Blueprints
          </span>
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          <p
            className={cn(
              'mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 transition-opacity',
              collapsed && 'lg:opacity-0'
            )}
          >
            Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 h-9 text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-primary text-primary-foreground shadow-[0_1px_3px_oklch(0.3_0.15_260/0.3)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  collapsed && 'lg:justify-center lg:px-0'
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className={cn('transition-opacity', collapsed && 'lg:hidden')}>
                  {item.label}
                </span>
              </Link>
            )
          })}

          {isAdmin && (
            <>
              <div
                className={cn(
                  'my-3 border-t border-sidebar-border',
                  collapsed ? 'mx-3' : 'mx-2'
                )}
              />
              <p
                className={cn(
                  'mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 transition-opacity',
                  collapsed && 'lg:opacity-0'
                )}
              >
                Admin
              </p>
              <Link
                href="/admin"
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 h-9 text-sm font-medium transition-all duration-150',
                  pathname === '/admin'
                    ? 'bg-primary text-primary-foreground shadow-[0_1px_3px_oklch(0.3_0.15_260/0.3)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  collapsed && 'lg:justify-center lg:px-0'
                )}
              >
                <Shield className="size-4 shrink-0" />
                <span className={cn('transition-opacity', collapsed && 'lg:hidden')}>
                  Admin
                </span>
              </Link>
            </>
          )}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden lg:flex border-t border-sidebar-border p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex w-full items-center gap-2 rounded-xl px-3 h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150',
              collapsed && 'justify-center px-0'
            )}
          >
            {collapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <>
                <PanelLeftClose className="size-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── Main Area ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navigation */}
        <header className="glass sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            {/* Search */}
            <div className="relative hidden sm:flex items-center">
              <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                className="h-8 w-56 lg:w-72 rounded-xl border border-input bg-muted/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:w-80 focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20 focus:shadow-[0_0_0_4px_oklch(0.55_0.19_260/0.06)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'size-8 ring-2 ring-background shadow-sm',
                },
              }}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
