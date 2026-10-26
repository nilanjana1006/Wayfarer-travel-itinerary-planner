import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DisplayHeading, Eyebrow } from '@/components/eyebrow'
import { TripForm } from '@/components/trip-form'

export const metadata: Metadata = { title: 'Plan a trip — wayfarer.' }

export default function NewTripPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <Link href="/trips" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-3.5" aria-hidden="true" /> All trips
      </Link>
      <Eyebrow className="mt-10">Your next adventure</Eyebrow>
      <DisplayHeading lead="A trip that feels" accent="like you." className="mt-5 text-5xl md:text-6xl" />
      <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
        Start with the shape of your trip. We&apos;ll take care of the research and bring you a clear,
        considered plan.
      </p>
      <div className="mt-10">
        <TripForm />
      </div>
    </div>
  )
}
