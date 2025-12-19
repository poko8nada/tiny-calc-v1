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
 * - Terminal-style gold/amber/red coloring
 * - Click-to-copy functionality
 * - Visual feedback on successful copy
 * - Glow effects and hover states
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
      <div className='text-terminal-muted italic select-none font-mono'>
        {'> Waiting for input...'}
      </div>
    )
  }

  return (
    <div className='relative group font-mono'>
      {/* Header / Status Area */}
      <div className='text-terminal-muted mb-2 text-xs uppercase tracking-widest select-none flex justify-between items-center h-5'>
        <span>[ Result ]</span>
        {copied && (
          <span className='text-terminal-mint animate-pulse normal-case font-bold'>
            Copied!
          </span>
        )}
      </div>

      {/* Result Display Area */}
      <button
        type='button'
        onClick={handleCopy}
        disabled={currentResult.isError}
        className={`
          w-full text-left text-3xl font-bold break-all transition-all duration-200 bg-transparent border-none p-0
          ${
            currentResult.isError
              ? 'text-terminal-red cursor-default'
              : 'text-terminal-gold hover:text-terminal-amber cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
          }
          glow-text
        `}
        title={!currentResult.isError ? 'Click to copy result' : ''}
      >
        <span className='select-none mr-2'>{'>'}</span>
        {currentResult.value}
      </button>

      {/* Hint for user */}
      {!currentResult.isError && (
        <div className='mt-2 text-[10px] text-terminal-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none'>
          (Click value to copy to clipboard)
        </div>
      )}
    </div>
  )
}
