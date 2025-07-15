import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "mystical-dark": "#0f0b1f",
        "mystical-purple": "#1a0b2e",
        "mystical-indigo": "#16213e",
        gold: {
          400: "#d4af37",
          500: "#b8941f",
        },
        silver: {
          400: "#c0c0c0",
          500: "#a8a8a8",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        vintage: {
          paper: "#F1E8D6",
          ink: "#2F2C29",
          red: "#B74646",
          blue: "#4E7AA2",
          gold: "#C9A44E",
          back: "#322E29",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Times New Roman", "serif"],
        sans: ["Inter", "Helvetica Neue", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(212, 175, 55, 0.3)",
        "glow-lg": "0 0 40px rgba(212, 175, 55, 0.4)",
        "inner-glow": "inset 0 0 20px rgba(212, 175, 55, 0.2)",
        "card-gold": "0 0 4px 0 #d9b365, 0 0 12px 2px rgba(217,179,101,0.5)",
        "card-vintage": "0 0 6px 0 #C9A44E, 0 0 16px 4px rgba(201,164,78,.45)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
