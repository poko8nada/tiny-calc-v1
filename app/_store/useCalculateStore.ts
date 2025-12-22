import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { evaluateExpression } from '@/app/_lib/evaluateExpression'
import { addHistoryItem, deleteHistoryItem } from '@/app/_lib/historyUtils'
import type { Result } from '@/utils/types'

interface CalculateStore {
  expression: string
  history: {
    id: string
    expression: string
    result: number
    timestamp: number
  }[]
  result: Result<number, string>
  setExpressionAndResult: (newExpression: string) => void
  submitExpression: () => void
  deleteHistoryItem: (id: string) => void
  clearHistory: () => void
  selectHistoryItem: (expr: string) => void
}

export const useCalculateStore = create<CalculateStore>()(
  persist(
    (set, get) => ({
      expression: '',
      history: [],
      result: { ok: false, error: 'empty' },
      setExpressionAndResult: (newExpression: string) => {
        set({
          expression: newExpression,
          result: evaluateExpression(newExpression),
        })
      },
      submitExpression: () => {
        const { expression, history } = get()
        const exResult = evaluateExpression(expression)
        if (exResult.ok) {
          set({
            expression: '',
            history: addHistoryItem(history, expression, exResult.value),
            result: { ok: false, error: 'empty' },
          })
        }
      },
      deleteHistoryItem: (id: string) => {
        set({
          history: deleteHistoryItem(get().history, id),
        })
      },
      clearHistory: () => {
        set({ history: [] })
      },
      selectHistoryItem: (id: string) => {
        const item = get().history.find(h => h.id === id)
        if (item) {
          set({
            expression: item.expression,
            result: { ok: true, value: item.result },
          })
        }
      },
    }),
    {
      name: 'tiny-calc-history',
    },
  ),
)
