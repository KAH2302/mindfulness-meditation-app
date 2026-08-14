import { useState } from 'react'
import { NatureBackground } from '../components/NatureBackground'
import { musicTracks } from '../data/music'
import { getTimeOfDay } from '../data/timeOfDay'
import type { MusicTrack } from '../types'

export function MusicPage() {
  const timeOfDay = getTimeOfDay()
  const [active, setActive] = useState<MusicTrack>(musicTracks[0])

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <NatureBackground image={timeOfDay.image} />
      <div className="relative z-10 mx-auto max-w-lg px-6 pb-10 pt-6">
        <h2 className="animate-fade-up text-3xl font-extrabold">오늘의 음악</h2>
        <p className="animate-fade-up-delay mt-2 text-sm text-[var(--color-ivory-muted)]">
          자연과 명상의 소리를 들어보세요.
        </p>

        <div className="animate-fade-up-delay mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-lg">
          <div className="aspect-video w-full">
            <iframe
              key={active.youtubeId}
              title={active.title}
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${active.youtubeId}?rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="px-4 py-3">
            <p className="text-sm font-bold text-[var(--color-ivory)]">{active.title}</p>
            <p className="mt-1 text-xs text-[var(--color-ivory-muted)]">{active.description}</p>
          </div>
        </div>

        <ul className="animate-fade-up-delay-2 mt-6 space-y-2">
          {musicTracks.map((track) => {
            const selected = track.id === active.id
            return (
              <li key={track.id}>
                <button
                  type="button"
                  onClick={() => setActive(track)}
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
                    {selected ? '재생 중' : '선택'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
