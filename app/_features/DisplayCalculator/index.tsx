'use client'

import { useState } from 'react'
import CalculatorInput from '@/app/_components/CalculatorInput'
import CalculatorResult from '@/app/_components/CalculatorResult'
import HistoryPanel from '@/app/_components/HistoryPanel'
import type { useCalculationHistory } from '@/app/_hooks/useCalculationHistory'

interface DisplayCalculatorProps {
  historyState: ReturnType<typeof useCalculationHistory>
}

/**
 * DisplayCalculator Feature Component
 *
 * Refactored to a "True Terminal" layout:
 * - No boxes, borders, or container glows.
 * - Fixed Header: Active command line session pinned to the top.
 * - Scrollable Body: Past session logs flow underneath.
 * - Seamless Integration: Input and Result look like a continuous stream.
 */
export default function DisplayCalculator({
  historyState,
}: DisplayCalculatorProps) {
  const [expression, setExpression] = useState('')
  const [currentResult, setCurrentResult] = useState<{
    expression: string
    value: number | string
    isError: boolean
  }>({ expression: '', value: '', isError: false })

  const { history, addHistory, deleteHistory, clearHistory } = historyState

  const handleEvaluate = (
    expr: string,
    val: number | string,
    isErr: boolean,
  ) => {
    setCurrentResult({ expression: expr, value: val, isError: isErr })
  }

  const handleSubmit = (expr: string) => {
    if (currentResult.value !== '' && !currentResult.isError) {
      addHistory(expr, currentResult.value)
    }
    setExpression('')
  }

  const handleSelectHistory = (expr: string) => {
    setExpression(expr)
    // Scroll the parent container to the top
    const scrollContainer = document.querySelector('.overflow-y-auto')
    scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='flex flex-col w-full max-w-4xl mx-auto min-h-full px-4 font-mono'>
      {/*
        Fixed Header Section:
        The active prompt is pinned to the top.
      */}
      <div className='sticky top-0 z-50 bg-terminal-bg/95 backdrop-blur-sm pt-6 pb-4'>
        <div className='flex flex-col gap-1 ml-2 pl-4 border-l border-terminal-mint/50'>
          {/* Active Input Line */}
          <CalculatorInput
            value={expression}
            onValueChange={setExpression}
            onEvaluate={handleEvaluate}
            onSubmit={handleSubmit}
          />

          {/* Active Result Line */}
          <CalculatorResult currentResult={currentResult} />
        </div>

        {/* Minimalist separator */}
        <div className='mt-6 border-b border-terminal-border-dim opacity-20 w-full' />
      </div>

      {/*
        Scrollable History Section:
        Past calculations flow naturally below the active prompt.
      */}
      <div className='grow pb-20'>
        <HistoryPanel
          history={history}
          onSelect={handleSelectHistory}
          onDelete={deleteHistory}
          onClear={clearHistory}
        />
      </div>
    </div>
  )
}
