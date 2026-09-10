import type { ElementType, ReactNode } from 'react'
import './BasicCard.css'

type BasicCardProps = {
  children: ReactNode
  className?: string
  as?: ElementType
}

export function BasicCard({ children, className = '', as: Component = 'article' }: BasicCardProps) {
  return <Component className={['basic-card', className].filter(Boolean).join(' ')}>{children}</Component>
}

