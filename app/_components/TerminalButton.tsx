'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface TerminalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'default' | 'danger' | 'success'
  size?: 'xs' | 'sm' | 'md'
}

/**
 * TerminalButton Component
 *
 * A reusable button component that follows the terminal aesthetic:
 * - Monospace font
 * - ASCII-style brackets [ ]
 * - Inverted colors on hover/focus
 * - Consistent glow and transition effects
 */
export default function TerminalButton({
  children,
  variant = 'default',
  size = 'xs',
  className = '',
  ...props
}: TerminalButtonProps) {
  const baseStyles = 'font-mono transition-all duration-200 border select-none outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-terminal-bg'

  const variantStyles = {
    default: 'border-terminal-gold text-terminal-gold hover:bg-terminal-gold hover:text-terminal-bg focus:ring-terminal-gold',
    danger: 'border-terminal-red text-terminal-red hover:bg-terminal-red hover:text-terminal-bg focus:ring-terminal-red',
    success: 'border-terminal-mint text-terminal-mint hover:bg-terminal-mint hover:text-terminal-bg focus:ring-terminal-mint',
  }

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px] font-bold',
    sm: 'px-3 py-1 text-xs font-bold',
    md: 'px-4 py-2 text-sm font-bold',
  }

  return (
    <button
      type='button'
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      [ {children} ]
    </button>
  )
}
