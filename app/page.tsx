"use client"

import { useEffect, useState } from "react"
import { designTokens } from "@/lib/design-tokens"

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/splash"
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: designTokens.colors.gradient.primary,
        }}
      >
        {/* Animated Stars Background */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gold-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center z-10">
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <div className="absolute inset-0 border-4 border-gold-400 rounded-full animate-spin" />
            <div className="absolute inset-2 border-2 border-purple-400 rounded-full animate-spin animate-reverse" />
            <div className="absolute inset-4 w-16 h-16 bg-gold-400 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-purple-900 rounded-full animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: designTokens.fonts.serif }}>
            神秘塔罗
          </h1>
          <p className="text-gold-400 text-lg animate-pulse">正在连接宇宙的智慧...</p>
        </div>
      </div>
    )
  }

  return null
}
