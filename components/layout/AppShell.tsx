'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

const ROUTE_META = [
  {
    href: '/home',
    title: 'Network Home',
    subtitle: 'Updates, events, and asks across the Blueprints community.',
  },
  {
    href: '/dashboard',
    title: 'Member Directory',
    subtitle: 'Search alumni, majors, roles, and shared context quickly.',
  },
  {
    href: '/events',
    title: 'Events',
    subtitle: 'Track the moments bringing the network together.',
  },
  {
    href: '/careers',
    title: 'Careers',
    subtitle: 'Keep opportunities visible to the community.',
  },
  {
    href: '/teams',
    title: 'Teams',
    subtitle: 'Follow who is doing what across Blueprints.',
  },
  {
    href: '/connections',
    title: 'Connections',
    subtitle: 'Map the relationships that keep the alumni network warm.',
  },
  {
    href: '/admin',
    title: 'Admin',
    subtitle: 'Manage the data that powers the alumni atlas.',
  },
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
  const routeMeta =
    ROUTE_META.find((item) => pathname === item.href || pathname.startsWith(item.href + '/')) ?? {
      title: 'Blueprints for Pangaea',
      subtitle: 'A shared home for alumni profiles, opportunities, and updates.',
    }

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
    <div className="flex h-dvh bg-transparent">
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
          'fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-r border-sidebar-border bg-[linear-gradient(180deg,oklch(0.995_0.004_248)_0%,oklch(0.965_0.014_248)_100%)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:relative lg:z-auto',
          // Desktop width
          collapsed ? 'lg:w-[68px]' : 'lg:w-60',
          // Mobile: translate off-screen
          mobileOpen ? 'w-64 translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="pointer-events-none absolute inset-0 brand-grid opacity-[0.16]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,oklch(0.88_0.1_252/0.26),transparent_68%)]" />

        {/* Logo */}
        <div
          className={cn(
            'relative z-10 shrink-0 border-b border-sidebar-border transition-all',
            collapsed ? 'flex h-16 items-center justify-center px-3' : 'px-4 py-4'
          )}
        >
          {collapsed ? (
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-brand-ocean),var(--color-brand-bright))] text-primary-foreground shadow-[0_16px_30px_oklch(0.5_0.18_257/0.25)]">
              <Globe className="size-4" />
            </div>
          ) : (
            <>
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/80 hover:text-foreground transition-colors lg:hidden"
              >
                <X className="size-4" />
              </button>
              <div className="brand-panel flex items-center justify-center rounded-[1.5rem] p-3">
                <Image
                  src="/brand/blueprints-logo.png"
                  alt="Blueprints for Pangaea"
                  width={936}
                  height={556}
                  priority
                  className="h-auto w-[10.75rem]"
                />
              </div>
              <div className="mt-3 space-y-1 px-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-muted-foreground">
                  Alumni Hub
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  One place for members, opportunities, updates, and org needs.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          <p
            className={cn(
              'mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/80 transition-opacity',
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
                  'group relative flex h-10 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-[linear-gradient(135deg,var(--color-brand-ocean),var(--color-brand-bright))] text-primary-foreground shadow-[0_16px_28px_oklch(0.5_0.18_257/0.26)]'
                    : 'text-muted-foreground hover:bg-white/80 hover:text-foreground',
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
                  'mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/80 transition-opacity',
                  collapsed && 'lg:opacity-0'
                )}
              >
                Admin
              </p>
              <Link
                href="/admin"
                className={cn(
                  'group flex h-10 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-all duration-150',
                  pathname === '/admin'
                    ? 'bg-[linear-gradient(135deg,var(--color-brand-ocean),var(--color-brand-bright))] text-primary-foreground shadow-[0_16px_28px_oklch(0.5_0.18_257/0.26)]'
                    : 'text-muted-foreground hover:bg-white/80 hover:text-foreground',
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

        {!collapsed && (
          <div className="relative z-10 px-3 pb-3">
            <div className="brand-panel rounded-[1.4rem] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                Atlas Mode
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Use the hub to keep alumni visibility high and team asks easy to find.
              </p>
            </div>
          </div>
        )}

        {/* Collapse toggle — desktop only */}
        <div className="relative z-10 hidden border-t border-sidebar-border p-2 lg:flex">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex h-9 w-full items-center gap-2 rounded-2xl px-3 text-xs text-muted-foreground transition-all duration-150 hover:bg-white/80 hover:text-foreground',
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
        <header className="glass sticky top-0 z-30 flex min-h-16 shrink-0 items-center justify-between border-b border-white/50 px-4 py-3 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/80 hover:text-foreground lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            <div className="hidden min-w-0 sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-muted-foreground">
                Blueprints for Pangaea
              </p>
              <div className="mt-1 flex min-w-0 items-center gap-2">
                <p className="truncate text-sm font-semibold text-foreground">{routeMeta.title}</p>
                <span className="hidden text-xs text-muted-foreground lg:inline">
                  {routeMeta.subtitle}
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative hidden sm:flex items-center">
              <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search alumni, teams, and resources"
                className="h-9 w-60 lg:w-80 rounded-2xl border border-[oklch(0.8_0.05_252/0.45)] bg-white/80 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-200 focus:w-84 focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20 focus:shadow-[0_0_0_4px_oklch(0.57_0.18_257/0.08)]"
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
        <main className="relative flex-1 overflow-y-auto">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.89_0.08_250/0.25),transparent_32%)]" />
          <div className="relative mx-auto w-full max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
