import type { TimeOfDayConfig, TimeOfDayId } from '../types'

export const TIME_OF_DAY: Record<TimeOfDayId, TimeOfDayConfig> = {
  dawn: {
    id: 'dawn',
    label: '새벽',
    greeting: '좋은 새벽입니다.',
    subtitle: '고요한 시작을 함께해요.',
    image: '/images/dawn.jpg',
    recommendedType: 'breath',
    recommendedDuration: 10,
  },
  morning: {
    id: 'morning',
    label: '아침',
    greeting: '좋은 아침입니다.',
    subtitle: '하루를 차분히 열어보세요.',
    image: '/images/morning.jpg',
    recommendedType: 'breath',
    recommendedDuration: 10,
  },
  day: {
    id: 'day',
    label: '낮',
    greeting: '좋은 오후입니다.',
    subtitle: '잠시 쉬어가는 시간을 가져보세요.',
    image: '/images/day.jpg',
    recommendedType: 'break',
    recommendedDuration: 5,
  },
  evening: {
    id: 'evening',
    label: '저녁',
    greeting: '좋은 저녁입니다.',
    subtitle: '하루의 긴장을 내려놓아 보세요.',
    image: '/images/evening.jpg',
    recommendedType: 'stress',
    recommendedDuration: 10,
  },
  night: {
    id: 'night',
    label: '밤',
    greeting: '좋은 밤이에요.',
    subtitle: '오늘 하루도 수고했어요.',
    image: '/images/night.jpg',
    recommendedType: 'sleep',
    recommendedDuration: 10,
  },
  deepNight: {
    id: 'deepNight',
    label: '깊은 밤',
    greeting: '고요한 밤입니다.',
    subtitle: '몸과 마음을 편안하게 해주세요.',
    image: '/images/night.jpg',
    recommendedType: 'sleep',
    recommendedDuration: 15,
  },
}

/** Resolve current local hour to a time-of-day band. */
export function getTimeOfDay(date: Date = new Date()): TimeOfDayConfig {
  const hour = date.getHours()

  if (hour >= 5 && hour < 9) {
    // 05–08: use dawn for earliest hours, morning for later
    return hour < 7 ? TIME_OF_DAY.dawn : TIME_OF_DAY.morning
  }
  if (hour >= 9 && hour < 17) return TIME_OF_DAY.day
  if (hour >= 17 && hour < 20) return TIME_OF_DAY.evening
  if (hour >= 20 && hour < 24) return TIME_OF_DAY.night
  return TIME_OF_DAY.deepNight
}

export function formatClock(date: Date = new Date()): string {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
