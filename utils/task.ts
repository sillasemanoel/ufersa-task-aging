import { priorityData } from '@/datas/priority'
import { unitData } from '@/datas/unit'

export const priorityOrder = priorityData.map((item) => item.value)
export const timerUnitOrder = unitData.map((item) => item.value)

export type TaskPriority = (typeof priorityOrder)[number]
export type TimerUnit = (typeof timerUnitOrder)[number]

export type TimerConfig = Record<
  TaskPriority,
  {
    time: number
    unit: TimerUnit
  }
>

export type TaskDraft = {
  title: string
  description: string
  priority: TaskPriority
}

export type TaskRecord = TaskDraft & {
  id: string
  createdAt: number
  updatedAt: number
  priorityAt: number | null
}

export const taskStorageKey = 'tasks'

export function getMilliseconds(time: number, unit: TimerUnit) {
  const values = {
    seconds: 1_000,
    minutes: 60_000,
    hours: 3_600_000,
    days: 86_400_000,
  } satisfies Record<TimerUnit, number>

  return time * values[unit]
}

export function getNextPriority(priority: TaskPriority): TaskPriority | null {
  const index = priorityOrder.indexOf(priority)

  if (index === -1 || index === priorityOrder.length - 1) {
    return null
  }

  return priorityOrder[index + 1]
}

export function getPriorityAt(
  priority: TaskPriority,
  timers: TimerConfig,
  from = Date.now()
) {
  const nextPriority = getNextPriority(priority)

  if (!nextPriority) {
    return null
  }

  return from + getMilliseconds(timers[priority].time, timers[priority].unit)
}

export function formatCountdown(targetAt: number, now = Date.now()) {
  const remainingMilliseconds = Math.max(0, targetAt - now)
  const totalSeconds = Math.floor(remainingMilliseconds / 1000)
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60

  const pad = (value: number) => String(value).padStart(2, '0')

  if (days > 0) {
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function createTaskRecord(
  draft: TaskDraft,
  timers: TimerConfig,
  now = Date.now()
): TaskRecord {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${now}-${Math.random()}`,
    title: draft.title,
    description: draft.description,
    priority: draft.priority,
    priorityAt: getPriorityAt(draft.priority, timers, now),
    createdAt: now,
    updatedAt: now,
  }
}

export function updateTaskRecord(
  existing: TaskRecord,
  updates: Partial<TaskDraft>,
  timers: TimerConfig,
  now = Date.now()
) {
  const nextPriority = updates.priority ?? existing.priority
  const priorityChanged =
    Object.prototype.hasOwnProperty.call(updates, 'priority') &&
    updates.priority !== undefined &&
    updates.priority !== existing.priority

  return {
    ...existing,
    ...updates,
    description: updates.description ?? existing.description,
    priority: nextPriority,
    priorityAt: priorityChanged
      ? getPriorityAt(nextPriority, timers, now)
      : existing.priorityAt,
    updatedAt: now,
  }
}

export function advanceTaskPriority(
  task: TaskRecord,
  timers: TimerConfig,
  now = Date.now()
) {
  if (task.priorityAt === null || task.priorityAt > now) {
    return task
  }

  const nextPriority = getNextPriority(task.priority)

  if (!nextPriority) {
    return {
      ...task,
      priorityAt: null,
      updatedAt: now,
    }
  }

  return {
    ...task,
    priority: nextPriority,
    priorityAt: getPriorityAt(nextPriority, timers, now),
    updatedAt: now,
  }
}

export function progressTasks(
  tasks: TaskRecord[],
  timers: TimerConfig,
  now = Date.now()
) {
  let changed = false

  const nextTasks = tasks.map((task) => {
    const nextTask = advanceTaskPriority(task, timers, now)

    if (nextTask !== task) {
      changed = true
    }

    return nextTask
  })

  return changed ? nextTasks : tasks
}

export function loadTasksFromStorage() {
  if (typeof window === 'undefined') {
    return [] as TaskRecord[]
  }

  try {
    const raw = window.localStorage.getItem(taskStorageKey)

    if (!raw) {
      return [] as TaskRecord[]
    }

    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) {
      return [] as TaskRecord[]
    }

    return parsed.filter(isTaskRecord)
  } catch {
    return [] as TaskRecord[]
  }
}

export function saveTasksToStorage(tasks: TaskRecord[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(taskStorageKey, JSON.stringify(tasks))
}

function isTaskRecord(value: unknown): value is TaskRecord {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Partial<TaskRecord>

  return (
    typeof record.id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.description === 'string' &&
    priorityOrder.includes(record.priority as TaskPriority) &&
    (typeof record.priorityAt === 'number' || record.priorityAt === null) &&
    typeof record.createdAt === 'number' &&
    typeof record.updatedAt === 'number'
  )
}
