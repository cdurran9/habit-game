import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
  ghost: 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white',
  danger: 'bg-red-600/20 hover:bg-red-600/40 text-red-400',
}

export function Button({ children, onClick, variant = 'primary', disabled, type = 'button', className = '' }: Props) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.93, rotate: -1 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  )
}
