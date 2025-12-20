'use client'

import { useState } from 'react'
import TerminalButton from './TerminalButton'

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
 * Displays the result of the mathematical evaluation.
 * Refactored for seamless integration into the terminal prompt flow:
 * - No internal padding or background to match the input line
 * - Reduced font size for errors to prevent layout shifts
 * - Explicit [ COPY ] action button
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

  return (
    <div className='font-mono w-full flex items-center min-h-[32px] text-sm'>
      {currentResult.value === '' ? (
        <div className='text-terminal-muted select-none text-sm opacity-70 flex items-center'>
          <span className='w-6 shrink-0'>↳</span>
          <span>Answer is "5002.59757"</span>
        </div>
      ) : (
        <div className='flex items-center justify-between w-full gap-4'>
          {/* Result/Error Display Area */}
          <div
            className={`font-bold break-all glow-text flex-grow flex items-center ${
              currentResult.isError ? 'text-terminal-red' : 'text-terminal-cyan'
            }`}
          >
            <span className='select-none w-6 shrink-0 opacity-30'>↳</span>
            {currentResult.value}
          </div>

          {/* Copy Button - Only shown for valid results */}
          {!currentResult.isError && (
            <div className='flex-shrink-0'>
              <TerminalButton
                onClick={handleCopy}
                variant={copied ? 'success' : 'default'}
              >
                {copied ? 'COPIED!' : 'COPY'}
              </TerminalButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
