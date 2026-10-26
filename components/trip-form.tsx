'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Loader2, MapPin, Minus, Plus, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COMPANIONS, INTERESTS, MAX_TRIP_DAYS, PACES, STAYS, type Plan, type TripInput } from '@/lib/schema'
import { saveTrip } from '@/lib/trips-store'
import { formatInr } from '@/lib/format'
import { DisplayHeading, Eyebrow } from './eyebrow'

const labelCls = 'mb-2 block text-xs font-semibold text-foreground'
const inputCls =
  'h-11 w-full border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 border px-3 text-xs transition-colors',
        active ? 'border-primary bg-secondary text-primary' : 'border-border bg-card text-muted-foreground hover:border-input',
      )}
    >
      {children}
    </button>
  )
}

function Section({ n, title, hint, children }: { n: string; title: string; hint: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-border py-8 last:border-b-0">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex gap-4">
        <span className="font-mono text-xs text-accent">{n}</span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-primary">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </fieldset>
  )
}

export function TripForm() {
  const router = useRouter()
  const today = new Date().toISOString().slice(0, 10)
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [companions, setCompanions] = useState<TripInput['companions']>('Solo')
  const [travelers, setTravelers] = useState(1)
  const [pace, setPace] = useState<string>('A little of both')
  const [interests, setInterests] = useState<TripInput['interests']>(['Food & cafés', 'Architecture'])
  const [stay, setStay] = useState<TripInput['stay']>('Boutique stay')
  const [budget, setBudget] = useState(65000)
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState<string | null>(null)

  function toggleInterest(i: TripInput['interests'][number]) {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
  }

  function pickCompanions(c: TripInput['companions']) {
    setCompanions(c)
    if (c === 'Solo') setTravelers(1)
    else if (c === 'As a couple') setTravelers(2)
    else if (travelers < 2) setTravelers(c === 'Family' ? 4 : 3)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (endDate < startDate) {
      setError('Your leave date needs to be after your arrive date.')
      return
    }
    const input: TripInput = { destination, startDate, endDate, companions, travelers, pace, interests, stay, budget }
    setStatus('loading')
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = (await res.json()) as { plan?: Plan; error?: string }
      if (!res.ok || !data.plan) throw new Error(data.error ?? 'Something went wrong. Please try again.')
      const id = crypto.randomUUID()
      saveTrip({ id, createdAt: new Date().toISOString(), input, plan: data.plan })
      router.push(`/trips/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  const maxEnd = startDate
    ? new Date(new Date(`${startDate}T00:00:00`).getTime() + (MAX_TRIP_DAYS - 1) * 86_400_000).toISOString().slice(0, 10)
    : undefined

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <form onSubmit={handleSubmit} className="flex-1 border border-border bg-card px-5 md:px-8" aria-busy={status === 'loading'}>
        <ol className="hidden justify-between border-b border-border py-4 font-mono text-[11px] text-muted-foreground sm:flex">
          <li>01 · The essentials</li>
          <li>02 · Your style</li>
          <li>03 · Make it yours</li>
        </ol>

        <Section n="01" title="Where are we going?" hint="A place, a region, or a feeling.">
          <div>
            <label htmlFor="destination" className={labelCls}>Destination</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id="destination"
                required
                minLength={2}
                maxLength={80}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Jaipur, Rajasthan"
                className={cn(inputCls, 'pl-10')}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="start" className={labelCls}>Arrive</label>
              <input
                id="start"
                type="date"
                required
                min={today}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  if (!endDate || endDate < e.target.value) setEndDate(e.target.value)
                }}
                className={inputCls}
              />
            </div>
            <span className="hidden pb-3 text-xs text-muted-foreground sm:block">to</span>
            <div className="flex-1">
              <label htmlFor="end" className={labelCls}>Leave</label>
              <input
                id="end"
                type="date"
                required
                min={startDate || today}
                max={maxEnd}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </Section>

        <Section n="02" title="How do you like to travel?" hint="There's no wrong way to get away.">
          <div>
            <span className={labelCls}>Who&apos;s coming?</span>
            <div className="flex flex-wrap gap-2">
              {COMPANIONS.map((c) => (
                <Chip key={c} active={companions === c} onClick={() => pickCompanions(c)}>{c}</Chip>
              ))}
            </div>
          </div>
          <div>
            <span className={labelCls}>Number of travellers</span>
            <div className="inline-flex h-11 items-center border border-input bg-card">
              <button type="button" aria-label="Decrease travellers" disabled={travelers <= 1} onClick={() => setTravelers((t) => Math.max(1, t - 1))} className="flex size-11 items-center justify-center text-muted-foreground hover:text-primary disabled:opacity-40">
                <Minus className="size-4" />
              </button>
              <span className="w-28 text-center text-sm" aria-live="polite">
                {travelers} traveller{travelers > 1 ? 's' : ''}
              </span>
              <button type="button" aria-label="Increase travellers" disabled={travelers >= 20} onClick={() => setTravelers((t) => Math.min(20, t + 1))} className="flex size-11 items-center justify-center text-muted-foreground hover:text-primary disabled:opacity-40">
                <Plus className="size-4" />
              </button>
            </div>
          </div>
          <div>
            <span className={labelCls}>Your pace</span>
            <div className="grid gap-2 sm:grid-cols-3">
              {PACES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  aria-pressed={pace === p.value}
                  onClick={() => setPace(p.value)}
                  className={cn(
                    'flex flex-col items-start gap-1 border p-3 text-left transition-colors',
                    pace === p.value ? 'border-primary bg-secondary' : 'border-border bg-card hover:border-input',
                  )}
                >
                  <span className="text-sm font-semibold text-foreground">{p.value}</span>
                  <span className="text-[11px] text-muted-foreground">{p.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section n="03" title="The things you love" hint="Choose a few; we'll leave space for surprises.">
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => {
              const active = interests.includes(i)
              return (
                <Chip key={i} active={active} onClick={() => toggleInterest(i)}>
                  {active && <Check className="size-3.5" aria-hidden="true" />}
                  {i}
                </Chip>
              )
            })}
          </div>
          <div>
            <label htmlFor="stay" className={labelCls}>Where do you like to stay?</label>
            <select id="stay" value={stay} onChange={(e) => setStay(e.target.value as TripInput['stay'])} className={inputCls}>
              {STAYS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </Section>

        <div className="border-t border-border py-6">
          {error && (
            <p role="alert" className="mb-4 border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex h-12 w-full items-center justify-center gap-2 bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-80"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Building your itinerary…
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden="true" /> Build my itinerary <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {status === 'loading' ? 'This usually takes 15–30 seconds.' : 'Your details stay yours. Costs are estimates, shown in INR.'}
          </p>
        </div>
      </form>

      <aside className="border border-border bg-secondary p-6 lg:sticky lg:top-6 lg:w-96">
        <Eyebrow>The framework</Eyebrow>
        <DisplayHeading as="h2" lead="A budget that" accent="works for you." className="mt-4 text-3xl" />
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Set your total trip budget. We&apos;ll help spread it across the parts that matter.
        </p>
        <label htmlFor="budget" className={cn(labelCls, 'mt-6')}>Total trip budget</label>
        <div className="flex h-12 items-center gap-2 border border-input bg-card px-3">
          <span className="text-muted-foreground" aria-hidden="true">₹</span>
          <input
            id="budget"
            type="number"
            inputMode="numeric"
            min={1000}
            max={10_000_000}
            step={500}
            value={budget}
            onChange={(e) => setBudget(Math.max(0, Math.round(Number(e.target.value) || 0)))}
            className="w-full bg-transparent font-mono text-lg text-primary outline-none"
          />
          <span className="font-mono text-[11px] text-muted-foreground">INR</span>
        </div>
        <dl className="mt-4 flex justify-between border-b border-input pb-4 font-mono text-xs">
          <div>
            <dt className="text-[11px] text-muted-foreground">Travellers</dt>
            <dd className="mt-1 text-primary">{travelers}</dd>
          </div>
          <div className="text-right">
            <dt className="text-[11px] text-muted-foreground">Per person</dt>
            <dd className="mt-1 text-primary">{formatInr(budget / travelers)}</dd>
          </div>
        </dl>
        <p className="mt-4 flex gap-3 text-[11px] leading-relaxed text-muted-foreground">
          <Wallet className="size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>
            <strong className="text-foreground">Grounded in real costs.</strong> Your estimate includes stays, local
            transport, meals and experiences. Flights are not included.
          </span>
        </p>
      </aside>
    </div>
  )
}
