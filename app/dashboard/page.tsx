import Link from "next/link"

export default function DashboardPage({ searchParams }: { searchParams?: { username?: string; role?: string } }) {
  const username = searchParams?.username
  const role = searchParams?.role

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 border border-white/10 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4 pixel-font animate-sparkle">
          Welcome to your Dashboard{username ? `, ${username}` : ""}!
        </h1>
        {role === "admin" && <p className="text-lg text-blue-400 mb-6">You are logged in as an Administrator.</p>}
        <p className="text-white/70 mb-8">
          From here, you will be able to manage your site's content, including adding and customizing your social links,
          profile picture, background, and music.
        </p>
        <div className="flex flex-col gap-4">
          {/* Placeholder for future management links */}
          <Link href={`/${username || "your-site"}`} passHref>
            <button className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/40 rounded-full text-white font-extrabold hover:bg-white/30 transition-all duration-300 btn-glow">
              View My Site
            </button>
          </Link>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-bold hover:bg-white/20 transition-all duration-300">
            Manage Links (Coming Soon)
          </button>
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-bold hover:bg-white/20 transition-all duration-300">
            Update Media (Coming Soon)
          </button>
          {role === "admin" && (
            <Link href="/admin/users" passHref>
              <button className="px-6 py-3 bg-red-600/20 backdrop-blur-sm border border-red-600/40 rounded-full text-white font-extrabold hover:bg-red-600/30 transition-all duration-300 btn-glow">
                Admin: Manage Users (Coming Soon)
              </button>
            </Link>
          )}
        </div>
        <p className="mt-8 text-sm text-white/70">
          <Link href="/" className="text-blue-400 hover:underline">
            Go back to the main page
          </Link>
        </p>
      </div>
    </div>
  )
}
