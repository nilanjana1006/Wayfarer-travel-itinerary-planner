import { CalendarDays, Lightbulb, MapPin, Users } from 'lucide-react'
import { tripLength, type Trip } from '@/lib/schema'
import { addDays, formatDate, formatInr } from '@/lib/format'
import { Eyebrow } from './eyebrow'

const BUDGET_ROWS = [
  { key: 'stays', label: 'Stays', color: 'bg-chart-1' },
  { key: 'transport', label: 'Local transport', color: 'bg-chart-3' },
  { key: 'food', label: 'Food', color: 'bg-chart-2' },
  { key: 'experiences', label: 'Experiences', color: 'bg-chart-4' },
] as const

export function Itinerary({ trip, actions }: { trip: Trip; actions?: React.ReactNode }) {
  const { input, plan } = trip
  const days = tripLength(input.startDate, input.endDate)
  const total = BUDGET_ROWS.reduce((sum, r) => sum + (plan.budget[r.key] ?? 0), 0)
  const remaining = input.budget - total

  return (
    <>
      <header className="mt-10 flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>{input.destination}</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tighter text-primary text-balance md:text-5xl">
            {plan.title}
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{plan.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-accent" aria-hidden="true" />
              {formatDate(input.startDate)} – {formatDate(input.endDate, { year: 'numeric' })} · {days} day{days > 1 ? 's' : ''}
            </li>
            <li className="flex items-center gap-1.5">
              <Users className="size-3.5 text-accent" aria-hidden="true" />
              {input.companions} · {input.travelers}
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-accent" aria-hidden="true" />
              {input.pace} · {input.stay}
            </li>
          </ul>
        </div>
        {actions}
      </header>

      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start">
        <ol className="flex flex-1 flex-col gap-8">
          {plan.days.map((day, i) => (
            <li key={i} className="border border-border bg-card">
              <div className="flex items-baseline gap-4 border-b border-border px-5 py-4">
                <span className="font-mono text-xs text-accent">Day {String(i + 1).padStart(2, '0')}</span>
                <h2 className="flex-1 text-lg font-semibold tracking-tight text-primary">{day.title}</h2>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {formatDate(addDays(input.startDate, i), { weekday: 'short' })}
                </span>
              </div>
              <ul className="divide-y divide-border">
                {day.items.map((item, j) => (
                  <li key={j} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6">
                    <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">{item.time}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-primary">
                      {item.costInr > 0 ? formatInr(item.costInr) : 'Free'}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:w-80">
          <section className="border border-border bg-secondary p-6" aria-labelledby="budget-heading">
            <Eyebrow>Estimated spend</Eyebrow>
            <h2 id="budget-heading" className="mt-3 font-mono text-3xl text-primary">{formatInr(total)}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              of {formatInr(input.budget)} ·{' '}
              <span className={remaining >= 0 ? 'text-primary' : 'text-destructive'}>
                {remaining >= 0 ? `${formatInr(remaining)} to spare` : `${formatInr(-remaining)} over`}
              </span>
            </p>
            <div className="mt-5 flex h-2 overflow-hidden bg-card" aria-hidden="true">
              {BUDGET_ROWS.map((r) => (
                <span key={r.key} className={r.color} style={{ width: `${total ? (plan.budget[r.key] / total) * 100 : 0}%` }} />
              ))}
            </div>
            <dl className="mt-5 flex flex-col gap-2 text-sm">
              {BUDGET_ROWS.map((r) => (
                <div key={r.key} className="flex items-center justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground">
                    <span className={`size-2 ${r.color}`} aria-hidden="true" />
                    {r.label}
                  </dt>
                  <dd className="font-mono text-xs text-primary">{formatInr(plan.budget[r.key])}</dd>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-input pt-3">
                <dt className="text-muted-foreground">Per person</dt>
                <dd className="font-mono text-xs text-primary">{formatInr(total / input.travelers)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[11px] text-muted-foreground">Flights not included. All figures are estimates.</p>
          </section>

          {plan.tips.length > 0 && (
            <section className="border border-border bg-card p-6" aria-labelledby="tips-heading">
              <h2 id="tips-heading" className="flex items-center gap-2 font-semibold text-primary">
                <Lightbulb className="size-4 text-accent" aria-hidden="true" /> Good to know
              </h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="border-l-2 border-accent/40 pl-3">{tip}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </>
  )
}
