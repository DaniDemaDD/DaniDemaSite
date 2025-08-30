"use client"

import Link from "next/link"
import { Bot, Plus, Shield, Users, Zap } from "lucide-react"
import { SecurityCheck } from "@/components/security-check"

export default function SikeGGPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Security Check Component */}
      <SecurityCheck />

      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold">sike.gg</h1>
          </div>
          <Link href="/" className="text-purple-300 hover:text-white transition-colors duration-200">
            ← Back to DaniDema
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Bot Logo/Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-600 rounded-full mb-6">
              <Bot className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              sike.gg
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8">Discord Moderation Bot</p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Moderation Tools</h3>
              <p className="text-purple-200 text-sm">Ban, warn, kick, mute and other essential moderation commands</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Simple & Fast</h3>
              <p className="text-purple-200 text-sm">Easy to use commands with quick response times</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Transparent</h3>
              <p className="text-purple-200 text-sm">All actions are visible and logged transparently</p>
            </div>
          </div>

          {/* Add Bot Button */}
          <div className="mb-16">
            <a
              href="https://discord.com/oauth2/authorize?client_id=1403453249280802911"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <Plus className="w-6 h-6" />
              Add sike.gg to Your Server
            </a>
            <p className="text-purple-300 text-sm mt-4">Click to invite sike.gg to your Discord server</p>
          </div>

          {/* Terms of Service Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-left max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-center">
              <Shield className="w-8 h-8 text-purple-400" />
              Terms of Service & Privacy Policy
            </h2>

            <div className="text-purple-200 space-y-6 text-sm leading-relaxed">
              <div className="text-center mb-8">
                <p className="text-lg font-semibold text-purple-300">for the Discord bot sike.gg</p>
                <p className="text-purple-400">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* 1.0 Definitions */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">1.0 – Definizioni</h3>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong>Bot / Servizio:</strong> sike.gg, bot di moderazione per server Discord.
                  </li>
                  <li>
                    <strong>Utente:</strong> chiunque utilizzi il bot (sia amministratori che membri).
                  </li>
                  <li>
                    <strong>Proprietario:</strong> dani.dema, sviluppatore e gestore del bot.
                  </li>
                  <li>
                    <strong>Server:</strong> comunità Discord in cui il bot viene aggiunto.
                  </li>
                </ul>
              </div>

              {/* 2.0 Acceptance */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">2.0 – Accettazione dei Termini</h3>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong>2.1</strong> – Utilizzando sike.gg accetti questi Termini di Servizio e la Privacy Policy.
                  </li>
                  <li>
                    <strong>2.2</strong> – Se non accetti, rimuovi subito il bot dal tuo server.
                  </li>
                  <li>
                    <strong>2.3</strong> – I Termini possono essere aggiornati in qualsiasi momento con avviso tramite
                    canali ufficiali.
                  </li>
                </ul>
              </div>

              {/* 3.0 Service Features */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">3.0 – Funzionalità del Servizio</h3>
                <div className="ml-4 space-y-2">
                  <p>
                    <strong>3.1</strong> – sike.gg fornisce strumenti semplici di moderazione:
                  </p>
                  <ul className="ml-6 space-y-1">
                    <li>
                      • <code className="bg-purple-900/50 px-2 py-1 rounded">/ban</code>: per espellere in modo
                      permanente un utente.
                    </li>
                    <li>
                      • <code className="bg-purple-900/50 px-2 py-1 rounded">/warn</code>: per avvisare un utente con
                      una segnalazione interna.
                    </li>
                    <li>• Comandi di base di moderazione (kick, mute, unmute, ecc. se attivi).</li>
                  </ul>
                  <p>
                    <strong>3.2</strong> – Non esistono comandi distruttivi o nascosti (es. "nuke" o simili).
                  </p>
                  <p>
                    <strong>3.3</strong> – Tutte le azioni sono trasparenti e visibili nei log/testi Discord.
                  </p>
                </div>
              </div>

              {/* 4.0 Permitted Use */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">4.0 – Uso Consentito</h3>
                <div className="ml-4 space-y-2">
                  <p>
                    <strong>4.1</strong> – Puoi usare sike.gg solo rispettando i Termini di Servizio di Discord.
                  </p>
                  <p>
                    <strong>4.2</strong> – È vietato:
                  </p>
                  <ul className="ml-6 space-y-1">
                    <li>• Usare il bot per abusi o attività illegali.</li>
                    <li>• Tentare di modificarne il codice o sfruttarne bug.</li>
                    <li>• Usarlo in server con contenuti contrari alle regole Discord.</li>
                  </ul>
                </div>
              </div>

              {/* 5.0 Liability Limitations */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">5.0 – Limitazioni di Responsabilità</h3>
                <div className="ml-4 space-y-2">
                  <p>
                    <strong>5.1</strong> – Il bot è fornito "così com'è", senza garanzia di funzionamento continuo.
                  </p>
                  <p>
                    <strong>5.2</strong> – Il Proprietario non è responsabile di:
                  </p>
                  <ul className="ml-6 space-y-1">
                    <li>• Uso improprio del bot da parte degli amministratori.</li>
                    <li>• Eventuali malfunzionamenti temporanei.</li>
                    <li>• Conseguenze delle azioni di moderazione avviate dagli utenti.</li>
                  </ul>
                </div>
              </div>

              {/* Privacy Policy Header */}
              <div className="border-t border-purple-500/30 pt-6">
                <h2 className="text-2xl font-bold text-purple-300 mb-4">Privacy Policy</h2>
              </div>

              {/* 6.0 Data Collected */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">6.0 – Dati Raccolti</h3>
                <div className="ml-4 space-y-2">
                  <p>sike.gg raccoglie solo i dati minimi necessari al funzionamento:</p>
                  <ul className="ml-6 space-y-1">
                    <li>• ID utente, ID server, ID canale (per l'esecuzione dei comandi).</li>
                    <li>
                      • Azioni di moderazione (ban, warn, ecc.) quando vengono effettuate, salvate solo se richiesto dal
                      server.
                    </li>
                  </ul>
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-3">
                    <p>
                      <strong>❌ Il bot non legge né memorizza messaggi privati.</strong>
                    </p>
                    <p>
                      <strong>❌ Non raccoglie dati sensibili né li usa per scopi commerciali.</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* 7.0 Data Retention */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">7.0 – Conservazione dei Dati</h3>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong>7.1</strong> – I dati vengono conservati solo localmente al server (nei log, se abilitati).
                  </li>
                  <li>
                    <strong>7.2</strong> – Nessun dato è condiviso con terze parti.
                  </li>
                  <li>
                    <strong>7.3</strong> – I log possono essere cancellati dagli amministratori in qualsiasi momento.
                  </li>
                </ul>
              </div>

              {/* 8.0 Data Sharing */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">8.0 – Condivisione dei Dati</h3>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong>8.1</strong> – Nessun dato raccolto viene venduto o condiviso.
                  </li>
                  <li>
                    <strong>8.2</strong> – Solo il Proprietario può accedere ai dati, esclusivamente per manutenzione
                    tecnica.
                  </li>
                </ul>
              </div>

              {/* 9.0 Security */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">9.0 – Sicurezza</h3>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong>9.1</strong> – Il bot utilizza sistemi sicuri e aggiornati.
                  </li>
                  <li>
                    <strong>9.2</strong> – Sono adottate misure per ridurre al minimo accessi non autorizzati o abusi.
                  </li>
                </ul>
              </div>

              {/* 10.0 User Rights */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">10.0 – Diritti dell'Utente</h3>
                <ul className="space-y-2 ml-4">
                  <li>
                    <strong>10.1</strong> – Puoi richiedere la rimozione dei dati dal tuo server contattando il
                    Proprietario.
                  </li>
                  <li>
                    <strong>10.2</strong> – Puoi smettere di usare il bot rimuovendolo dal server.
                  </li>
                </ul>
              </div>

              {/* 11.0 Contacts */}
              <div>
                <h3 className="text-xl font-bold text-purple-300 mb-3">11.0 – Contatti</h3>
                <div className="ml-4">
                  <p>Per domande o richieste:</p>
                  <ul className="ml-6 space-y-1 mt-2">
                    <li>
                      • <strong>Discord:</strong> dani.dema
                    </li>
                    <li>• Canali ufficiali di supporto (se attivi)</li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-center">
                <p className="text-purple-300 italic">
                  👉 Con questo documento il bot risulta trasparente, legale e affidabile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10 mt-16">
        <div className="text-center text-purple-300">
          <p className="text-sm">
            © 2024 sike.gg - Discord Bot by{" "}
            <Link href="/" className="text-purple-400 hover:text-white transition-colors">
              DaniDema
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
