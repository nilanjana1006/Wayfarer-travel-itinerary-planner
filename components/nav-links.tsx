'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  {
    href: '/trips',
    label: 'My trips',
    isActive: (path: string) => path === '/trips' || (path.startsWith('/trips/') && path !== '/trips/new'),
  },
  {
    href: '/trips/new',
    label: 'Plan a trip',
    isActive: (path: string) => path === '/trips/new',
  },
]

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => {
        const active = link.isActive(pathname)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'transition-colors hover:text-primary',
              active ? 'text-accent' : 'text-muted-foreground',
              className,
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}
