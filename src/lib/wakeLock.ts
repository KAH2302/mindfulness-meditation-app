let wakeLock: WakeLockSentinel | null = null

export async function requestWakeLock(): Promise<void> {
  try {
    if (!('wakeLock' in navigator)) return
    wakeLock = await navigator.wakeLock.request('screen')
    wakeLock.addEventListener('release', () => {
      wakeLock = null
    })
  } catch {
    // Ignore — unsupported or denied
  }
}

export async function releaseWakeLock(): Promise<void> {
  try {
    await wakeLock?.release()
  } catch {
    // ignore
  } finally {
    wakeLock = null
  }
}

export function setupWakeLockVisibility(): () => void {
  const onVisible = () => {
    if (document.visibilityState === 'visible' && wakeLock === null) {
      void requestWakeLock()
    }
  }
  document.addEventListener('visibilitychange', onVisible)
  return () => document.removeEventListener('visibilitychange', onVisible)
}
