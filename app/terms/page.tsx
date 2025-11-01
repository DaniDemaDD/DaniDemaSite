import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-purple-400 hover:text-white mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 space-y-6 text-white/90">
          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this
              agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on
              DaniDema's website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">3. Disclaimer</h2>
            <p>
              The materials on DaniDema's website are provided on an 'as is' basis. DaniDema makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">4. Limitations</h2>
            <p>
              In no event shall DaniDema or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on DaniDema's website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on DaniDema's website could include technical, typographical, or photographic
              errors. DaniDema does not warrant that any of the materials on its website are accurate, complete, or
              current.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">6. Links</h2>
            <p>
              DaniDema has not reviewed all of the sites linked to its website and is not responsible for the contents
              of any such linked site. The inclusion of any link does not imply endorsement by DaniDema of the site. Use
              of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">7. Modifications</h2>
            <p>
              DaniDema may revise these terms of service for its website at any time without notice. By using this
              website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the United States,
              and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
