"use client"

import { useTheme } from "@/hooks/use-theme"
import { Sun, Moon, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, effectiveTheme, setTheme } = useTheme()

  const themes = [
    { value: "light" as const, icon: Sun, label: "明亮" },
    { value: "dark" as const, icon: Moon, label: "暗黑" },
    { value: "auto" as const, icon: Monitor, label: "自动" },
  ]

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "p-2 rounded-full transition-all duration-300 hover:scale-110",
            theme === value
              ? effectiveTheme === "dark"
                ? "bg-gold-400 text-black shadow-glow"
                : "bg-amber-600 text-white shadow-lg"
              : effectiveTheme === "dark"
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-black/10 text-black hover:bg-black/20",
          )}
          title={label}
        >
          <Icon size={18} />
        </button>
      ))}
      {showLabel && (
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            effectiveTheme === "dark" ? "text-white/70" : "text-black/70",
          )}
        >
          {themes.find((t) => t.value === theme)?.label}
        </span>
      )}
    </div>
  )
}
