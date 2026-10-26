import type { Trip } from './schema'

function toBase64Url(bytes: Uint8Array) {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(str: string) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream)
  return new Uint8Array(await new Response(out).arrayBuffer())
}

export async function encodeTrip(trip: Trip) {
  const json = new TextEncoder().encode(JSON.stringify(trip))
  return toBase64Url(await pipe(json, new CompressionStream('gzip')))
}

export async function decodeTrip(code: string): Promise<Trip> {
  const bytes = await pipe(fromBase64Url(code.trim()), new DecompressionStream('gzip'))
  const trip = JSON.parse(new TextDecoder().decode(bytes)) as Trip
  if (!trip?.id || !trip.plan?.days || !trip.input?.destination) {
    throw new Error('Invalid trip code')
  }
  return trip
}

export function extractCode(value: string) {
  const v = value.trim()
  const hashIndex = v.indexOf('#')
  return hashIndex >= 0 ? v.slice(hashIndex + 1) : v
}
