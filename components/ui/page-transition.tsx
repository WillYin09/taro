"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { designTokens } from "@/lib/design-tokens"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 减少延迟，提升响应速度
    const timer = setTimeout(() => setIsVisible(true), 30)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-500 ease-out relative overflow-hidden", // 减少动画时长
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2", // 减少位移距离
        className,
      )}
      style={{
        background: designTokens.colors.gradient.primary,
      }}
    >
      {/* 减少粒子数量，提升性能 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map(
          (
            _,
            i, // 从30减少到20
          ) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gold-400/30 rounded-full animate-pulse" // 降低透明度
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ),
        )}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
