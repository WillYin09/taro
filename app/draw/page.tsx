"use client"

import { useState, useEffect } from "react"
import { designTokens } from "@/lib/design-tokens"
import { TarotCard } from "@/components/ui/tarot-card"
import { MysticalButton } from "@/components/ui/mystical-button"
import { PageTransition } from "@/components/ui/page-transition"
import { useNavigation } from "@/hooks/use-navigation"
import { useGesture } from "@/hooks/use-gesture"
import { useLongPress } from "@/hooks/use-long-press"
import { ArrowLeft } from "lucide-react"

export default function DrawPage() {
  const [phase, setPhase] = useState<"shuffle" | "draw" | "reveal">("shuffle")
  const [shuffleCount, setShuffleCount] = useState(0)
  const [drawnCards, setDrawnCards] = useState<number[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [spreadType, setSpreadType] = useState(1)
  const { navigateWithTransition } = useNavigation()

  // 获取URL参数
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const spread = urlParams.get("spread")
    if (spread) {
      setSpreadType(Number.parseInt(spread))
    }
  }, [])

  const totalCards = 78
  const cardsNeeded = getCardsNeeded(spreadType)

  function getCardsNeeded(spread: number): number {
    switch (spread) {
      case 1:
        return 1 // 今日指引
      case 2:
        return 3 // 经典三牌
      case 3:
        return 6 // 爱情六芒星
      case 4:
        return 10 // 凯尔特十字
      case 5:
        return 5 // 事业发展
      case 6:
        return 12 // 十二宫位
      default:
        return 3
    }
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && phase === "shuffle" && shuffleCount >= 10) {
      setPhase("draw")
    }
  }, [countdown, phase, shuffleCount])

  const handleShuffle = () => {
    if (isShuffling) return

    setIsShuffling(true)
    setShuffleCount((prev) => prev + 1)

    // 添加震动反馈（如果支持）
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    if (shuffleCount >= 9) {
      setCountdown(3)
    }

    setTimeout(() => setIsShuffling(false), 500)
  }

  const longPressProps = useLongPress({
    onLongPress: handleShuffle,
    delay: 100, // 减少延迟，让长按更敏感
  })

  const gestureProps = useGesture({
    onSwipeLeft: () => {
      if (phase === "draw" && drawnCards.length > 0) {
        // 可以添加撤销选择的功能
      }
    },
    onSwipeRight: () => {
      if (phase === "reveal") {
        navigateWithTransition("/reading")
      }
    },
  })

  const handleCardDraw = (cardIndex: number) => {
    if (drawnCards.includes(cardIndex) || drawnCards.length >= cardsNeeded) return

    setDrawnCards((prev) => [...prev, cardIndex])

    // 添加震动反馈
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }

    if (drawnCards.length + 1 === cardsNeeded) {
      setTimeout(() => setPhase("reveal"), 1000)
    }
  }

  const renderShufflePhase = () => (
    <div className="flex flex-col items-center justify-center min-h-screen px-6" {...gestureProps}>
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: designTokens.fonts.serif }}>
          {countdown > 0 ? `准备中 ${countdown}` : "洗牌仪式"}
        </h2>
        <p className="text-white/70 mb-2">
          {countdown > 0
            ? "即将开始抽牌..."
            : shuffleCount < 10
              ? `请长按洗牌 (${shuffleCount}/10)`
              : "洗牌完成，准备抽牌"}
        </p>
        {shuffleCount < 10 && <p className="text-gold-400 text-sm">专注于你想要询问的问题</p>}
      </div>

      <div className="relative mb-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
        {/* Card Deck */}
        <div className="relative">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`absolute transition-all duration-500 ${isShuffling ? "animate-pulse" : ""}`}
              style={{
                transform: `translate(${i * 2}px, ${i * -2}px) ${isShuffling ? "rotate(2deg)" : "rotate(0deg)"}`,
                zIndex: 5 - i,
              }}
            >
              <TarotCard size="lg" />
            </div>
          ))}
        </div>

        {/* Shuffle Effect */}
        {isShuffling && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gold-400 rounded-full animate-ping"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {countdown === 0 && shuffleCount < 10 && (
        <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }} {...longPressProps}>
          <MysticalButton
            className="w-48 h-48 rounded-full text-lg select-none touch-manipulation"
            disabled={isShuffling}
          >
            {isShuffling ? "洗牌中..." : "长按洗牌"}
          </MysticalButton>
        </div>
      )}

      {/* 进度指示器 */}
      <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
        <div className="flex space-x-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < shuffleCount ? "bg-gold-400" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )

  const renderDrawPhase = () => (
    <div className="min-h-screen px-6 py-12" {...gestureProps}>
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: designTokens.fonts.serif }}>
          选择你的牌
        </h2>
        <p className="text-white/70 mb-2">
          请选择 {cardsNeeded} 张牌 ({drawnCards.length}/{cardsNeeded})
        </p>
        <p className="text-gold-400 text-sm">跟随直觉，选择吸引你的牌</p>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-6 gap-2 mb-8">
        {[...Array(totalCards)].map((_, index) => (
          <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${Math.random() * 0.5}s` }}>
            <TarotCard
              size="sm"
              className={`transition-all duration-300 ${
                drawnCards.includes(index) ? "opacity-30 scale-95" : "hover:scale-105 cursor-pointer hover:shadow-glow"
              }`}
              onClick={() => handleCardDraw(index)}
            />
          </div>
        ))}
      </div>

      {/* Selected Cards */}
      {drawnCards.length > 0 && (
        <div className="text-center animate-fade-in-up">
          <h3 className="text-white text-lg mb-4">已选择的牌</h3>
          <div className="flex justify-center space-x-4">
            {drawnCards.map((cardIndex, i) => (
              <div key={i} className="animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <TarotCard size="md" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 进度条 */}
      <div className="fixed bottom-24 left-6 right-6">
        <div className="bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-gold-400 to-purple-400 h-full transition-all duration-500"
            style={{ width: `${(drawnCards.length / cardsNeeded) * 100}%` }}
          />
        </div>
        <p className="text-center text-white/70 text-sm mt-2">
          {drawnCards.length === cardsNeeded ? "选择完成！" : `还需选择 ${cardsNeeded - drawnCards.length} 张牌`}
        </p>
      </div>
    </div>
  )

  const renderRevealPhase = () => (
    <div className="min-h-screen px-6 py-12" {...gestureProps}>
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: designTokens.fonts.serif }}>
          你的牌阵
        </h2>
        <p className="text-white/70">{getSpreadName(spreadType)}</p>
      </div>

      <div className="flex justify-center space-x-6 mb-8">
        {drawnCards.slice(0, Math.min(3, cardsNeeded)).map((_, i) => (
          <div key={i} className="text-center animate-scale-in" style={{ animationDelay: `${i * 0.2}s` }}>
            <TarotCard size="lg" isFlipped={true} name={`Card ${i + 1}`} className="mb-2" />
            <p className="text-white/70 text-sm">{getPositionName(i, spreadType)}</p>
          </div>
        ))}
      </div>

      {cardsNeeded > 3 && (
        <div className="text-center mb-8">
          <p className="text-white/70 text-sm mb-4">还有 {cardsNeeded - 3} 张牌等待解读</p>
          <div className="flex justify-center space-x-2">
            {drawnCards.slice(3).map((_, i) => (
              <TarotCard key={i} size="sm" isFlipped={true} />
            ))}
          </div>
        </div>
      )}

      <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
        <MysticalButton size="lg" onClick={() => navigateWithTransition("/reading")} className="mb-4">
          查看解读
        </MysticalButton>
        <p className="text-white/60 text-sm">向右滑动也可以查看解读</p>
      </div>
    </div>
  )

  function getSpreadName(spread: number): string {
    const names = {
      1: "今日指引",
      2: "过去 · 现在 · 未来",
      3: "爱情六芒星",
      4: "凯尔特十字",
      5: "事业发展",
      6: "十二宫位",
    }
    return names[spread as keyof typeof names] || "塔罗牌阵"
  }

  function getPositionName(index: number, spread: number): string {
    if (spread === 2) {
      return ["过去", "现在", "未来"][index] || ""
    }
    return `位置 ${index + 1}`
  }

  return (
    <PageTransition>
      {/* Header */}
      <div className="absolute top-12 left-6 z-10 animate-fade-in-up">
        <button
          onClick={() => navigateWithTransition("/spreads")}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {phase === "shuffle" && renderShufflePhase()}
        {phase === "draw" && renderDrawPhase()}
        {phase === "reveal" && renderRevealPhase()}
      </div>
    </PageTransition>
  )
}
