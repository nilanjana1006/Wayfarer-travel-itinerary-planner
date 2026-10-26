'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import type { Trip } from '@/lib/schema'
import { encodeTrip } from '@/lib/share'

export function ShareTrip({ trip }: { trip: Trip }) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')
  const [link, setLink] = useState<string | null>(null)

  async function handleShare() {
    try {
      const url = `${window.location.origin}/join#${await encodeTrip(trip)}`
      setLink(url)
      await navigator.clipboard.writeText(url)
      setState('copied')
      setTimeout(() => setState('idle'), 2500)
    } catch {
      setState('error')
    }
  }

  return (
    <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {state === 'copied' ? <Check className="size-4" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
        {state === 'copied' ? 'Invite link copied' : 'Invite people'}
      </button>
      <p className="text-[11px] text-muted-foreground" aria-live="polite">
        {state === 'error' ? 'Copy blocked — select the link below.' : 'Anyone with the link can join this trip.'}
      </p>
      {link && (
        <input readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Invite link" className="w-72 border border-input bg-card px-2 py-1 font-mono text-[11px]" />
      )}
    </div>
  )
}
