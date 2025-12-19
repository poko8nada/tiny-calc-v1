'use client'

import { type HistoryItem } from '@/utils/historyUtils'

interface HistoryPanelProps {
  history: HistoryItem[]
  onSelect: (expression: string) => void
  onDelete: (id: string) => void
  onClear: () => void
}

/**
 * HistoryPanel Component
 *
 * Displays a list of past calculations in a terminal-style interface.
 * Features:
 * - ASCII border decorations
 * - Clickable items to reuse expressions
 * - Individual item deletion
 * - Bulk clear functionality
 */
export default function HistoryPanel({
  history,
  onSelect,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  return (
    <div className='flex flex-col h-full font-mono text-sm'>
      {/* Header with ASCII Border */}
      <div className='flex items-center justify-between mb-2 px-2'>
        <div className='text-terminal-muted uppercase tracking-widest select-none'>
          <span className='mr-1'>┌</span>
          <span>History</span>
          <span className='ml-1'>─</span>
        </div>
        {history.length > 0 && (
          <button
            type='button'
            onClick={onClear}
            className='text-[10px] text-terminal-red hover:text-terminal-bg hover:bg-terminal-red px-2 py-0.5 border border-terminal-red transition-colors'
          >
            [ CLEAR ALL ]
          </button>
        )}
      </div>

      {/* History List Container */}
      <div className='grow overflow-y-auto border-l border-terminal-border-dim ml-2 pl-4 space-y-4 custom-scrollbar'>
        {history.length === 0 ? (
          <div className='text-terminal-muted italic py-4'>
            {'│ (No history yet)'}
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className='group relative'>
              {/* Vertical line connector */}
              <div className='absolute -left-4 top-2 w-4 border-t border-terminal-border-dim' />

              <div className='flex flex-col gap-1'>
                {/* Expression (Clickable to reuse) */}
                <button
                  type='button'
                  onClick={() => onSelect(item.expression)}
                  className='text-left text-terminal-gold hover:text-terminal-amber transition-colors break-all'
                  title='Click to reuse expression'
                >
                  {`$ ${item.expression}`}
                </button>

                {/* Result and Actions */}
                <div className='flex items-center justify-between gap-2'>
                  <div className='text-terminal-cyan font-bold'>
                    {`> ${item.result}`}
                  </div>

                  <button
                    type='button'
                    onClick={() => onDelete(item.id)}
                    className='opacity-0 group-hover:opacity-100 text-terminal-red hover:scale-110 transition-all px-1'
                    title='Delete record'
                  >
                    [×]
                  </button>
                </div>

                {/* Timestamp */}
                <div className='text-[10px] text-terminal-muted select-none'>
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer ASCII Border */}
      <div className='mt-2 px-2 text-terminal-muted select-none'>
        <span>└</span>
        <span className='mx-1'>────────────────</span>
      </div>
    </div>
  )
}
