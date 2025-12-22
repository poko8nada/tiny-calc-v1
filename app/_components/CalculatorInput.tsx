'use client'

import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useCalculateStore } from '../_store/useCalculateStore'

/**
 * CalculatorInput Component (Controlled)
 *
 * Provides a terminal-style input interface with:
 * - Custom prompt (user@tiny-calc:~$)
 * - Real-time expression evaluation
 * - Blinking cursor effect
 * - Keyboard handling (Enter to submit)
 * - Controlled value for history reuse support
 */
export default function CalculatorInput() {
  const expression = useCalculateStore(state => state.expression)
  const setExpression = useCalculateStore(state => state.setExpressionAndResult)
  const submitExpression = useCalculateStore(state => state.submitExpression)

  const [isFocused, setIsFocused] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [cursorOffset, setCursorOffset] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const updateCursorPosition = (
    e:
      | ChangeEvent<HTMLInputElement>
      | KeyboardEvent<HTMLInputElement>
      | React.SyntheticEvent<HTMLInputElement>,
  ) => {
    const target = e.target as HTMLInputElement
    setCursorPosition(target.selectionStart || 0)
  }

  // Sync cursor position when value changes
  useEffect(() => {
    if (inputRef.current) {
      const currentPos = inputRef.current.selectionStart || 0

      // If the input is not focused, we assume it's an external change (like history reuse)
      // and move the cursor to the end.
      if (document.activeElement !== inputRef.current) {
        setCursorPosition(expression.length)
      } else {
        setCursorPosition(currentPos)
      }
    }
  }, [expression])

  // biome-ignore lint/correctness/useExhaustiveDependencies: measureRef is a ref
  useEffect(() => {
    if (measureRef.current) {
      setCursorOffset(measureRef.current.offsetWidth)
    }
  }, [cursorPosition, expression])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setExpression(newValue)
    updateCursorPosition(e)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Submit on Enter
    if (e.key === 'Enter' && expression.trim() !== '') {
      submitExpression()
      setCursorPosition(0)
    } else {
      // Use setTimeout to get the cursor position after the key event has been processed
      setTimeout(() => updateCursorPosition(e), 0)
    }
  }

  return (
    <label className='flex items-center font-mono text-sm cursor-text'>
      <span className='text-terminal-mint w-6 shrink-0 select-none opacity-50'>
        $
      </span>

      {/* Input Wrapper for Cursor Effect */}
      <div className='relative grow flex items-center overflow-hidden'>
        <input
          ref={inputRef}
          type='text'
          value={expression}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={updateCursorPosition}
          onClick={updateCursorPosition}
          onFocus={e => {
            setIsFocused(true)
            updateCursorPosition(e)
          }}
          onBlur={() => setIsFocused(false)}
          className='w-full bg-transparent border-none outline-none text-terminal-gold glow-text caret-transparent'
          spellCheck={false}
          autoComplete='off'
          placeholder='Input here   : "PI+sin(10)+10000*.5"'
        />

        {/* Mirror element for pixel-perfect measurement */}
        <span
          ref={measureRef}
          className='absolute invisible whitespace-pre pointer-events-none font-mono text-sm'
          aria-hidden='true'
        >
          {expression.substring(0, cursorPosition)}
        </span>

        {/* Custom Blinking Cursor */}
        <div
          className='absolute pointer-events-none h-[1.2em] w-[0.6em] bg-terminal-gold animate-cursor-blink opacity-70'
          style={{
            left: `${cursorOffset}px`,
            display: isFocused ? 'block' : 'none',
          }}
        />
      </div>
    </label>
  )
}
