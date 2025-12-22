import CalculatorInput from '@/app/_components/CalculatorInput'
import CalculatorResult from '@/app/_components/CalculatorResult'

/**
 * DisplayCalculator Feature Component
 *
 * Refactored to a "True Terminal" layout:
 * - No boxes, borders, or container glows.
 * - Fixed Header: Active command line session pinned to the top.
 * - Scrollable Body: Past session logs flow underneath.
 * - Seamless Integration: Input and Result look like a continuous stream.
 */
export default function DisplayCalculator() {
  return (
    <div className='flex flex-col w-full max-w-4xl mx-auto px-4 font-mono'>
      {/*
        Fixed Header Section:
        The active prompt is pinned to the top.
      */}
      <div className='sticky top-0 z-50 bg-terminal-bg/95 backdrop-blur-sm pt-6 pb-4'>
        <div className='flex flex-col gap-1 ml-2 pl-4 border-l border-terminal-mint/50'>
          {/* Active Input Line */}
          <CalculatorInput />

          {/* Active Result Line */}
          <CalculatorResult />
        </div>

        {/* Minimalist separator */}
        <div className='mt-6 border-b border-terminal-border-dim opacity-20 w-full' />
      </div>
    </div>
  )
}
