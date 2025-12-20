'use client'

import SystemFooter from './_components/SystemFooter'
import SystemHeader from './_components/SystemHeader'
import DisplayCalculator from './_features/DisplayCalculator'
import { useCalculationHistory } from './_hooks/useCalculationHistory'

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
  const historyState = useCalculationHistory()

  return (
    <main className='h-screen w-full flex flex-col overflow-hidden bg-terminal-bg text-terminal-gold font-mono'>
      {/* Fixed Top Bar */}
      <SystemHeader />

      {/*
        Main Content Area:
        - flex-1 allows it to take up all remaining space
        - overflow-y-auto enables scrolling for the history log
      */}
      <div className='flex-1 overflow-y-auto relative'>
        <DisplayCalculator historyState={historyState} />
      </div>

      {/* Fixed Bottom Bar */}
      <SystemFooter historyCount={historyState.history.length} />
    </main>
  )
}
