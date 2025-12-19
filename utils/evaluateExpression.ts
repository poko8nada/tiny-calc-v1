import { all, create } from 'mathjs'
import { ALLOWED_CONSTANTS, ALLOWED_FUNCTIONS } from './constants'
import { err, ok, type Result } from './types'

/**
 * Configure mathjs to use BigNumber for arbitrary precision
 */
const math = create(all, {
  number: 'BigNumber',
  precision: 64,
})

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
 * @param precision - Number of decimal places to round to (default: 2)
 * @returns Result<number, string> - { ok: true, value } or { ok: false, error }
 *
 * @example
 * evaluateExpression("2 + 3 * 4")     // { ok: true, value: 14 }
 * evaluateExpression("0.1 + 0.2")     // { ok: true, value: 0.3 }
 * evaluateExpression("1/0")           // { ok: false, error: "Division by zero" }
 */
export function evaluateExpression(
  expression: string,
  precision = 5,
): Result<number, string> {
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
    let result = math.evaluate(normalized)

    // Round to specified precision while still a BigNumber to maintain accuracy
    if (math.isBigNumber(result)) {
      result = math.round(result, precision)
    }

    // Convert BigNumber to number and validate
    const numericResult = math.isBigNumber(result) ? result.toNumber() : result

    if (typeof numericResult !== 'number' || !Number.isFinite(numericResult)) {
      return err(
        typeof numericResult !== 'number'
          ? 'Result is not a number'
          : Number.isNaN(numericResult)
            ? 'Result is NaN'
            : 'Division by zero',
      )
    }

    return ok(numericResult)
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : 'Unknown evaluation error'

    if (msg.includes('Division by zero')) return err('Division by zero')

    return err(`Syntax error: ${msg}`)
  }
}
