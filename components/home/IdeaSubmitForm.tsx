'use client'

import { useActionState, useRef } from 'react'
import { submitIdea, type IdeaFormState } from '@/app/actions/home'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Lightbulb } from 'lucide-react'

const initialState: IdeaFormState = {}

export default function IdeaSubmitForm() {
  const [state, action, isPending] = useActionState(submitIdea, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  // Reset form on success
  if (state.success && formRef.current) {
    formRef.current.reset()
  }

  return (
    <form ref={formRef} action={action} className="space-y-3 pt-3 border-t border-border">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Lightbulb className="size-3.5" />
        Submit an idea
      </div>
      <Input name="title" placeholder="Idea title" required maxLength={200} disabled={isPending} />
      <Textarea
        name="description"
        placeholder="Describe your idea…"
        required
        maxLength={1000}
        disabled={isPending}
        className="min-h-20 resize-none"
      />
      {state.error && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
      {state.success && (
        <p className="text-xs text-green-600 dark:text-green-400">
          Idea submitted! Thanks for sharing.
        </p>
      )}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? 'Submitting…' : 'Submit idea'}
      </Button>
    </form>
  )
}
