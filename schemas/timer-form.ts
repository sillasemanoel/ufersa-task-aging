import * as z from 'zod'

export const timerFormSchema = z.object({
  low: z.object({
    time: z.number().int().min(1, 'Insira um tempo válido'),
    unit: z.enum(['seconds', 'minutes', 'hours', 'days']),
  }),
  normal: z.object({
    time: z.number().int().min(1, 'Insira um tempo válido'),
    unit: z.enum(['seconds', 'minutes', 'hours', 'days']),
  }),
  high: z.object({
    time: z.number().int().min(1, 'Insira um tempo válido'),
    unit: z.enum(['seconds', 'minutes', 'hours', 'days']),
  }),
  urgent: z.object({
    time: z.number().int().min(1, 'Insira um tempo válido'),
    unit: z.enum(['seconds', 'minutes', 'hours', 'days']),
  }),
})
