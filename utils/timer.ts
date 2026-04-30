import { priorityOrder, type TaskPriority, type TimerConfig } from './task'

export const timerStorageKey = 'timers'

export function getDefaultTimers(): TimerConfig {
  return {
    low: { time: 30, unit: 'minutes' },
    normal: { time: 20, unit: 'minutes' },
    high: { time: 10, unit: 'minutes' },
    urgent: { time: 5, unit: 'minutes' },
  }
}

export function loadTimersFromStorage() {
  if (typeof window === 'undefined') {
    return getDefaultTimers()
  }

  try {
    const raw = window.localStorage.getItem(timerStorageKey)

    if (!raw) {
      return getDefaultTimers()
    }

    const parsed = JSON.parse(raw) as unknown

    if (!isTimerConfig(parsed)) {
      return getDefaultTimers()
    }

    return parsed
  } catch {
    return getDefaultTimers()
  }
}

export function saveTimersToStorage(timers: TimerConfig) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(timerStorageKey, JSON.stringify(timers))
}

function isTimerConfig(value: unknown): value is TimerConfig {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const config = value as Partial<
    Record<TaskPriority, { time: unknown; unit: unknown }>
  >

  return priorityOrder.every((priority) => {
    const entry = config[priority]

    return (
      !!entry &&
      typeof entry.time === 'number' &&
      Number.isInteger(entry.time) &&
      entry.time > 0 &&
      (entry.unit === 'seconds' ||
        entry.unit === 'minutes' ||
        entry.unit === 'hours' ||
        entry.unit === 'days')
    )
  })
}
