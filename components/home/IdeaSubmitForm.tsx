'use client'

import { useActionState, useRef } from 'react'
import { submitIdea, type IdeaFormState } from '@/app/actions/home'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Lightbulb, Send, CheckCircle2 } from 'lucide-react'

const initialState: IdeaFormState = {}

export default function IdeaSubmitForm() {
  const [state, action, isPending] = useActionState(submitIdea, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  if (state.success && formRef.current) {
    formRef.current.reset()
  }

  return (
    <form ref={formRef} action={action} className="space-y-3 pt-4 mt-3 border-t border-border">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        <Lightbulb className="size-3.5" />
        Submit an idea
      </div>
      <Input
        name="title"
        placeholder="What's your idea?"
        required
        maxLength={200}
        disabled={isPending}
        className="transition-shadow duration-200 focus-visible:shadow-[0_0_0_4px_oklch(0.55_0.19_260/0.06)]"
      />
      <Textarea
        name="description"
        placeholder="Describe your idea in a few sentences..."
        required
        maxLength={1000}
        disabled={isPending}
        className="min-h-20 resize-none transition-shadow duration-200 focus-visible:shadow-[0_0_0_4px_oklch(0.55_0.19_260/0.06)]"
      />
      {state.error && (
        <p className="text-xs text-destructive animate-fade-in">{state.error}</p>
      )}
      {state.success && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 animate-fade-in">
          <CheckCircle2 className="size-3.5" />
          Idea submitted! Thanks for sharing.
        </div>
      )}
      <Button type="submit" size="sm" disabled={isPending} className="gap-1.5 transition-transform duration-150 active:scale-[0.98]">
        <Send className="size-3.5" />
        {isPending ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
