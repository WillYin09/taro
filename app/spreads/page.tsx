"use client"

import { useState } from "react"
import { designTokens } from "@/lib/design-tokens"
import { MysticalButton } from "@/components/ui/mystical-button"
import { ArrowLeft, Clock, Star } from "lucide-react"

export default function SpreadsPage() {
  const [selectedSpread, setSelectedSpread] = useState<number | null>(null)

  const spreads = [
    {
      id: 1,
      name: "今日指引",
      description: "单张牌为你指明今日方向",
      cards: 1,
      time: "1分钟",
      difficulty: "初级",
      image: "/placeholder.svg?height=120&width=200",
      layout: "single",
    },
    {
      id: 2,
      name: "经典三牌",
      description: "过去·现在·未来的时间轴解读",
      cards: 3,
      time: "3分钟",
      difficulty: "初级",
      image: "/placeholder.svg?height=120&width=200",
      layout: "linear",
    },
    {
      id: 3,
      name: "爱情六芒星",
      description: "全面解析你的感情状况",
      cards: 6,
      time: "8分钟",
      difficulty: "中级",
      image: "/placeholder.svg?height=120&width=200",
      layout: "star",
    },
    {
      id: 4,
      name: "凯尔特十字",
      description: "最经典的综合性牌阵",
      cards: 10,
      time: "15分钟",
      difficulty: "高级",
      image: "/placeholder.svg?height=120&width=200",
      layout: "cross",
    },
    {
      id: 5,
      name: "事业发展",
      description: "职场运势与发展建议",
      cards: 5,
      time: "6分钟",
      difficulty: "中级",
      image: "/placeholder.svg?height=120&width=200",
      layout: "pyramid",
    },
    {
      id: 6,
      name: "十二宫位",
      description: "全方位人生解读",
      cards: 12,
      time: "20分钟",
      difficulty: "专家",
      image: "/placeholder.svg?height=120&width=200",
      layout: "circle",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "初级":
        return "text-green-400 bg-green-400/20"
      case "中级":
        return "text-yellow-400 bg-yellow-400/20"
      case "高级":
        return "text-orange-400 bg-orange-400/20"
      case "专家":
        return "text-red-400 bg-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: designTokens.colors.gradient.primary,
      }}
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center mb-6">
          <button
            className="p-2 rounded-full bg-white/10 text-white mr-4"
            onClick={() => (window.location.href = "/home")}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: designTokens.fonts.serif }}>
              选择牌阵
            </h1>
            <p className="text-white/70 text-sm">选择适合的牌阵开始占卜</p>
          </div>
        </div>
      </div>

      {/* Spreads Grid */}
      <div className="px-6 pb-24">
        <div className="space-y-4">
          {spreads.map((spread) => (
            <div
              key={spread.id}
              className={`bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-4 border transition-all duration-300 cursor-pointer ${
                selectedSpread === spread.id
                  ? "border-gold-400 bg-gold-400/10"
                  : "border-purple-400/30 hover:border-purple-400/50"
              }`}
              onClick={() => setSelectedSpread(spread.id)}
            >
              <div className="flex items-start space-x-4">
                <img
                  src={spread.image || "/placeholder.svg"}
                  alt={spread.name}
                  className="w-20 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg">{spread.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(spread.difficulty)}`}>
                        {spread.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{spread.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-white/60">
                    <div className="flex items-center space-x-1">
                      <Star size={12} />
                      <span>{spread.cards} 张牌</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{spread.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSpread === spread.id && (
                <div className="mt-4 pt-4 border-t border-gold-400/30">
                  <MysticalButton
                    className="w-full"
                    onClick={() => {
                      // Navigate to card drawing
                      window.location.href = `/draw?spread=${spread.id}`
                    }}
                  >
                    开始占卜
                  </MysticalButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
