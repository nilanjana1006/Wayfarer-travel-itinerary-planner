import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const sans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', style: ['normal', 'italic'] })
const mono = DM_Mono({ subsets: ['latin'], variable: '--font-dm-mono', weight: ['400', '500'] })

export const metadata: Metadata = {
  title: 'wayfarer. — Thoughtful travel itineraries for India',
  description:
    'Build a considered day-by-day itinerary with costs in rupees, then share it so friends and family can join your trip.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f6f4ee',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} bg-background`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
