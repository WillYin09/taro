export class AudioSystem {
  private static instance: AudioSystem
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private isMuted = false
  private isInitialized = false

  private constructor() {}

  static getInstance(): AudioSystem {
    if (!AudioSystem.instance) {
      AudioSystem.instance = new AudioSystem()
    }
    return AudioSystem.instance
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      await this.loadSounds()
      this.isInitialized = true
    } catch (error) {
      console.warn("Audio initialization failed:", error)
    }
  }

  private async loadSounds() {
    const soundFiles = {
      // 使用占位音频URL，实际项目中应替换为真实音频文件
      ambient: "/placeholder-audio/ambient-mystical.mp3",
      shuffle: "/placeholder-audio/card-shuffle.mp3",
      cardFlip: "/placeholder-audio/card-flip.mp3",
      complete: "/placeholder-audio/ritual-complete.mp3",
      hover: "/placeholder-audio/ui-hover.mp3",
      click: "/placeholder-audio/ui-click.mp3",
    }

    for (const [name, url] of Object.entries(soundFiles)) {
      try {
        // 创建合成音效作为占位
        const buffer = this.createSyntheticSound(name)
        this.sounds.set(name, buffer)
      } catch (error) {
        console.warn(`Failed to load sound: ${name}`, error)
      }
    }
  }

  private createSyntheticSound(type: string): AudioBuffer {
    if (!this.audioContext) throw new Error("Audio context not initialized")

    const sampleRate = this.audioContext.sampleRate
    let duration = 1
    let frequency = 440

    switch (type) {
      case "ambient":
        duration = 30
        frequency = 220
        break
      case "shuffle":
        duration = 0.3
        frequency = 150
        break
      case "cardFlip":
        duration = 0.5
        frequency = 330
        break
      case "complete":
        duration = 2
        frequency = 528
        break
      case "hover":
        duration = 0.1
        frequency = 800
        break
      case "click":
        duration = 0.1
        frequency = 1000
        break
    }

    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let value = 0

      switch (type) {
        case "ambient":
          // 神秘的环境音
          value = Math.sin(2 * Math.PI * frequency * t) * 0.1 * Math.sin(t * 0.5)
          break
        case "shuffle":
          // 洗牌声效
          value = (Math.random() - 0.5) * 0.3 * Math.exp(-t * 5)
          break
        case "cardFlip":
          // 翻牌声效
          value = Math.sin(2 * Math.PI * frequency * t) * 0.2 * Math.exp(-t * 3)
          break
        case "complete":
          // 完成音效 - 和谐的和弦
          value =
            (Math.sin(2 * Math.PI * frequency * t) +
              Math.sin(2 * Math.PI * (frequency * 1.25) * t) +
              Math.sin(2 * Math.PI * (frequency * 1.5) * t)) *
            0.1 *
            Math.exp(-t * 0.5)
          break
        case "hover":
        case "click":
          // UI音效
          value = Math.sin(2 * Math.PI * frequency * t) * 0.1 * Math.exp(-t * 10)
          break
      }

      data[i] = value
    }

    return buffer
  }

  async playSound(name: string, volume = 1) {
    if (this.isMuted || !this.audioContext || !this.isInitialized) return

    const buffer = this.sounds.get(name)
    if (!buffer) return

    try {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = buffer
      gainNode.gain.value = volume * 0.3 // 降低整体音量

      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      source.start()
    } catch (error) {
      console.warn(`Failed to play sound: ${name}`, error)
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted
    localStorage.setItem("tarot-audio-muted", muted.toString())
  }

  getMuted(): boolean {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tarot-audio-muted")
      return stored ? stored === "true" : false
    }
    return false
  }

  // 启动环境音乐循环
  async startAmbientMusic() {
    if (this.isMuted) return

    const playAmbient = async () => {
      await this.playSound("ambient", 0.2)
      setTimeout(playAmbient, 30000) // 30秒循环
    }

    playAmbient()
  }
}
