"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { useAudio } from "@/hooks/use-audio"
import { themeTokens } from "@/lib/theme-system"

interface HoldAndDrawProps {
  onHoldStart?: () => void
  onHoldComplete?: () => void
  onProgress?: (progress: number) => void
  disabled?: boolean
  className?: string
  deckWidth?: number
}

const HOLD_DURATION = 1000 // 1000ms
const DECK_HOVER = 20 // 20px
const TRAIL_COLOR = "rgba(255,223,134,0.35)"
const PROGRESS_COLOR = "#E9C46A"

export function HoldAndDraw({
  onHoldStart,
  onHoldComplete,
  onProgress,
  disabled = false,
  className,
  deckWidth = 96, // 24 * 4 (w-24)
}: HoldAndDrawProps) {
  const { effectiveTheme } = useTheme()
  const { playSound } = useAudio()
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const vibrateRef = useRef<NodeJS.Timeout | null>(null)

  const currentTheme = themeTokens[effectiveTheme]
  const ringRadius = (deckWidth + 48) / 2 // deckWidth + 24px * 2
  const circumference = 2 * Math.PI * ringRadius

  useEffect(() => {
    onProgress?.(progress)
  }, [progress, onProgress])

  const startHold = () => {
    if (disabled || isCompleted) return

    setIsHolding(true)
    setProgress(0)
    onHoldStart?.()

    playSound("hover", 0.3)

    // 持续震动反馈 - 轻脉冲200ms
    if (navigator.vibrate) {
      const vibratePattern = () => {
        navigator.vibrate(50)
        vibrateRef.current = setTimeout(vibratePattern, 200)
      }
      vibratePattern()
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (HOLD_DURATION / 50)
        if (newProgress >= 100) {
          clearInterval(intervalRef.current!)
          if (vibrateRef.current) {
            clearTimeout(vibrateRef.current)
          }
          setIsCompleted(true)
          onHoldComplete?.()

          // 完成震动
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100])
          }

          playSound("click", 0.5)
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
    if (vibrateRef.current) {
      clearTimeout(vibrateRef.current)
    }

    if (!isCompleted) {
      setIsHolding(false)
      setProgress(0)
    }
  }

  return (
    <>
      <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none", className)}>
        {/* 环形进度条 */}
        <svg
          className="transition-all duration-500 progress-ring"
          width={ringRadius * 2 + 20}
          height={ringRadius * 2 + 20}
          viewBox={`0 0 ${ringRadius * 2 + 20} ${ringRadius * 2 + 20}`}
          style={{
            transform: "rotate(-90deg)",
            opacity: progress > 0 || isHolding ? 1 : 0.3,
          }}
        >
          {/* 背景圆环 */}
          <circle
            cx={(ringRadius * 2 + 20) / 2}
            cy={(ringRadius * 2 + 20) / 2}
            r={ringRadius}
            fill="none"
            stroke={TRAIL_COLOR}
            strokeWidth="2"
            className="transition-all duration-500"
          />

          {/* 进度圆环 */}
          <circle
            cx={(ringRadius * 2 + 20) / 2}
            cy={(ringRadius * 2 + 20) / 2}
            r={ringRadius}
            fill="none"
            stroke={PROGRESS_COLOR}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            className="transition-all duration-100 ease-out progress-circle"
            style={{
              filter: progress > 0 ? `drop-shadow(0 0 12px ${PROGRESS_COLOR})` : "none",
            }}
          />

          {/* 进度指示点 */}
          {progress > 0 && (
            <circle
              cx={(ringRadius * 2 + 20) / 2 + ringRadius * Math.cos((progress / 100) * 2 * Math.PI)}
              cy={(ringRadius * 2 + 20) / 2 + ringRadius * Math.sin((progress / 100) * 2 * Math.PI)}
              r="4"
              fill={PROGRESS_COLOR}
              className="animate-pulse progress-dot"
              style={{
                filter: `drop-shadow(0 0 8px ${PROGRESS_COLOR})`,
              }}
            />
          )}
        </svg>

        {/* 中心交互区域 */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-auto cursor-pointer select-none transition-all duration-300 hold-area",
            disabled && "cursor-not-allowed opacity-50",
            isHolding && "scale-95",
          )}
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          onTouchCancel={endHold}
        >
          {/* 提示文本 */}
          {!isCompleted && progress === 0 && (
            <div
              className="text-center transition-all duration-300 pointer-events-none"
              style={{ color: currentTheme.text.secondary }}
            >
              <div className="text-sm font-medium mb-1">长按抽牌</div>
              <div className="text-xs opacity-70">Hold to Draw</div>
            </div>
          )}

          {/* 进度文本 */}
          {isHolding && progress > 0 && progress < 100 && (
            <div
              className="text-center transition-all duration-300 pointer-events-none"
              style={{ color: PROGRESS_COLOR }}
            >
              <div className="text-lg font-bold">{Math.round(progress)}%</div>
              <div className="text-xs">正在抽取...</div>
            </div>
          )}

          {/* 完成状态 */}
          {isCompleted && (
            <div
              className="text-center transition-all duration-300 pointer-events-none animate-pulse"
              style={{ color: PROGRESS_COLOR }}
            >
              <div className="text-lg font-bold">✨</div>
              <div className="text-sm">抽取完成</div>
            </div>
          )}
        </div>

        {/* 螺旋粒子效果 - 向中心收束 */}
        {isHolding && (
          <div className="absolute inset-0 pointer-events-none spiral-particles">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 + progress * 3.6) % 360
              const distance = ringRadius * (1 - progress / 200)
              return (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full transition-all duration-100 spiral-particle spiral-particle-${i}`}
                  style={{
                    backgroundColor: currentTheme.nebula.particles,
                    left: `calc(50% + ${distance * Math.cos((angle * Math.PI) / 180)}px)`,
                    top: `calc(50% + ${distance * Math.sin((angle * Math.PI) / 180)}px)`,
                    opacity: 1 - progress / 100,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* CSS动画定义 */}
      <style jsx>{`
        .progress-ring {
          filter: drop-shadow(0 0 10px rgba(233, 196, 106, 0.3));
        }

        .progress-circle {
          transition: stroke-dashoffset 0.1s ease-out;
        }

        .progress-dot {
          animation: progressPulse 1s ease-in-out infinite;
        }

        .spiral-particles .spiral-particle {
          animation: spiralIn 0.5s ease-out;
        }

        .spiral-particles .spiral-particle-0 { animation-delay: 0s; }
        .spiral-particles .spiral-particle-1 { animation-delay: 0.05s; }
        .spiral-particles .spiral-particle-2 { animation-delay: 0.1s; }
        .spiral-particles .spiral-particle-3 { animation-delay: 0.15s; }
        .spiral-particles .spiral-particle-4 { animation-delay: 0.2s; }
        .spiral-particles .spiral-particle-5 { animation-delay: 0.25s; }
        .spiral-particles .spiral-particle-6 { animation-delay: 0.3s; }
        .spiral-particles .spiral-particle-7 { animation-delay: 0.35s; }
        .spiral-particles .spiral-particle-8 { animation-delay: 0.4s; }
        .spiral-particles .spiral-particle-9 { animation-delay: 0.45s; }
        .spiral-particles .spiral-particle-10 { animation-delay: 0.5s; }
        .spiral-particles .spiral-particle-11 { animation-delay: 0.55s; }

        @keyframes spiralIn {
          from {
            transform: translate(-50%, -50%) scale(0) rotate(180deg);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes progressPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  )
}
