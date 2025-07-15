"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { themeTokens } from "@/lib/theme-system"

export function ParallaxBackground() {
  const { effectiveTheme } = useTheme()
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([])

  const currentTheme = themeTokens[effectiveTheme]

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: effectiveTheme === "dark" ? 25 : 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        size: effectiveTheme === "dark" ? 2 + Math.random() * 2 : 2 + Math.random() * 1.5,
      }))
      setStars(newStars)
    }

    generateStars()
  }, [effectiveTheme])

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {/* Layer 1: 背景星云 - 最慢 */}
        <div
          className="absolute inset-0 transition-all duration-1000 parallax-layer-1"
          style={{
            background: currentTheme.background.primary,
          }}
        />

        {/* Layer 2: 星轨中景 - 中速旋转 */}
        <div className="absolute inset-0 flex items-center justify-center parallax-layer-2">
          <div className="relative star-trail-container">
            {/* 同心圆星轨 */}
            {[0.3, 0.5, 0.7, 0.9].map((radius, index) => (
              <div
                key={index}
                className={`absolute border rounded-full transition-all duration-1000 star-trail-ring star-trail-ring-${index}`}
                style={{
                  width: `${radius * 100}%`,
                  height: `${radius * 100}%`,
                  top: `${(1 - radius) * 50}%`,
                  left: `${(1 - radius) * 50}%`,
                  borderColor: `${currentTheme.text.accent}${Math.floor((0.3 - index * 0.05) * 255)
                    .toString(16)
                    .padStart(2, "0")}`,
                  borderWidth: "1px",
                  borderStyle: "dashed",
                }}
              >
                {/* 星轨上的光点 */}
                {Array.from({ length: 6 + index * 3 }).map((_, starIndex) => {
                  const angle = (starIndex * 360) / (6 + index * 3)
                  return (
                    <div
                      key={starIndex}
                      className={`absolute w-1 h-1 rounded-full transition-all duration-1000 star-trail-dot star-trail-dot-${starIndex}`}
                      style={{
                        backgroundColor: currentTheme.text.accent,
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${angle}deg) translateX(${radius * 50}vmax) translateX(-50%) translateY(-50%)`,
                        opacity: 0.6,
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Layer 3: 前景微粒 - 最快 */}
        <div className="absolute inset-0 pointer-events-none parallax-layer-3">
          {stars.map((star, index) => (
            <div
              key={star.id}
              className={`absolute rounded-full transition-all duration-500 floating-particle floating-particle-${index}`}
              style={
                {
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: currentTheme.nebula.particles,
                  filter: "blur(1px)",
                  boxShadow: `0 0 ${star.size * 2}px ${currentTheme.nebula.glow}`,
                  "--delay": `${star.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      {/* CSS动画定义 */}
      <style jsx>{`
        .parallax-layer-1 {
          transform: scale(1.15);
          animation: slowDrift 60s ease-in-out infinite;
        }

        .parallax-layer-2 {
          opacity: 0.2;
        }

        .star-trail-container {
          width: 80vmax;
          height: 80vmax;
          animation: starTrailRotation 120s linear infinite;
        }

        .star-trail-ring-0 {
          animation: starTrailRotation 80s linear infinite;
        }

        .star-trail-ring-1 {
          animation: starTrailRotation 100s linear infinite reverse;
        }

        .star-trail-ring-2 {
          animation: starTrailRotation 120s linear infinite;
        }

        .star-trail-ring-3 {
          animation: starTrailRotation 140s linear infinite reverse;
        }

        .star-trail-dot {
          animation: twinkle 2s ease-in-out infinite;
        }

        .star-trail-dot-0 { animation-delay: 0s; }
        .star-trail-dot-1 { animation-delay: 0.2s; }
        .star-trail-dot-2 { animation-delay: 0.4s; }
        .star-trail-dot-3 { animation-delay: 0.6s; }
        .star-trail-dot-4 { animation-delay: 0.8s; }
        .star-trail-dot-5 { animation-delay: 1s; }
        .star-trail-dot-6 { animation-delay: 1.2s; }
        .star-trail-dot-7 { animation-delay: 1.4s; }
        .star-trail-dot-8 { animation-delay: 1.6s; }

        .floating-particle {
          animation: floatParticle 3s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        @keyframes slowDrift {
          0%, 100% {
            transform: scale(1.15) translateX(0) translateY(0);
          }
          25% {
            transform: scale(1.15) translateX(-10px) translateY(-5px);
          }
          50% {
            transform: scale(1.15) translateX(5px) translateY(-10px);
          }
          75% {
            transform: scale(1.15) translateX(-5px) translateY(5px);
          }
        }

        @keyframes starTrailRotation {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-10px) translateX(5px);
          }
          66% {
            transform: translateY(5px) translateX(-5px);
          }
        }
      `}</style>
    </>
  )
}
