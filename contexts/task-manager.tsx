'use client'

import * as React from 'react'

import {
  createTaskRecord,
  loadTasksFromStorage,
  progressTasks,
  saveTasksToStorage,
  TaskDraft,
  TaskRecord,
  TimerConfig,
  updateTaskRecord,
} from '@/utils/task'
import {
  getDefaultTimers,
  loadTimersFromStorage,
  saveTimersToStorage,
} from '@/utils/timer'

export const TaskManagerContext = React.createContext<{
  tasks: TaskRecord[]
  timers: TimerConfig
  now: number
  addTask: (draft: TaskDraft) => void
  updateTask: (taskId: string, updates: Partial<TaskDraft>) => void
  removeTask: (taskId: string) => void
  updateTimers: (timers: TimerConfig) => void
} | null>(null)

export function TaskManagerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [tasks, setTasks] = React.useState<TaskRecord[]>([])
  const [timers, setTimers] = React.useState<TimerConfig>(getDefaultTimers)
  const [now, setNow] = React.useState(() => Date.now())
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setTasks(loadTasksFromStorage())
      setTimers(loadTimersFromStorage())
      setNow(Date.now())
      setHydrated(true)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  React.useEffect(() => {
    if (!hydrated) {
      return
    }

    saveTasksToStorage(tasks)
  }, [hydrated, tasks])

  React.useEffect(() => {
    if (!hydrated) {
      return
    }

    saveTimersToStorage(timers)
  }, [hydrated, timers])

  React.useEffect(() => {
    if (!hydrated) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setTasks((currentTasks) =>
        progressTasks(currentTasks, timers, Date.now())
      )
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [hydrated, timers])

  React.useEffect(() => {
    if (!hydrated) {
      return
    }

    const intervalId = window.setInterval(() => {
      const currentNow = Date.now()

      setNow(currentNow)
      setTasks((currentTasks) =>
        progressTasks(currentTasks, timers, currentNow)
      )
    }, 1_000)

    return () => window.clearInterval(intervalId)
  }, [hydrated, timers])

  React.useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === null) {
        return
      }

      if (event.key === 'task-aging:tasks') {
        setTasks(loadTasksFromStorage())
      }

      if (event.key === 'task-aging:timers') {
        setTimers(loadTimersFromStorage())
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const addTask = React.useCallback(
    (draft: TaskDraft) => {
      const now = Date.now()
      const nextTask = createTaskRecord(draft, timers, now)

      setTasks((currentTasks) =>
        progressTasks([...currentTasks, nextTask], timers, now)
      )
    },
    [timers]
  )

  const updateTask = React.useCallback(
    (taskId: string, updates: Partial<TaskDraft>) => {
      const now = Date.now()

      setTasks((currentTasks) =>
        progressTasks(
          currentTasks.map((task) =>
            task.id === taskId
              ? updateTaskRecord(task, updates, timers, now)
              : task
          ),
          timers,
          now
        )
      )
    },
    [timers]
  )

  const removeTask = React.useCallback((taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    )
  }, [])

  const updateTimers = React.useCallback((nextTimers: TimerConfig) => {
    const now = Date.now()

    setTimers(nextTimers)
    setTasks((currentTasks) => progressTasks(currentTasks, nextTimers, now))
  }, [])

  const value = React.useMemo(
    () => ({
      tasks,
      timers,
      now,
      addTask,
      updateTask,
      removeTask,
      updateTimers,
    }),
    [addTask, now, removeTask, tasks, timers, updateTask, updateTimers]
  )

  return (
    <TaskManagerContext.Provider value={value}>
      {children}
    </TaskManagerContext.Provider>
  )
}
