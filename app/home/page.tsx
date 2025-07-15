"use client"

import { useState } from "react"
import { designTokens } from "@/lib/design-tokens"
import { TarotCard } from "@/components/ui/tarot-card"
import { PageTransition } from "@/components/ui/page-transition"
import { useNavigation } from "@/hooks/use-navigation"
import { Search, Bell, Star, Heart, Users, User } from "lucide-react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home")
  const { navigateWithTransition, isTransitioning } = useNavigation()

  const quickActions = [
    {
      title: "今日指引",
      subtitle: "单张牌快速占卜",
      icon: "🔮",
      color: "from-purple-500 to-pink-500",
      time: "1分钟",
    },
    {
      title: "经典三牌",
      subtitle: "过去·现在·未来",
      icon: "✨",
      color: "from-blue-500 to-purple-500",
      time: "3分钟",
    },
    {
      title: "爱情占卜",
      subtitle: "感情运势解读",
      icon: "💕",
      color: "from-pink-500 to-red-500",
      time: "5分钟",
    },
    {
      title: "事业指导",
      subtitle: "职场发展建议",
      icon: "🌟",
      color: "from-yellow-500 to-orange-500",
      time: "5分钟",
    },
  ]

  const recentReadings = [
    { name: "愚者", isReversed: false, date: "今天" },
    { name: "恋人", isReversed: true, date: "昨天" },
    { name: "星星", isReversed: false, date: "2天前" },
  ]

  const handleQuickAction = (actionTitle: string) => {
    const spreadMap = {
      今日指引: 1,
      经典三牌: 2,
      爱情占卜: 3,
      事业指导: 5,
    }
    const spreadId = spreadMap[actionTitle as keyof typeof spreadMap] || 1
    navigateWithTransition(`/draw-ritual?spread=${spreadId}`)
  }

  return (
    <PageTransition>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: designTokens.fonts.serif }}>
              神秘塔罗
            </h1>
            <p className="text-white/70 text-sm">探索内心的智慧</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <Search size={20} />
            </button>
            <button className="p-2 rounded-full bg-white/10 text-white relative hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </button>
          </div>
        </div>

        {/* Today's Fortune Banner */}
        <div
          className="bg-gradient-to-r from-gold-400/20 to-purple-400/20 rounded-2xl p-4 border border-gold-400/30 animate-fade-in-up hover:shadow-glow transition-all duration-500"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">今日运势</h3>
              <p className="text-white/80 text-sm">整体运势良好，适合新的开始</p>
            </div>
            <div className="text-2xl animate-bounce">🌟</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8">
        <h2 className="text-white text-lg font-semibold mb-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          快速占卜
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${action.color} rounded-2xl p-4 relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-glow animate-fade-in-up`}
              style={{
                boxShadow: designTokens.shadows.card,
                animationDelay: `${0.4 + index * 0.1}s`,
              }}
              onClick={() => handleQuickAction(action.title)}
            >
              <div className="relative z-10">
                <div className="text-2xl mb-2 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                  {action.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{action.title}</h3>
                <p className="text-white/80 text-xs mb-2">{action.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">{action.time}</span>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Readings */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <h2 className="text-white text-lg font-semibold">最近占卜</h2>
          <button className="text-gold-400 text-sm hover:text-gold-300 transition-colors">查看全部</button>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {recentReadings.map((reading, index) => (
            <div
              key={index}
              className="flex-shrink-0 animate-fade-in-up"
              style={{ animationDelay: `${0.9 + index * 0.1}s` }}
            >
              <TarotCard name={reading.name} isReversed={reading.isReversed} isFlipped={true} size="sm" />
              <p className="text-white/70 text-xs text-center mt-2">{reading.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Content */}
      <div className="px-6 mb-20">
        <h2 className="text-white text-lg font-semibold mb-4 animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
          精选内容
        </h2>
        <div
          className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl p-4 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-500 hover:shadow-glow animate-fade-in-up"
          style={{ animationDelay: "1.3s" }}
        >
          <div className="flex items-start space-x-4">
            <img src="/placeholder.svg?height=60&width=60" alt="Featured" className="w-15 h-15 rounded-lg" />
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">塔罗牌的历史与奥秘</h3>
              <p className="text-white/70 text-sm mb-2">探索塔罗牌背后的深层含义和古老智慧</p>
              <div className="flex items-center space-x-4 text-xs text-white/60">
                <span>5分钟阅读</span>
                <span>•</span>
                <span>1.2k 阅读</span>
              </div>
            </div>
          </div>
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
