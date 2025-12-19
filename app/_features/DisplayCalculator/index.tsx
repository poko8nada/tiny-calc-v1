'use client'

import { useState } from 'react'
import CalculatorInput from '@/app/_components/CalculatorInput'
import CalculatorResult from '@/app/_components/CalculatorResult'

export default function DisplayCalculator() {
  const [currentResult, setCurrentResult] = useState<{
    expression: string
    value: number | string
    isError: boolean
  }>({ expression: '', value: '', isError: false })

  const handleEvaluate = (
    expression: string,
    value: number | string,
    isError: boolean,
  ) => {
    setCurrentResult({ expression, value, isError })
  }

  return (
    <>
      <div className='terminal-border p-4 terminal-surface rounded-lg'>
        <CalculatorInput onEvaluate={handleEvaluate} />
      </div>

      <div className='terminal-border p-4 terminal-surface rounded-lg min-h-[100px]'>
        <CalculatorResult currentResult={currentResult} />
      </div>
    </>
  )
}
