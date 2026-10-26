import Link from 'next/link'
import { Compass, Users } from 'lucide-react'
import { NavLinks } from '@/components/nav-links'

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-[75px] md:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-primary">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Compass className="size-4" aria-hidden="true" />
          </span>
          <span>
            wayfarer<span className="text-accent">.</span>
          </span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <NavLinks />
        </nav>
        <Link
          href="/join"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent"
        >
          <Users className="size-4" aria-hidden="true" />
          Join a trip
        </Link>
      </div>
      <nav aria-label="Mobile" className="flex gap-6 border-t border-border px-4 py-2 text-sm sm:hidden">
        <NavLinks />
      </nav>
    </header>
  )
}
