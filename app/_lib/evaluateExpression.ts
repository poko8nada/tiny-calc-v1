import { all, create } from 'mathjs'
import {
  ALLOWED_CONSTANTS_SET,
  ALLOWED_FUNCTIONS_SET,
  normalized,
} from '@/utils/normalizeExpression'
import { err, ok, type Result } from '@/utils/types'

/**
 * Configure mathjs to use BigNumber for arbitrary precision
 */
const math = create(all, {
  number: 'BigNumber',
  precision: 64,
})

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
    return err('empty')
  }

  const normalizedExpr = normalized(trimmed)

  // Re-check for any unauthorized identifiers after normalization attempt
  const identifiers = normalizedExpr.match(/[a-zA-Z_]\w*/g)
  if (identifiers) {
    for (const id of new Set(identifiers)) {
      if (!ALLOWED_FUNCTIONS_SET.has(id) && !ALLOWED_CONSTANTS_SET.has(id)) {
        return err(`Unknown identifier: ${id}`)
      }
    }
  }

  try {
    let result = math.evaluate(normalizedExpr)

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
