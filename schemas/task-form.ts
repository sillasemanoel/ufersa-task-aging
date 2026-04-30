import * as z from 'zod'

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Insira um título válido')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(300, 'A descrição deve ter no máximo 300 caracteres')
    .optional()
    .or(z.literal('')),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
})
