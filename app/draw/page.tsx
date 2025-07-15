"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PageTransition } from "@/components/ui/page-transition"
import { FanSpread } from "@/components/ui/fan-spread"
import { ParallaxBackground } from "@/components/ui/parallax-background"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigation } from "@/hooks/use-navigation"
import { useTheme } from "@/hooks/use-theme"
import { useAudio } from "@/hooks/use-audio"
import { themeTokens } from "@/lib/theme-system"
import { ArrowLeft, Volume2, VolumeX } from "lucide-react"

type RitualPhase = "entering" | "ready" | "drawing" | "complete"

export default function DrawPage() {
  const [phase, setPhase] = useState<RitualPhase>("entering")
  const [drawnCards, setDrawnCards] = useState<number[]>([])
  const [spreadType, setSpreadType] = useState(1)
  const { navigateWithTransition } = useNavigation()
  const { effectiveTheme } = useTheme()
  const { playSound, toggleMute, startAmbient, isMuted, isInitialized } = useAudio()
  const searchParams = useSearchParams()

  const currentTheme = themeTokens[effectiveTheme]

  useEffect(() => {
    const spread = searchParams?.get("spread")
    if (spread) {
      setSpreadType(Number.parseInt(spread))
    }
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("ready")
      if (isInitialized) {
        startAmbient()
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [isInitialized, startAmbient])

  const getSpreadInfo = (spread: number) => {
    const spreads = {
      1: { name: "今日指引", cards: 1, description: "一张牌为你指明方向" },
      2: { name: "经典三牌", cards: 3, description: "过去·现在·未来" },
      3: { name: "爱情六芒星", cards: 6, description: "感情运势全解析" },
      4: { name: "凯尔特十字", cards: 10, description: "人生全景占卜" },
      5: { name: "事业发展", cards: 5, description: "职场运势指导" },
      6: { name: "十二宫位", cards: 12, description: "全方位人生解读" },
    }
    return spreads[spread as keyof typeof spreads] || spreads[1]
  }

  const spreadInfo = getSpreadInfo(spreadType)

  const handleDraw = (index: number) => {
    if (drawnCards.includes(index)) return

    setPhase("drawing")
    setDrawnCards((prev) => [...prev, index])

    // 震动反馈
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50])
    }

    // 检查是否完成所有抽牌
    if (drawnCards.length + 1 >= spreadInfo.cards) {
      setTimeout(() => {
        setPhase("complete")
        playSound("complete", 0.8)
      }, 1000)
    }
  }

  const handleContinue = () => {
    navigateWithTransition(`/reading?spread=${spreadType}`)
  }

  const getPhaseText = () => {
    switch (phase) {
      case "entering":
        return "正在连接宇宙的智慧..."
      case "ready":
        return "准备开始占卜仪式"
      case "drawing":
        return `已抽取 ${drawnCards.length}/${spreadInfo.cards} 张牌`
      case "complete":
        return "占卜完成，查看你的指引"
      default:
        return ""
    }
  }

  const getPhaseSubtext = () => {
    switch (phase) {
      case "ready":
        return "点击牌堆开始抽牌"
      case "drawing":
        return drawnCards.length < spreadInfo.cards ? "继续选择剩余卡牌" : "所有卡牌已抽取完成"
      case "complete":
        return "点击查看详细解读"
      default:
        return ""
    }
  }

  return (
    <PageTransition>
      <section className="relative w-full h-screen overflow-hidden flex flex-col items-center">
        {/* 三层Parallax背景 */}
        <ParallaxBackground />

        {/* 顶部导航 */}
        <div className="absolute top-12 left-6 right-6 z-20 flex items-center justify-between">
          <button
            onClick={() => navigateWithTransition("/spreads")}
            className="p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: `${currentTheme.background.card}`,
              color: currentTheme.text.primary,
              border: `1px solid ${currentTheme.border.secondary}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="text-center">
            <h1
              className="text-xl font-bold transition-colors duration-300 mb-1"
              style={{
                fontFamily: "Cinzel, serif",
                color: currentTheme.text.primary,
              }}
            >
              {spreadInfo.name}
            </h1>
            <p className="text-sm transition-colors duration-300" style={{ color: currentTheme.text.secondary }}>
              {spreadInfo.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMute}
              className="p-3 rounded-full transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: isMuted ? `${currentTheme.text.accent}20` : `${currentTheme.background.card}`,
                color: isMuted ? currentTheme.text.accent : currentTheme.text.primary,
                border: `1px solid ${isMuted ? currentTheme.text.accent : currentTheme.border.secondary}`,
                backdropFilter: "blur(10px)",
              }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>

        {/* 标题区域 */}
        <div className="pt-32 pb-8 text-center z-10">
          <h2
            className="text-2xl mb-3 transition-all duration-500"
            style={{
              fontFamily: "Cinzel, serif",
              color: currentTheme.text.primary,
            }}
          >
            {getPhaseText()}
          </h2>
          <p className="text-base transition-all duration-500" style={{ color: currentTheme.text.secondary }}>
            {getPhaseSubtext()}
          </p>

          {/* 进度指示器 */}
          {phase === "drawing" && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              {[...Array(spreadInfo.cards)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: drawnCards.includes(i) ? currentTheme.text.accent : currentTheme.border.secondary,
                    transform: drawnCards.includes(i) ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 扇形牌阵 */}
        <div className="flex-1 w-full relative z-10">
          <FanSpread total={spreadInfo.cards} onDraw={handleDraw} drawnCards={drawnCards} />
        </div>

        {/* 完成按钮 */}
        {phase === "complete" && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={handleContinue}
              className="px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: `linear-gradient(45deg, ${currentTheme.text.accent} 0%, #E9C46A 50%, ${currentTheme.text.accent} 100%)`,
                color: effectiveTheme === "dark" ? "#000" : "#fff",
                boxShadow: `0 0 40px ${currentTheme.text.accent}40`,
              }}
            >
              查看解读
            </button>
          </div>
        )}
      </section>
    </PageTransition>
  )
}
