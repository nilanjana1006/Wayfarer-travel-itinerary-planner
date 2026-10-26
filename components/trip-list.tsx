'use client'

import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { useTrips } from '@/lib/trips-store'
import { formatDate, formatInr } from '@/lib/format'
import { tripLength } from '@/lib/schema'

export function TripList({ limit }: { limit?: number }) {
  const { trips, isLoading } = useTrips()

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading your trips…</p>
  }

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 border border-dashed border-input bg-card p-8">
        <p className="text-sm text-muted-foreground">
          No trips yet. Plan one from scratch, or open an invite link a friend sent you.
        </p>
        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <Link href="/trips/new" className="text-accent underline-offset-4 hover:underline">
            Plan a trip
          </Link>
          <Link href="/join" className="text-primary underline-offset-4 hover:underline">
            Join a trip
          </Link>
        </div>
      </div>
    )
  }

  const shown = limit ? trips.slice(0, limit) : trips

  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {shown.map((trip) => {
        const days = tripLength(trip.input.startDate, trip.input.endDate)
        return (
          <li key={trip.id}>
            <Link
              href={`/trips/${trip.id}`}
              className="group flex h-full flex-col gap-3 border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <span className="flex items-center gap-1.5 font-mono text-xs text-accent">
                <MapPin className="size-3.5" aria-hidden="true" />
                {trip.input.destination}
              </span>
              <span className="text-lg font-semibold leading-snug tracking-tight text-primary text-pretty">
                {trip.plan.title}
              </span>
              <span className="mt-auto flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span>
                  {formatDate(trip.input.startDate)} · {days} day{days > 1 ? 's' : ''}
                </span>
                <span>{formatInr(trip.input.budget)}</span>
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-primary">
                Open plan
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
