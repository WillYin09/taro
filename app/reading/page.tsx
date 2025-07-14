"use client"

import { useState } from "react"
import { designTokens } from "@/lib/design-tokens"
import { TarotCard } from "@/components/ui/tarot-card"
import { MysticalButton } from "@/components/ui/mystical-button"
import { ArrowLeft, Heart, Share2, Star, Copy, Download } from "lucide-react"

export default function ReadingPage() {
  const [selectedCard, setSelectedCard] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [rating, setRating] = useState(0)

  const reading = {
    spread: "经典三牌",
    date: new Date().toLocaleDateString("zh-CN"),
    cards: [
      {
        name: "愚者",
        position: "过去",
        isReversed: false,
        meaning: "新的开始",
        description:
          "愚者代表着纯真、自发性和新的开始。在过去的位置上，它暗示你曾经怀着一颗纯真的心踏上了某个重要的人生旅程。",
        keywords: ["新开始", "冒险", "纯真", "自由"],
        advice: "回顾过去的勇敢决定，它们为现在的你奠定了基础。",
      },
      {
        name: "恋人",
        position: "现在",
        isReversed: false,
        meaning: "选择与和谐",
        description: "恋人牌在现在的位置表示你正面临重要的选择。这可能涉及人际关系、价值观或人生方向的决定。",
        keywords: ["选择", "爱情", "和谐", "价值观"],
        advice: "倾听内心的声音，做出符合你真实价值观的选择。",
      },
      {
        name: "星星",
        position: "未来",
        isReversed: false,
        meaning: "希望与指引",
        description: "星星牌预示着光明的未来。经历过挑战后，你将找到内心的平静和人生的方向。",
        keywords: ["希望", "指引", "灵感", "治愈"],
        advice: "保持对未来的信心，你的努力将得到回报。",
      },
    ],
    overallMessage:
      "你的人生旅程从纯真的开始，经过现在的重要选择，最终将迎来充满希望的未来。相信自己的直觉，勇敢地做出决定。",
  }

  const handleShare = () => {
    // Share functionality
    console.log("Sharing reading...")
  }

  const handleCopy = () => {
    // Copy reading text
    console.log("Copying reading...")
  }

  const handleDownload = () => {
    // Download as image
    console.log("Downloading image...")
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
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded-full bg-white/10 text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-2 rounded-full transition-colors ${
                isFavorited ? "bg-red-500 text-white" : "bg-white/10 text-white"
              }`}
            >
              <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-full bg-white/10 text-white">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: designTokens.fonts.serif }}>
            {reading.spread}
          </h1>
          <p className="text-white/70 text-sm">{reading.date}</p>
        </div>
      </div>

      {/* Cards Overview */}
      <div className="px-6 mb-8">
        <div className="flex justify-center space-x-4 mb-6">
          {reading.cards.map((card, index) => (
            <div
              key={index}
              className={`cursor-pointer transition-all duration-300 ${
                selectedCard === index ? "scale-110" : "scale-100 opacity-70"
              }`}
              onClick={() => setSelectedCard(index)}
            >
              <TarotCard name={card.name} isReversed={card.isReversed} isFlipped={true} size="md" />
              <p className="text-white/70 text-xs text-center mt-2">{card.position}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Card Details */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 border border-purple-400/30">
          <div className="text-center mb-6">
            <TarotCard
              name={reading.cards[selectedCard].name}
              isReversed={reading.cards[selectedCard].isReversed}
              isFlipped={true}
              size="lg"
              className="mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: designTokens.fonts.serif }}>
              {reading.cards[selectedCard].name}
            </h2>
            <p className="text-gold-400 text-sm mb-1">{reading.cards[selectedCard].position}</p>
            <p className="text-white/80 text-sm">{reading.cards[selectedCard].meaning}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">牌意解读</h3>
              <p className="text-white/80 text-sm leading-relaxed">{reading.cards[selectedCard].description}</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">关键词</h3>
              <div className="flex flex-wrap gap-2">
                {reading.cards[selectedCard].keywords.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 bg-gold-400/20 text-gold-400 rounded-full text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">建议</h3>
              <p className="text-white/80 text-sm leading-relaxed">{reading.cards[selectedCard].advice}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Message */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-r from-gold-400/20 to-purple-400/20 rounded-2xl p-6 border border-gold-400/30">
          <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: designTokens.fonts.serif }}>
            整体启示
          </h3>
          <p className="text-white/90 leading-relaxed">{reading.overallMessage}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleCopy}
            className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <Copy size={20} className="mb-2" />
            <span className="text-xs">复制</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <Download size={20} className="mb-2" />
            <span className="text-xs">保存</span>
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <Share2 size={20} className="mb-2" />
            <span className="text-xs">分享</span>
          </button>
        </div>

        {/* Rating */}
        <div className="text-center mb-6">
          <p className="text-white/70 text-sm mb-3">这次解读对你有帮助吗？</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`transition-colors ${star <= rating ? "text-gold-400" : "text-white/30"}`}
              >
                <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </div>

        <MysticalButton className="w-full" size="lg" onClick={() => (window.location.href = "/home")}>
          返回首页
        </MysticalButton>
      </div>
    </div>
  )
}
