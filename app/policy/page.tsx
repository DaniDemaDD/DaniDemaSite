import Link from "next/link"

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-purple-400 hover:text-white mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 space-y-6 text-white/90">
          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">1. Information Collection</h2>
            <p>
              We collect information you provide directly to us, such as when you fill out a form, create an account, or
              contact us. This may include your name, email address, and other information you choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">2. Use of Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, communicate with you,
              and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">3. Information Sharing</h2>
            <p>
              We do not share your personal information with third parties except as necessary to provide our services
              or comply with legal requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">4. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. You can
              control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">5. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">6. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. Please contact us at
              support@danidema.xyz to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">7. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We encourage you to review this policy regularly to
              stay informed about how we protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">8. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or our privacy practices, please contact us at
              support@danidema.xyz.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
