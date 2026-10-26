const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export const formatInr = (n: number) => inr.format(Math.max(0, Math.round(n)))

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    ...opts,
  })
}

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
