import type { MusicTrack } from '../types'

/** Distinct YouTube embeds — do not rehost. */
export const musicTracks: MusicTrack[] = [
  {
    id: 'none',
    title: '음악 없음',
    description: '소리 없이 조용히 명상합니다.',
    category: 'none',
  },
  {
    id: 'meditation-music',
    title: '명상 음악',
    description: '잔잔한 명상 음악으로 마음을 가라앉혀 보세요.',
    category: 'meditation',
    youtubeId: 'ridhBE2tuXM',
  },
  {
    id: 'rain',
    title: '빗소리',
    description: '빗소리와 함께 긴장을 풀어보세요.',
    category: 'rain',
    youtubeId: 'mPZkdNFkN9I',
  },
  {
    id: 'waves',
    title: '파도소리',
    description: '바다의 파도 소리로 마음을 쉬게 하세요.',
    category: 'waves',
    youtubeId: 'V1bFr2SWP1I',
  },
  {
    id: 'forest',
    title: '숲의 소리',
    description: '숲과 바람 소리 속에서 쉬어보세요.',
    category: 'forest',
    youtubeId: 'xNN7iTA57jM',
  },
  {
    id: 'sleep',
    title: '수면 음악',
    description: '잠들기 전 몸과 마음을 편안하게 해보세요.',
    category: 'sleep',
    youtubeId: 'pfvY5VRkfxI',
  },
]
