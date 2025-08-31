"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Secret1Page() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlayer, setShowPlayer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showFallback, setShowFallback] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Try direct download first, fallback to Google Drive view
  const audioUrl = "https://drive.google.com/uc?export=download&id=1yOhj0Cx_IY-j6LkLFL-7-IHftwtIz7us"
  const fallbackUrl = "https://drive.google.com/file/d/1yOhj0Cx_IY-j6LkLFL-7-IHftwtIz7us/view"

  useEffect(() => {
    const timer = setTimeout(() => setShowPlayer(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedData = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      setError("Il file audio non può essere riprodotto direttamente da Google Drive")
      setIsLoading(false)
      setShowFallback(true)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    audio.addEventListener("loadeddata", handleLoadedData)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.addEventListener("canplay", handleCanPlay)

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Errore nella riproduzione:", error)
      setError("Impossibile riprodurre l'audio")
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)

    const audio = audioRef.current
    if (audio) {
      audio.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = Number.parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const skipBackward = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 10)
    }
  }

  const skipForward = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = Math.min(duration, audio.currentTime + 10)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20" />

      {/* Back Button */}
      <Link href="/" className="fixed top-6 left-6 z-20">
        <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </Link>

      <div
        className={`relative z-10 transition-all duration-1000 transform ${
          showPlayer ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl max-w-lg w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 pixel-font animate-sparkle">🎵 SECRET TRACK</h1>
            <p className="text-gray-300 text-sm">You discovered the hidden music player!</p>
          </div>

          {/* Audio Element */}
          <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />

          {/* Album Art Placeholder */}
          <div className="mb-6 flex justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-2xl">
              <div className="text-6xl">🎶</div>
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Secret Song</h2>
            <p className="text-gray-400">DaniDema Collection</p>
          </div>

          {/* Error Message & Fallback */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm mb-4 text-center">
              {error}
              {showFallback && (
                <div className="mt-4">
                  <a
                    href={fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full text-white font-bold transition-all transform hover:scale-105"
                  >
                    🎵 Ascolta su Google Drive
                  </a>
                  <p className="text-xs mt-2 text-gray-400">Il file si aprirà in una nuova scheda</p>
                </div>
              )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              disabled={isLoading || !!error}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <button
              onClick={skipBackward}
              className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors disabled:opacity-50"
              disabled={isLoading || !!error}
            >
              <SkipBack className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={togglePlay}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full p-4 transition-all transform hover:scale-105 disabled:opacity-50"
              disabled={isLoading || !!error}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>

            <button
              onClick={skipForward}
              className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors disabled:opacity-50"
              disabled={isLoading || !!error}
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <button onClick={toggleMute} className="text-white hover:text-gray-300 transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Loading State */}
          {isLoading && !error && (
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">Caricamento audio...</p>
            </div>
          )}
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #a855f7, #ec4899);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #a855f7, #ec4899);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}
