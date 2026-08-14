import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { NatureBackground } from '../components/NatureBackground'
import { getThemeById } from '../data/meditations'
import { musicTracks } from '../data/music'
import { getTimeOfDay } from '../data/timeOfDay'
import { ko } from '../i18n/ko'
import { isNotifyEnabled, notify } from '../lib/notifications'
import {
  clearActiveSession,
  loadActiveSession,
  remainingFromEndsAt,
  saveActiveSession,
} from '../lib/sessionPersist'
import {
  calculateChallenge,
  calculateStreak,
  getTodayKey,
  saveSession,
} from '../lib/storage'
import {
  releaseWakeLock,
  requestWakeLock,
  setupWakeLockVisibility,
} from '../lib/wakeLock'
import { ytCommand, ytEmbedSrc } from '../lib/youtube'
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
  if (raw && VALID_TYPES.includes(raw as MeditationType)) return raw as MeditationType
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
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const sessionType = parseType(params.get('type'))
  const theme = getThemeById(sessionType)
  const initialDuration = parseDuration(params.get('duration'), theme.duration)
  const initialMusic =
    musicTracks.find((t) => t.id === params.get('music'))?.id ?? theme.defaultMusicId

  const restored = useMemo(() => {
    if (params.get('run') !== '1') return null
    const saved = loadActiveSession()
    if (!saved || saved.type !== sessionType) return null
    return saved
  }, [params, sessionType])

  const [duration, setDuration] = useState<5 | 10 | 15>(
    restored?.durationMin ?? initialDuration,
  )
  const [musicId, setMusicId] = useState(restored?.musicId ?? initialMusic)
  const [phase, setPhase] = useState<Phase>(() => {
    if (restored?.phase === 'paused') return 'paused'
    if (restored || params.get('run') === '1') return 'running'
    return 'select'
  })
  const [endsAt, setEndsAt] = useState<number | null>(() => {
    if (restored?.phase === 'running' && restored.endsAt) return restored.endsAt
    if (restored?.phase === 'running') return Date.now() + restored.remainingSec * 1000
    return null
  })
  const [remaining, setRemaining] = useState(() => {
    if (!restored) return initialDuration * 60
    if (restored.phase === 'running' && restored.endsAt) {
      return remainingFromEndsAt(restored.endsAt)
    }
    return restored.remainingSec
  })
  const [completedMinutes, setCompletedMinutes] = useState<number>(initialDuration)
  const [streak, setStreak] = useState(0)
  const [challengeCount, setChallengeCount] = useState(0)
  const [cueIndex, setCueIndex] = useState(0)

  const selectedMusic = useMemo(
    () => musicTracks.find((t) => t.id === musicId) ?? musicTracks[0],
    [musicId],
  )
  const cue = theme.cues[cueIndex % theme.cues.length]

  const durationRef = useRef(duration)
  const musicIdRef = useRef(musicId)
  const sessionTypeRef = useRef(sessionType)
  durationRef.current = duration
  musicIdRef.current = musicId
  sessionTypeRef.current = sessionType
  const finishedRef = useRef(false)

  function persist(next: {
    phase: 'running' | 'paused'
    remainingSec: number
    endsAt: number | null
  }) {
    saveActiveSession({
      type: sessionTypeRef.current,
      musicId: musicIdRef.current,
      durationMin: durationRef.current,
      remainingSec: next.remainingSec,
      endsAt: next.endsAt,
      phase: next.phase,
      savedAt: Date.now(),
    })
  }

  function finish(mins: number) {
    if (finishedRef.current) return
    finishedRef.current = true
    clearActiveSession()
    void releaseWakeLock()
    ytCommand(iframeRef.current, 'pauseVideo')
    const sessions = saveSession({
      date: getTodayKey(),
      duration: mins,
      type: sessionTypeRef.current,
    })
    const nextStreak = calculateStreak(sessions)
    const nextChallenge = calculateChallenge(sessions).completedCount
    setCompletedMinutes(mins)
    setStreak(nextStreak)
    setChallengeCount(nextChallenge)
    setPhase('done')
    setEndsAt(null)
    setParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev)
        nextParams.delete('run')
        return nextParams
      },
      { replace: true },
    )
    if (isNotifyEnabled()) {
      void notify(ko.notifyTitle, ko.notifyBody(mins, nextStreak, nextChallenge))
    }
  }

  useEffect(() => {
    if (phase !== 'running' || endsAt == null) return

    const tick = () => {
      const left = remainingFromEndsAt(endsAt)
      setRemaining(left)
      persist({ phase: 'running', remainingSec: left, endsAt })
      if (left <= 0) finish(durationRef.current)
    }

    tick()
    const id = window.setInterval(tick, 250)
    const onVis = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [phase, endsAt, setParams])

  useEffect(() => {
    if (phase !== 'running') {
      void releaseWakeLock()
      return
    }
    void requestWakeLock()
    const stop = setupWakeLockVisibility()
    return () => {
      stop()
      void releaseWakeLock()
    }
  }, [phase])

  useEffect(() => {
    if (!selectedMusic.youtubeId) return
    if (phase === 'running') ytCommand(iframeRef.current, 'playVideo')
    if (phase === 'paused' || phase === 'done' || phase === 'select') {
      ytCommand(iframeRef.current, 'pauseVideo')
    }
  }, [phase, selectedMusic.youtubeId])

  useEffect(() => {
    if (phase !== 'running') return
    const id = window.setInterval(() => setCueIndex((i) => i + 1), 20_000)
    return () => window.clearInterval(id)
  }, [phase])

  function startSession() {
    finishedRef.current = false
    const total = duration * 60
    const nextEnds = Date.now() + total * 1000
    setRemaining(total)
    setEndsAt(nextEnds)
    setPhase('running')
    setCueIndex(0)
    persist({ phase: 'running', remainingSec: total, endsAt: nextEnds })
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
    if (phase === 'running') {
      const left = endsAt ? remainingFromEndsAt(endsAt) : remaining
      setRemaining(left)
      setEndsAt(null)
      setPhase('paused')
      ytCommand(iframeRef.current, 'pauseVideo')
      persist({ phase: 'paused', remainingSec: left, endsAt: null })
      return
    }
    if (phase === 'paused') {
      const nextEnds = Date.now() + remaining * 1000
      setEndsAt(nextEnds)
      setPhase('running')
      ytCommand(iframeRef.current, 'playVideo')
      persist({ phase: 'running', remainingSec: remaining, endsAt: nextEnds })
    }
  }

  function handleEnd() {
    const left = endsAt ? remainingFromEndsAt(endsAt) : remaining
    const elapsed = duration * 60 - left
    const mins = Math.max(1, Math.round(elapsed / 60))
    if (elapsed >= 30) {
      finish(mins)
      return
    }
    clearActiveSession()
    ytCommand(iframeRef.current, 'pauseVideo')
    setPhase('select')
    setEndsAt(null)
    setParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev)
        nextParams.delete('run')
        return nextParams
      },
      { replace: true },
    )
  }

  if (phase === 'done') {
    return (
      <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
        <NatureBackground image={timeOfDay.image} video={timeOfDay.video} />
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
          <p className="animate-fade-up text-xs tracking-[0.3em] text-[var(--color-ivory-muted)]">
            {ko.done}
          </p>
          <h2 className="animate-fade-up-delay mt-4 text-4xl font-extrabold sm:text-5xl">
            {ko.meditationComplete}
          </h2>
          <p className="animate-fade-up-delay-2 mt-4 text-[var(--color-ivory-muted)]">
            {theme.title} ? {ko.goodTimeToday}
          </p>
          <p className="mt-8 text-lg tracking-wide text-[var(--color-ivory)]">
            {ko.minutesComplete(completedMinutes)}
          </p>
          <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/15 bg-black/30 px-3 py-3">
              <p className="text-xs text-[var(--color-ivory-muted)]">{ko.streakLabel}</p>
              <p className="mt-1 text-xl font-extrabold">{ko.days(streak)}</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-black/30 px-3 py-3">
              <p className="text-xs text-[var(--color-ivory-muted)]">{ko.challenge7}</p>
              <p className="mt-1 text-xl font-extrabold">{challengeCount} / 7</p>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/history"
              className="rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-6 py-3 text-sm backdrop-blur-sm transition hover:bg-white/20"
            >
              {ko.viewHistory}
            </Link>
            <Link
              to="/"
              className="rounded-full border border-transparent px-6 py-3 text-sm text-[var(--color-ivory-muted)] transition hover:text-[var(--color-ivory)]"
            >
              {ko.toHome}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (phase === 'select') {
    return (
      <section className="relative min-h-[100dvh] overflow-hidden">
        <NatureBackground image={timeOfDay.image} video={timeOfDay.video} />
        <div className="relative z-10 mx-auto flex max-w-lg flex-col px-5 pb-10 pt-6">
          <p className="text-xs tracking-[0.28em] text-[var(--color-ivory-muted)]">
            {ko.prepare}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold">{theme.title}</h2>
          <p className="mt-2 text-sm text-[var(--color-ivory-muted)]">{theme.description}</p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
            <h3 className="text-sm font-bold tracking-wide text-[var(--color-ivory)]">
              {ko.pickDuration}
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
                    {ko.minutes(mins)}
                  </button>
                )
              })}
            </div>

            <h3 className="mt-8 text-sm font-bold tracking-wide text-[var(--color-ivory)]">
              {ko.pickMusic}
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
                        {selected ? ko.selected : ''}
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
              {ko.startWith(duration, selectedMusic.title)}
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <NatureBackground image={timeOfDay.image} video={timeOfDay.video} />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-12">
        <div className="animate-breath pointer-events-none absolute h-48 w-48 rounded-full border border-white/15 bg-white/5 sm:h-64 sm:w-64" />

        <p className="relative text-xs tracking-[0.35em] text-[var(--color-ivory-muted)]">
          {phase === 'paused' ? ko.paused : theme.title}
        </p>
        <p className="relative mt-8 text-6xl font-extrabold tracking-wide sm:text-7xl">
          {formatRemaining(remaining)}
        </p>
        <p className="relative mt-6 text-sm font-light text-[var(--color-ivory-muted)]">{cue}</p>
        <p className="relative mt-2 text-xs text-[var(--color-ivory-muted)]/80">
          {selectedMusic.title}
        </p>

        {selectedMusic.youtubeId ? (
          <iframe
            ref={iframeRef}
            title={selectedMusic.title}
            className="pointer-events-none absolute h-0 w-0 opacity-0"
            src={ytEmbedSrc(selectedMusic.youtubeId)}
            allow="autoplay; encrypted-media"
          />
        ) : null}

        <div className="relative mt-16 flex gap-3">
          <button
            type="button"
            onClick={handlePause}
            className="rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-7 py-3 text-sm font-bold backdrop-blur-sm transition hover:bg-white/20"
          >
            {phase === 'paused' ? ko.resume : ko.paused}
          </button>
          <button
            type="button"
            onClick={handleEnd}
            className="rounded-full border border-transparent px-7 py-3 text-sm text-[var(--color-ivory-muted)] transition hover:text-[var(--color-ivory)]"
          >
            {ko.end}
          </button>
        </div>
      </div>
    </section>
  )
}
