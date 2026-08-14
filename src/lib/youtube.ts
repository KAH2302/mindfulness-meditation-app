export function ytCommand(
  iframe: HTMLIFrameElement | null,
  func: 'playVideo' | 'pauseVideo' | 'stopVideo',
): void {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args: [] }),
    '*',
  )
}

export function ytEmbedSrc(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&playsinline=1&autoplay=1`
}
