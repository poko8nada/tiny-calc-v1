import { normalized } from '@/utils/normalizeExpression'

/**
 * HistoryItem Interface
 * Represents a single calculation record in the history
 */
export interface HistoryItem {
  id: string
  expression: string
  result: number
  timestamp: number
}

const MAX_HISTORY = 100

/**
 * Pure logic to add a new history item
 * @param currentHistory - Current list of history items
 * @param expression - Mathematical expression
 * @param result - Evaluation result
 * @returns New history list limited to MAX_HISTORY
 */
export function addHistoryItem(
  currentHistory: HistoryItem[],
  expression: string,
  result: number,
): HistoryItem[] {
  if (!expression || result === undefined) return currentHistory

  const normalizedExpr = normalized(expression).replace(/\s+/g, '')

  const newItem: HistoryItem = {
    id: crypto.randomUUID(),
    expression: normalizedExpr,
    result,
    timestamp: Date.now(),
  }

  return [newItem, ...currentHistory].slice(0, MAX_HISTORY)
}

/**
 * Pure logic to delete a history item
 * @param currentHistory - Current list of history items
 * @param id - ID of the item to remove
 * @returns Filtered history list
 */
export function deleteHistoryItem(
  currentHistory: HistoryItem[],
  id: string,
): HistoryItem[] {
  return currentHistory.filter(item => item.id !== id)
}
