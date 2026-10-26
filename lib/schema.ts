import { z } from 'zod'

export const COMPANIONS = ['Solo', 'As a couple', 'With friends', 'Family'] as const
export const PACES = [
  { value: 'Unhurried', hint: 'Time to linger' },
  { value: 'A little of both', hint: 'Room to explore' },
  { value: 'Full days', hint: 'See it all' },
] as const
export const INTERESTS = [
  'Food & cafés',
  'Architecture',
  'Nature',
  'Art & culture',
  'Markets',
  'Slow mornings',
  'Local experiences',
] as const
export const STAYS = [
  'Boutique stay',
  'Homestay',
  'Comfortable hotel',
  'Hostel or guesthouse',
  'Open to ideas',
] as const

export const MAX_TRIP_DAYS = 14

export const tripInputSchema = z
  .object({
    destination: z.string().trim().min(2).max(80),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    companions: z.enum(COMPANIONS),
    travelers: z.number().int().min(1).max(20),
    pace: z.enum(PACES.map((p) => p.value) as [string, ...string[]]),
    interests: z.array(z.enum(INTERESTS)).max(INTERESTS.length),
    stay: z.enum(STAYS),
    budget: z.number().int().min(1000).max(10_000_000),
  })
  .refine((v) => v.endDate >= v.startDate, {
    message: 'Leave date must be on or after arrive date',
    path: ['endDate'],
  })
  .refine((v) => tripLength(v.startDate, v.endDate) <= MAX_TRIP_DAYS, {
    message: `Trips can be up to ${MAX_TRIP_DAYS} days`,
    path: ['endDate'],
  })

export type TripInput = z.infer<typeof tripInputSchema>

export const planSchema = z.object({
  title: z.string().describe('Short evocative trip title, e.g. "Pink city, slow mornings"'),
  summary: z.string().describe('2-3 sentence overview of the trip'),
  days: z.array(
    z.object({
      title: z.string().describe('Theme of the day'),
      items: z.array(
        z.object({
          time: z.string().describe('e.g. "Morning", "1:00 PM"'),
          title: z.string(),
          description: z.string().describe('One or two practical sentences'),
          costInr: z.number().describe('Estimated cost for the whole group in INR, 0 if free'),
        }),
      ),
    }),
  ),
  budget: z.object({
    stays: z.number().describe('Total INR for the group'),
    transport: z.number().describe('Total local transport INR for the group'),
    food: z.number().describe('Total food INR for the group'),
    experiences: z.number().describe('Total experiences/entry INR for the group'),
  }),
  tips: z.array(z.string()).describe('3-5 short practical tips'),
})

export type Plan = z.infer<typeof planSchema>

export type Trip = {
  id: string
  createdAt: string
  input: TripInput
  plan: Plan
}

export function tripLength(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return Math.round(ms / 86_400_000) + 1
}
