"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

export default function Secret1Page() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)

  useEffect(() => {
    // Animate in the player after component mounts
    const timer = setTimeout(() => setShowPlayer(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20" />

      <div
        className={`relative z-10 transition-all duration-1000 transform ${
          showPlayer ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">🎵 Secret Track</h1>
            <p className="text-gray-300 text-sm">You found the hidden music player!</p>
          </div>

          {/* Spotify Embed */}
          <div className="mb-6 rounded-lg overflow-hidden">
            <iframe
              src="https://open.spotify.com/embed/track/3V7ZGSYKKCqZEeKYOiulHS?utm_source=generator&theme=0"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            />
          </div>

          {/* Custom Controls (decorative) */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button onClick={togglePlay} className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
            </button>

            <button onClick={toggleMute} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>
          </div>

          {/* Progress Bar (decorative) */}
          <div className="w-full bg-white/20 rounded-full h-1 mb-4">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-1 rounded-full w-1/3 transition-all duration-300" />
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-xs">Use the Spotify player above for full controls</p>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  )
}
