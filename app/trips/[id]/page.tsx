import type { Metadata } from 'next'
import { TripDetail } from '@/components/trip-detail'

export const metadata: Metadata = { title: 'Your itinerary — wayfarer.' }

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TripDetail id={id} />
}
