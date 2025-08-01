import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MusicPlayer from "@/components/music-player"
import ImageSlider from "@/components/image-slider"
import SocialLinks from "@/components/social-links"

export default function Home() {
  const sliderImages = [
    { src: "/placeholder.svg?height=720&width=1280", alt: "Futuristic City" },
    { src: "/placeholder.svg?height=720&width=1280", alt: "Cyberpunk Street" },
    { src: "/placeholder.svg?height=720&width=1280", alt: "Abstract Neon Lines" },
  ]

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background animation overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-70 animate-background-pan"></div>
      <div className="absolute inset-0 z-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-10"></div>

      {/* Music Player */}
      <MusicPlayer />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center animate-fade-in">
        <h1
          className="text-6xl md:text-8xl font-orbitron font-bold mb-6 neon-text"
          style={{ "--neon": "var(--neon-blue)" } as React.CSSProperties}
        >
          DANIDEMA
        </h1>
        <p className="text-xl md:text-3xl max-w-3xl mx-auto mb-10 font-rajdhani text-gray-300">
          Welcome to my digital realm. Explore my projects, connect with me, and dive into the future.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Button
            asChild
            size="lg"
            className="bg-transparent border-2 border-neon text-neon hover:bg-neon hover:text-black transition-all duration-300 font-orbitron text-lg shadow-neon-glow"
            style={{ "--neon": "var(--neon-green)" } as React.CSSProperties}
          >
            <Link href="#projects">My Projects</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-transparent border-2 border-neon text-neon hover:bg-neon hover:text-black transition-all duration-300 font-orbitron text-lg shadow-neon-glow"
            style={{ "--neon": "var(--neon-purple)" } as React.CSSProperties}
          >
            <Link href="#contact">Contact Me</Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-4 bg-black bg-opacity-80">
        <div className="container mx-auto text-center">
          <h2
            className="text-4xl font-orbitron font-bold mb-12 neon-text"
            style={{ "--neon": "var(--neon-pink)" } as React.CSSProperties}
          >
            ABOUT ME
          </h2>
          <div className="max-w-4xl mx-auto text-lg md:text-xl font-rajdhani leading-relaxed text-gray-300">
            <p className="mb-6">
              I am a passionate developer and creator, constantly exploring the frontiers of technology. My journey
              involves crafting innovative software solutions, designing immersive digital experiences, and pushing the
              boundaries of what's possible.
            </p>
            <p>
              With a keen eye for detail and a drive for excellence, I transform complex ideas into functional and
              elegant applications. This site is a glimpse into my world, showcasing my skills, projects, and the tools
              I wield to bring visions to life.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section with Slider */}
      <section id="projects" className="relative z-10 py-20 px-4 bg-black bg-opacity-90">
        <div className="container mx-auto text-center">
          <h2
            className="text-4xl font-orbitron font-bold mb-12 neon-text"
            style={{ "--neon": "var(--neon-green)" } as React.CSSProperties}
          >
            MY PROJECTS
          </h2>
          <ImageSlider images={sliderImages} />
          <p className="mt-10 text-lg font-rajdhani text-gray-400">
            Explore a selection of my recent works and creative endeavors.
          </p>
        </div>
      </section>

      {/* Social Links Section */}
      <section id="contact" className="relative z-10 py-20 px-4 bg-black bg-opacity-80">
        <div className="container mx-auto text-center">
          <h2
            className="text-4xl font-orbitron font-bold mb-12 neon-text"
            style={{ "--neon": "var(--neon-purple)" } as React.CSSProperties}
          >
            CONNECT WITH ME
          </h2>
          <SocialLinks />
          <p className="mt-10 text-lg font-rajdhani text-gray-400">
            Feel free to reach out through any of these platforms.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 text-center bg-black bg-opacity-95 border-t border-gray-800">
        <p className="text-gray-500 font-rajdhani text-sm">
          © {new Date().getFullYear()} DANIDEMA. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
