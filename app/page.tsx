"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, MapPin, SkipForward, BadgeCheck, ShoppingBag } from "lucide-react"
import { SecurityCheck } from "@/components/security-check"

export default function HomePage() {
  const [isMuted, setIsMuted] = useState(true)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isContentRevealed, setIsContentRevealed] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const tracks = ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SpotiDownloader.com%20-%20Sonne%20-%20Best%20Part%20-%20Six%20Dior-RcTYqTR9QLd2dnIvVCndrEo6qDuiPp.mp3", "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SpotiDownloader.com%20-%20Sonne%20-%20Best%20Part%20-%20Six%20Dior-RcTYqTR9QLd2dnIvVCndrEo6qDuiPp.mp3"]

  useEffect(() => {
    setIsLoaded(true)
    if (audioRef.current) {
      audioRef.current.volume = 0.2
    }
  }, [])

  const handleRevealContent = () => {
    setIsContentRevealed(true)
    if (audioRef.current) {
      audioRef.current.play().catch(console.error)
      setIsMuted(false)
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error)
        setIsMuted(false)
      } else {
        audioRef.current.pause()
        setIsMuted(true)
      }
    }
  }

  const nextTrack = () => {
    const next = (currentTrack + 1) % tracks.length
    setCurrentTrack(next)
    if (audioRef.current && !isMuted) {
      audioRef.current.load()
      audioRef.current.play().catch(console.error)
    }
  }

  const socialLinks = [
    {
      name: "Discord",
      url: "https://discord.gg/dani.dema",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@yessact",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg",
    },
    {
      name: "Twitch",
      url: "https://twitch.tv/yessact",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitch.svg",
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/user/dani11ele",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spotify.svg",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/dani.dema_",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg",
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/+17786015614",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg",
    },
    {
      name: "Ko-fi",
      url: "https://ko-fi.com/danidema",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/kofi.svg",
    },
    {
      name: "GitHub",
      url: "https://github.com/DaniDemaDD",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
    },
    {
      name: "Patreon",
      url: "https://patreon.com/DaniDema",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/patreon.svg",
    },
    {
      name: "Email",
      url: "mailto:dani@danidema.xyz",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg",
    },
  ]

  const toolLinks = [
    {
      name: "Roblox 1",
      url: "https://roblox.com/users/1721899145/profile",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/roblox.svg",
    },
    {
      name: "Roblox 2",
      url: "https://www.roblox.com/users/2506957261/profile",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/roblox.svg",
    },
    {
      name: "Shop Link",
      url: "https://www.roblox.com/catalog/125977396777204/cat",
      icon: "shopping-bag",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Security Check Component */}
      <SecurityCheck />

      {/* Background */}
      <div
        className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
          isContentRevealed ? "filter-none" : "filter blur-lg"
        }`}
        style={{
          backgroundImage: `url('/background-forest.jpeg')`,
        }}
      />

      {/* Background Music */}
      <audio ref={audioRef} loop preload="auto" className="hidden">
        <source src={tracks[currentTrack]} type="audio/mpeg" />
      </audio>

      {/* Initial Overlay */}
      {!isContentRevealed && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-lg text-center transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleRevealContent}
          style={{ cursor: "pointer" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider pixel-font mb-4 animate-pulse-glow">
            WELCOME
          </h1>
          <p
            className="text-lg md:text-xl text-white/80 font-bold tracking-wide animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            CLICK TO REVEAL ALL MY SOCIALS
          </p>
        </div>
      )}

      {/* USA Location */}
      {isContentRevealed && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 text-white/80 text-sm animate-fade-in">
          <MapPin className="w-4 h-4" />
          <span>USA</span>
        </div>
      )}

      {/* Music Controls */}
      {isContentRevealed && (
        <div className="fixed top-6 left-6 z-50 flex gap-2 animate-fade-in">
          <button
            onClick={toggleMusic}
            className={`p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 ${
              !isMuted ? "music-pulse" : ""
            }`}
            title={isMuted ? "Play Music" : "Pause Music"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
          <button
            onClick={nextTrack}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Main Content */}
      {isContentRevealed && (
        <div
          className={`relative z-10 text-center bg-black/30 backdrop-blur-md rounded-xl p-8 border border-white/10 transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Profile Image */}
          <div className="mb-6 animate-fade-in">
            <div className="relative inline-block">
              <img
                src="/profile.jpg"
                alt="DaniDema Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl mx-auto"
              />
            </div>
          </div>

          {/* Name with pixel font style */}
          <div className="mb-2 animate-fade-in flex flex-col items-center" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider pixel-font animate-sparkle">
              DANIDEMA
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl text-white" title="Premium">
                💎
              </span>
              <BadgeCheck className="w-6 h-6 text-blue-400" title="Verified" />
            </div>
          </div>

          {/* Social Links */}
          <div
            className="flex flex-wrap justify-center gap-x-2 gap-y-3 mb-6 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110"
                title={social.name}
              >
                <img
                  src={social.icon || "/placeholder.svg"}
                  alt={`${social.name} icon`}
                  className="w-8 h-8 filter brightness-0 invert transition-all duration-300 group-hover:brightness-100 group-hover:invert-0"
                />
              </a>
            ))}
          </div>

          {/* Tool Links */}
          <div className="flex justify-center gap-x-2 gap-y-3 mb-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            {toolLinks.map((tool, index) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110"
                title={tool.name}
              >
                {tool.icon === "shopping-bag" ? (
                  <ShoppingBag className="w-8 h-8 text-white transition-all duration-300 group-hover:text-gray-300" />
                ) : tool.icon.startsWith("http") ? (
                  <img
                    src={tool.icon || "/placeholder.svg"}
                    alt={`${tool.name} icon`}
                    className="w-8 h-8 filter brightness-0 invert transition-all duration-300 group-hover:brightness-100 group-hover:invert-0"
                  />
                ) : (
                  <span className="text-xl">{tool.icon}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
