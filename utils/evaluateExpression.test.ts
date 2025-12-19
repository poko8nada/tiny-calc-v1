import { describe, expect, it } from 'vitest'
import { evaluateExpression } from './evaluateExpression'

describe('evaluateExpression', () => {
  // 1. 正常系: 基本演算
  describe('Basic Arithmetic', () => {
    it('should evaluate addition and subtraction', () => {
      expect(evaluateExpression('1 + 2 - 3')).toEqual({ ok: true, value: 0 })
    })

    it('should evaluate multiplication and division', () => {
      expect(evaluateExpression('10 * 2 / 5')).toEqual({ ok: true, value: 4 })
    })

    it('should respect operator precedence', () => {
      expect(evaluateExpression('1 + 2 * 3')).toEqual({ ok: true, value: 7 })
      expect(evaluateExpression('(1 + 2) * 3')).toEqual({ ok: true, value: 9 })
    })

    it('should handle decimal numbers with high precision', () => {
      expect(evaluateExpression('0.1 + 0.2')).toEqual({ ok: true, value: 0.3 })
    })

    it('should round to specified precision', () => {
      // Default precision is 5
      expect(evaluateExpression('1 / 3')).toEqual({ ok: true, value: 0.33333 })
      // Custom precision
      expect(evaluateExpression('1 / 3', 4)).toEqual({
        ok: true,
        value: 0.3333,
      })
    })
  })

  // 2. 正常系: 許可された関数と定数
  describe('Allowed Functions and Constants', () => {
    it('should evaluate math constants', () => {
      expect(evaluateExpression('PI')).toMatchObject({ ok: true })
      expect(evaluateExpression('E')).toMatchObject({ ok: true })
    })

    it('should evaluate allowed functions', () => {
      expect(evaluateExpression('sqrt(16)')).toEqual({ ok: true, value: 4 })
      expect(evaluateExpression('abs(-5)')).toEqual({ ok: true, value: 5 })
      expect(evaluateExpression('pow(2, 3)')).toEqual({ ok: true, value: 8 })
    })

    it('should evaluate trigonometric functions', () => {
      const result = evaluateExpression('sin(PI / 2)')
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toBe(1)
      }
    })

    it('should be case-insensitive for functions and constants', () => {
      expect(evaluateExpression('SIN(pi / 2)')).toEqual({ ok: true, value: 1 })
    })
  })

  // 3. 異常系: エラーハンドリング
  describe('Error Handling', () => {
    it('should return error for empty expression', () => {
      expect(evaluateExpression('')).toEqual({
        ok: false,
        error: 'Expression cannot be empty',
      })
      expect(evaluateExpression('   ')).toEqual({
        ok: false,
        error: 'Expression cannot be empty',
      })
    })

    it('should return error for syntax errors', () => {
      const result = evaluateExpression('1 + * 2')
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBe('Syntax error: Value expected (char 5)')
      }
    })

    it('should return error for division by zero', () => {
      const result = evaluateExpression('1 / 0')
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toBe('Division by zero')
      }
    })

    it('should return error for non-numeric results', () => {
      // sqrt(-1) returns a complex number in mathjs by default
      const result = evaluateExpression('sqrt(-1)')
      expect(result).toEqual({
        ok: false,
        error: 'Result is not a number',
      })
    })
  })

  // 4. セキュリティ: 許可リストの検証
  describe('Security and Sandboxing', () => {
    it('should reject unauthorized functions', () => {
      const result = evaluateExpression('alert("hello")')
      expect(result).toEqual({
        ok: false,
        error: 'Unknown identifier: alert',
      })
    })

    it('should reject unauthorized constants/variables', () => {
      const result = evaluateExpression('window')
      expect(result).toEqual({
        ok: false,
        error: 'Unknown identifier: window',
      })
    })

    it('should reject property access', () => {
      // mathjs evaluate might throw or return undefined for these
      const result = evaluateExpression('Object.keys')
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toContain('Unknown identifier')
      }
    })

    it('should reject complex injection attempts', () => {
      const result = evaluateExpression('cos.constructor("return process")()')
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toContain('Unknown identifier')
      }
    })
  })
})
