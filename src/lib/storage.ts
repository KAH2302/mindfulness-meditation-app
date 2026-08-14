import type { MeditationSession } from '../types'

const STORAGE_KEY = 'meditation-sessions-v1'

function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function loadSessions(): MeditationSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as MeditationSession[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveSession(session: Omit<MeditationSession, 'completedAt'>): MeditationSession[] {
  const sessions = loadSessions()
  const next: MeditationSession = {
    ...session,
    completedAt: new Date().toISOString(),
  }
  sessions.push(next)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  return sessions
}

/** Minutes meditated on a given date key (YYYY-MM-DD). */
export function minutesOnDate(sessions: MeditationSession[], dateKey: string): number {
  return sessions
    .filter((s) => s.date === dateKey)
    .reduce((sum, s) => sum + s.duration, 0)
}

export function sessionsInMonth(
  sessions: MeditationSession[],
  year: number,
  month: number,
): MeditationSession[] {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
  return sessions.filter((s) => s.date.startsWith(prefix))
}

export function totalMinutes(sessions: MeditationSession[]): number {
  return sessions.reduce((sum, s) => sum + s.duration, 0)
}

export function sessionCount(sessions: MeditationSession[]): number {
  return sessions.length
}

/** Unique dates with any meditation, descending. */
export function uniqueMeditationDates(sessions: MeditationSession[]): string[] {
  return [...new Set(sessions.map((s) => s.date))].sort((a, b) => (a < b ? 1 : -1))
}

/**
 * Consecutive days ending today (or yesterday if today has no session yet).
 * A day counts if any session exists that day.
 */
export function calculateStreak(sessions: MeditationSession[], now: Date = new Date()): number {
  const dates = new Set(sessions.map((s) => s.date))
  if (dates.size === 0) return 0

  let cursor = todayKey(now)
  if (!dates.has(cursor)) {
    cursor = todayKey(addDays(now, -1))
    if (!dates.has(cursor)) return 0
  }

  let streak = 0
  while (dates.has(cursor)) {
    streak += 1
    cursor = todayKey(addDays(parseDateKey(cursor), -1))
  }
  return streak
}

/**
 * 7-day challenge: rolling window of last 7 calendar days,
 * a day counts when minutes >= 5.
 */
export function calculateChallenge(
  sessions: MeditationSession[],
  now: Date = new Date(),
): { days: boolean[]; completedCount: number; isComplete: boolean } {
  const days: boolean[] = []
  for (let i = 6; i >= 0; i -= 1) {
    const key = todayKey(addDays(now, -i))
    days.push(minutesOnDate(sessions, key) >= 5)
  }
  const completedCount = days.filter(Boolean).length
  return {
    days,
    completedCount,
    isComplete: completedCount >= 7,
  }
}

export function getTodayKey(now: Date = new Date()): string {
  return todayKey(now)
}

export { todayKey }
