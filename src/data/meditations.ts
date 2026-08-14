import type { MeditationTheme, MeditationType } from '../types'

export const meditationThemes: MeditationTheme[] = [
  {
    id: 'breath',
    title: '\uD638\uD761',
    description: '\uB4E4\uC228\uACFC \uB0A0\uC228\uC5D0 \uC9D1\uC911\uD558\uBA70 \uB9C8\uC74C\uC744 \uAC00\uB77C\uC549\uD600 \uBCF4\uC138\uC694.',
    duration: 10,
    accent: '#5fd4b3',
    accentSoft: 'rgba(95, 212, 179, 0.35)',
    defaultMusicId: 'meditation-music',
    cues: ['\uCC9C\uCC9C\uD788 \uB4E4\uC774\uC26C\uC138\uC694', '\uCC9C\uCC9C\uD788 \uB0B4\uC26C\uC138\uC694', '\uD638\uD761\uC5D0 \uBA38\uBB3C\uB7EC \uBCF4\uC138\uC694'],
  },
  {
    id: 'stress',
    title: '\uC2A4\uD2B8\uB808\uC2A4 \uC644\uD654',
    description: '\uC313\uC778 \uAE34\uC7A5\uC744 \uCC9C\uCC9C\uD788 \uB0B4\uB824\uB193\uB294 \uC2DC\uAC04\uC785\uB2C8\uB2E4.',
    duration: 10,
    accent: '#f0b47a',
    accentSoft: 'rgba(240, 180, 122, 0.35)',
    defaultMusicId: 'rain',
    cues: ['\uC5B4\uAE68\uC758 \uD798\uC744 \uBE7C \uBCF4\uC138\uC694', '\uAE34\uC7A5\uC744 \uB0B4\uB824\uB193\uC73C\uC138\uC694', '\uC9C0\uAE08 \uC774 \uC21C\uAC04\uC5D0 \uC26C\uC5B4\uAC00\uC138\uC694'],
  },
  {
    id: 'break',
    title: '\uC9E7\uC740 \uD734\uC2DD',
    description: '\uBC14\uC05C \uD558\uB8E8 \uC0AC\uC774, 5\uBD84\uB9CC \uC26C\uC5B4\uAC00\uC138\uC694.',
    duration: 5,
    accent: '#b7e07a',
    accentSoft: 'rgba(183, 224, 122, 0.35)',
    defaultMusicId: 'forest',
    cues: ['\uC7A0\uC2DC \uBA48\uCD94\uC5B4 \uBCF4\uC138\uC694', '\uAE4A\uAC8C \uC228\uC744 \uC26C\uC5B4\uBCF4\uC138\uC694', '\uC9E7\uAC8C \uC26C\uC5B4\uAC00\uB3C4 \uCDA9\uBD84\uD569\uB2C8\uB2E4'],
  },
  {
    id: 'mindfulness',
    title: '\uB9C8\uC74C\uCC59\uAE40',
    description: '\uC9C0\uAE08 \uC774 \uC21C\uAC04\uC5D0 \uBD80\uB4DC\uB7FD\uAC8C \uBA38\uBB3C\uB7EC \uBCF4\uC138\uC694.',
    duration: 10,
    accent: '#f5f0e4',
    accentSoft: 'rgba(245, 240, 228, 0.28)',
    defaultMusicId: 'meditation-music',
    cues: ['\uC0DD\uAC01\uC744 \uC54C\uC544\uCC28\uB9AC\uACE0 \uB193\uC544\uC8FC\uC138\uC694', '\uAC10\uAC01\uC5D0 \uBD80\uB4DC\uB7FD\uAC8C \uBA38\uBB34\uB974\uC138\uC694', '\uC788\uB294 \uADF8\uB300\uB85C \uB450\uC5B4 \uBCF4\uC138\uC694'],
  },
  {
    id: 'nature',
    title: '\uC790\uC5F0\uACFC \uD568\uAED8',
    description: '\uC232\uACFC \uBC14\uB78C \uC18C\uB9AC \uC18D\uC5D0\uC11C \uC26C\uC5B4\uAC00\uC138\uC694.',
    duration: 10,
    accent: '#7ed49a',
    accentSoft: 'rgba(126, 212, 154, 0.35)',
    defaultMusicId: 'waves',
    cues: ['\uC790\uC5F0\uC758 \uB9AC\uB4EC\uC744 \uB290\uAEF4\uBCF4\uC138\uC694', '\uBC14\uB78C\uCC98\uB7FC \uBD80\uB4DC\uB7FD\uAC8C \uD638\uD761\uD558\uC138\uC694', '\uBAB8\uC774 \uC774\uC644\uB418\uB3C4\uB85D \uB450\uC138\uC694'],
  },
  {
    id: 'sleep',
    title: '\uC219\uBA74',
    description: '\uC7A0\uB4E4\uAE30 \uC804 \uBAB8\uACFC \uB9C8\uC74C\uC744 \uD3B8\uC548\uD558\uAC8C \uD574\uBCF4\uC138\uC694.',
    duration: 15,
    accent: '#9db7ef',
    accentSoft: 'rgba(157, 183, 239, 0.35)',
    defaultMusicId: 'sleep',
    cues: ['\uBAB8\uC774 \uBB34\uAC70\uC6CC\uC9C0\uB3C4\uB85D \uB450\uC138\uC694', '\uD638\uD761\uC774 \uB290\uB824\uC9C0\uAC8C \uD558\uC138\uC694', '\uD3B8\uC548\uD558\uAC8C \uB193\uC544\uC8FC\uC138\uC694'],
  }
]

const TYPE_LABELS: Record<MeditationType, string> = {
  breath: '\uD638\uD761',
  stress: '\uC2A4\uD2B8\uB808\uC2A4 \uC644\uD654',
  break: '\uC9E7\uC740 \uD734\uC2DD',
  mindfulness: '\uB9C8\uC74C\uCC59\uAE40',
  sleep: '\uC219\uBA74',
  nature: '\uC790\uC5F0\uACFC \uD568\uAED8',
  relaxation: '\uC774\uC644',
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
