"use client"

import { useState } from "react"
import { designTokens } from "@/lib/design-tokens"
import { ArrowLeft, Settings, Crown, Calendar, TrendingUp, Star, Heart, Users, User } from "lucide-react"
import { PageTransition } from "@/components/ui/page-transition"
import { useNavigation } from "@/hooks/use-navigation"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { navigateWithTransition, isTransitioning } = useNavigation()

  const userStats = {
    totalReadings: 156,
    favoriteCards: 23,
    daysActive: 45,
    accuracy: 87,
  }

  const recentActivity = [
    { type: "reading", title: "完成了今日指引", time: "2小时前" },
    { type: "favorite", title: "收藏了恋人牌解读", time: "1天前" },
    { type: "community", title: "在社区发布了心得", time: "2天前" },
    { type: "reading", title: "完成了凯尔特十字", time: "3天前" },
  ]

  return (
    <PageTransition>
      <div
        className="min-h-screen"
        style={{
          background: designTokens.colors.gradient.primary,
        }}
      >
        {/* Header */}
        <div className="px-6 pt-12 pb-6 animate-fade-in-up" style={{ animationDelay: "calc(0 * 0.05s)" }}>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigateWithTransition("/home")} className="p-2 rounded-full bg-white/10 text-white">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: designTokens.fonts.serif }}>
              个人中心
            </h1>
            <button
              onClick={() => navigateWithTransition("/settings")}
              className="p-2 rounded-full bg-white/10 text-white"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 mb-8 animate-fade-in-up" style={{ animationDelay: "calc(1 * 0.05s)" }}>
          <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 border border-purple-400/30">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400 to-purple-400 flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">塔罗探索者</h2>
              <div className="flex items-center justify-center space-x-2">
                <Crown size={16} className="text-gold-400" />
                <span className="text-gold-400 text-sm">高级会员</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{userStats.totalReadings}</div>
                <div className="text-white/70 text-sm">总占卜次数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{userStats.favoriteCards}</div>
                <div className="text-white/70 text-sm">收藏卡牌</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{userStats.daysActive}</div>
                <div className="text-white/70 text-sm">活跃天数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{userStats.accuracy}%</div>
                <div className="text-white/70 text-sm">准确度</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-8 animate-fade-in-up" style={{ animationDelay: "calc(2 * 0.05s)" }}>
          <h3 className="text-white text-lg font-semibold mb-4">快捷功能</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-4 text-left">
              <Calendar className="text-white mb-2" size={24} />
              <div className="text-white font-semibold">占卜历史</div>
              <div className="text-white/70 text-sm">查看所有记录</div>
            </button>
            <button className="bg-gradient-to-br from-gold-500 to-orange-500 rounded-xl p-4 text-left">
              <TrendingUp className="text-white mb-2" size={24} />
              <div className="text-white font-semibold">成长报告</div>
              <div className="text-white/70 text-sm">查看进步轨迹</div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-6 mb-24 animate-fade-in-up" style={{ animationDelay: "calc(3 * 0.05s)" }}>
          <h3 className="text-white text-lg font-semibold mb-4">最近活动</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-white/60 text-sm">{activity.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-gold-400 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Tab Bar */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 animate-fade-in-up"
          style={{ animationDelay: "calc(4 * 0.05s)" }}
        >
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
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id ? "text-gold-400 bg-gold-400/10" : "text-white/60 hover:text-white/80"
                }`}
              >
                <tab.icon size={20} />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
