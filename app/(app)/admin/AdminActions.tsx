'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Props = {
  profileId: string
  isAdmin: boolean
  clerkId: string
  currentUserId: string
}

export default function AdminActions({ profileId, isAdmin, clerkId, currentUserId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isSelf = clerkId === currentUserId

  async function toggleAdmin() {
    setLoading(true)
    await fetch(`/api/admin/${profileId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_admin: !isAdmin }),
    })
    router.refresh()
    setLoading(false)
  }

  async function deleteProfile() {
    if (!confirm('Delete this member? This cannot be undone.')) return
    setLoading(true)
    await fetch(`/api/admin/${profileId}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        disabled={loading || isSelf}
        onClick={toggleAdmin}
        title={isSelf ? "Can't change your own admin status" : undefined}
      >
        {isAdmin ? 'Revoke Admin' : 'Make Admin'}
      </Button>
      {!isSelf && (
        <Button variant="destructive" size="sm" disabled={loading} onClick={deleteProfile}>
          Delete
        </Button>
      )}
    </>
  )
}
