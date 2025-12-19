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
