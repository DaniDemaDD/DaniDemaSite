import Link from "next/link"
import { Github, Twitter, Youtube, Instagram, Linkedin } from "lucide-react"

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      <Link
        href="https://github.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon hover:text-neon-blue transition-colors duration-300 animate-pulse-neon"
        aria-label="GitHub profile"
      >
        <Github className="h-12 w-12" />
      </Link>
      <Link
        href="https://twitter.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon hover:text-neon-blue transition-colors duration-300 animate-pulse-neon"
        aria-label="Twitter profile"
      >
        <Twitter className="h-12 w-12" />
      </Link>
      <Link
        href="https://youtube.com/yourchannel"
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon hover:text-neon-blue transition-colors duration-300 animate-pulse-neon"
        aria-label="YouTube channel"
      >
        <Youtube className="h-12 w-12" />
      </Link>
      <Link
        href="https://instagram.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon hover:text-neon-blue transition-colors duration-300 animate-pulse-neon"
        aria-label="Instagram profile"
      >
        <Instagram className="h-12 w-12" />
      </Link>
      <Link
        href="https://linkedin.com/in/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon hover:text-neon-blue transition-colors duration-300 animate-pulse-neon"
        aria-label="LinkedIn profile"
      >
        <Linkedin className="h-12 w-12" />
      </Link>
    </div>
  )
}
