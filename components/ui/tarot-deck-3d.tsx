"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { useAudio } from "@/hooks/use-audio"
import { themeTokens } from "@/lib/theme-system"

interface TarotDeck3DProps {
  isShuffling: boolean
  onShuffleComplete?: () => void
  cardCount?: number
  className?: string
  isRevealing?: boolean
}

export function TarotDeck3D({
  isShuffling,
  onShuffleComplete,
  cardCount = 5,
  className,
  isRevealing = false,
}: TarotDeck3DProps) {
  const { effectiveTheme } = useTheme()
  const { playSound } = useAudio()
  const [shuffleRotation, setShuffleRotation] = useState(0)
  const [isGlowing, setIsGlowing] = useState(false)
  const [deckOffset, setDeckOffset] = useState(0)

  const currentTheme = themeTokens[effectiveTheme]

  useEffect(() => {
    if (isShuffling) {
      setIsGlowing(true)
      playSound("shuffle", 0.5)

      const interval = setInterval(() => {
        setShuffleRotation((prev) => prev + 15)
      }, 50)

      const timeout = setTimeout(() => {
        clearInterval(interval)
        setIsGlowing(false)
        onShuffleComplete?.()
      }, 1000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [isShuffling, onShuffleComplete, playSound])

  useEffect(() => {
    if (isRevealing) {
      // 卡牌跃起动画
      setDeckOffset(-20)
      playSound("cardFlip", 0.7)

      setTimeout(() => {
        setDeckOffset(0)
        playSound("complete", 0.6)
      }, 800)
    }
  }, [isRevealing, playSound])

  return (
    <>
      <div
        className={cn("relative flex items-center justify-center deck-container", className)}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          transform: `translateY(${deckOffset}px)`,
          transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* 牌堆 */}
        <div
          className={`relative transition-all duration-300 deck-stack ${isShuffling ? "shuffling" : ""}`}
          style={{
            transform: `rotateY(${shuffleRotation}deg) rotateX(15deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {[...Array(cardCount)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "absolute w-24 h-40 rounded-lg border transition-all duration-500 tarot-card",
                isGlowing && "shadow-2xl",
                isRevealing && index === cardCount - 1 && "animate-pulse",
              )}
              style={{
                background:
                  effectiveTheme === "dark"
                    ? `linear-gradient(135deg, 
                      rgba(26, 11, 46, 0.95) 0%, 
                      rgba(22, 33, 62, 0.9) 50%, 
                      rgba(15, 11, 31, 0.95) 100%)`
                    : `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.98) 0%, 
                      rgba(248, 250, 252, 0.95) 50%, 
                      rgba(241, 245, 249, 0.98) 100%)`,
                border: `1px solid ${currentTheme.border.accent}`,
                transform: `translateZ(${(index * 4) / cardCount}px) translateY(${index * -1}px)`,
                boxShadow: isGlowing
                  ? `0 0 30px ${currentTheme.nebula.glow}, 0 8px 32px rgba(0, 0, 0, 0.3)`
                  : effectiveTheme === "dark"
                    ? `0 8px 32px rgba(0, 0, 0, 0.4)`
                    : `0 8px 32px rgba(0, 0, 0, 0.15)`,
                zIndex: cardCount - index,
              }}
            >
              {/* 卡牌背面设计 */}
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                {/* 中心神秘符号 */}
                <div
                  className="absolute inset-3 rounded border transition-all duration-500"
                  style={{
                    border: `1px solid ${currentTheme.border.accent}`,
                    background: `radial-gradient(circle at center, 
                      ${currentTheme.text.accent}${effectiveTheme === "dark" ? "25" : "35"} 0%, 
                      transparent 70%)`,
                    opacity: effectiveTheme === "dark" ? 0.7 : 0.9,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative mystical-symbol"
                      style={{ borderColor: currentTheme.text.accent }}
                    >
                      {/* 内部旋转符号 */}
                      <div
                        className="absolute inset-1 border border-dashed rounded-full transition-all duration-500 symbol-inner"
                        style={{
                          borderColor: currentTheme.text.accent,
                        }}
                      />
                      <div
                        className="w-4 h-4 rounded-full animate-pulse transition-all duration-500"
                        style={{ backgroundColor: currentTheme.text.accent }}
                      />
                    </div>
                  </div>
                </div>

                {/* 四角装饰 */}
                {[
                  { top: "8px", left: "8px" },
                  { top: "8px", right: "8px" },
                  { bottom: "8px", left: "8px" },
                  { bottom: "8px", right: "8px" },
                ].map((position, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 border transition-all duration-500"
                    style={{
                      ...position,
                      borderColor: currentTheme.text.accent,
                      opacity: 0.6,
                      transform: `rotate(${i * 45}deg)`,
                    }}
                  />
                ))}

                {/* 金箔描边效果 */}
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none transition-all duration-500"
                  style={{
                    background: `linear-gradient(45deg, 
                      transparent 30%, 
                      ${currentTheme.text.accent}${effectiveTheme === "dark" ? "40" : "50"} 50%, 
                      transparent 70%)`,
                    opacity: isShuffling ? 0.9 : effectiveTheme === "dark" ? 0.4 : 0.5,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 洗牌粒子效果 */}
        {isShuffling && (
          <div className="absolute inset-0 pointer-events-none shuffle-particles">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full animate-ping transition-all duration-500 particle-${i}`}
                style={{
                  backgroundColor: currentTheme.nebula.particles,
                  left: `${50 + Math.cos((i * 22.5 * Math.PI) / 180) * 50}%`,
                  top: `${50 + Math.sin((i * 22.5 * Math.PI) / 180) * 50}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* 体积光效果 */}
        {(isGlowing || isRevealing) && (
          <div
            className="absolute inset-0 rounded-full animate-pulse pointer-events-none transition-all duration-500 deck-glow"
            style={{
              background: `radial-gradient(circle, 
                ${currentTheme.nebula.glow} 0%, 
                transparent 70%)`,
              filter: "blur(25px)",
              transform: "scale(1.5)",
            }}
          />
        )}
      </div>

      {/* CSS动画定义 */}
      <style jsx>{`
        .deck-container {
          transform: translateY(40px); /* 偏下40px */
        }

        .deck-stack {
          animation: deckIdle 4s ease-in-out infinite;
        }

        .deck-stack.shuffling {
          animation: none;
        }

        .mystical-symbol .symbol-inner {
          animation: symbolRotate 8s linear infinite;
        }

        .shuffle-particles .particle-0 { animation-delay: 0s; }
        .shuffle-particles .particle-1 { animation-delay: 0.05s; }
        .shuffle-particles .particle-2 { animation-delay: 0.1s; }
        .shuffle-particles .particle-3 { animation-delay: 0.15s; }
        .shuffle-particles .particle-4 { animation-delay: 0.2s; }
        .shuffle-particles .particle-5 { animation-delay: 0.25s; }
        .shuffle-particles .particle-6 { animation-delay: 0.3s; }
        .shuffle-particles .particle-7 { animation-delay: 0.35s; }
        .shuffle-particles .particle-8 { animation-delay: 0.4s; }
        .shuffle-particles .particle-9 { animation-delay: 0.45s; }
        .shuffle-particles .particle-10 { animation-delay: 0.5s; }
        .shuffle-particles .particle-11 { animation-delay: 0.55s; }
        .shuffle-particles .particle-12 { animation-delay: 0.6s; }
        .shuffle-particles .particle-13 { animation-delay: 0.65s; }
        .shuffle-particles .particle-14 { animation-delay: 0.7s; }
        .shuffle-particles .particle-15 { animation-delay: 0.75s; }

        @keyframes deckIdle {
          0%, 100% {
            transform: rotateY(0deg) rotateX(15deg) rotateZ(-2deg);
          }
          50% {
            transform: rotateY(0deg) rotateX(15deg) rotateZ(2deg);
          }
        }

        @keyframes symbolRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}
