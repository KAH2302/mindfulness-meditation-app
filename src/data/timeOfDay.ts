import type { TimeOfDayConfig, TimeOfDayId } from '../types'

export const TIME_OF_DAY: Record<TimeOfDayId, TimeOfDayConfig> = {
  dawn: {
    id: 'dawn',
    label: '\uC0C8\uBCBD',
    greeting: '\uC88B\uC740 \uC0C8\uBCBD\uC785\uB2C8\uB2E4.',
    subtitle: '\uACE0\uC694\uD55C \uC2DC\uC791\uC744 \uD568\uAED8\uD574\uC694.',
    image: '/images/dawn.jpg',
    video: '/videos/dawn.mp4',
    recommendedType: 'breath',
    recommendedDuration: 10,
  },
  morning: {
    id: 'morning',
    label: '\uC544\uCE68',
    greeting: '\uC88B\uC740 \uC544\uCE68\uC785\uB2C8\uB2E4.',
    subtitle: '\uD558\uB8E8\uB97C \uCC28\uBD84\uD788 \uC5F4\uC5B4\uBCF4\uC138\uC694.',
    image: '/images/morning.jpg',
    video: '/videos/morning.mp4',
    recommendedType: 'breath',
    recommendedDuration: 10,
  },
  day: {
    id: 'day',
    label: '\uB0AE',
    greeting: '\uC88B\uC740 \uC624\uD6C4\uC785\uB2C8\uB2E4.',
    subtitle: '\uC7A0\uC2DC \uC26C\uC5B4\uAC00\uB294 \uC2DC\uAC04\uC744 \uAC00\uC838\uBCF4\uC138\uC694.',
    image: '/images/day.jpg',
    video: '/videos/day.mp4',
    recommendedType: 'break',
    recommendedDuration: 5,
  },
  evening: {
    id: 'evening',
    label: '\uC800\uB141',
    greeting: '\uC88B\uC740 \uC800\uB141\uC785\uB2C8\uB2E4.',
    subtitle: '\uD558\uB8E8\uC758 \uAE34\uC7A5\uC744 \uB0B4\uB824\uB193\uC544 \uBCF4\uC138\uC694.',
    image: '/images/evening.jpg',
    video: '/videos/evening.mp4',
    recommendedType: 'stress',
    recommendedDuration: 10,
  },
  night: {
    id: 'night',
    label: '\uBC24',
    greeting: '\uC88B\uC740 \uBC24\uC774\uC5D0\uC694.',
    subtitle: '\uC624\uB298 \uD558\uB8E8\uB3C4 \uC218\uACE0\uD588\uC5B4\uC694.',
    image: '/images/night.jpg',
    video: '/videos/night.mp4',
    recommendedType: 'sleep',
    recommendedDuration: 10,
  },
  deepNight: {
    id: 'deepNight',
    label: '\uAE4A\uC740 \uBC24',
    greeting: '\uACE0\uC694\uD55C \uBC24\uC785\uB2C8\uB2E4.',
    subtitle: '\uBAB8\uACFC \uB9C8\uC74C\uC744 \uD3B8\uC548\uD558\uAC8C \uD574\uC8FC\uC138\uC694.',
    image: '/images/night.jpg',
    video: '/videos/night.mp4',
    recommendedType: 'sleep',
    recommendedDuration: 15,
  }
}

export function getTimeOfDay(date: Date = new Date()): TimeOfDayConfig {
  const hour = date.getHours()
  if (hour >= 5 && hour < 9) return hour < 7 ? TIME_OF_DAY.dawn : TIME_OF_DAY.morning
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
