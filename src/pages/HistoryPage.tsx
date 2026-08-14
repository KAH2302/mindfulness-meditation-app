import { useEffect, useMemo, useState } from 'react'
import { NatureBackground } from '../components/NatureBackground'
import { getMeditationLabel } from '../data/meditations'
import { getTimeOfDay } from '../data/timeOfDay'
import { ko } from '../i18n/ko'
import {
  ensureNotifyPermission,
  isNotifyEnabled,
  setNotifyEnabled,
} from '../lib/notifications'
import {
  calculateChallenge,
  calculateStreak,
  getTodayKey,
  loadSessions,
  minutesOnDate,
  sessionCount,
  sessionsInMonth,
  totalMinutes,
} from '../lib/storage'
import type { MeditationSession } from '../types'

function buildCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1)
  const startWeekday = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<{ day: number | null; key: string }> = []

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ day: null, key: `pad-${i}` })
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, key })
  }
  return cells
}

function formatKoreanDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

function formatDateKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  return formatKoreanDate(new Date(y, m - 1, d))
}

export function HistoryPage() {
  const timeOfDay = getTimeOfDay()
  const today = new Date()
  const todayKey = getTodayKey(today)
  const [cursor, setCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }))
  const [sessions, setSessions] = useState<MeditationSession[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(todayKey)
  const [notifyOn, setNotifyOn] = useState(false)

  useEffect(() => {
    setSessions(loadSessions())
    setNotifyOn(isNotifyEnabled())
  }, [])

  const monthSessions = sessionsInMonth(sessions, cursor.year, cursor.month)
  const monthCount = sessionCount(monthSessions)
  const monthMinutes = totalMinutes(monthSessions)
  const allMinutes = totalMinutes(sessions)
  const streak = calculateStreak(sessions)
  const challenge = calculateChallenge(sessions)
  const cells = buildCalendarDays(cursor.year, cursor.month)
  const todayMinutes = minutesOnDate(sessions, todayKey)

  const daySessions = useMemo(() => {
    if (!selectedDay) return []
    return sessions
      .filter((s) => s.date === selectedDay)
      .sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1))
  }, [sessions, selectedDay])

  function shiftMonth(delta: number) {
    setCursor((prev) => {
      const date = new Date(prev.year, prev.month + delta, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }

  async function toggleNotify() {
    if (!notifyOn) {
      const perm = await ensureNotifyPermission()
      if (perm !== 'granted') return
      setNotifyEnabled(true)
      setNotifyOn(true)
      return
    }
    setNotifyEnabled(false)
    setNotifyOn(false)
  }

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <NatureBackground image={timeOfDay.image} video={timeOfDay.video} />
      <div className="relative z-10 mx-auto max-w-lg px-6 pb-10 pt-6">
        <h2 className="animate-fade-up text-3xl font-extrabold">{ko.myHistory}</h2>
        <p className="animate-fade-up mt-2 text-sm text-[var(--color-ivory-muted)]">
          {ko.todayDot}: {formatKoreanDate(today)}
        </p>
        <p className="mt-1 text-xs text-[var(--color-ivory-muted)]/80">
          {todayMinutes > 0
            ? ko.meditatedMinutesToday(todayMinutes)
            : ko.noMeditationToday}
        </p>

        <button
          type="button"
          onClick={() => void toggleNotify()}
          className="mt-4 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-bold text-[var(--color-ivory)] backdrop-blur-sm"
        >
          {notifyOn ? ko.notifyOn : ko.notifyOff}
        </button>

        <div className="animate-fade-up-delay mt-8 rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="px-2 py-1 text-[var(--color-ivory-muted)] hover:text-[var(--color-ivory)]"
              aria-label={ko.prevMonth}
            >
              {ko.prev}
            </button>
            <p className="text-xl font-bold">
              {ko.yearMonth(cursor.year, cursor.month + 1)}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="px-2 py-1 text-[var(--color-ivory-muted)] hover:text-[var(--color-ivory)]"
              aria-label={ko.nextMonth}
            >
              {ko.next}
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-[var(--color-ivory-muted)]">
            {ko.weekdays.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {cells.map((cell) => {
              if (cell.day === null) {
                return <span key={cell.key} className="py-2" />
              }
              const hasSession = minutesOnDate(sessions, cell.key) > 0
              const isToday = cell.key === todayKey
              const isSelected = cell.key === selectedDay
              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => setSelectedDay(cell.key)}
                  className={[
                    'relative rounded-lg py-2 transition',
                    isSelected
                      ? 'bg-white/25 font-bold text-[var(--color-ivory)] ring-1 ring-[var(--color-ivory)]'
                      : isToday
                        ? 'bg-white/10 font-bold text-[var(--color-ivory)]'
                        : hasSession
                          ? 'text-[var(--color-ivory)] hover:bg-white/10'
                          : 'text-[var(--color-ivory-muted)]/60 hover:bg-white/5',
                  ].join(' ')}
                >
                  {cell.day}
                  {hasSession && (
                    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--color-ivory)]" />
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-center text-[11px] text-[var(--color-ivory-muted)]">
            {ko.calendarHint}
          </p>
        </div>

        {selectedDay && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
            <h3 className="text-base font-extrabold">{formatDateKey(selectedDay)}</h3>
            {daySessions.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--color-ivory-muted)]">
                {ko.noSessionsThatDay}
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {daySessions.map((s) => (
                  <li
                    key={`${s.completedAt}-${s.duration}-${s.type}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm"
                  >
                    <span>{getMeditationLabel(s.type)}</span>
                    <span className="text-[var(--color-ivory-muted)]">
                      {ko.minutes(s.duration)} {ko.dot}{' '}
                      {new Date(s.completedAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="animate-fade-up-delay-2 mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat label={ko.monthSessions} value={ko.times(monthCount)} />
          <Stat label={ko.monthTime} value={ko.minutes(monthMinutes)} />
          <Stat label={ko.totalTime} value={ko.minutes(allMinutes)} />
        </div>

        <p className="mt-6 text-center text-sm text-[var(--color-ivory-muted)]">
          {ko.currentStreak}{' '}
          <span className="text-[var(--color-ivory)]">{ko.days(streak)}</span>
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
          <h3 className="text-xl font-extrabold">{ko.challengeTitle}</h3>
          <p className="mt-1 text-sm text-[var(--color-ivory-muted)]">{ko.challengeHint}</p>
          <div className="mt-5 flex justify-between px-1">
            {challenge.days.map((done, i) => (
              <span
                key={i}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs',
                  done
                    ? 'bg-[var(--color-ivory)] text-[var(--color-moss-deep)]'
                    : 'border border-white/20 text-[var(--color-ivory-muted)]',
                ].join(' ')}
              >
                {done ? ko.filled : ko.empty}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--color-ivory-muted)]">
            {challenge.isComplete
              ? ko.challengeDone
              : ko.challengeProgress(challenge.completedCount)}
          </p>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-4 backdrop-blur-sm">
      <p className="text-[10px] tracking-wide text-[var(--color-ivory-muted)] sm:text-xs">
        {label}
      </p>
      <p className="mt-2 text-xl font-extrabold sm:text-2xl">{value}</p>
    </div>
  )
}
