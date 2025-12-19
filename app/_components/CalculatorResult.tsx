interface CalculatorResultProps {
  currentResult: {
    expression: string;
    value: number | string;
    isError: boolean;
  }
}

export default function CalculatorResult({ currentResult }: CalculatorResultProps ) {
  return (
    <>
      <div className='text-terminal-muted mb-2 select-none'>
        [Live Preview]
      </div>
      <div
        className={`text-2xl ${currentResult.isError ? 'text-terminal-red' : 'text-terminal-gold'} glow-text`}
      >
        {currentResult.value !== '' ? `> ${currentResult.value}` : '> _'}
      </div>
    </>
  )
}
