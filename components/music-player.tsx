"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Placeholder for your music file
  // IMPORTANT: Replace this with your actual music file URL
  // Example: /music/background-track.mp3
  const musicSrc = "/placeholder.svg?height=1&width=1" // Placeholder, replace with actual MP3 URL

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5 // Default volume
      audioRef.current.loop = true // Loop the music
    }
  }, [])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setIsMuted(audioRef.current.muted)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 p-2 bg-black bg-opacity-70 rounded-lg shadow-lg border border-neon">
      <audio ref={audioRef} src={musicSrc} />
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlayPause}
        className="text-neon hover:bg-gray-800"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="text-neon hover:bg-gray-800"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  )
}
