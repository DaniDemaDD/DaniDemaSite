"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react" // Importa l'icona della chiave inglese

export default function MaintenancePage() {
  // Imposta isDialogOpen a true inizialmente per aprirlo automaticamente
  const [isDialogOpen, setIsDialogOpen] = useState(true)

  useEffect(() => {
    // Questo useEffect assicura che il dialog si apra all'inizio.
    // Non è strettamente necessario se useState(true) è sufficiente,
    // ma può essere utile per logica più complessa di apertura.
    setIsDialogOpen(true)
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

      {/* Maintenance Info Dialog - Now closable */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-dark-card text-dark-text border-dark-card-border rounded-lg shadow-2xl animate-border-pulse">
          <DialogHeader className="flex flex-col items-center text-center">
            <Wrench className="h-12 w-12 text-dark-accent mb-2" />
            <DialogTitle className="text-2xl font-orbitron text-dark-accent">Avviso Importante</DialogTitle>
            <DialogDescription className="text-dark-text mt-2 font-rajdhani">
              Ci scusiamo per l'inconveniente. Il sito è attualmente in fase di manutenzione programmata. Apprezziamo la
              tua pazienza e ti invitiamo a riprovare più tardi.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="bg-dark-accent text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Ho Capito
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
