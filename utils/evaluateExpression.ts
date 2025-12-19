import { evaluate } from 'mathjs'
import { ALLOWED_CONSTANTS, ALLOWED_FUNCTIONS } from './constants'
import { err, ok, type Result } from './types'

/**
 * Pre-compute Sets for fast identifier validation
 *
 * Set vs Array performance:
 * - Array.includes(): O(n) - checks every element linearly
 * - Set.has(): O(1) - uses hash table for instant lookup
 *
 * These Sets are created once at module load time (not per function call),
 * so the conversion cost is paid only once.
 */
const ALLOWED_FUNCTIONS_SET = new Set(
  ALLOWED_FUNCTIONS.map(fn => fn.toLowerCase()),
)
const ALLOWED_CONSTANTS_SET = new Set(
  ALLOWED_CONSTANTS.map(c => c.toUpperCase()),
)

/**
 * Evaluates a mathematical expression safely
 * Security: Only allowlisted functions/constants are permitted
 *
 * @param expression - Mathematical expression string
 * @returns Result<number, string> - { ok: true, value } or { ok: false, error }
 *
 * @example
 * evaluateExpression("2 + 3 * 4")     // { ok: true, value: 14 }
 * evaluateExpression("sin(PI/2)")     // { ok: true, value: 1 }
 * evaluateExpression("1/0")           // { ok: false, error: "..." }
 * evaluateExpression("process.exit") // { ok: false, error: "..." }
 */
export function evaluateExpression(expression: string): Result<number, string> {
  const trimmed = expression.trim()

  if (trimmed.length === 0) {
    return err('Expression cannot be empty')
  }

  // Validate and normalize identifiers against allowlist
  // This allows users to type 'SIN(pi)' and have it evaluated as 'sin(PI)'
  const normalized = trimmed.replace(/[a-zA-Z_]\w*/g, match => {
    const lower = match.toLowerCase()
    if (ALLOWED_FUNCTIONS_SET.has(lower)) return lower

    const upper = match.toUpperCase()
    if (ALLOWED_CONSTANTS_SET.has(upper)) return upper

    return match
  })

  // Re-check for any unauthorized identifiers after normalization attempt
  const identifiers = normalized.match(/[a-zA-Z_]\w*/g)
  if (identifiers) {
    for (const id of new Set(identifiers)) {
      if (!ALLOWED_FUNCTIONS_SET.has(id) && !ALLOWED_CONSTANTS_SET.has(id)) {
        return err(`Unknown identifier: ${id}`)
      }
    }
  }

  try {
    const result = evaluate(normalized)

    if (typeof result !== 'number' || !Number.isFinite(result)) {
      return err(
        typeof result !== 'number'
          ? 'Result is not a number'
          : Number.isNaN(result)
            ? 'Result is NaN'
            : 'Result is infinity',
      )
    }

    return ok(result)
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : 'Unknown evaluation error'

    if (msg.includes('Division by zero')) return err('Division by zero')

    return err(`Syntax error: ${msg}`)
  }
}
