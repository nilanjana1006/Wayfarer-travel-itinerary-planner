import { generateText, Output } from 'ai'
import { planSchema, tripInputSchema, tripLength } from '@/lib/schema'
import { buildFallbackPlan } from '@/lib/fallback-plan'

export const maxDuration = 60

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = tripInputSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid trip details' },
      { status: 400 },
    )
  }

  const t = parsed.data
  const days = tripLength(t.startDate, t.endDate)

  try {
    const { output } = await generateText({
      model: 'google/gemini-3-flash',
      output: Output.object({ schema: planSchema }),
      system:
        'You are a thoughtful travel planner specialising in India. Produce realistic, specific itineraries with real place names, sensible routing between neighbourhoods, and honest cost estimates in Indian rupees (INR). Flights are not included in costs. Keep the total budget breakdown at or below the traveller budget.',
      prompt: [
        `Destination: ${t.destination}`,
        `Dates: ${t.startDate} to ${t.endDate} (${days} day${days > 1 ? 's' : ''}) — produce exactly ${days} day entries`,
        `Travelling: ${t.companions}, ${t.travelers} traveller(s)`,
        `Pace: ${t.pace} (${t.pace === 'Unhurried' ? '2-3' : t.pace === 'Full days' ? '5-6' : '3-4'} items per day)`,
        `Interests: ${t.interests.length ? t.interests.join(', ') : 'open to anything'}`,
        `Accommodation preference: ${t.stay}`,
        `Total budget for the group: ₹${t.budget} INR`,
      ].join('\n'),
    })

    return Response.json({ plan: output })
  } catch (error) {
    console.error('[itinerary] AI generation failed, using built-in planner:', (error as Error).message)
    return Response.json({ plan: buildFallbackPlan(t) })
  }
}
