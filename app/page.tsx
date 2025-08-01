"use client"

import { useState, useEffect } from "react"
import { Wrench, X } from "lucide-react" // Importa l'icona della chiave inglese e la X per chiudere

export default function MaintenancePage() {
  // Stato per controllare la visibilità dell'avviso nell'angolo
  const [isNoticeVisible, setIsNoticeVisible] = useState(true)

  useEffect(() => {
    // L'avviso è visibile di default e rimane tale finché non viene chiuso
    setIsNoticeVisible(true)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-dark-bg text-dark-text overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
        <Wrench className="h-24 w-24 text-dark-accent mb-6 animate-pulse-glow" />
        <h1 className="text-5xl md:text-7xl font-orbitron font-extrabold leading-tight animate-pulse-glow">
          Sito Chiuso Momentaneamente
        </h1>
        <p className="mt-4 text-lg md:text-xl font-rajdhani max-w-2xl">
          Stiamo effettuando importanti lavori di manutenzione per migliorare la tua esperienza. Torneremo online il
          prima possibile!
        </p>
      </main>

      {/* Fixed Corner Notice */}
      {isNoticeVisible && (
        <div className="fixed bottom-4 right-4 z-50 bg-dark-card text-dark-text border-2 border-dark-card-border rounded-lg shadow-2xl p-4 max-w-xs animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-orbitron text-dark-accent flex items-center gap-2">
              <Wrench className="h-5 w-5" /> Avviso Importante
            </h3>
            <button
              onClick={() => setIsNoticeVisible(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Chiudi avviso"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm font-rajdhani text-gray-300">
            Il sito è in manutenzione programmata. Apprezziamo la tua pazienza.
          </p>
        </div>
      )}
    </div>
  )
}
