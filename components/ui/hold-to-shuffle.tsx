"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { themeTokens } from "@/lib/theme-system"
import { ritualTokens } from "@/lib/ritual-tokens"

interface HoldToShuffleProps {
  onShuffleStart?: () => void
  onShuffleComplete?: () => void
  onProgress?: (progress: number) => void
  disabled?: boolean
  className?: string
}

export function HoldToShuffle({
  onShuffleStart,
  onShuffleComplete,
  onProgress,
  disabled = false,
  className,
}: HoldToShuffleProps) {
  const { effectiveTheme } = useTheme()
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentTheme = themeTokens[effectiveTheme]
  const holdDuration = 800
  const tickCount = 10

  useEffect(() => {
    onProgress?.(progress)
  }, [progress, onProgress])

  const startHold = () => {
    if (disabled || isCompleted) return

    setIsHolding(true)
    setProgress(0)
    onShuffleStart?.()

    if (navigator.vibrate) {
      navigator.vibrate(ritualTokens.vibration.tapPattern)
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (holdDuration / 50)
        if (newProgress >= 100) {
          clearInterval(intervalRef.current!)
          setIsCompleted(true)
          onShuffleComplete?.()

          if (navigator.vibrate) {
            navigator.vibrate(ritualTokens.vibration.shufflePattern)
          }

          return 100
        }
        return newProgress
      })
    }, 50)
  }

  const endHold = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (!isCompleted) {
      setIsHolding(false)
      setProgress(0)
    }
  }

  const circumference = 2 * Math.PI * 45

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* 环形进度条背景 */}
      <svg className="w-32 h-32 transform -rotate-90 transition-all duration-500" viewBox="0 0 100 100">
        {/* 背景圆环 */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={currentTheme.border.secondary}
          strokeWidth="3"
          className="transition-all duration-500"
        />

        {/* 进度圆环 */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          className="transition-all duration-100 ease-out"
          style={{
            filter: progress > 0 ? `drop-shadow(0 0 8px ${currentTheme.text.accent})` : "none",
          }}
        />

        {/* 渐变定义 */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentTheme.text.accent} />
            <stop offset="50%" stopColor={effectiveTheme === "dark" ? "#FFD700" : "#f59e0b"} />
            <stop offset="100%" stopColor={currentTheme.text.accent} />
          </linearGradient>
        </defs>

        {/* 进度刻度 */}
        {[...Array(tickCount)].map((_, i) => {
          const angle = (i * 360) / tickCount
          const isActive = progress >= (i * 100) / tickCount
          return (
            <g key={i} transform={`rotate(${angle} 50 50)`}>
              <circle
                cx="50"
                cy="5"
                r="1.5"
                fill={isActive ? currentTheme.text.accent : currentTheme.border.secondary}
                className="transition-all duration-200"
                style={{
                  filter: isActive ? `drop-shadow(0 0 4px ${currentTheme.text.accent})` : "none",
                }}
              />
            </g>
          )
        })}
      </svg>

      {/* 中心按钮 */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center cursor-pointer select-none transition-all duration-300",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onTouchCancel={endHold}
      >
        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center font-medium text-sm text-center transition-all duration-300",
            isHolding && "scale-95",
            isCompleted && "scale-110",
          )}
          style={{
            background: isCompleted
              ? `linear-gradient(45deg, ${currentTheme.text.accent} 0%, ${effectiveTheme === "dark" ? "#FFD700" : "#f59e0b"} 50%, ${currentTheme.text.accent} 100%)`
              : isHolding
                ? `${currentTheme.text.accent}30`
                : currentTheme.background.card,
            color: isCompleted ? (effectiveTheme === "dark" ? "#000" : "#fff") : currentTheme.text.primary,
            boxShadow: isHolding
              ? `0 0 20px ${currentTheme.nebula.glow}`
              : isCompleted
                ? `0 0 30px ${currentTheme.text.accent}60`
                : `0 4px 12px ${effectiveTheme === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"}`,
            border: `1px solid ${currentTheme.border.primary}`,
          }}
        >
          {isCompleted ? <div className="font-bold">完成</div> : isHolding ? <div>洗牌中...</div> : <div>长按洗牌</div>}
        </div>
      </div>
    </div>
  )
}
