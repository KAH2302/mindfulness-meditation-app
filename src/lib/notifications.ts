const PREF_KEY = 'meditation-notify-pref-v1'

export function isNotifyEnabled(): boolean {
  try {
    return localStorage.getItem(PREF_KEY) === '1'
  } catch {
    return false
  }
}

export function setNotifyEnabled(on: boolean): void {
  localStorage.setItem(PREF_KEY, on ? '1' : '0')
}

export async function ensureNotifyPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}

export async function notify(title: string, body: string): Promise<void> {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    const reg = await navigator.serviceWorker?.getRegistration()
    if (reg?.showNotification) {
      await reg.showNotification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
      })
      return
    }
    new Notification(title, { body, icon: '/favicon.svg' })
  } catch {
    // ignore
  }
}
