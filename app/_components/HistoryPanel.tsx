'use client'

import type { HistoryItem } from '@/utils/historyUtils'
import TerminalButton from './TerminalButton'

interface HistoryPanelProps {
  history: HistoryItem[]
  onSelect: (expression: string) => void
  onDelete: (id: string) => void
  onClear: () => void
}

/**
 * HistoryPanel Component
 *
 * Refactored to look like a continuous terminal log:
 * - No cards or boxes, just a stream of text.
 * - Right-aligned timestamps and delete actions.
 * - Simplified prompts for a cleaner look.
 */
export default function HistoryPanel({
  history,
  onSelect,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  return (
    <div className='flex flex-col h-full font-mono text-sm'>
      {/* History Header / Actions */}
      <div className='flex items-center justify-between mb-6 px-2'>
        <div className='text-terminal-muted uppercase tracking-widest select-none flex items-center gap-2'>
          <span className='text-xs opacity-70'>[ HISTORY LOG ]</span>
          <div className='h-[1px] w-12 bg-terminal-border-dim opacity-30' />
        </div>
        {history.length > 0 && (
          <TerminalButton onClick={onClear} variant='danger'>
            PURGE ALL
          </TerminalButton>
        )}
      </div>

      {/* History Stream */}
      <div className='flex flex-col gap-6'>
        {history.length === 0 ? (
          <div className='text-terminal-muted italic px-2 opacity-50'>
            {'> No records found in buffer.'}
          </div>
        ) : (
          history.map(item => (
            <div
              key={item.id}
              className='group flex flex-col gap-1 px-2 relative border-l border-terminal-border-dim/50 ml-2 pl-4 hover:border-terminal-mint/30 transition-colors'
            >
              {/* Input Line in History */}
              <div className='flex justify-between items-start gap-4'>
                <div className='flex items-start grow'>
                  <span className='text-terminal-mint w-6 shrink-0 select-none opacity-50'>
                    $
                  </span>
                  <button
                    type='button'
                    onClick={() => onSelect(item.expression)}
                    className='text-left text-terminal-gold hover:text-terminal-amber transition-colors break-all'
                    title='Click to reuse expression'
                  >
                    {item.expression}
                  </button>
                </div>

                {/* Right-aligned Timestamp */}
                <div className='shrink-0 text-[10px] text-terminal-muted opacity-70 select-none pt-1'>
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </div>
              </div>

              {/* Result Line in History */}
              <div className='flex justify-between items-center gap-4'>
                <div className='flex items-center grow'>
                  <span className='text-terminal-mint w-6 shrink-0 select-none opacity-30'>
                    ↳
                  </span>
                  <div className='text-terminal-cyan font-bold glow-text'>
                    {item.result}
                  </div>
                </div>

                {/* Delete Action */}
                <div className='shrink-0 opacity-30 group-hover:opacity-100 transition-opacity'>
                  <TerminalButton
                    onClick={() => onDelete(item.id)}
                    variant='danger'
                    className='border-none'
                  >
                    DELETE
                  </TerminalButton>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* End of Buffer Indicator */}
      {history.length > 0 && (
        <div className='mt-12 mb-8 px-2 flex items-center gap-4 opacity-40 select-none'>
          <div className='h-[1px] grow bg-terminal-border-dim' />
          <span className='text-[10px] text-terminal-muted whitespace-nowrap'>
            [ END OF BUFFER ]
          </span>
          <div className='h-[1px] grow bg-terminal-border-dim' />
        </div>
      )}
    </div>
  )
}
