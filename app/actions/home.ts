'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { createIdea } from '@/lib/notion-home'

export type IdeaFormState = {
  error?: string
  success?: boolean
}

export async function submitIdea(
  _prev: IdeaFormState,
  formData: FormData
): Promise<IdeaFormState> {
  const user = await currentUser()
  if (!user) return { error: 'You must be signed in to submit an idea.' }

  const title = formData.get('title')?.toString().trim() ?? ''
  const description = formData.get('description')?.toString().trim() ?? ''

  if (!title) return { error: 'Title is required.' }
  if (!description) return { error: 'Description is required.' }
  if (title.length > 200) return { error: 'Title must be under 200 characters.' }
  if (description.length > 1000) return { error: 'Description must be under 1000 characters.' }

  const submitted_by =
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.emailAddresses[0]?.emailAddress?.split('@')[0] ||
    'Anonymous'

  try {
    await createIdea({ title, description, submitted_by })
    revalidatePath('/home')
    return { success: true }
  } catch {
    return { error: 'Failed to submit idea. Please try again.' }
  }
}
