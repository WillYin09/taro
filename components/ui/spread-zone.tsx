"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAudio } from "@/hooks/use-audio"

interface Card {
  id: string
  face: string
  index: number
}

interface SpreadLayout {
  x: number
  y: number
  rotate: number
}

interface SpreadZoneProps {
  layout: SpreadLayout[]
  cards: Card[]
  flipped: boolean[]
  onFlip: (index: number) => void
  className?: string
}

export function SpreadZone({ layout, cards, flipped, onFlip, className }: SpreadZoneProps) {
  const { playSound } = useAudio()

  const handleCardClick = (index: number) => {
    // 只有当所有卡牌都抽完且该卡牌未翻开时才能点击
    if (cards.length < layout.length || flipped[index]) return

    playSound("cardFlip", 0.7)
    onFlip(index)
  }

  return (
    <div className={cn("relative w-full h-64 flex items-center justify-center", className)}>
      {layout.map((slot, index) => {
        const hasCard = cards[index]
        const isFlipped = flipped[index]
        const canFlip = cards.length === layout.length && hasCard && !isFlipped

        return (
          <motion.div
            key={`slot-${index}`}
            className={cn(
              "absolute w-[94px] h-[146px] rounded-lg border-2 border-dashed transition-all duration-300",
              hasCard ? "border-[#C9A44E]/60" : "border-gray-400/30",
              canFlip && "cursor-pointer hover:border-[#C9A44E]",
            )}
            style={{
              left: `calc(50% + ${slot.x}px)`,
              top: `calc(50% + ${slot.y}px)`,
              transform: `translate(-50%, -50%) rotate(${slot.rotate}deg)`,
            }}
            onClick={() => handleCardClick(index)}
            whileHover={canFlip ? { scale: 1.05 } : {}}
          >
            {!hasCard ? (
              // 空槽占位
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400/50 text-xs font-medium">{index + 1}</div>
              </div>
            ) : (
              // 有卡牌
              <div className="relative w-full h-full">
                {/* 卡牌背面 */}
                <motion.div
                  className="absolute inset-0 w-full h-full rounded-lg"
                  style={{
                    backgroundColor: "#322E29",
                    backgroundImage: `
                      radial-gradient(circle at 30% 30%, rgba(201,164,78,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 70% 70%, rgba(201,164,78,0.08) 0%, transparent 50%)
                    `,
                    border: "1px solid rgba(201,164,78,0.6)",
                  }}
                  animate={{
                    rotateY: isFlipped ? 180 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <div
                      className="w-16 h-20 border-2 rounded-sm flex items-center justify-center"
                      style={{
                        borderColor: "#C9A44E",
                        backgroundColor: "rgba(201,164,78,0.1)",
                      }}
                    >
                      <div className="w-6 h-6 border transform rotate-45" style={{ borderColor: "#C9A44E" }} />
                    </div>
                  </div>
                </motion.div>

                {/* 卡牌正面 */}
                <motion.div
                  className="absolute inset-0 w-full h-full rounded-lg"
                  style={{
                    backgroundColor: "#F1E8D6",
                    border: "1px solid rgba(201,164,78,0.8)",
                    backfaceVisibility: "hidden",
                  }}
                  animate={{
                    rotateY: isFlipped ? 0 : -180,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-3">
                    <div
                      className="text-xs font-bold mb-2 text-center"
                      style={{ color: "#2F2C29", fontFamily: "serif" }}
                    >
                      {hasCard.face}
                    </div>
                    <div
                      className="w-16 h-20 rounded border-2 flex items-center justify-center"
                      style={{
                        borderColor: "#2F2C29",
                        backgroundColor: "rgba(78,122,162,0.1)",
                      }}
                    >
                      <div className="text-lg" style={{ color: "#4E7AA2" }}>
                        ✨
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
