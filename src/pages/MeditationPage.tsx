import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { NatureBackground } from '../components/NatureBackground'
import { getThemeById } from '../data/meditations'
import { musicTracks } from '../data/music'
import { getTimeOfDay } from '../data/timeOfDay'
import { getTodayKey, saveSession } from '../lib/storage'
import type { MeditationType } from '../types'

type Phase = 'select' | 'running' | 'paused' | 'done'

const DURATIONS = [5, 10, 15] as const
const VALID_TYPES: MeditationType[] = [
  'breath',
  'stress',
  'break',
  'mindfulness',
  'sleep',
  'nature',
  'relaxation',
]

function parseDuration(raw: string | null, fallback: 5 | 10 | 15): 5 | 10 | 15 {
  const n = Number(raw)
  if (n === 5 || n === 10 || n === 15) return n
  return fallback
}

function parseType(raw: string | null): MeditationType {
  if (raw && VALID_TYPES.includes(raw as MeditationType)) {
    return raw as MeditationType
  }
  return 'breath'
}

function formatRemaining(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function MeditationPage() {
  const [params, setParams] = useSearchParams()
  const timeOfDay = getTimeOfDay()

  const sessionType = parseType(params.get('type'))
  const theme = getThemeById(sessionType)
  const initialDuration = parseDuration(params.get('duration'), theme.duration)
  const initialMusic =
    musicTracks.find((t) => t.id === params.get('music'))?.id ??
    theme.defaultMusicId

  const [duration, setDuration] = useState<5 | 10 | 15>(initialDuration)
  const [musicId, setMusicId] = useState(initialMusic)
  const [phase, setPhase] = useState<Phase>(
    params.get('run') === '1' ? 'running' : 'select',
  )
  const [remaining, setRemaining] = useState(initialDuration * 60)
  const [completedMinutes, setCompletedMinutes] = useState<number>(initialDuration)

  const selectedMusic = useMemo(
    () => musicTracks.find((t) => t.id === musicId) ?? musicTracks[0],
    [musicId],
  )

  const remainingRef = useRef(remaining)
  remainingRef.current = remaining

  useEffect(() => {
    if (phase !== 'running') return

    const id = window.setInterval(() => {
      const next = remainingRef.current - 1
      if (next <= 0) {
        window.clearInterval(id)
        setRemaining(0)
        setCompletedMinutes(duration)
        saveSession({
          date: getTodayKey(),
          duration,
          type: sessionType,
        })
        setPhase('done')
        setParams(
          (prev) => {
            const nextParams = new URLSearchParams(prev)
            nextParams.delete('run')
            return nextParams
          },
          { replace: true },
        )
        return
      }
      setRemaining(next)
    }, 1000)

    return () => window.clearInterval(id)
  }, [phase, duration, sessionType, setParams])

  function startSession() {
    setRemaining(duration * 60)
    setPhase('running')
    setParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev)
        nextParams.set('run', '1')
        nextParams.set('duration', String(duration))
        nextParams.set('type', sessionType)
        nextParams.set('music', musicId)
        return nextParams
      },
      { replace: true },
    )
  }

  function handlePause() {
    setPhase((p) => (p === 'running' ? 'paused' : 'running'))
  }

  function handleEnd() {
    const elapsed = duration * 60 - remainingRef.current
    const mins = Math.max(1, Math.round(elapsed / 60))
    setParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev)
        nextParams.delete('run')
        return nextParams
      },
      { replace: true },
    )
    if (elapsed >= 30) {
      setCompletedMinutes(mins)
      saveSession({
        date: getTodayKey(),
        duration: mins,
        type: sessionType,
      })
      setPhase('done')
      return
    }
    setPhase('select')
  }

  if (phase === 'done') {
    return (
      <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
        <NatureBackground image={timeOfDay.image} />
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
          <p className="animate-fade-up text-xs tracking-[0.3em] text-[var(--color-ivory-muted)]">
            완료
          </p>
          <h2 className="animate-fade-up-delay mt-4 text-4xl font-extrabold sm:text-5xl">
            명상이 완료되었습니다.
          </h2>
          <p className="animate-fade-up-delay-2 mt-4 text-[var(--color-ivory-muted)]">
            {theme.title} · 오늘도 좋은 시간을 보냈어요.
          </p>
          <p className="mt-8 text-lg tracking-wide text-[var(--color-ivory)]">
            {completedMinutes}분 명상 완료
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/history"
              className="rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-6 py-3 text-sm backdrop-blur-sm transition hover:bg-white/20"
            >
              기록 보기
            </Link>
            <Link
              to="/"
              className="rounded-full border border-transparent px-6 py-3 text-sm text-[var(--color-ivory-muted)] transition hover:text-[var(--color-ivory)]"
            >
              홈으로
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (phase === 'select') {
    return (
      <section className="relative min-h-[100dvh] overflow-hidden">
        <NatureBackground image={timeOfDay.image} />
        <div className="relative z-10 mx-auto flex max-w-lg flex-col px-5 pb-10 pt-6">
          <p className="text-xs tracking-[0.28em] text-[var(--color-ivory-muted)]">
            명상 준비
          </p>
          <h2 className="mt-2 text-3xl font-extrabold">{theme.title}</h2>
          <p className="mt-2 text-sm text-[var(--color-ivory-muted)]">{theme.description}</p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
            <h3 className="text-sm font-bold tracking-wide text-[var(--color-ivory)]">
              시간 선택
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {DURATIONS.map((mins) => {
                const selected = duration === mins
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={[
                      'rounded-xl border px-3 py-3 text-sm font-bold transition',
                      selected
                        ? 'border-[var(--color-glass-border)] bg-white/20 text-[var(--color-ivory)]'
                        : 'border-white/10 bg-black/20 text-[var(--color-ivory-muted)] hover:bg-white/10',
                    ].join(' ')}
                  >
                    {mins}분
                  </button>
                )
              })}
            </div>

            <h3 className="mt-8 text-sm font-bold tracking-wide text-[var(--color-ivory)]">
              음악 선택
            </h3>
            <ul className="mt-4 space-y-2">
              {musicTracks.map((track) => {
                const selected = track.id === musicId
                return (
                  <li key={track.id}>
                    <button
                      type="button"
                      onClick={() => setMusicId(track.id)}
                      className={[
                        'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition',
                        selected
                          ? 'border-[var(--color-glass-border)] bg-white/15'
                          : 'border-white/10 bg-black/20 hover:bg-white/10',
                      ].join(' ')}
                    >
                      <span>
                        <span className="block text-sm font-bold text-[var(--color-ivory)]">
                          {track.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--color-ivory-muted)]">
                          {track.description}
                        </span>
                      </span>
                      <span className="ml-3 text-xs text-[var(--color-ivory-muted)]">
                        {selected ? '선택됨' : ''}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={startSession}
              className="mt-8 w-full rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass)] py-3.5 text-sm font-bold tracking-wide backdrop-blur-sm transition hover:bg-white/20"
            >
              {duration}분 · {selectedMusic.title}로 시작
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <NatureBackground image={timeOfDay.image} />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-12">
        <div className="animate-breath pointer-events-none absolute h-48 w-48 rounded-full border border-white/15 bg-white/5 sm:h-64 sm:w-64" />

        <p className="relative text-xs tracking-[0.35em] text-[var(--color-ivory-muted)]">
          {phase === 'paused' ? '일시정지' : theme.title}
        </p>
        <p className="relative mt-8 text-6xl font-extrabold tracking-wide sm:text-7xl">
          {formatRemaining(remaining)}
        </p>
        <p className="relative mt-6 text-sm font-light text-[var(--color-ivory-muted)]">
          천천히 호흉하세요.
        </p>
        <p className="relative mt-2 text-xs text-[var(--color-ivory-muted)]/80">
          {selectedMusic.title}
        </p>

        <iframe
          title={selectedMusic.title}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          src={`https://www.youtube.com/embed/${selectedMusic.youtubeId}?autoplay=1&rel=0`}
          allow="autoplay; encrypted-media"
        />

        <div className="relative mt-16 flex gap-3">
          <button
            type="button"
            onClick={handlePause}
            className="rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-7 py-3 text-sm font-bold backdrop-blur-sm transition hover:bg-white/20"
          >
            {phase === 'paused' ? '이어하기' : '일시정지'}
          </button>
          <button
            type="button"
            onClick={handleEnd}
            className="rounded-full border border-transparent px-7 py-3 text-sm text-[var(--color-ivory-muted)] transition hover:text-[var(--color-ivory)]"
          >
            종료
          </button>
        </div>
      </div>
    </section>
  )
}
