import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 border border-white/10 w-full max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4 pixel-font animate-sparkle text-red-400">404</h1>
        <h2 className="text-3xl font-bold mb-4 pixel-font">PAGE NOT FOUND</h2>
        <p className="text-white/70 mb-6">
          We could not find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        <Link href="/" passHref>
          <button className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/40 rounded-full text-white font-extrabold hover:bg-white/30 transition-all duration-300 btn-glow">
            Go to Homepage
          </button>
        </Link>
      </div>
    </div>
  )
}
