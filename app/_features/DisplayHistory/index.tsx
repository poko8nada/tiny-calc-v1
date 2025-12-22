import { useRef } from 'react'
import HistoryPanel from '@/app/_components/HistoryPanel'

export default function DisplayHistory() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScrollToTopAction = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div
      className='flex-1 overflow-y-auto relative grow pb-20 w-full max-w-4xl mx-auto px-4'
      ref={scrollRef}
    >
      <HistoryPanel handleScrollToTopAction={handleScrollToTopAction} />
    </div>
  )
}
