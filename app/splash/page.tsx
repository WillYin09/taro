"use client"

import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { designTokens } from "@/lib/design-tokens"
import { MysticalButton } from "@/components/ui/mystical-button"

export default function SplashScreen() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const onboardingSteps = [
    {
      title: "欢迎来到神秘塔罗世界",
      subtitle: "探索内心深处的智慧与指引",
      description: "通过古老的塔罗牌艺术，发现生活中的答案与方向",
      image: "/placeholder.svg?height=300&width=200",
    },
    {
      title: "专业的牌阵解读",
      subtitle: "多种经典牌阵任你选择",
      description: "从简单的单张指引到复杂的凯尔特十字，满足不同需求",
      image: "/placeholder.svg?height=300&width=200",
    },
    {
      title: "AI智能解读",
      subtitle: "深度个性化占卜体验",
      description: "结合传统智慧与现代科技，为你提供精准的人生指导",
      image: "/placeholder.svg?height=300&width=200",
    },
  ]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // 最后一步，跳转到首页
      window.location.href = "/home"
    }
  }

  const handleSkip = () => {
    // Navigate to main app
    window.location.href = "/home"
  }

  if (currentStep === -1) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: designTokens.colors.gradient.primary,
        }}
      >
        {/* Animated Stars Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
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

        <div
          className={cn(
            "text-center z-10 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: designTokens.fonts.serif }}>
            神秘塔罗
          </h1>
          <p className="text-gold-400 text-lg mb-8">"每一张牌都是一扇通往内心的门"</p>
          <div className="w-16 h-16 mx-auto border-2 border-gold-400 rounded-full flex items-center justify-center mb-8">
            <div className="w-8 h-8 bg-gold-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const step = onboardingSteps[currentStep]

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: designTokens.colors.gradient.primary,
      }}
    >
      {/* Background Stars */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold-400/60 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Skip Button */}
      <div className="absolute top-12 right-6 z-20">
        <button onClick={handleSkip} className="text-white/70 hover:text-white transition-colors">
          跳过
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 z-10">
        <div className="text-center max-w-sm">
          <div className="mb-8">
            <img
              src={step.image || "/placeholder.svg"}
              alt={step.title}
              className="w-48 h-64 mx-auto rounded-lg shadow-2xl"
            />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: designTokens.fonts.serif }}>
            {step.title}
          </h2>

          <h3 className="text-lg text-gold-400 mb-4">{step.subtitle}</h3>

          <p className="text-white/80 leading-relaxed mb-8">{step.description}</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="pb-12 px-8 z-10">
        {/* Progress Dots */}
        <div className="flex justify-center mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full mx-1 transition-all duration-300",
                index === currentStep ? "bg-gold-400 w-6" : "bg-white/30",
              )}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <MysticalButton onClick={handleNext} className="w-full" size="lg">
            {currentStep === onboardingSteps.length - 1 ? "开始探索" : "下一步"}
          </MysticalButton>

          {currentStep > 0 && (
            <MysticalButton onClick={() => setCurrentStep(currentStep - 1)} variant="ghost" className="w-full">
              上一步
            </MysticalButton>
          )}
        </div>
      </div>
    </div>
  )
}
