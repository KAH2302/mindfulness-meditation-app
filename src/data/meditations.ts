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
    cues: ['천천히 들이쉬세요', '천천히 내쉬세요', '호흡에 머물러 보세요'],
  },
  {
    id: 'stress',
    title: '스트레스 완화',
    description: '쌓인 긴장을 천천히 내려놓는 시간입니다.',
    duration: 10,
    accent: '#f0b47a',
    accentSoft: 'rgba(240, 180, 122, 0.35)',
    defaultMusicId: 'rain',
    cues: ['어깨의 힘을 빼 보세요', '긴장을 내려놓으세요', '지금 이 순간에 쉬어가세요'],
  },
  {
    id: 'break',
    title: '짧은 휴식',
    description: '바쁜 하루 사이, 5분만 쉬어가세요.',
    duration: 5,
    accent: '#b7e07a',
    accentSoft: 'rgba(183, 224, 122, 0.35)',
    defaultMusicId: 'forest',
    cues: ['잠시 멈추어 보세요', '깊게 숨을 쉬어보세요', '짧게 쉬어가도 충분합니다'],
  },
  {
    id: 'mindfulness',
    title: '마음챙김',
    description: '지금 이 순간에 부드럽게 머물러 보세요.',
    duration: 10,
    accent: '#f5f0e4',
    accentSoft: 'rgba(245, 240, 228, 0.28)',
    defaultMusicId: 'meditation-music',
    cues: ['생각을 알아차리고 놓아주세요', '감각에 부드럽게 머무르세요', '있는 그대로 두어 보세요'],
  },
  {
    id: 'nature',
    title: '자연과 함께',
    description: '숲과 바람 소리 속에서 쉬어가세요.',
    duration: 10,
    accent: '#7ed49a',
    accentSoft: 'rgba(126, 212, 154, 0.35)',
    defaultMusicId: 'waves',
    cues: ['자연의 리듬을 느껴보세요', '바람처럼 부드럽게 호흡하세요', '몸이 이완되도록 두세요'],
  },
  {
    id: 'sleep',
    title: '숙면',
    description: '잠들기 전 몸과 마음을 편안하게 해보세요.',
    duration: 15,
    accent: '#9db7ef',
    accentSoft: 'rgba(157, 183, 239, 0.35)',
    defaultMusicId: 'sleep',
    cues: ['몸이 무거워지도록 두세요', '호흡이 느려지게 하세요', '편안하게 놓아주세요'],
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

export function getMeditationByType(type: MeditationType): MeditationTheme {
  return getThemeById(type)
}
