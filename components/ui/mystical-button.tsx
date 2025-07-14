"use client"

import { cn } from "@/lib/utils"
import { designTokens } from "@/lib/design-tokens"
import type { ReactNode } from "react"

interface MysticalButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function MysticalButton({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled = false,
}: MysticalButtonProps) {
  const baseClasses = "relative overflow-hidden transition-all duration-300 font-medium rounded-xl"

  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25",
    secondary: "border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black",
    ghost: "text-white hover:bg-white/10",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: designTokens.fonts.sans,
      }}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
    </button>
  )
}
