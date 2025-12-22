import { describe, expect, it, vi } from 'vitest'
import {
  addHistoryItem,
  deleteHistoryItem,
  type HistoryItem,
} from './historyUtils'

/**
 * Mock crypto.randomUUID for consistent testing.
 * We use a valid UUID format to satisfy TypeScript's strict template literal type requirements
 * for the randomUUID return value.
 */
const MOCK_UUID = '12345678-1234-1234-1234-123456789012' as const

vi.stubGlobal('crypto', {
  randomUUID: () => MOCK_UUID,
})

describe('historyUtils', () => {
  describe('addHistoryItem', () => {
    it('should add a new item to the beginning of the list', () => {
      const currentHistory: HistoryItem[] = []
      const result = addHistoryItem(currentHistory, '1 + 1', 2)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        expression: '1+1',
        result: 2,
        id: MOCK_UUID,
        timestamp: expect.any(Number),
      })
    })

    it('should limit history to 100 items', () => {
      // Create a history with 100 items
      const currentHistory: HistoryItem[] = Array.from(
        { length: 100 },
        (_, i) => ({
          id: `id-${i}`,
          expression: '1+1',
          result: 2,
          timestamp: Date.now(),
        }),
      )

      const result = addHistoryItem(currentHistory, 'new expression', 3)

      expect(result).toHaveLength(100)
      expect(result[0].expression).toBe('newexpression')
      // The last item from the original history should be removed
      expect(result.find(item => item.id === 'id-99')).toBeUndefined()
    })

    it('should return current history if expression is empty', () => {
      const currentHistory: HistoryItem[] = [
        { id: '1', expression: '1+1', result: 2, timestamp: 123 },
      ]
      const result = addHistoryItem(currentHistory, '', 2)
      expect(result).toBe(currentHistory)
    })
  })

  describe('deleteHistoryItem', () => {
    it('should remove an item by id', () => {
      const currentHistory: HistoryItem[] = [
        { id: '1', expression: '1+1', result: 2, timestamp: 123 },
        { id: '2', expression: '2+2', result: 4, timestamp: 456 },
      ]
      const result = deleteHistoryItem(currentHistory, '1')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })

    it('should return the same list if id is not found', () => {
      const currentHistory: HistoryItem[] = [
        { id: '1', expression: '1+1', result: 2, timestamp: 123 },
      ]
      const result = deleteHistoryItem(currentHistory, 'non-existent')

      expect(result).toHaveLength(1)
      expect(result).toEqual(currentHistory)
    })
  })
})
