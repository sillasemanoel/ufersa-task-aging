'use client'

import { LucideIcon } from 'lucide-react'

import { Button } from '../ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog as DialogUI,
} from '../ui/dialog'

export function Dialog({
  icon: Icon,
  label = '',
  title,
  description,
  variant = 'default',
  size = 'default',
  children,
}: {
  icon: LucideIcon
  label?: string
  title: string
  description: string
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
}) {
  return (
    <DialogUI>
      <DialogTrigger asChild>
        <Button size={size} variant={variant}>
          <Icon />

          {label}
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </DialogUI>
  )
}
