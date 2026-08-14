import type { MeditationTheme, MeditationType } from '../types'

export const meditationThemes: MeditationTheme[] = [
  {
    id: 'breath',
    title: '호흡',
    description: '들숨과 날숨에 집중하며 마음을 가라앉혀 보세요.',
    duration: 10,
    accent: '#5fd4b3',
    accentSoft: 'rgba(95, 212, 179, 0.35)',
    defaultMusicId: 'meditation-music',
  },
  {
    id: 'stress',
    title: '스트레스 완화',
    description: '쌓인 긴장을 천천히 내려놓는 시간입니다.',
    duration: 10,
    accent: '#f0b47a',
    accentSoft: 'rgba(240, 180, 122, 0.35)',
    defaultMusicId: 'rain',
  },
  {
    id: 'break',
    title: '짧은 휴식',
    description: '바쁜 하루 사이, 5분만 쉬어가세요.',
    duration: 5,
    accent: '#b7e07a',
    accentSoft: 'rgba(183, 224, 122, 0.35)',
    defaultMusicId: 'forest',
  },
  {
    id: 'mindfulness',
    title: '마음챙김',
    description: '지금 이 순간에 부드럽게 머물러 보세요.',
    duration: 10,
    accent: '#f5f0e4',
    accentSoft: 'rgba(245, 240, 228, 0.28)',
    defaultMusicId: 'meditation-music',
  },
  {
    id: 'nature',
    title: '자연과 함께',
    description: '숲과 바람 소리 속에서 쉬어가세요.',
    duration: 10,
    accent: '#7ed49a',
    accentSoft: 'rgba(126, 212, 154, 0.35)',
    defaultMusicId: 'waves',
  },
  {
    id: 'sleep',
    title: '숙면',
    description: '잠들기 전 몸과 마음을 편안하게 해보세요.',
    duration: 15,
    accent: '#9db7ef',
    accentSoft: 'rgba(157, 183, 239, 0.35)',
    defaultMusicId: 'sleep',
  },
]

const TYPE_LABELS: Record<MeditationType, string> = {
  breath: '호흡',
  stress: '스트레스 완화',
  break: '짧은 휴식',
  mindfulness: '마음챙김',
  sleep: '숙면',
  nature: '자연과 함께',
  relaxation: '이완',
}

export function getThemeById(id: MeditationType): MeditationTheme {
  return meditationThemes.find((t) => t.id === id) ?? meditationThemes[0]
}

export function getMeditationLabel(type: MeditationType): string {
  return TYPE_LABELS[type]
}

/** @deprecated use getThemeById */
export function getMeditationByType(type: MeditationType): MeditationTheme {
  return getThemeById(type)
}
