import type { Metadata } from 'next'
import { JoinTrip } from '@/components/join-trip'

export const metadata: Metadata = { title: 'Join a trip — wayfarer.' }

export default function JoinPage() {
  return <JoinTrip />
}
