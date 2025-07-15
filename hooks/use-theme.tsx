"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Theme } from "@/lib/theme-system"
import { getEffectiveTheme } from "@/lib/theme-system"

interface ThemeContextType {
  theme: Theme
  effectiveTheme: "dark" | "light"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark") // 默认暗黑模式
  const [effectiveTheme, setEffectiveTheme] = useState<"dark" | "light">("dark")

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem("tarot-theme") as Theme
    if (savedTheme && ["dark", "light", "auto"].includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      const newEffectiveTheme = getEffectiveTheme(theme)
      setEffectiveTheme(newEffectiveTheme)
      updateDocumentTheme(newEffectiveTheme)
    }

    handleChange() // 初始设置
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  // 更新文档主题
  const updateDocumentTheme = (effectiveTheme: "dark" | "light") => {
    document.documentElement.setAttribute("data-theme", effectiveTheme)
    document.documentElement.classList.toggle("dark", effectiveTheme === "dark")
    document.documentElement.classList.toggle("light", effectiveTheme === "light")
  }

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("tarot-theme", newTheme)
    const newEffectiveTheme = getEffectiveTheme(newTheme)
    setEffectiveTheme(newEffectiveTheme)
    updateDocumentTheme(newEffectiveTheme)
  }

  const toggleTheme = () => {
    const newTheme = effectiveTheme === "dark" ? "light" : "dark"
    handleSetTheme(newTheme)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        effectiveTheme,
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
