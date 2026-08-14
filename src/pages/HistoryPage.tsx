import { useEffect, useState } from 'react'
import { NatureBackground } from '../components/NatureBackground'
import { getTimeOfDay } from '../data/timeOfDay'
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

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

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

export function HistoryPage() {
  const timeOfDay = getTimeOfDay()
  const today = new Date()
  const todayKey = getTodayKey(today)
  const [cursor, setCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }))
  const [sessions, setSessions] = useState<MeditationSession[]>([])

  useEffect(() => {
    setSessions(loadSessions())
  }, [])

  const monthSessions = sessionsInMonth(sessions, cursor.year, cursor.month)
  const monthCount = sessionCount(monthSessions)
  const monthMinutes = totalMinutes(monthSessions)
  const allMinutes = totalMinutes(sessions)
  const streak = calculateStreak(sessions)
  const challenge = calculateChallenge(sessions)
  const cells = buildCalendarDays(cursor.year, cursor.month)
  const todayMinutes = minutesOnDate(sessions, todayKey)

  function shiftMonth(delta: number) {
    setCursor((prev) => {
      const date = new Date(prev.year, prev.month + delta, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <NatureBackground image={timeOfDay.image} />
      <div className="relative z-10 mx-auto max-w-lg px-6 pb-10 pt-6">
        <h2 className="animate-fade-up text-3xl font-extrabold">나의 명상 기록</h2>
        <p className="animate-fade-up mt-2 text-sm text-[var(--color-ivory-muted)]">
          오늘 · {formatKoreanDate(today)}
        </p>
        <p className="mt-1 text-xs text-[var(--color-ivory-muted)]/80">
          {todayMinutes > 0
            ? `오늘 ${todayMinutes}분 명상했어요`
            : '오늘은 아직 명상 기록이 없어요'}
        </p>

        <div className="animate-fade-up-delay mt-8 rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="px-2 py-1 text-[var(--color-ivory-muted)] hover:text-[var(--color-ivory)]"
              aria-label="이전 달"
            >
              ‹
            </button>
            <p className="text-xl font-bold">
              {cursor.year}년 {cursor.month + 1}월
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="px-2 py-1 text-[var(--color-ivory-muted)] hover:text-[var(--color-ivory)]"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-[var(--color-ivory-muted)]">
            {WEEKDAYS.map((d) => (
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
              return (
                <span
                  key={cell.key}
                  className={[
                    'relative rounded-lg py-2',
                    isToday
                      ? 'bg-white/20 font-bold text-[var(--color-ivory)] ring-1 ring-[var(--color-ivory)]/70'
                      : hasSession
                        ? 'text-[var(--color-ivory)]'
                        : 'text-[var(--color-ivory-muted)]/60',
                  ].join(' ')}
                  title={isToday ? '오늘' : undefined}
                >
                  {cell.day}
                  {hasSession && (
                    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--color-ivory)]" />
                  )}
                </span>
              )
            })}
          </div>
          <p className="mt-3 text-center text-[11px] text-[var(--color-ivory-muted)]">
            오늘 날짜는 밝은 테두리로 표시됩니다
          </p>
        </div>

        <div className="animate-fade-up-delay-2 mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat label="이번 달 명상" value={`${monthCount}회`} />
          <Stat label="이번 달 시간" value={`${monthMinutes}분`} />
          <Stat label="총 명상 시간" value={`${allMinutes}분`} />
        </div>

        <p className="mt-6 text-center text-sm text-[var(--color-ivory-muted)]">
          현재 연속 기록{' '}
          <span className="text-[var(--color-ivory)]">{streak}일</span>
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
          <h3 className="text-xl font-extrabold">7일 명상 찰린지</h3>
          <p className="mt-1 text-sm text-[var(--color-ivory-muted)]">
            매일 5분 이상 명상해보세요.
          </p>
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
                {done ? '●' : '○'}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--color-ivory-muted)]">
            {challenge.isComplete
              ? '7일 명상 찰린지 완료!'
              : `${challenge.completedCount} / 7일`}
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
