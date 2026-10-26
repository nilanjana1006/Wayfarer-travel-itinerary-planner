import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center md:px-6">
        <p className="flex items-center gap-6">
          <span className="text-base font-semibold tracking-tight text-primary">
            wayfarer<span className="text-accent">.</span>
          </span>
          Thoughtful plans. Room to wander.
        </p>
        <Link href="/trips/new" className="underline underline-offset-4 hover:text-primary">
          Plan a trip
        </Link>
      </div>
    </footer>
  )
}
