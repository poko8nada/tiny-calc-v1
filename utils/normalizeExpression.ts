/**
 * Security allowlist for expression evaluation
 *
 * Only these functions and constants are permitted in expressions
 * to prevent code injection attacks.
 */

export const ALLOWED_FUNCTIONS = [
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'sinh',
  'cosh',
  'tanh',
  'log',
  'log10',
  'log2',
  'ln',
  'sqrt',
  'abs',
  'ceil',
  'floor',
  'round',
  'trunc',
  'sign',
  'min',
  'max',
  'pow',
  'exp',
] as const

export const ALLOWED_CONSTANTS = [
  'PI',
  'E',
  'LN2',
  'LN10',
  'LOG2E',
  'LOG10E',
  'SQRT1_2',
  'SQRT2',
] as const

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

export const ALLOWED_FUNCTIONS_SET = new Set(
  ALLOWED_FUNCTIONS.map(fn => fn.toLowerCase()),
)
export const ALLOWED_CONSTANTS_SET = new Set(
  ALLOWED_CONSTANTS.map(c => c.toUpperCase()),
)

export function normalized(trimmed: string): string {
  // Validate and normalize identifiers against allowlist
  // This allows users to type 'SIN(pi)' and have it evaluated as 'sin(PI)'
  const normalized = trimmed.replace(/[a-zA-Z_]\w*/g, match => {
    const lower = match.toLowerCase()
    if (ALLOWED_FUNCTIONS_SET.has(lower)) return lower

    const upper = match.toUpperCase()
    if (ALLOWED_CONSTANTS_SET.has(upper)) return upper

    return match
  })
  return normalized
}
