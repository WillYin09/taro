"use client"

import { useState } from "react"
import { designTokens } from "@/lib/design-tokens"
import { ArrowLeft, Search, Plus, Heart, MessageCircle, Share2, Star, Users, User } from "lucide-react"
import { PageTransition } from "@/components/ui/page-transition"
import { useNavigation } from "@/hooks/use-navigation"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("community")
  const { navigateWithTransition, isTransitioning } = useNavigation()

  const posts = [
    {
      id: 1,
      user: "塔罗师小月",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "2小时前",
      content: "今天抽到了愚者牌，感觉是新开始的信号。有没有同样经历的朋友？",
      image: "/placeholder.svg?height=200&width=300",
      likes: 24,
      comments: 8,
      tags: ["愚者", "新开始", "分享"],
    },
    {
      id: 2,
      user: "星空占卜师",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "5小时前",
      content: "分享一个恋人牌的深度解读，关于选择和内心的声音...",
      likes: 56,
      comments: 12,
      tags: ["恋人", "选择", "解读"],
    },
    {
      id: 3,
      user: "神秘学爱好者",
      avatar: "/placeholder.svg?height=40&width=40",
      time: "1天前",
      content: "凯尔特十字牌阵的完整解读分享，希望对大家有帮助！",
      image: "/placeholder.svg?height=200&width=300",
      likes: 89,
      comments: 23,
      tags: ["凯尔特十字", "牌阵", "教学"],
    },
  ]

  return (
    <PageTransition>
      <div
        className="min-h-screen animate-fade-in-up"
        style={{
          background: designTokens.colors.gradient.primary,
        }}
      >
        {/* Header */}
        <div className="px-6 pt-12 pb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigateWithTransition("/home")} className="p-2 rounded-full bg-white/10 text-white">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: designTokens.fonts.serif }}>
              塔罗社区
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full bg-white/10 text-white">
                <Search size={20} />
              </button>
              <button className="p-2 rounded-full bg-gold-400 text-black">
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="px-6 pb-24 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl p-4 border border-purple-400/30"
              >
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-3">
                  <img src={post.avatar || "/placeholder.svg"} alt={post.user} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">{post.user}</h3>
                    <p className="text-white/60 text-xs">{post.time}</p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-white/90 mb-3 leading-relaxed">{post.content}</p>

                {/* Image */}
                {post.image && (
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt="Post image"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gold-400/20 text-gold-400 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-white/60 hover:text-red-400">
                      <Heart size={18} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-white/60 hover:text-blue-400">
                      <MessageCircle size={18} />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                  </div>
                  <button className="text-white/60 hover:text-white">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Tab Bar */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
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
