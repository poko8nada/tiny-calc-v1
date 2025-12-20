'use client'

import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { evaluateExpression } from '@/utils/evaluateExpression'

interface CalculatorInputProps {
  value: string
  onValueChange: (value: string) => void
  onEvaluate?: (
    expression: string,
    result: number | string,
    isError: boolean,
  ) => void
  onSubmit?: (expression: string) => void
}

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
export default function CalculatorInput({
  value,
  onValueChange,
  onEvaluate,
  onSubmit,
}: CalculatorInputProps) {
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
        setCursorPosition(value.length)
      } else {
        setCursorPosition(currentPos)
      }
    }
  }, [value])

  // biome-ignore lint/correctness/useExhaustiveDependencies: measureRef is a ref
  useEffect(() => {
    if (measureRef.current) {
      setCursorOffset(measureRef.current.offsetWidth)
    }
  }, [cursorPosition, value])

  // biome-ignore lint/correctness/useExhaustiveDependencies: onEvaluate is a callback prop
  useEffect(() => {
    if (onEvaluate) {
      if (value.trim() === '') {
        onEvaluate('', '', false)
        return
      }

      const result = evaluateExpression(value)
      if (result.ok) {
        onEvaluate(value, result.value, false)
      } else {
        onEvaluate(value, result.error, true)
      }
    }
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onValueChange(newValue)
    updateCursorPosition(e)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim() !== '') {
      onSubmit?.(value)
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
          value={value}
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
          placeholder='Input here. "PI + sin(10) + 10000 * .5"'
        />

        {/* Mirror element for pixel-perfect measurement */}
        <span
          ref={measureRef}
          className='absolute invisible whitespace-pre pointer-events-none font-mono text-sm'
          aria-hidden='true'
        >
          {value.substring(0, cursorPosition)}
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
