export type TimeOfDayId =
  | 'dawn'
  | 'morning'
  | 'day'
  | 'evening'
  | 'night'
  | 'deepNight'

export type MeditationType =
  | 'breath'
  | 'stress'
  | 'break'
  | 'mindfulness'
  | 'sleep'
  | 'nature'
  | 'relaxation'

export interface TimeOfDayConfig {
  id: TimeOfDayId
  label: string
  greeting: string
  subtitle: string
  image: string
  video?: string
  recommendedType: MeditationType
  recommendedDuration: 5 | 10 | 15
}

export interface MeditationSession {
  date: string
  duration: number
  type: MeditationType
  completedAt: string
}

export interface MeditationTheme {
  id: MeditationType
  title: string
  description: string
  duration: 5 | 10 | 15
  accent: string
  accentSoft: string
  defaultMusicId: string
}

export interface MeditationContent {
  id: string
  title: string
  description: string
  category: MeditationType
  duration: number
  youtubeId: string
}

export interface MusicTrack {
  id: string
  title: string
  description: string
  category: 'meditation' | 'rain' | 'waves' | 'forest' | 'sleep'
  youtubeId: string
}
