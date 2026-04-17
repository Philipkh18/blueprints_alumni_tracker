'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import type { Profile } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Network, Search, UserRoundPlus, Users } from 'lucide-react'

type Props = {
  profiles: Profile[]
}

type Family = {
  rootId: string
  memberIds: string[]
}

export default function ConnectionsExplorer({ profiles }: Props) {
  const [query, setQuery] = useState('')

  const {
    connectedFamilies,
    unlinkedProfiles,
    childrenById,
    profileMap,
    linkedMembers,
  } = useMemo(() => buildConnectionsData(profiles), [profiles])

  const normalizedQuery = query.trim().toLowerCase()

  const filteredFamilies = useMemo(() => {
    if (!normalizedQuery) return connectedFamilies

    return connectedFamilies.filter((family) =>
      family.memberIds.some((memberId) => {
        const profile = profileMap.get(memberId)
        return profile ? matchesProfile(profile, normalizedQuery) : false
      })
    )
  }, [connectedFamilies, normalizedQuery, profileMap])

  const filteredUnlinkedProfiles = useMemo(() => {
    if (!normalizedQuery) return unlinkedProfiles
    return unlinkedProfiles.filter((profile) => matchesProfile(profile, normalizedQuery))
  }, [normalizedQuery, unlinkedProfiles])

  const hasConnections = connectedFamilies.length > 0

  return (
    <div className="space-y-6">
      <div className="brand-panel rounded-[1.75rem] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Mentor Trees
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Follow the big-little lines across the network.
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every member can set their big in Edit Profile. Littles are derived automatically,
              so each family stays in one tree.
            </p>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a member or family..."
              className="h-10 rounded-2xl border-[oklch(0.8_0.05_252/0.45)] bg-white/70 pl-9"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <StatCard
            icon={Network}
            label="Connected families"
            value={String(connectedFamilies.length)}
          />
          <StatCard
            icon={Users}
            label="Members linked"
            value={`${linkedMembers}/${profiles.length}`}
          />
          <StatCard
            icon={UserRoundPlus}
            label="Still unlinked"
            value={String(unlinkedProfiles.length)}
          />
        </div>
      </div>

      {!hasConnections ? (
        <div className="brand-panel rounded-[1.75rem] p-8 text-center">
          <p className="text-sm font-medium text-foreground">No mentor trees yet.</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Once members add their big in the profile editor, their family lines will appear here.
          </p>
          <Link
            href="/profile/edit"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Edit your profile
          </Link>
        </div>
      ) : filteredFamilies.length === 0 && filteredUnlinkedProfiles.length === 0 ? (
        <div className="brand-panel rounded-[1.75rem] p-8 text-center">
          <p className="text-sm font-medium text-foreground">No families match that search.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different name, major, role, or grad year.
          </p>
        </div>
      ) : (
        <>
          {filteredFamilies.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Connected Families</h3>
                  <p className="text-sm text-muted-foreground">
                    Each tree starts with a root member and branches through their littles.
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {filteredFamilies.length} shown
                </Badge>
              </div>

              <div className="space-y-6">
                {filteredFamilies.map((family) => {
                  const root = profileMap.get(family.rootId)
                  if (!root) return null

                  return (
                    <div key={family.rootId} className="brand-panel rounded-[1.75rem] p-5">
                      <TreeNode
                        profile={root}
                        childrenById={childrenById}
                        query={normalizedQuery}
                        depth={0}
                      />
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {filteredUnlinkedProfiles.length > 0 && (
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Members Without a Big Yet</h3>
                <p className="text-sm text-muted-foreground">
                  These profiles are in the directory but not attached to a mentor tree yet.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredUnlinkedProfiles.map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/profile/${profile.id}`}
                    className="brand-panel rounded-[1.5rem] p-4 transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar profile={profile} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {profile.full_name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {profile.role_title || profile.team || profile.major || 'Member'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function buildConnectionsData(profiles: Profile[]) {
  const orderedProfiles = [...profiles].sort((a, b) => a.full_name.localeCompare(b.full_name))
  const profileMap = new Map(orderedProfiles.map((profile) => [profile.id, profile]))
  const childrenById = new Map<string, Profile[]>()

  for (const profile of orderedProfiles) {
    if (!profile.big_id || profile.big_id === profile.id || !profileMap.has(profile.big_id)) continue

    const siblings = childrenById.get(profile.big_id) ?? []
    siblings.push(profile)
    childrenById.set(profile.big_id, siblings)
  }

  for (const children of childrenById.values()) {
    children.sort((a, b) => a.full_name.localeCompare(b.full_name))
  }

  const roots = orderedProfiles
    .filter((profile) => !profile.big_id || profile.big_id === profile.id || !profileMap.has(profile.big_id))
    .map((profile) => profile.id)

  const families: Family[] = []
  const globallyVisited = new Set<string>()

  for (const rootId of roots) {
    const memberIds = collectFamily(rootId, childrenById)
    memberIds.forEach((memberId) => globallyVisited.add(memberId))
    families.push({ rootId, memberIds })
  }

  for (const profile of orderedProfiles) {
    if (globallyVisited.has(profile.id)) continue

    const memberIds = collectFamily(profile.id, childrenById)
    memberIds.forEach((memberId) => globallyVisited.add(memberId))
    families.push({ rootId: profile.id, memberIds })
  }

  const connectedFamilies = families.filter((family) => family.memberIds.length > 1)
  const unlinkedProfiles = families
    .filter((family) => family.memberIds.length === 1)
    .map((family) => profileMap.get(family.rootId))
    .filter((profile): profile is Profile => Boolean(profile))

  const linkedMembers = orderedProfiles.filter(
    (profile) =>
      (profile.big_id && profileMap.has(profile.big_id) && profile.big_id !== profile.id) ||
      (childrenById.get(profile.id)?.length ?? 0) > 0
  ).length

  return {
    connectedFamilies,
    unlinkedProfiles,
    childrenById,
    profileMap,
    linkedMembers,
  }
}

function collectFamily(rootId: string, childrenById: Map<string, Profile[]>) {
  const seen = new Set<string>()
  const orderedIds: string[] = []

  function walk(currentId: string) {
    if (seen.has(currentId)) return
    seen.add(currentId)
    orderedIds.push(currentId)

    const children = childrenById.get(currentId) ?? []
    for (const child of children) walk(child.id)
  }

  walk(rootId)

  return orderedIds
}

function matchesProfile(profile: Profile, query: string) {
  const haystack = [
    profile.full_name,
    profile.major,
    profile.team,
    profile.role_title,
    profile.location,
    profile.status,
    profile.graduation_year ? String(profile.graduation_year) : null,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

function TreeNode({
  profile,
  childrenById,
  query,
  depth,
}: {
  profile: Profile
  childrenById: Map<string, Profile[]>
  query: string
  depth: number
}) {
  const children = childrenById.get(profile.id) ?? []
  const isMatch = query ? matchesProfile(profile, query) : false

  return (
    <div className={cn(depth > 0 && 'pl-6')}>
      <div className="relative">
        {depth > 0 && (
          <>
            <span className="absolute -left-6 top-7 h-px w-4 bg-[oklch(0.82_0.04_250)]" />
            <span className="absolute -left-2.5 top-[1.55rem] size-2 rounded-full bg-[var(--color-brand-bright)]" />
          </>
        )}

        <Link
          href={`/profile/${profile.id}`}
          className={cn(
            'flex items-start gap-3 rounded-[1.35rem] border px-4 py-3 transition-all duration-150 hover:-translate-y-0.5',
            isMatch
              ? 'border-primary/40 bg-primary/8 shadow-[0_10px_28px_oklch(0.58_0.17_255/0.12)]'
              : 'border-[oklch(0.89_0.01_255)] bg-white/65 hover:bg-white/80'
          )}
        >
          <Avatar profile={profile} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground">{profile.full_name}</p>
              {profile.graduation_year && (
                <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px]">
                  {profile.graduation_year}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile.role_title || profile.team || profile.major || 'Member'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              {profile.status && <span>{profile.status}</span>}
              {profile.location && <span>{profile.location}</span>}
              {children.length > 0 && (
                <span>
                  {children.length} little{children.length === 1 ? '' : 's'}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {children.length > 0 && (
        <div className="relative mt-4 border-l border-dashed border-[oklch(0.82_0.04_250)] pl-4">
          <div className="space-y-4">
            {children.map((child) => (
              <TreeNode
                key={child.id}
                profile={child}
                childrenById={childrenById}
                query={query}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Avatar({ profile }: { profile: Profile }) {
  if (profile.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.full_name}
        className="size-12 rounded-2xl object-cover ring-1 ring-black/5"
      />
    )
  }

  const initials = profile.full_name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-brand-ocean),var(--color-brand-bright))] text-sm font-semibold text-primary-foreground">
      {initials || '?'}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-[1.35rem] border border-[oklch(0.89_0.01_255)] bg-white/70 px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  )
}
