'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { priorityData } from '@/datas/priority'
import { useTaskManager } from '@/hooks/use-task-manager'
import { taskFormSchema } from '@/schemas/task-form'
import { TaskRecord } from '@/utils/task'

import { Button } from '../ui/button'
import { DialogClose, DialogFooter } from '../ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../ui/field'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Spinner } from '../ui/spinner'
import { Textarea } from '../ui/textarea'

export function TaskUpdateForm({ task }: { task: TaskRecord }) {
  const { updateTask } = useTaskManager()

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
    },
  })

  const isSubmitting = form.formState.isSubmitting

  useEffect(() => {
    form.reset({
      title: task.title,
      description: task.description,
      priority: task.priority,
    })
  }, [form, task])

  function onSubmit(data: z.infer<typeof taskFormSchema>) {
    updateTask(task.id, {
      title: data.title,
      description: data.description ?? '',
      priority: data.priority,
    })
  }

  return (
    <>
      <form id="task-update-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">Título</FieldLabel>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                  id="title"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">
                  Descrição (opcional)
                </FieldLabel>

                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                  id="description"
                />

                <FieldDescription>Máximo de 300 caracteres</FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="priority"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="priority">Prioridade</FieldLabel>

                <Select
                  disabled={isSubmitting}
                  name={field.name}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    id="priority"
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent position="item-aligned">
                    {priorityData.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
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
        </FieldGroup>
      </form>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>

        <DialogClose asChild>
          <Button disabled={isSubmitting} form="task-update-form" type="submit">
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'Salvando' : 'Salvar'}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
