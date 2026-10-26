'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { deleteTrip, useTrips } from '@/lib/trips-store'
import { Itinerary } from './itinerary'
import { ShareTrip } from './share-trip'

export function TripDetail({ id }: { id: string }) {
  const router = useRouter()
  const { trips, isLoading } = useTrips()
  const trip = trips.find((t) => t.id === id)

  if (isLoading) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground md:px-6">Loading trip…</p>
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">We couldn&apos;t find that trip</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Trips are saved in the browser they were created in. If someone shared this with you, ask them for the invite
          link.
        </p>
        <div className="mt-6 flex justify-center gap-6 text-sm font-medium">
          <Link href="/join" className="text-primary underline underline-offset-4">Join with a link</Link>
          <Link href="/trips/new" className="text-accent underline underline-offset-4">Plan a trip</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/trips" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> All trips
        </Link>
        <button
          type="button"
          onClick={() => {
            if (confirm('Delete this trip from this browser?')) {
              deleteTrip(trip.id)
              router.push('/trips')
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" aria-hidden="true" /> Delete
        </button>
      </div>
      <Itinerary trip={trip} actions={<ShareTrip trip={trip} />} />
    </div>
  )
}
