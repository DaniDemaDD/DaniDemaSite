import AISection from "@/components/ai-section"
import SoftwareSection from "@/components/software-section"
import SocialLinksSection from "@/components/social-links-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">DaniDema</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Connect with me on social media, explore my software solutions, and chat with my AI assistant.
          </p>
        </div>
      </section>

      {/* Social Links Section - Now First */}
      <section id="social" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Connect With Me</h2>
          <SocialLinksSection />
        </div>
      </section>

      {/* Software Section */}
      <section id="software" className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">My Software</h2>
          <SoftwareSection />
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">AI Assistant</h2>
          <AISection />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} DaniDema. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
