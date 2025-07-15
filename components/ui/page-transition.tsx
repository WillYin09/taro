"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { themeTokens } from "@/lib/theme-system"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const { effectiveTheme } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  const currentTheme = themeTokens[effectiveTheme]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 30)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-500 ease-out relative overflow-hidden",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className,
      )}
      style={{
        background: currentTheme.background.primary,
      }}
    >
      {/* 主题化粒子背景 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(effectiveTheme === "dark" ? 20 : 15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse transition-all duration-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: `${currentTheme.nebula.particles}${effectiveTheme === "dark" ? "30" : "40"}`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
