import type { Metadata, Viewport } from 'next'
import { Fira_Code } from 'next/font/google'
import './globals.css'

const firaCode = Fira_Code({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0d0d0d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: {
    default: 'Tiny Calc - Terminal Style Calculator',
    template: '%s | Tiny Calc',
  },
  description:
    'A minimalist terminal-style calculator with calculation history, built with Next.js and Tailwind CSS.',
  keywords: ['Calculator', 'Terminal', 'Retro', 'Next.js', 'React', 'Math.js'],
  authors: [{ name: 'Tiny Calc Team' }],
  creator: 'Tiny Calc Team',
  metadataBase: new URL('https://tiny-calc.example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tiny Calc - Terminal Style Calculator',
    description:
      'A minimalist terminal-style calculator with calculation history',
    url: 'https://tiny-calc.example.com',
    siteName: 'Tiny Calc',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/tiny-calc-ogp.png',
        width: 1200,
        height: 630,
        alt: 'Tiny Calc - Terminal Style Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiny Calc - Terminal Style Calculator',
    description:
      'A minimalist terminal-style calculator with calculation history',
    images: ['/tiny-calc-ogp.png'],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ja'>
      <body className={`${firaCode.variable} antialiased`}>{children}</body>
    </html>
  )
}
