"use client"

import { useState, useEffect } from "react"
import { MapPin, ArrowLeft } from "lucide-react"
import { SecurityCheck } from "@/components/security-check"
import Link from "next/link"

export default function ProfilePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isContentRevealed, setIsContentRevealed] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleRevealContent = () => {
    setIsContentRevealed(true)
  }

  const socialLinks = [
    {
      name: "Discord",
      url: "https://discord.gg/danidema",
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
      name: "Instagram",
      url: "https://instagram.com/dani.dema_",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg",
    },
    {
      name: "GitHub",
      url: "https://github.com/danidemadd",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
    },
    {
      name: "Email",
      url: "mailto:support@danidema.xyz",
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
      name: "Shop",
      url: "https://shop.danidema.xyz",
      icon: "shopping-bag",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
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

      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/80 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Home</span>
      </Link>

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

      {isContentRevealed && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 text-white/80 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 animate-fade-in">
          <MapPin className="w-4 h-4" />
          <span>Profile</span>
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
                src="/cat2.jpg"
                alt="DaniDema Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl mx-auto"
              />
            </div>
          </div>

          <div className="mb-6 animate-fade-in flex flex-col items-center" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider pixel-font animate-sparkle">
              DANIDEMA
            </h1>
          </div>

          {/* Social Links */}
          <div
            className="flex flex-wrap justify-center gap-x-2 gap-y-3 mb-6 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {socialLinks.map((social) => (
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
          <div className="flex justify-center gap-x-2 gap-y-3 mb-8 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            {toolLinks.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110"
                title={tool.name}
              >
                {tool.icon === "shopping-bag" ? (
                  <svg
                    className="w-8 h-8 text-white transition-all duration-300 group-hover:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                ) : (
                  <img
                    src={tool.icon || "/placeholder.svg"}
                    alt={`${tool.name} icon`}
                    className="w-8 h-8 filter brightness-0 invert transition-all duration-300 group-hover:brightness-100 group-hover:invert-0"
                  />
                )}
              </a>
            ))}
          </div>

          <div
            className="flex justify-center gap-4 text-sm text-white/60 animate-fade-in"
            style={{ animationDelay: "1s" }}
          >
            <Link href="https://home.danidema.xyz/terms" target="_blank" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="https://home.danidema.xyz/policy"
              target="_blank"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
