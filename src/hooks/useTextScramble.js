import { useState, useEffect } from 'react'

const CHARS = '!@#$%^&*():;<%?/[]{}-=_+'

export function useTextScramble(finalText, { delay = 0, duration = 1200 } = {}) {
  const [text, setText] = useState(finalText)

  useEffect(() => {
    if (!finalText) return
    const timeout = setTimeout(() => {
      const chars = finalText.split('')
      const step = 40
      const totalFrames = Math.floor(duration / step)
      let frame = 0

      const interval = setInterval(() => {
        frame++
        const progress = frame / totalFrames
        const revealCount = Math.floor(chars.length * Math.min(progress, 1))

        setText(
          chars
            .map((c, i) => (i < revealCount ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
            .join('')
        )

        if (frame >= totalFrames) {
          clearInterval(interval)
          setText(finalText)
        }
      }, step)
    }, delay)

    return () => clearTimeout(timeout)
  }, [finalText, delay, duration])

  return text
}
