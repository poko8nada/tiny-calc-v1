'use client'

import { useEffect, useState } from 'react'

/**
 * SystemHeader Component
 *
 * A fixed top bar that displays system information and real-time status.
 * Designed to look like a terminal multiplexer or OS status bar.
 */
export default function SystemHeader() {
  const [time, setTime] = useState<string>('XX:XX:XX')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className='w-full bg-terminal-surface border-b border-terminal-border-dim/30 px-4 py-1 font-mono text-[10px] select-none z-50'>
      <div className='w-full max-w-4xl flex items-center justify-between mx-auto'>
        {/* Left: System Identity */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <span className='bg-terminal-gold text-terminal-bg px-1.5 font-bold'>
              TINY-CALC
            </span>
            <span className='text-terminal-gold opacity-70'>v1.0.0-stable</span>
          </div>
          <div className='hidden sm:flex items-center gap-2 text-terminal-muted'>
            <span>[</span>
            <span className='text-terminal-mint animate-pulse'>● ONLINE</span>
            <span>]</span>
          </div>
        </div>

        {/* Right: Session Info & Clock */}
        <div className='flex items-center gap-4'>
          <div className='hidden md:flex items-center gap-2 text-terminal-muted'>
            <span>SESSION:</span>
            <span className='text-terminal-gold'>TTY1</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-terminal-muted'>CLOCK:</span>
            <span className='text-terminal-gold tabular-nums'>{time}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
