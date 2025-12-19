'use client'

import { useState } from 'react'

interface CalculatorResultProps {
  currentResult: {
    expression: string
    value: number | string
    isError: boolean
  }
}

/**
 * CalculatorResult Component
 *
 * Displays the result of the mathematical evaluation with:
 * - Explicit [ COPY ] action button for better discoverability
 * - Terminal-style gold/amber/red coloring
 * - Visual feedback on successful copy
 */
export default function CalculatorResult({
  currentResult,
}: CalculatorResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (currentResult.value === '' || currentResult.isError) return

    try {
      await navigator.clipboard.writeText(currentResult.value.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (currentResult.value === '') {
    return (
      <div className='text-terminal-muted italic select-none font-mono p-2'>
        {'> Waiting for input...'}
      </div>
    )
  }

  return (
    <div className='font-mono p-2'>
      {/* Status Header */}
      <div className='text-terminal-muted mb-3 text-xs uppercase tracking-widest select-none flex justify-between items-center h-5'>
        <span>[ Result ]</span>
      </div>

      {/* Result Row */}
      <div className='flex items-center justify-between gap-4'>
        <div
          className={`text-3xl font-bold break-all glow-text ${
            currentResult.isError ? 'text-terminal-red' : 'text-terminal-gold'
          }`}
        >
          <span className='select-none mr-2'>{'>'}</span>
          {currentResult.value}
        </div>

        {!currentResult.isError && (
          <button
            type='button'
            onClick={handleCopy}
            className={`
              shrink-0 w-28 py-1 border border-terminal-gold text-xs font-bold transition-all duration-200 flex justify-center
              ${
                copied
                  ? 'bg-terminal-gold text-terminal-bg border-terminal-gold'
                  : 'text-terminal-gold hover:bg-terminal-gold/10 active:scale-95'
              }
            `}
          >
            {copied ? '[ COPIED! ]' : '[ COPY ]'}
          </button>
        )}
      </div>
    </div>
  )
}
