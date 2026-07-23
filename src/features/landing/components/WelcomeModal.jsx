import { useState } from 'react'
import { X } from 'lucide-react'

export default function WelcomeModal() {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" style={{ animation: 'modalBackdrop 0.3s ease-out' }}>
      <div
        className="bg-surface border border-border/50 rounded-2xl shadow-2xl shadow-black/40 p-8 max-w-lg w-full text-center relative overflow-hidden"
        style={{ animation: 'modalContent 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-plumbob/60 to-transparent" />

        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-text-dim hover:text-text-main hover:bg-hover transition-all duration-200 cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-5">
          <img
            src="/sims-icon.png"
            alt=""
            className="w-20 h-20 object-contain"
          />
        </div>

        <h2 className="text-2xl font-extrabold mb-3 tracking-tight text-text-main">
          ¡Bienvenido a Los Sims 4!
        </h2>

        <p className="text-text-sub mb-8 leading-relaxed text-sm md:text-base">
          Explora todos los paquetes de expansión y descubre nuevas aventuras para tus Sims.
        </p>

        <button
          onClick={() => setOpen(false)}
          className="px-8 py-3 bg-plumbob hover:bg-plumbob-light text-white font-semibold rounded-xl shadow-lg shadow-plumbob/20 hover:shadow-plumbob/40 active:scale-[0.97] transition-all duration-200 cursor-pointer"
        >
          Explorar
        </button>
      </div>
    </div>
  )
}
