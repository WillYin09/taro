"use client"

import { useState } from "react"
import { designTokens } from "@/lib/design-tokens"
import { TarotCard } from "@/components/ui/tarot-card"
import { PageTransition } from "@/components/ui/page-transition"
import { useNavigation } from "@/hooks/use-navigation"
import { ArrowLeft, Search, Trash2, Star, Heart, Users, User } from "lucide-react"

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("favorites")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const { navigateWithTransition, isTransitioning } = useNavigation()

  const favoriteReadings = [
    {
      id: 1,
      date: "2024-01-15",
      spread: "今日指引",
      cards: [{ name: "愚者", isReversed: false }],
      rating: 5,
      tags: ["事业", "新开始"],
    },
    {
      id: 2,
      date: "2024-01-14",
      spread: "经典三牌",
      cards: [
        { name: "恋人", isReversed: false },
        { name: "星星", isReversed: true },
        { name: "太阳", isReversed: false },
      ],
      rating: 4,
      tags: ["爱情", "关系"],
    },
    {
      id: 3,
      date: "2024-01-12",
      spread: "事业指导",
      cards: [
        { name: "皇帝", isReversed: false },
        { name: "战车", isReversed: false },
        { name: "力量", isReversed: true },
      ],
      rating: 5,
      tags: ["事业", "成功"],
    },
  ]

  const filters = ["all", "事业", "爱情", "健康", "财运"]

  return (
    <PageTransition>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={() => navigateWithTransition("/home")}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            disabled={isTransitioning}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: designTokens.fonts.serif }}>
            我的收藏
          </h1>
          <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
            <Search size={20} />
          </button>
        </div>

        {/* Filter Tags */}
        <div className="flex space-x-3 overflow-x-auto pb-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {filters.map((filter, index) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 hover:scale-105 animate-fade-in-up ${
                selectedFilter === filter
                  ? "bg-gold-400 text-black shadow-glow"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              style={{ animationDelay: `${0.3 + index * 0.05}s` }}
            >
              {filter === "all" ? "全部" : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Favorites List */}
      <div className="px-6 pb-24">
        <div className="space-y-4">
          {favoriteReadings.map((reading, index) => (
            <div
              key={reading.id}
              className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-4 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-500 hover:shadow-glow animate-fade-in-up"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{reading.spread}</h3>
                  <p className="text-white/70 text-sm">{reading.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`transition-colors duration-300 ${i < reading.rating ? "text-gold-400 fill-current" : "text-white/30"}`}
                      />
                    ))}
                  </div>
                  <button className="p-1 text-white/60 hover:text-red-400 transition-all duration-300 hover:scale-110">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-3">
                {reading.cards.map((card, cardIndex) => (
                  <div
                    key={cardIndex}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${0.6 + cardIndex * 0.1}s` }}
                  >
                    <TarotCard name={card.name} isReversed={card.isReversed} isFlipped={true} size="sm" />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {reading.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-gold-400/20 text-gold-400 rounded-full text-xs animate-fade-in-up hover:bg-gold-400/30 transition-colors duration-300"
                    style={{ animationDelay: `${0.7 + tagIndex * 0.05}s` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 animate-slide-up">
        <div className="flex items-center justify-around py-3">
          {[
            { id: "home", icon: Star, label: "主页", href: "/home" },
            { id: "favorites", icon: Heart, label: "收藏", href: "/favorites" },
            { id: "community", icon: Users, label: "社区", href: "/community" },
            { id: "profile", icon: User, label: "我的", href: "/profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigateWithTransition(tab.href)}
              disabled={isTransitioning}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                activeTab === tab.id ? "text-gold-400 bg-gold-400/10" : "text-white/60 hover:text-white/80"
              } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <tab.icon size={20} />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
