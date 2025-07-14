"use client"

import { useState, useCallback } from "react"

export function useNavigation() {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const navigateWithTransition = useCallback(
    (href: string, delay = 300) => {
      if (isTransitioning) return

      setIsTransitioning(true)

      // 添加退出动画
      document.body.style.overflow = "hidden"

      setTimeout(() => {
        window.location.href = href
      }, delay)
    },
    [isTransitioning],
  )

  return {
    navigateWithTransition,
    isTransitioning,
  }
}
