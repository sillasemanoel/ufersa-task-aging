import * as React from 'react'

import { TaskManagerContext } from '@/contexts/task-manager'

export function useTaskManager() {
  const context = React.useContext(TaskManagerContext)

  if (!context) {
    throw new Error(
      'useTaskManager deve ser usado dentro de TaskManagerProvider'
    )
  }

  return context
}
