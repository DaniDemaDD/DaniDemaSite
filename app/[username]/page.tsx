import { getSiteData } from "@/actions/site"
import { redirect } from "next/navigation"

interface SiteData {
  username: string
  profile_image_url: string
  background_image_url: string
  music_url: string
  music_volume: number
  social_links: Array<{ name: string; url: string; icon: string }>
  tool_links: Array<{ name: string; url: string; icon: string }>
  is_banned: boolean // Mantenuto per compatibilità, ma sarà sempre false
}

export default async function CustomUserPage({ params }: { params: { username: string } }) {
  const username = params.username

  // Fetch site data
  const siteData: SiteData | null = await getSiteData(username)

  // If site data is not found, redirect to the main page
  if (!siteData) {
    redirect("/") // Redirect to homepage if the custom URL path does not exist
  }

  // La logica di ban è stata rimossa qui, poiché non c'è più una tabella users per gestirla.
  // Se la funzionalità di ban è ancora desiderata, dovrà essere implementata diversamente,
  // ad esempio aggiungendo una colonna 'is_banned' direttamente alla tabella 'sites'.
  // Per ora, non ci sarà un messaggio di "URL BANNED" da questa pagina.

  // If site data is found and user is not banned, render the custom site
  return (
    <div
      className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center bg-cover bg-center animate-background-pan"
      style={{ backgroundImage: `url(${siteData.background_image_url || "/placeholder.svg"})` }} // Immagine di background dal database
    >
      {/* Background Music */}
      {siteData.music_url && (
        <audio autoPlay loop controls={false} volume={siteData.music_volume} className="hidden">
          <source src={siteData.music_url} type="audio/mpeg" />
        </audio>
      )}

      {/* Main Content - Wrapped in blurred box */}
      <div className="relative z-10 text-center bg-black/30 backdrop-blur-md rounded-xl p-8 border border-white/10 transition-all duration-1000 opacity-100 translate-y-0">
        {/* Profile Image */}
        <div className="mb-6">
          <div className="relative inline-block">
            <img
              src={siteData.profile_image_url || "/placeholder.svg"}
              alt={`${siteData.username} Profile`}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl mx-auto"
            />
          </div>
        </div>

        {/* Name with pixel font style */}
        <div className="mb-2 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider pixel-font animate-sparkle">
            {siteData.username}
          </h1>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 mb-6 max-w-2xl mx-auto">
          {siteData.social_links &&
            siteData.social_links.map((social, index) => (
              <a
                key={index}
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
        <div className="flex justify-center gap-x-2 gap-y-3 mb-0">
          {siteData.tool_links &&
            siteData.tool_links.map((tool, index) => (
              <a
                key={index}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110"
                title={tool.name}
              >
                {tool.icon.startsWith("http") ? (
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
    </div>
  )
}
