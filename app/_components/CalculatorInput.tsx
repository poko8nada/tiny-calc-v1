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
  onEvaluate?: (
    expression: string,
    result: number | string,
    isError: boolean,
  ) => void
  onSubmit?: (expression: string) => void
}

/**
 * CalculatorInput Component
 *
 * Provides a terminal-style input interface with:
 * - Custom prompt (user@tiny-calc:~$)
 * - Real-time expression evaluation
 * - Blinking cursor effect
 * - Keyboard handling (Enter to submit)
 */
export default function CalculatorInput({
  onEvaluate,
  onSubmit,
}: CalculatorInputProps) {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [cursorOffset, setCursorOffset] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)

  // Focus input on mount and when clicking the container
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

  // Update cursor pixel offset whenever position or input changes
  useEffect(() => {
    if (measureRef.current) {
      setCursorOffset(measureRef.current.offsetWidth)
    }
  }, [cursorPosition, input])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    updateCursorPosition(e)

    // Real-time evaluation
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
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      onSubmit?.(input)
      setInput('')
      setCursorPosition(0)
      onEvaluate?.('', '', false)
    } else {
      // Use setTimeout to get the cursor position after the key event has been processed
      setTimeout(() => updateCursorPosition(e), 0)
    }
  }

  return (
    <label className='flex items-center font-mono text-lg p-2 cursor-text'>
      <span className='text-terminal-mint mr-2 shrink-0 select-none'>
        user@tiny-calc:~$
      </span>

      {/* Input Wrapper for Cursor Effect */}
      <div className='relative grow flex items-center overflow-hidden'>
        <input
          ref={inputRef}
          type='text'
          value={input}
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
        />

        {/* Mirror element for pixel-perfect measurement */}
        <span
          ref={measureRef}
          className='absolute invisible whitespace-pre pointer-events-none font-mono text-lg'
          aria-hidden='true'
        >
          {input.substring(0, cursorPosition)}
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
