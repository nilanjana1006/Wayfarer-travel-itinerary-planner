import { tripLength, type Plan, type TripInput } from './schema'

type Interest = TripInput['interests'][number]
type Idea = { title: string; description: string; cost: number }

const IDEAS: Record<Interest, Idea[]> = {
  'Food & cafés': [
    { title: 'Breakfast at a local institution', description: 'Ask your host for the busiest breakfast spot nearby — queues are a good sign. Try the regional speciality.', cost: 250 },
    { title: 'Street-food walk', description: 'Graze through the old quarter in small portions. Stick to stalls with high turnover and freshly cooked food.', cost: 400 },
    { title: 'Long lunch, regional thali', description: 'A thali is the best way to taste many local dishes at once. Unlimited refills are common.', cost: 450 },
    { title: 'Café hour', description: 'Find an independent café for coffee or chai and something sweet. A good moment to slow down.', cost: 300 },
  ],
  Architecture: [
    { title: 'Old city heritage walk', description: 'Walk the historic core early, before the heat and crowds. A local guide adds stories you would otherwise miss.', cost: 600 },
    { title: 'Fort or palace visit', description: 'Give yourself two unhurried hours. Carry water and check the last-entry time.', cost: 500 },
    { title: 'Stepwells, temples and havelis', description: 'Seek out the lesser-known heritage buildings — often as beautiful and far quieter.', cost: 200 },
  ],
  Nature: [
    { title: 'Sunrise viewpoint', description: 'Head to the best nearby viewpoint or lake for first light. Book a car the night before.', cost: 500 },
    { title: 'Garden or lakeside stroll', description: 'An easy green escape from the city — good for a slow late afternoon.', cost: 100 },
    { title: 'Half-day countryside trip', description: 'Hire a driver for a loop through the surrounding countryside, villages or hills.', cost: 1800 },
  ],
  'Art & culture': [
    { title: 'City museum', description: 'Start with the main museum to get your bearings on local history and craft.', cost: 300 },
    { title: 'Evening performance', description: 'Look for a folk music, dance or classical performance — many hotels and cultural centres host them.', cost: 600 },
    { title: 'Craft workshop', description: 'Spend an hour with a local artisan — block printing, pottery or textiles depending on the region.', cost: 1200 },
  ],
  Markets: [
    { title: 'Bazaar wander', description: 'Lose yourself in the main bazaar. Browse first, buy later, and bargain with a smile.', cost: 0 },
    { title: 'Spice and textile lanes', description: 'Look for the specialist lanes — spices, fabrics, silver. Good for gifts that travel well.', cost: 0 },
  ],
  'Slow mornings': [
    { title: 'Lazy start', description: 'No alarm. Breakfast where you are staying and an easy, unplanned morning.', cost: 0 },
    { title: 'Rooftop chai', description: 'Find a rooftop with a view and take your time over chai and a book.', cost: 150 },
  ],
  'Local experiences': [
    { title: 'Home-cooked meal with a family', description: 'Book a home dining experience — the best way to understand how people here really eat.', cost: 1500 },
    { title: 'Neighbourhood cycle tour', description: 'An early morning ride through residential lanes, markets and temples with a local guide.', cost: 1200 },
    { title: 'Evening aarti or local ritual', description: 'Join the crowd at a temple, ghat or lake for the evening ceremony. Dress modestly.', cost: 0 },
  ],
}

const FALLBACK_INTERESTS: Interest[] = ['Architecture', 'Food & cafés', 'Markets', 'Local experiences']
const NIGHTLY: Record<TripInput['stay'], number> = {
  'Boutique stay': 5500,
  Homestay: 2500,
  'Comfortable hotel': 4500,
  'Hostel or guesthouse': 1200,
  'Open to ideas': 3500,
}
const SLOTS = ['Morning', 'Late morning', '1:00 PM', 'Afternoon', 'Golden hour', 'Evening']

export function buildFallbackPlan(t: TripInput): Plan {
  const days = tripLength(t.startDate, t.endDate)
  const perDay = t.pace === 'Unhurried' ? 3 : t.pace === 'Full days' ? 5 : 4
  const interests = t.interests.length ? t.interests : FALLBACK_INTERESTS
  const pool = interests.flatMap((i) => IDEAS[i])
  const place = t.destination.split(',')[0].trim()
  const rooms = Math.ceil(t.travelers / 2)
  const scale = t.travelers

  let cursor = 0
  const planDays: Plan['days'] = Array.from({ length: days }, (_, d) => {
    const items = Array.from({ length: perDay }, (_, k) => {
      const idea = pool[cursor++ % pool.length]
      const slot = SLOTS[Math.round((k * (SLOTS.length - 1)) / Math.max(1, perDay - 1))]
      return { time: slot, title: idea.title, description: idea.description, costInr: idea.cost * scale }
    })
    const title =
      d === 0 ? `Arriving in ${place}` : d === days - 1 && days > 1 ? 'One last wander' : `${place}, day ${d + 1}`
    return { title, items }
  })

  const experiences = planDays.flatMap((d) => d.items).reduce((s, i) => s + i.costInr, 0)
  const nights = Math.max(1, days - 1)
  let stays = NIGHTLY[t.stay] * rooms * nights
  let food = 900 * scale * days
  let transport = 700 * Math.ceil(t.travelers / 4) * days
  const total = stays + food + transport + experiences
  if (total > t.budget) {
    const k = Math.max(0.4, (t.budget - experiences) / (stays + food + transport))
    stays = Math.round(stays * k)
    food = Math.round(food * k)
    transport = Math.round(transport * k)
  }

  return {
    title: `${place}, at your own pace`,
    summary: `A ${days}-day ${t.pace.toLowerCase()} trip to ${t.destination} for ${t.companions.toLowerCase()}, built around ${interests
      .slice(0, 3)
      .join(', ')
      .toLowerCase()}. Treat it as a starting framework — swap in places you discover along the way.`,
    days: planDays,
    budget: { stays, transport, food, experiences },
    tips: [
      'Carry some cash in small notes — many smaller vendors prefer UPI or cash.',
      'Start sightseeing early to beat the heat and the crowds.',
      'Use app-based cabs or agree on auto-rickshaw fares before you set off.',
      'Dress modestly for temples and remove shoes where asked.',
    ],
  }
}
