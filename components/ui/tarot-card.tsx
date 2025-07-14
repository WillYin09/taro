"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { designTokens } from "@/lib/design-tokens"

interface TarotCardProps {
  name?: string
  image?: string
  isReversed?: boolean
  isFlipped?: boolean
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
}

export function TarotCard({
  name,
  image,
  isReversed = false,
  isFlipped = false,
  onClick,
  className,
  size = "md",
}: TarotCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizes = {
    sm: "w-16 h-28",
    md: "w-24 h-40",
    lg: "w-32 h-52",
  }

  return (
    <div
      className={cn(
        "relative cursor-pointer transition-all duration-500 transform-gpu",
        sizes[size],
        isHovered && "scale-105",
        className,
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-preserve-3d",
          isFlipped && "rotate-y-180",
        )}
      >
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden">
          <div
            className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 border border-gold-400/30"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
              `,
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-gold-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gold-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-lg overflow-hidden",
            isReversed && "rotate-180",
          )}
        >
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 border border-gold-400/50">
            {image ? (
              <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-2">
                <div className="w-full h-3/4 bg-gradient-to-br from-purple-200 to-indigo-200 rounded mb-2" />
                {name && (
                  <p
                    className="text-xs text-center font-medium text-gray-800"
                    style={{ fontFamily: designTokens.fonts.serif }}
                  >
                    {name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      {isHovered && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gold-400/20 to-purple-400/20 blur-sm -z-10" />
      )}
    </div>
  )
}
