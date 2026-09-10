import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { BasicCard } from '../basic-card/BasicCard'
import './DetailCard.css'

type DetailCardProps = {
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className'>

export function DetailCard({ children, className = '', ...props }: DetailCardProps) {
  return (
    <BasicCard as="div" className={['detail-card', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </BasicCard>
  )
}
