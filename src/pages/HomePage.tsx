import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { NatureBackground } from '../components/NatureBackground'
import { getThemeById, meditationThemes } from '../data/meditations'
import { formatClock, getTimeOfDay } from '../data/timeOfDay'

export function HomePage() {
  const [now, setNow] = useState(() => new Date())
  const timeOfDay = getTimeOfDay(now)
  const recommendation = getThemeById(timeOfDay.recommendedType)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const startPath = `/meditation?type=${timeOfDay.recommendedType}&duration=${timeOfDay.recommendedDuration}`

  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <NatureBackground image={timeOfDay.image} video={timeOfDay.video} />

      <div className="relative z-10 flex flex-1 flex-col px-5 pb-10 pt-6 sm:px-8">
        <header className="animate-fade-up flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--color-ivory-muted)]">
              마음 챙김
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--color-ivory)] sm:text-3xl">
              오늘의 명상
            </h1>
          </div>
          <time className="pt-1 text-sm font-bold tracking-widest text-[var(--color-ivory)]">
            {formatClock(now)}
          </time>
        </header>

        <div className="mt-8 space-y-3">
          <p className="animate-soft-pulse text-xs font-bold tracking-[0.28em] text-[var(--color-ivory-muted)]">
            {timeOfDay.label}
          </p>
          <h2 className="animate-fade-up text-3xl font-extrabold leading-tight text-[var(--color-ivory)] sm:text-4xl">
            {timeOfDay.greeting}
          </h2>
          <p className="animate-fade-up-delay max-w-md text-sm font-light leading-relaxed text-[var(--color-ivory-muted)] sm:text-base">
            {timeOfDay.subtitle}
          </p>
        </div>

        <div className="animate-fade-up-delay mt-8 rounded-2xl border border-white/25 bg-black/45 p-4 shadow-lg backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[var(--color-ivory-muted)]">추천</p>
              <p className="mt-1 text-sm font-bold text-[var(--color-ivory)]">
                {recommendation.title} · {timeOfDay.recommendedDuration}분
              </p>
            </div>
            <Link
              to={startPath}
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/20 px-5 py-2.5 text-sm font-bold tracking-wide text-[var(--color-ivory)] backdrop-blur-sm transition hover:bg-white/30 active:scale-[0.98]"
            >
              {timeOfDay.recommendedDuration}분 시작하기
            </Link>
          </div>
        </div>

        <div className="animate-fade-up-delay-2 mt-8 rounded-3xl border border-white/20 bg-black/55 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-[var(--color-ivory)]">
                테마 선택
              </h3>
              <p className="mt-1 text-xs font-light text-[var(--color-ivory-muted)]">
                원하는 명상 테마를 골라 바로 시작해 보세요
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-[var(--color-ivory)]">
              {meditationThemes.length}개
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {meditationThemes.map((theme) => (
              <Link
                key={theme.id}
                to={`/meditation?type=${theme.id}&duration=${theme.duration}&music=${theme.defaultMusicId}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/25 bg-[#162018]/92 p-4 shadow-md transition hover:-translate-y-0.5 hover:border-white/45 hover:bg-[#1c2920] active:scale-[0.99]"
                style={{
                  boxShadow: `inset 5px 0 0 ${theme.accent}, 0 8px 24px rgba(0,0,0,0.35)`,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}55 0%, transparent 55%)`,
                  }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      />
                      <p className="truncate text-base font-extrabold tracking-tight text-[var(--color-ivory)]">
                        {theme.title}
                      </p>
                    </div>
                    <p className="mt-2 text-sm font-light leading-snug text-[#ebe6da]">
                      {theme.description}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold text-[#101812]"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {theme.duration}분
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
