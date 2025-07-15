"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { themeTokens } from "@/lib/theme-system"

export function NebulaBackground() {
  const { effectiveTheme } = useTheme()
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([])

  const currentTheme = themeTokens[effectiveTheme]

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: effectiveTheme === "dark" ? 50 : 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        size: effectiveTheme === "dark" ? 0.5 + Math.random() * 1.5 : 0.3 + Math.random() * 1,
      }))
      setStars(newStars)
    }

    generateStars()
  }, [effectiveTheme])

  return (
    <div className="absolute inset-0 overflow-hidden transition-all duration-1000">
      {/* 主背景渐变 */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: currentTheme.background.primary,
        }}
      />

      {/* 星云纹理层 */}
      <div className="absolute inset-0" style={{ opacity: effectiveTheme === "dark" ? 0.15 : 0.25 }}>
        <div
          className="w-full h-full animate-pulse transition-all duration-1000"
          style={{
            background:
              effectiveTheme === "dark"
                ? `
                radial-gradient(ellipse at 20% 30%, rgba(26, 11, 46, 0.8) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(22, 33, 62, 0.6) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(15, 11, 31, 0.9) 0%, transparent 70%)
              `
                : `
                radial-gradient(ellipse at 20% 30%, rgba(248, 250, 252, 0.8) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(226, 232, 240, 0.6) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(203, 213, 225, 0.9) 0%, transparent 70%)
              `,
            animationDuration: "4s",
          }}
        />
      </div>

      {/* 散落星光 */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-pulse transition-all duration-500"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: currentTheme.nebula.particles,
            animationDelay: `${star.delay}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            boxShadow: `0 0 ${star.size * 2}px ${currentTheme.nebula.glow}`,
          }}
        />
      ))}

      {/* 流动光效 */}
      <div className="absolute inset-0">
        <div
          className="absolute w-full h-1 animate-pulse transition-all duration-1000"
          style={{
            top: "30%",
            opacity: effectiveTheme === "dark" ? 0.3 : 0.4,
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${currentTheme.text.accent}60 50%, 
              transparent 100%)`,
            animationDuration: "3s",
            transform: "rotate(-15deg)",
          }}
        />
        <div
          className="absolute w-full h-1 animate-pulse transition-all duration-1000"
          style={{
            top: "70%",
            opacity: effectiveTheme === "dark" ? 0.2 : 0.3,
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${currentTheme.nebula.particles} 50%, 
              transparent 100%)`,
            animationDuration: "4s",
            animationDelay: "1s",
            transform: "rotate(15deg)",
          }}
        />
      </div>

      {/* 主题切换时的过渡效果 */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background:
            effectiveTheme === "dark"
              ? "radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, transparent 70%)"
              : "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
          opacity: 0.5,
        }}
      />
    </div>
  )
}
