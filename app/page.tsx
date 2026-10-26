import Link from 'next/link'
import { ArrowRight, IndianRupee, Gauge, Users } from 'lucide-react'
import { DisplayHeading, Eyebrow } from '@/components/eyebrow'
import { TripList } from '@/components/trip-list'

const FEATURES = [
  { icon: IndianRupee, title: 'Clear costs, in rupees', body: 'See the estimate before you commit.' },
  { icon: Gauge, title: 'Your pace, your priorities', body: 'Not a checklist. A trip that feels like yours.' },
  { icon: Users, title: 'Better together', body: 'Share an invite link and bring your people into the plan.' },
]

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <section className="py-16 md:py-24">
        <Eyebrow>Your travel desk</Eyebrow>
        <DisplayHeading
          lead="Make room for"
          accent="the good bits."
          className="mt-6 text-5xl md:text-7xl"
        />
        <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
          A thoughtful itinerary, shaped around how you like to travel. Less time researching, more time
          looking forward.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/trips/new"
            className="inline-flex h-12 items-center gap-2 bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Plan a trip <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/join"
            className="inline-flex h-12 items-center gap-2 border border-primary px-6 text-sm font-medium text-primary transition-colors hover:bg-secondary"
          >
            Join a trip
          </Link>
        </div>
      </section>

      <section aria-labelledby="plans-heading" className="border-t border-border py-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Your plans</p>
        <h2 id="plans-heading" className="mt-2 text-2xl font-semibold tracking-tight text-primary">
          Your next story starts here
        </h2>
        <div className="mt-6">
          <TripList limit={3} />
        </div>
      </section>

      <section aria-label="Why wayfarer" className="grid gap-px border border-border bg-border md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex flex-col gap-2 bg-card p-6">
            <Icon className="size-5 text-accent" aria-hidden="true" />
            <strong className="mt-2 font-semibold text-primary">{title}</strong>
            <span className="text-sm text-muted-foreground">{body}</span>
          </div>
        ))}
      </section>
    </div>
  )
}
