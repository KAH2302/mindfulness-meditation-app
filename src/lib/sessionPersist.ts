import type { ActiveSessionState } from '../types'

const KEY = 'meditation-active-session-v1'

export function loadActiveSession(): ActiveSessionState | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as ActiveSessionState
  } catch {
    return null
  }
}

export function saveActiveSession(state: ActiveSessionState): void {
  sessionStorage.setItem(KEY, JSON.stringify({ ...state, savedAt: Date.now() }))
}

export function clearActiveSession(): void {
  sessionStorage.removeItem(KEY)
}

/** Remaining seconds from wall-clock end time (robust across tab backgrounding). */
export function remainingFromEndsAt(endsAt: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((endsAt - now) / 1000))
}
