'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  addHistoryItem,
  deleteHistoryItem,
  type HistoryItem,
} from '@/utils/historyUtils'

const STORAGE_KEY = 'tiny-calc-history'

/**
 * useCalculationHistory Hook
 *
 * Manages the calculation history with:
 * - LocalStorage persistence
 * - Maximum limit of 100 items (via historyUtils)
 * - CRUD operations (add, delete, clear)
 */
export function useCalculationHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse history from localStorage:', e)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    }
  }, [history, isInitialized])

  /**
   * Adds a new calculation to the history
   */
  const addHistory = useCallback(
    (expression: string, result: number | string) => {
      setHistory(prev => addHistoryItem(prev, expression, result))
    },
    [],
  )

  /**
   * Deletes a specific history item by ID
   */
  const deleteHistory = useCallback((id: string) => {
    setHistory(prev => deleteHistoryItem(prev, id))
  }, [])

  /**
   * Clears all history items
   */
  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return {
    history,
    addHistory,
    deleteHistory,
    clearHistory,
    isInitialized,
  }
}
