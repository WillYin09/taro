"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PageTransition } from "@/components/ui/page-transition"
import { DeckZone } from "@/components/ui/deck-zone"
import { SpreadZone } from "@/components/ui/spread-zone"
import { ParallaxBackground } from "@/components/ui/parallax-background"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigation } from "@/hooks/use-navigation"
import { useTheme } from "@/hooks/use-theme"
import { useAudio } from "@/hooks/use-audio"
import { themeTokens } from "@/lib/theme-system"
import { ArrowLeft, Volume2, VolumeX } from "lucide-react"

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

export default function DrawRitualPage() {
  const [pickedCards, setPicked] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<boolean[]>([])
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
    if (isInitialized) {
      startAmbient()
    }
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

  // 初始化翻牌状态
  useEffect(() => {
    setFlipped(Array(spreadInfo.cards).fill(false))
  }, [spreadInfo.cards])

  // 生成牌阵布局
  const getSpreadLayout = (): SpreadLayout[] => {
    const layouts = {
      1: [{ x: 0, y: 0, rotate: 0 }], // 单张居中
      2: [
        { x: -60, y: 0, rotate: -10 },
        { x: 60, y: 0, rotate: 10 },
      ], // 两张对称
      3: [
        { x: -80, y: 0, rotate: -15 },
        { x: 0, y: 0, rotate: 0 },
        { x: 80, y: 0, rotate: 15 },
      ], // 三张一线
      5: [
        { x: 0, y: -60, rotate: 0 },
        { x: -60, y: 0, rotate: -10 },
        { x: 60, y: 0, rotate: 10 },
        { x: -30, y: 60, rotate: -5 },
        { x: 30, y: 60, rotate: 5 },
      ], // 五张金字塔
      6: [
        { x: -90, y: -30, rotate: -20 },
        { x: 0, y: -60, rotate: 0 },
        { x: 90, y: -30, rotate: 20 },
        { x: -90, y: 30, rotate: -20 },
        { x: 0, y: 60, rotate: 0 },
        { x: 90, y: 30, rotate: 20 },
      ], // 六芒星
      10: [
        { x: 0, y: -80, rotate: 0 },
        { x: -40, y: -40, rotate: -10 },
        { x: 40, y: -40, rotate: 10 },
        { x: -80, y: 0, rotate: -20 },
        { x: 0, y: 0, rotate: 0 },
        { x: 80, y: 0, rotate: 20 },
        { x: -40, y: 40, rotate: -10 },
        { x: 40, y: 40, rotate: 10 },
        { x: 0, y: 80, rotate: 0 },
        { x: 0, y: 120, rotate: 0 },
      ], // 凯尔特十字
      12: Array.from({ length: 12 }, (_, i) => {
        const angle = i * 30 - 90
        const radian = (angle * Math.PI) / 180
        const radius = 100
        return {
          x: Math.cos(radian) * radius,
          y: Math.sin(radian) * radius,
          rotate: angle + 90,
        }
      }), // 十二宫位圆形
    }
    return layouts[spreadInfo.cards as keyof typeof layouts] || layouts[1]
  }

  const spreadLayout = getSpreadLayout()

  const handlePick = (index: number) => {
    if (pickedCards.length >= spreadInfo.cards) return

    const cardFaces = [
      "愚者",
      "魔术师",
      "女祭司",
      "皇后",
      "皇帝",
      "教皇",
      "恋人",
      "战车",
      "力量",
      "隐者",
      "命运之轮",
      "正义",
    ]
    const randomFace = cardFaces[Math.floor(Math.random() * cardFaces.length)]

    const card: Card = {
      id: `card-${Date.now()}-${index}`,
      face: randomFace,
      index: pickedCards.length,
    }

    setPicked([...pickedCards, card])
  }

  const handleFlip = (index: number) => {
    if (pickedCards.length < spreadInfo.cards) return

    const newFlipped = [...flipped]
    newFlipped[index] = true
    setFlipped(newFlipped)

    // 检查是否全部翻开
    if (newFlipped.every(Boolean)) {
      setTimeout(() => {
        navigateWithTransition(`/reading?spread=${spreadType}`)
      }, 1000)
    }
  }

  const getPhaseText = () => {
    if (pickedCards.length === 0) {
      return "准备开始占卜仪式"
    } else if (pickedCards.length < spreadInfo.cards) {
      return `已选择 ${pickedCards.length}/${spreadInfo.cards} 张牌`
    } else if (!flipped.every(Boolean)) {
      return "点击卡牌查看结果"
    } else {
      return "正在跳转到解读页面..."
    }
  }

  const getPhaseSubtext = () => {
    if (pickedCards.length === 0) {
      return "点击想抽的卡牌"
    } else if (pickedCards.length < spreadInfo.cards) {
      return "继续选择剩余卡牌"
    } else if (!flipped.every(Boolean)) {
      return "点击背面卡牌翻开查看"
    } else {
      return "即将显示详细解读"
    }
  }

  return (
    <PageTransition>
      <section className="w-full h-screen flex flex-col items-center">
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

        {/* 顶部标题区：真正居中 */}
        <header className="mt-12 flex flex-col items-center gap-1 text-center z-10">
          <h2
            className="text-lg font-semibold tracking-wide transition-colors duration-300"
            style={{
              fontFamily: "Cinzel, serif",
              color: currentTheme.text.primary,
            }}
          >
            {spreadInfo.name}
          </h2>
          <p
            className="text-sm opacity-70 transition-colors duration-300"
            style={{ color: currentTheme.text.secondary }}
          >
            {spreadInfo.description}
          </p>
          <h3
            className="mt-6 text-xl transition-colors duration-300"
            style={{
              fontFamily: "Cinzel, serif",
              color: currentTheme.text.primary,
            }}
          >
            {getPhaseText()}
          </h3>
          <p
            className="text-xs opacity-60 transition-colors duration-300"
            style={{ color: currentTheme.text.tertiary }}
          >
            {getPhaseSubtext()}
          </p>
        </header>

        {/* DeckZone + SpreadZone */}
        <div className="relative flex flex-col items-center justify-start flex-1 w-full pt-10 z-10">
          {/* 上方扇形牌堆 */}
          <DeckZone total={24} picked={pickedCards} onPick={handlePick} />

          {/* 下方牌阵占位 */}
          <SpreadZone
            layout={spreadLayout}
            cards={pickedCards}
            flipped={flipped}
            onFlip={handleFlip}
            className="mt-8"
          />
        </div>
      </section>
    </PageTransition>
  )
}
