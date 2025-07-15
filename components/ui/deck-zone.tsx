"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAudio } from "@/hooks/use-audio"

interface Card {
  id: string
  face: string
  index: number
}

interface DeckZoneProps {
  total: number
  picked: Card[]
  onPick: (index: number) => void
  className?: string
}

export function DeckZone({ total, picked, onPick, className }: DeckZoneProps) {
  const { playSound } = useAudio()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const remaining = total - picked.length

  // 扇形布局算法
  const getCardPositions = () => {
    if (remaining <= 0) return []

    const ARC = 120 // 扇形角度
    const START_OFFSET = -6 // 首尾下垂
    const vw = typeof window !== "undefined" ? window.innerWidth : 375
    const vh = typeof window !== "undefined" ? window.innerHeight : 667
    const RADIUS = Math.min(vw, vh) * 0.25

    const startAngle = -ARC / 2 + START_OFFSET
    const step = remaining > 1 ? ARC / (remaining - 1) : 0

    return Array.from({ length: remaining }, (_, i) => {
      const angle = startAngle + i * step
      const radian = (angle * Math.PI) / 180

      // 首尾下垂效果
      const normalizedPos = remaining > 1 ? (i / (remaining - 1)) * 2 - 1 : 0
      const dropOffset = Math.abs(normalizedPos) * 10

      return {
        x: Math.sin(radian) * RADIUS,
        y: -Math.cos(radian) * RADIUS + dropOffset,
        rotation: angle,
        index: i,
        zIndex: remaining - Math.abs(i - Math.floor(remaining / 2)),
      }
    })
  }

  const positions = getCardPositions()

  const handleCardClick = (index: number) => {
    playSound("cardFlip", 0.7)
    onPick(index)
  }

  return (
    <div className={cn("relative w-full h-48 flex items-center justify-center", className)}>
      <AnimatePresence>
        {positions.map((pos) => (
          <motion.div
            key={`deck-${pos.index}`}
            className="absolute cursor-pointer"
            style={{
              left: "50%",
              top: "50%",
              zIndex: hoveredCard === pos.index ? 100 : pos.zIndex,
            }}
            initial={{
              x: pos.x,
              y: pos.y,
              rotate: pos.rotation,
            }}
            animate={{
              x: pos.x,
              y: pos.y,
              rotate: pos.rotation,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.3 },
            }}
            whileHover={{
              scale: 1.18,
              y: pos.y - 14,
              boxShadow: "0 0 8px 2px rgba(249,233,172,0.6)",
            }}
            onClick={() => handleCardClick(pos.index)}
            onHoverStart={() => setHoveredCard(pos.index)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            {/* 复古塔罗牌背面 */}
            <div
              className="w-[94px] h-[146px] rounded-lg border border-[#C9A44E]/60 shadow-card-gold origin-center transition-all duration-300"
              style={{
                transform: `rotate(${-pos.rotation}deg)`,
                backgroundColor: "#322E29",
                backgroundImage: `
                  radial-gradient(circle at 30% 30%, rgba(201,164,78,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 70% 70%, rgba(201,164,78,0.08) 0%, transparent 50%),
                  linear-gradient(45deg, transparent 30%, rgba(201,164,78,0.05) 50%, transparent 70%)
                `,
              }}
            >
              {/* 卡牌背面装饰 */}
              <div className="w-full h-full flex items-center justify-center relative p-2">
                <div
                  className="w-16 h-20 border-2 rounded-sm flex items-center justify-center relative"
                  style={{
                    borderColor: "#C9A44E",
                    backgroundColor: "rgba(201,164,78,0.1)",
                  }}
                >
                  <div className="w-12 h-16 relative">
                    <div
                      className="absolute top-1/2 left-1/2 w-6 h-6 border transform -translate-x-1/2 -translate-y-1/2 rotate-45"
                      style={{ borderColor: "#C9A44E" }}
                    />
                    {[
                      { top: "2px", left: "2px" },
                      { top: "2px", right: "2px" },
                      { bottom: "2px", left: "2px" },
                      { bottom: "2px", right: "2px" },
                    ].map((pos, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          ...pos,
                          backgroundColor: "#C9A44E",
                          opacity: 0.7,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
