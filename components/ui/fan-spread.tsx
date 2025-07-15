"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { useAudio } from "@/hooks/use-audio"
import { themeTokens } from "@/lib/theme-system"

interface FanSpreadProps {
  total: number
  onDraw: (index: number) => void
  drawnCards: number[]
  className?: string
}

interface CardPosition {
  x: number
  y: number
  rotation: number
  index: number
  zIndex: number
}

export function FanSpread({ total, onDraw, drawnCards, className }: FanSpreadProps) {
  const { effectiveTheme } = useTheme()
  const { playSound } = useAudio()
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [cardPositions, setCardPositions] = useState<CardPosition[]>([])

  const currentTheme = themeTokens[effectiveTheme]

  // 计算弧形布局 - 更戏剧化的展开
  useEffect(() => {
    const calculatePositions = () => {
      // 更大的弧形角度，首尾下垂
      const ARC = 120 // 更张开的角度
      const START_OFFSET = -6 // 首尾下垂偏移

      // 响应式半径
      const vw = typeof window !== "undefined" ? window.innerWidth : 375
      const vh = typeof window !== "undefined" ? window.innerHeight : 667
      const R = Math.min(vw, vh) * 0.38

      const startAngle = -ARC / 2 + START_OFFSET
      const step = total > 1 ? ARC / (total - 1) : 0

      const positions: CardPosition[] = []

      for (let i = 0; i < total; i++) {
        const angle = startAngle + i * step
        const radian = (angle * Math.PI) / 180

        // 计算位置，添加首尾下垂效果
        const normalizedPos = (i / (total - 1)) * 2 - 1 // -1 to 1
        const dropOffset = Math.abs(normalizedPos) * 15 // 首尾下垂

        const x = Math.sin(radian) * R
        const y = -Math.cos(radian) * R + dropOffset

        positions.push({
          x,
          y,
          rotation: angle,
          index: i,
          zIndex: total - Math.abs(i - Math.floor(total / 2)), // 中间的牌层级最高
        })
      }

      setCardPositions(positions)
    }

    calculatePositions()

    const handleResize = () => calculatePositions()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [total])

  const handleCardClick = (index: number) => {
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }

    if (drawnCards.includes(index)) {
      return
    }

    if (selectedCard === index) {
      playSound("cardFlip", 0.7)
      onDraw(index)
      setSelectedCard(null)
    } else {
      playSound("click", 0.5)
      setSelectedCard(index)
    }
  }

  const getCardState = (index: number) => {
    if (drawnCards.includes(index)) return "drawn"
    if (selectedCard === index) return "selected"
    return "normal"
  }

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center", className)}>
      {/* 烛光氛围遮罩 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      <motion.div
        className="relative"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <AnimatePresence>
          {cardPositions.map((position) => {
            const cardState = getCardState(position.index)
            const isDrawn = cardState === "drawn"
            const isSelected = cardState === "selected"

            return (
              <motion.div
                key={position.index}
                className="absolute cursor-pointer"
                style={{
                  left: "50%",
                  top: "50%",
                  zIndex: isSelected ? 100 : position.zIndex,
                }}
                initial={{
                  x: position.x,
                  y: position.y,
                  rotate: position.rotation,
                }}
                animate={{
                  x: position.x,
                  y: position.y,
                  rotate: isSelected ? position.rotation * 0.75 : position.rotation, // 选中时稍微减少旋转
                  scale: isSelected ? 1.24 : 1,
                  y: position.y + (isSelected ? -22 : 0),
                  opacity: isDrawn ? 1 : drawnCards.length > 0 && !isSelected ? 0.6 : 1,
                }}
                transition={{
                  type: isSelected ? "spring" : "tween",
                  stiffness: 260,
                  damping: 20,
                  duration: isSelected ? undefined : 0.3,
                }}
                onClick={() => handleCardClick(position.index)}
                whileHover={
                  !isDrawn && !isSelected
                    ? {
                        scale: 1.18,
                        y: position.y - 14,
                        boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
                      }
                    : {}
                }
              >
                {/* 复古塔罗牌容器 */}
                <div
                  className="relative w-24 h-[150px] rounded-lg border transition-all duration-300"
                  style={{
                    transform: `rotate(${-position.rotation}deg)`,
                    transformOrigin: "center center",
                    border: "1px solid rgba(201,164,78,0.6)",
                    boxShadow: isSelected
                      ? "0 0 20px rgba(201,164,78,0.8), 0 8px 32px rgba(0,0,0,0.4)"
                      : "0 0 6px rgba(201,164,78,0.35), 0 4px 12px rgba(0,0,0,0.2)",
                  }}
                >
                  {/* 卡牌背面 - Rider-Waite风格 */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 w-24 h-[150px] rounded-lg overflow-hidden transition-all duration-500",
                      isDrawn && "opacity-0",
                    )}
                    style={{
                      backgroundColor: "#322E29", // 深咖啡色底
                      backgroundImage: `
                        radial-gradient(circle at 30% 30%, rgba(201,164,78,0.1) 0%, transparent 50%),
                        radial-gradient(circle at 70% 70%, rgba(201,164,78,0.08) 0%, transparent 50%),
                        linear-gradient(45deg, transparent 30%, rgba(201,164,78,0.05) 50%, transparent 70%)
                      `,
                    }}
                  >
                    {/* 复古花纹设计 */}
                    <div className="w-full h-full flex items-center justify-center relative p-2">
                      {/* 中心装饰框 */}
                      <div
                        className="w-16 h-20 border-2 rounded-sm flex items-center justify-center relative"
                        style={{
                          borderColor: "#C9A44E",
                          backgroundColor: "rgba(201,164,78,0.1)",
                        }}
                      >
                        {/* 内部花纹 */}
                        <div className="w-12 h-16 relative">
                          {/* 中心菱形 */}
                          <div
                            className="absolute top-1/2 left-1/2 w-6 h-6 border transform -translate-x-1/2 -translate-y-1/2 rotate-45"
                            style={{ borderColor: "#C9A44E" }}
                          />

                          {/* 四角小装饰 */}
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

                          {/* 边框线条装饰 */}
                          <div
                            className="absolute top-0 left-1/2 w-4 h-px transform -translate-x-1/2"
                            style={{ backgroundColor: "#C9A44E", opacity: 0.6 }}
                          />
                          <div
                            className="absolute bottom-0 left-1/2 w-4 h-px transform -translate-x-1/2"
                            style={{ backgroundColor: "#C9A44E", opacity: 0.6 }}
                          />
                        </div>
                      </div>

                      {/* 四角边框装饰 */}
                      {[
                        { top: "4px", left: "4px", borderTop: "6px solid #C9A44E", borderLeft: "6px solid #C9A44E" },
                        { top: "4px", right: "4px", borderTop: "6px solid #C9A44E", borderRight: "6px solid #C9A44E" },
                        {
                          bottom: "4px",
                          left: "4px",
                          borderBottom: "6px solid #C9A44E",
                          borderLeft: "6px solid #C9A44E",
                        },
                        {
                          bottom: "4px",
                          right: "4px",
                          borderBottom: "6px solid #C9A44E",
                          borderRight: "6px solid #C9A44E",
                        },
                      ].map((style, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2"
                          style={{
                            ...style,
                            opacity: 0.4,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* 卡牌正面 - 复古羊皮纸风格 */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 w-24 h-[150px] rounded-lg overflow-hidden transition-all duration-500",
                      !isDrawn && "opacity-0",
                    )}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: isDrawn ? 0 : 180 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                      backgroundColor: "#F1E8D6", // 泛黄羊皮纸
                      backgroundImage: `
                        radial-gradient(circle at 20% 20%, rgba(47,44,41,0.03) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(47,44,41,0.02) 0%, transparent 50%),
                        linear-gradient(45deg, transparent 40%, rgba(47,44,41,0.01) 50%, transparent 60%)
                      `,
                      border: "1px solid rgba(201,164,78,0.8)",
                      boxShadow: "inset 0 0 20px rgba(201,164,78,0.1)",
                    }}
                  >
                    {/* 正面内容 */}
                    <div className="w-full h-full flex flex-col items-center justify-center p-3">
                      {/* 标题 */}
                      <div
                        className="text-xs font-bold mb-2 text-center"
                        style={{
                          color: "#2F2C29",
                          fontFamily: "serif",
                          letterSpacing: "0.5px",
                        }}
                      >
                        牌 {position.index + 1}
                      </div>

                      {/* 插图区域 */}
                      <div
                        className="w-16 h-20 rounded border-2 flex items-center justify-center mb-2"
                        style={{
                          borderColor: "#2F2C29",
                          backgroundColor: "rgba(78,122,162,0.1)",
                        }}
                      >
                        <div className="text-lg" style={{ color: "#4E7AA2" }}>
                          ✨
                        </div>
                      </div>

                      {/* 底部装饰线 */}
                      <div className="w-12 h-px" style={{ backgroundColor: "#C9A44E", opacity: 0.6 }} />
                    </div>
                  </motion.div>

                  {/* 位置标识 */}
                  {!isDrawn && (
                    <div
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium transition-all duration-300"
                      style={{
                        color: isSelected ? "#C9A44E" : currentTheme.text.secondary,
                        opacity: isSelected ? 1 : 0.7,
                        fontFamily: "serif",
                      }}
                    >
                      {position.index + 1}
                    </div>
                  )}
                </div>

                {/* 选择提示 */}
                {isSelected && (
                  <motion.div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(201,164,78,0.2)",
                        color: "#C9A44E",
                        border: "1px solid rgba(201,164,78,0.4)",
                        fontFamily: "serif",
                      }}
                    >
                      再次点击抽取
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* 中心提示文字 */}
        {drawnCards.length === 0 && selectedCard === null && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div
              className="text-sm font-medium mb-1"
              style={{
                color: currentTheme.text.secondary,
                fontFamily: "serif",
              }}
            >
              点击选择卡牌
            </div>
            <div
              className="text-xs opacity-70"
              style={{
                color: currentTheme.text.tertiary,
                fontFamily: "serif",
              }}
            >
              再次点击抽取
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
