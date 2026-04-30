import { config } from '@/config'

export function Copyright() {
  return (
    <span className="text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} {config.brand.name}. Todos os direitos
      reservados.
    </span>
  )
}
