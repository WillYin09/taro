export type Theme = "dark" | "light" | "auto"

export const themeTokens = {
  dark: {
    background: {
      primary: "linear-gradient(135deg, #0f0b1f 0%, #1a0b2e 50%, #16213e 100%)",
      secondary: "linear-gradient(145deg, rgba(26, 11, 46, 0.8) 0%, rgba(22, 33, 62, 0.6) 100%)",
      card: "rgba(26, 11, 46, 0.3)",
      overlay: "rgba(0, 0, 0, 0.8)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
      tertiary: "rgba(255, 255, 255, 0.6)",
      accent: "#D9B365",
    },
    border: {
      primary: "rgba(217, 179, 101, 0.3)",
      secondary: "rgba(255, 255, 255, 0.1)",
      accent: "#D9B365",
    },
    nebula: {
      start: "#0f0b1f",
      end: "#1a0b2e",
      particles: "rgba(235, 218, 174, 0.8)",
      glow: "rgba(217, 179, 101, 0.4)",
    },
  },
  light: {
    background: {
      primary: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
      secondary: "linear-gradient(145deg, rgba(248, 250, 252, 0.9) 0%, rgba(226, 232, 240, 0.8) 100%)",
      card: "rgba(255, 255, 255, 0.9)",
      overlay: "rgba(255, 255, 255, 0.95)",
    },
    text: {
      primary: "#1e293b",
      secondary: "#475569",
      tertiary: "#64748b",
      accent: "#b45309",
    },
    border: {
      primary: "rgba(180, 83, 9, 0.4)",
      secondary: "rgba(30, 41, 59, 0.2)",
      accent: "#b45309",
    },
    nebula: {
      start: "#f1f5f9",
      end: "#e2e8f0",
      particles: "rgba(180, 83, 9, 0.7)",
      glow: "rgba(180, 83, 9, 0.4)",
    },
  },
}

export const getSystemTheme = (): "dark" | "light" => {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export const getEffectiveTheme = (theme: Theme): "dark" | "light" => {
  if (theme === "auto") {
    return getSystemTheme()
  }
  return theme
}
