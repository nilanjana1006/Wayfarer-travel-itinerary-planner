import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { DisplayHeading, Eyebrow } from '@/components/eyebrow'
import { TripList } from '@/components/trip-list'

export const metadata: Metadata = { title: 'My trips — wayfarer.' }

export default function TripsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>My trips</Eyebrow>
          <DisplayHeading lead="Every plan," accent="in one place." className="mt-5 text-4xl md:text-6xl" />
        </div>
        <Link
          href="/trips/new"
          className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" aria-hidden="true" /> New trip
        </Link>
      </div>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Trips are saved in this browser. Use the share button on any trip to send an invite link.
      </p>
      <div className="mt-10">
        <TripList />
      </div>
    </div>
  )
}
