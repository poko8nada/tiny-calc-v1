import type { Metadata } from 'next'
import { Fira_Code } from 'next/font/google'
import './globals.css'

const firaCode = Fira_Code({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tiny Calc - Terminal Style Calculator',
  description:
    'A minimalist terminal-style calculator with calculation history',
  openGraph: {
    title: 'Tiny Calc - Terminal Style Calculator',
    description:
      'A minimalist terminal-style calculator with calculation history',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiny Calc - Terminal Style Calculator',
    description:
      'A minimalist terminal-style calculator with calculation history',
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
