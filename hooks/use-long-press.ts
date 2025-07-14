"use client"

import { useCallback, useRef } from "react"

interface UseLongPressOptions {
  onLongPress: () => void
  onPress?: () => void
  delay?: number
}

export function useLongPress({ onLongPress, onPress, delay = 300 }: UseLongPressOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isLongPress = useRef(false)

  const start = useCallback(() => {
    isLongPress.current = false
    timeoutRef.current = setTimeout(() => {
      isLongPress.current = true
      onLongPress()
    }, delay)
  }, [onLongPress, delay])

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const end = useCallback(() => {
    clear()
    if (!isLongPress.current && onPress) {
      onPress()
    }
  }, [clear, onPress])

  return {
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: end,
    onTouchCancel: clear,
  }
}
