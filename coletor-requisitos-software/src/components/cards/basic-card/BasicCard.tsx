import type { ElementType, ReactNode } from 'react'
import './BasicCard.css'

type BasicCardProps = {
  children: ReactNode
  className?: string
  as?: ElementType
} & Record<string, any>

export function BasicCard({
  children,
  className = '',
  as: Component = 'article',
  ...props
}: BasicCardProps) {
  return (
    <Component className={['basic-card', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Component>
  )
}

