'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { priorityData } from '@/datas/priority'
import { unitData } from '@/datas/unit'
import { useTaskManager } from '@/hooks/use-task-manager'
import { timerFormSchema } from '@/schemas/timer-form'

import { Button } from '../ui/button'
import { DialogClose, DialogFooter } from '../ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Spinner } from '../ui/spinner'

export function TimerUpdateForm() {
  const { timers, updateTimers } = useTaskManager()

  const form = useForm<z.infer<typeof timerFormSchema>>({
    resolver: zodResolver(timerFormSchema),
    defaultValues: timers,
  })

  const isSubmitting = form.formState.isSubmitting

  useEffect(() => {
    form.reset(timers)
  }, [form, timers])

  function onSubmit(data: z.infer<typeof timerFormSchema>) {
    updateTimers(data)
  }

  return (
    <>
      <form id="timer-update-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {priorityData.map((priority) => (
            <div
              className="group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4"
              key={priority.value}
            >
              <FieldLabel htmlFor={priority.value}>{priority.label}</FieldLabel>

              <div className="grid grid-cols-2 gap-2">
                <Controller
                  control={form.control}
                  name={`${priority.value}.time`}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                        disabled={isSubmitting}
                        id={`${priority.value}-time`}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        type="number"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name={`${priority.value}.unit`}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Select
                        disabled={isSubmitting}
                        name={field.name}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                          id={`${priority.value}-unit`}
                        >
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent position="item-aligned">
                          {unitData.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          ))}
        </FieldGroup>
      </form>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>

        <DialogClose asChild>
          <Button
            disabled={isSubmitting}
            form="timer-update-form"
            type="submit"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'Salvando' : 'Salvar'}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
