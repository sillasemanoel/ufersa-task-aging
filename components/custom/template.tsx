import { cn } from '@/lib/utils'

export function Template({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn('mx-auto flex min-h-screen max-w-3xl flex-col', className)}
    >
      {children}
    </section>
  )
}

export function Header({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <header
      className={cn(
        'sticky-0 top-0 z-50 flex items-center gap-1 bg-background p-4 md:gap-2 md:px-6',
        className
      )}
    >
      {children}
    </header>
  )
}

export function Main({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <main className={cn('flex flex-1 flex-col p-4 md:px-6', className)}>
      {children}
    </main>
  )
}

export function Section({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      {children}
    </section>
  )
}

export function Footer({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <footer className={cn('flex justify-center p-4 md:px-6', className)}>
      {children}
    </footer>
  )
}
