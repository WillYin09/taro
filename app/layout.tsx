import type React from "react"
import type { Metadata } from "next"
import { Cinzel } from "next/font/google"
import { ThemeProvider } from "@/hooks/use-theme"
import "./globals.css"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "神秘塔罗",
  description: "探索内心深处的智慧与指引",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cinzel.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
