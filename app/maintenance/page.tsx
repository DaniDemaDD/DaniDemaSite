export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8 text-8xl animate-spin" style={{ animationDuration: "2s" }}>
          ⚙️
        </div>
        <h1 className="text-5xl font-bold mb-4">Maintenance Mode</h1>
        <p className="text-xl text-white/70 mb-8">
          We're currently updating our systems to serve you better. We'll be back online shortly!
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://discord.gg/danidema"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
          >
            Join Discord
          </a>
          <a
            href="https://shop.danidema.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors"
          >
            Visit Shop
          </a>
        </div>
      </div>
    </div>
  )
}
