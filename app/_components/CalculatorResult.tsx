'use client'

import { useState } from 'react'
import { useCalculateStore } from '../_store/useCalculateStore'
import TerminalButton from './TerminalButton'

/**
 * CalculatorResult Component
 *
 * Displays the result of the mathematical evaluation.
 * Refactored for seamless integration into the terminal prompt flow:
 * - No internal padding or background to match the input line
 * - Reduced font size for errors to prevent layout shifts
 * - Explicit [ COPY ] action button
 */
export default function CalculatorResult() {
  const result = useCalculateStore(state => state.result)

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!result.ok) return

    try {
      await navigator.clipboard.writeText(result.value.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className='font-mono w-full flex items-center min-h-8 text-sm'>
      {!result.ok && result.error === 'empty' ? (
        <div className='text-terminal-muted select-none text-sm opacity-70 flex items-center'>
          <span className='w-6 shrink-0'>↳</span>
          <span>Exaple answer: "5002.59757"</span>
        </div>
      ) : (
        <div className='flex items-center justify-between w-full gap-4'>
          {/* Result/Error Display Area */}
          <div
            className={`font-bold break-all glow-text grow flex items-center ${
              !result.ok ? 'text-terminal-red' : 'text-terminal-cyan'
            }`}
          >
            <span className='select-none w-6 shrink-0 opacity-30'>↳</span>
            {!result.ok ? result.error : result.value}
          </div>

          {/* Copy Button - Only shown for valid results */}
          {!result.ok && (
            <div className='shrink-0'>
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
