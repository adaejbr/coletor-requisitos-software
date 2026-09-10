import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { BasicCard } from '../basic-card/BasicCard'
import './FormCard.css'

type FormCardProps = {
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<'form'>, 'children' | 'className'>

export function FormCard({ children, className = '', ...props }: FormCardProps) {
  return (
    <BasicCard as="form" className={['form-card', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </BasicCard>
  )
}
