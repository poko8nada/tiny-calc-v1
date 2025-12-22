'use client'

import { useCalculateStore } from '../_store/useCalculateStore'

/**
 * SystemFooter Component
 *
 * A fixed bottom bar that displays operation guides and system status.
 * Enhances the "full-screen application" feel of the terminal.
 */
export default function SystemFooter() {
  // The historyCount is capped at 100.
  const historyCount = useCalculateStore(state => state.history.length)

  return (
    <footer className='w-full bg-terminal-surface border-t border-terminal-border-dim/30 px-4 py-1 font-mono text-[10px] select-none z-50'>
      <div className='w-full max-w-4xl flex items-center justify-between mx-auto'>
        {/* Left: Keybindings Guide */}
        <div className='flex items-center gap-4 overflow-hidden'>
          <div className='flex items-center gap-1.5'>
            <span className='text-terminal-bg bg-terminal-muted px-1 font-bold'>
              ENTER
            </span>
            <span className='text-terminal-muted uppercase'>Evaluate</span>
          </div>
          <div className='hidden sm:flex items-center gap-1.5'>
            <span className='text-terminal-bg bg-terminal-muted px-1 font-bold'>
              ESC
            </span>
            <span className='text-terminal-muted uppercase'>Clear</span>
          </div>
          <div className='hidden md:flex items-center gap-1.5'>
            <span className='text-terminal-bg bg-terminal-muted px-1 font-bold'>
              CLICK
            </span>
            <span className='text-terminal-muted uppercase'>Reuse History</span>
          </div>
        </div>

        {/* Right: Buffer & System Status */}
        <div className='flex items-center gap-4 shrink-0 ml-4'>
          <div className='flex items-center gap-2'>
            <span className='text-terminal-muted'>BUFFER:</span>
            <div className='w-16 h-2 bg-terminal-bg border border-terminal-border-dim/50 relative overflow-hidden'>
              <div
                className='absolute top-0 left-0 h-full bg-terminal-mint/40 transition-all duration-500'
                style={{ width: `${historyCount}%` }}
              />
            </div>
            <span className='text-terminal-mint opacity-70'>
              {historyCount}%
            </span>
          </div>
          <div className='hidden xs:block text-terminal-muted'>UTF-8</div>
        </div>
      </div>
    </footer>
  )
}
