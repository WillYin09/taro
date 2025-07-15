"use client"

import { useEffect, useState } from "react"
import { AudioSystem } from "@/lib/audio-system"

export function useAudio() {
  const [audioSystem] = useState(() => AudioSystem.getInstance())
  const [isMuted, setIsMuted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initAudio = async () => {
      setIsMuted(audioSystem.getMuted())
      await audioSystem.initialize()
      setIsInitialized(true)
    }

    // 用户交互后初始化音频
    const handleUserInteraction = () => {
      initAudio()
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [audioSystem])

  const playSound = (name: string, volume?: number) => {
    audioSystem.playSound(name, volume)
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    audioSystem.setMuted(newMuted)
  }

  const startAmbient = () => {
    if (isInitialized) {
      audioSystem.startAmbientMusic()
    }
  }

  return {
    playSound,
    toggleMute,
    startAmbient,
    isMuted,
    isInitialized,
  }
}
