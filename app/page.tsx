'use client'

import SystemFooter from './_components/SystemFooter'
import SystemHeader from './_components/SystemHeader'
import DisplayCalculator from './_features/DisplayCalculator'
import DisplayHistory from './_features/DisplayHistory'

/**
 * Home Page
 *
 * Implements a full-screen terminal application layout:
 * - Fixed SystemHeader at the top
 * - Fixed SystemFooter at the bottom
 * - Scrollable DisplayCalculator in the center
 * - Shared history state for buffer status in footer
 */
export default function Home() {
  return (
    <main className='h-screen w-full flex flex-col overflow-hidden bg-terminal-bg text-terminal-gold font-mono'>
      {/* Fixed Top Bar */}
      <SystemHeader />

      <DisplayCalculator />
      <DisplayHistory />

      {/* Fixed Bottom Bar */}
      <SystemFooter />
    </main>
  )
}
