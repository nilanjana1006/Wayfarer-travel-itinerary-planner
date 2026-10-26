'use client'

import useSWR, { mutate } from 'swr'
import type { Trip } from './schema'

const KEY = 'wayfarer:trips'

function readTrips(): Trip[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Trip[]) : []
  } catch {
    return []
  }
}

function writeTrips(trips: Trip[]) {
  window.localStorage.setItem(KEY, JSON.stringify(trips))
  mutate(KEY, trips, { revalidate: false })
}

export function useTrips() {
  const { data, isLoading } = useSWR(KEY, readTrips, { revalidateOnFocus: true })
  return { trips: data ?? [], isLoading: isLoading || data === undefined }
}

export function saveTrip(trip: Trip) {
  const others = readTrips().filter((t) => t.id !== trip.id)
  writeTrips([trip, ...others])
}

export function deleteTrip(id: string) {
  writeTrips(readTrips().filter((t) => t.id !== id))
}
