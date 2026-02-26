import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Aura - Event Content Marketplace',
  description: 'The first peer-to-peer marketplace for event content. Upload your photos, download others, earn 50% revenue share.',
  keywords: 'event photos, peer-to-peer marketplace, buy event photos, sell event photos, aura',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-black text-white min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
