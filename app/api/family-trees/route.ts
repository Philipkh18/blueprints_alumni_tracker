import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  assignFamilyTreeToProfiles,
  createFamilyTree,
  getAllProfiles,
  getAllFamilyTrees,
  getProfileByClerkId,
  updateFamilyTreeName,
} from '@/lib/notion'

type ProfileGraphNode = {
  id: string
  big_id: string | null
  family_tree_id: string | null
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const viewer = await getProfileByClerkId(userId)
  if (!viewer) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const anchorProfileId =
    typeof body?.anchor_profile_id === 'string' ? body.anchor_profile_id : ''
  const name = typeof body?.name === 'string' ? body.name.trim() : ''

  if (!anchorProfileId) {
    return NextResponse.json({ error: 'Missing anchor profile id.' }, { status: 400 })
  }
  if (!name) {
    return NextResponse.json({ error: 'Family tree name is required.' }, { status: 400 })
  }

  const [profiles, familyTrees] = await Promise.all([getAllProfiles(), getAllFamilyTrees()])
  const componentProfileIds = getConnectedComponentProfileIds(profiles, anchorProfileId)

  if (componentProfileIds.length === 0) {
    return NextResponse.json({ error: 'Family not found.' }, { status: 404 })
  }

  const canEdit = viewer.is_admin || componentProfileIds.includes(viewer.id)
  if (!canEdit) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const familyTreeId = resolveComponentFamilyTreeId(profiles, familyTrees, componentProfileIds)

  try {
    let savedFamilyTreeId = familyTreeId

    if (savedFamilyTreeId) {
      await updateFamilyTreeName(savedFamilyTreeId, name)
    } else {
      const createdFamilyTree = await createFamilyTree(name)
      savedFamilyTreeId = createdFamilyTree.id
    }

    await assignFamilyTreeToProfiles(componentProfileIds, savedFamilyTreeId)

    return NextResponse.json({
      success: true,
      family_tree_id: savedFamilyTreeId,
      name,
      member_profile_ids: componentProfileIds,
    })
  } catch (error) {
    console.error('Failed to update family tree.', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update family tree.' },
      { status: 500 }
    )
  }
}

function getConnectedComponentProfileIds(
  profiles: ProfileGraphNode[],
  anchorProfileId: string
) {
  const adjacency = new Map<string, Set<string>>()

  for (const profile of profiles) {
    adjacency.set(profile.id, adjacency.get(profile.id) ?? new Set())
    if (!profile.big_id) continue

    adjacency.set(profile.big_id, adjacency.get(profile.big_id) ?? new Set())
    adjacency.get(profile.id)?.add(profile.big_id)
    adjacency.get(profile.big_id)?.add(profile.id)
  }

  if (!adjacency.has(anchorProfileId)) return []

  const queue = [anchorProfileId]
  const seen = new Set<string>(queue)

  while (queue.length > 0) {
    const currentId = queue.shift()
    if (!currentId) continue

    for (const neighborId of adjacency.get(currentId) ?? []) {
      if (seen.has(neighborId)) continue
      seen.add(neighborId)
      queue.push(neighborId)
    }
  }

  return [...seen]
}

function resolveComponentFamilyTreeId(
  profiles: ProfileGraphNode[],
  familyTrees: { id: string }[],
  componentProfileIds: string[]
) {
  const validFamilyTreeIds = new Set(familyTrees.map((familyTree) => familyTree.id))

  for (const profileId of componentProfileIds) {
    const profile = profiles.find((candidate) => candidate.id === profileId)
    if (profile?.family_tree_id && validFamilyTreeIds.has(profile.family_tree_id)) {
      return profile.family_tree_id
    }
  }

  return null
}
