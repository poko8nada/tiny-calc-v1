'use client'

import { useState } from 'react'
import CalculatorInput from '@/app/_components/CalculatorInput'
import CalculatorResult from '@/app/_components/CalculatorResult'
import HistoryPanel from '@/app/_components/HistoryPanel'
import { useCalculationHistory } from '@/app/_hooks/useCalculationHistory'

/**
 * DisplayCalculator Feature Component
 *
 * Orchestrates the main calculator logic by integrating:
 * - CalculatorInput: For expression entry
 * - CalculatorResult: For real-time evaluation display
 * - HistoryPanel: For managing and reusing past calculations
 */
export default function DisplayCalculator() {
  const [expression, setExpression] = useState('')
  const [currentResult, setCurrentResult] = useState<{
    expression: string
    value: number | string
    isError: boolean
  }>({ expression: '', value: '', isError: false })

  const { history, addHistory, deleteHistory, clearHistory } = useCalculationHistory()

  const handleEvaluate = (
    expr: string,
    val: number | string,
    isErr: boolean,
  ) => {
    setCurrentResult({ expression: expr, value: val, isError: isErr })
  }

  const handleSubmit = (expr: string) => {
    // Only add to history if it's a valid calculation
    if (currentResult.value !== '' && !currentResult.isError) {
      addHistory(expr, currentResult.value)
    }
    // Clear input after submission
    setExpression('')
  }

  const handleSelectHistory = (expr: string) => {
    setExpression(expr)
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-10 gap-8 items-start'>
      {/* Main Calculator Area (70% on large screens) */}
      <div className='lg:col-span-7 flex flex-col gap-6'>
        <div className='terminal-border p-4 terminal-surface rounded-lg'>
          <CalculatorInput
            value={expression}
            onValueChange={setExpression}
            onEvaluate={handleEvaluate}
            onSubmit={handleSubmit}
          />
        </div>

        <div className='terminal-border p-4 terminal-surface rounded-lg min-h-[120px] flex items-center'>
          <CalculatorResult currentResult={currentResult} />
        </div>
      </div>

      {/* History Panel Area (30% on large screens) */}
      <div className='lg:col-span-3 terminal-border p-4 terminal-surface rounded-lg h-full min-h-[400px] lg:max-h-[600px]'>
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
