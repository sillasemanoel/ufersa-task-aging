'use client'

import { SquarePenIcon } from 'lucide-react'

import { useTaskManager } from '@/hooks/use-task-manager'
import { formatCountdown, TaskRecord } from '@/utils/task'

import { ButtonGroup } from '../ui/button-group'
import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
  Item as ItemUI,
} from '../ui/item'
import { Badge } from './badge'
import { Dialog } from './dialog'
import { TaskDelete } from './task-delete'
import { TaskUpdateForm } from './task-update-form'

export function Item({ task }: { task: TaskRecord }) {
  const { now, removeTask } = useTaskManager()
  const countdown = task.priorityAt
    ? formatCountdown(task.priorityAt, now)
    : null

  return (
    <ItemUI variant="muted">
      <ItemContent>
        <div className="flex gap-2">
          <Badge priority={task.priority} />

          <ItemDescription>
            {countdown
              ? `Tempo restante: ${countdown}`
              : 'Prioridade máxima alcançada'}
          </ItemDescription>
        </div>
        <ItemTitle>{task.title}</ItemTitle>

        {task.description && (
          <ItemDescription>{task.description}</ItemDescription>
        )}
      </ItemContent>

      <ItemActions className="flex-col items-end">
        <ButtonGroup>
          <Dialog
            description="Preencha o formulário para atualizar a tarefa."
            icon={SquarePenIcon}
            size="icon"
            title="Atualizar Tarefa"
            variant="outline"
          >
            <TaskUpdateForm task={task} />
          </Dialog>

          <TaskDelete onConfirm={() => removeTask(task.id)} />
        </ButtonGroup>
      </ItemActions>
    </ItemUI>
  )
}
