import type { LinkProps } from 'react-router-dom'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import './Button.css'

export type ButtonLinkVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonLinkProps = LinkProps & {
  children: ReactNode
  variant?: ButtonLinkVariant
  className?: string
}

export function ButtonLink({ children, variant = 'primary', className = '', ...props }: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={['button', `button--${variant}`, className].filter(Boolean).join(' ')}
    >
      {children}
    </Link>
  )
}
