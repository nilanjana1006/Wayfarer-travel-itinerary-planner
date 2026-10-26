'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import type { Trip } from '@/lib/schema'
import { decodeTrip, extractCode } from '@/lib/share'
import { saveTrip } from '@/lib/trips-store'
import { DisplayHeading, Eyebrow } from './eyebrow'
import { Itinerary } from './itinerary'

export function JoinTrip() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [trip, setTrip] = useState<Trip | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load(raw: string) {
    setError(null)
    setLoading(true)
    try {
      setTrip(await decodeTrip(extractCode(raw)))
    } catch {
      setError("That invite link doesn't look right. Check you copied the whole link and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Invite links carry the trip in the URL hash, which only exists client-side.
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) load(hash)
  }, [])

  function join() {
    if (!trip) return
    saveTrip(trip)
    router.push(`/trips/${trip.id}`)
  }

  if (trip) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-4 border border-primary bg-secondary p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-primary">
            <strong className="font-semibold">You&apos;ve been invited.</strong> Join to save this trip to your plans.
          </p>
          <button
            type="button"
            onClick={join}
            className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Join this trip <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
        <Itinerary trip={trip} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      <Eyebrow>Better together</Eyebrow>
      <DisplayHeading lead="Join a trip," accent="pick up the plan." className="mt-5 text-5xl md:text-6xl" />
      <p className="mt-6 leading-relaxed text-muted-foreground">
        Paste the invite link someone shared with you. You&apos;ll see the full itinerary before you join.
      </p>
      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault()
          if (value.trim()) load(value)
        }}
      >
        <label htmlFor="invite" className="sr-only">Invite link</label>
        <input
          id="invite"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://…/join#…"
          className="h-12 flex-1 border border-input bg-card px-3 font-mono text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-80"
        >
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          View trip
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
