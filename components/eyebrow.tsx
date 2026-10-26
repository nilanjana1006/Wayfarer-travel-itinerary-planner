import { cn } from '@/lib/utils'

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-accent',
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-6 bg-accent" />
      {children}
    </p>
  )
}

export function DisplayHeading({
  lead,
  accent,
  as: Tag = 'h1',
  className,
}: {
  lead: string
  accent: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}) {
  return (
    <Tag className={cn('font-semibold leading-[0.95] tracking-tighter text-primary text-balance', className)}>
      {lead}
      <br />
      <em className="font-normal text-accent">{accent}</em>
    </Tag>
  )
}
