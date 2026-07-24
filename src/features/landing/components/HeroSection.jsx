import React from 'react'
import useHeroSection from '../hooks/useHeroSection'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroSection() {
  const { packs, currentIndex, setCurrentIndex, prevSlide, nextSlide, loading, error } = useHeroSection()

  if (loading) {
    return (
      <section className="relative w-full h-[var(--hero-height)] overflow-hidden flex items-center justify-center bg-bg">
        <div className="w-12 h-12 border-4 border-plumbob/30 border-t-plumbob rounded-full animate-spin" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative w-full h-[var(--hero-height)] overflow-hidden flex items-center justify-center bg-bg">
        <p className="text-red-400 text-sm">Error al cargar extensiones: {error}</p>
      </section>
    )
  }

  return (
    <section className="relative w-full h-[var(--hero-height)] overflow-hidden flex items-center justify-center rounded-2xl mx-auto max-w-7xl">
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {packs.map((pack) => (
          <div
            key={pack.id}
            className="relative w-full h-full flex-shrink-0 flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url('${pack.image || pack.imagen || ''}')` }}
          >
            <div className="absolute inset-0 hero-overlay z-0" />

            <div className="relative z-10 w-full max-w-5xl px-8 md:px-16 text-center md:text-left flex flex-col md:items-start items-center gap-5">
              <div className="bg-surface/90 backdrop-blur-sm rounded-2xl p-6 md:p-10 w-full md:w-auto md:max-w-3xl">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-text-main">
                  {pack.name}
                </h1>

                <p className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed font-light text-text-sub">
                  {pack.description || pack.aboutGame}
                </p>

                <a
                  href={pack.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block px-8 py-3.5 bg-plumbob hover:bg-plumbob-light text-white font-bold rounded-xl shadow-lg shadow-plumbob/25 hover:shadow-plumbob/40 active:scale-[0.97] transition-all duration-200 text-sm md:text-base cursor-pointer text-center"
                >
                  Comprar ahora
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 md:left-8 z-20 p-3 glass rounded-full active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center text-text-sub hover:text-text-main hover:border-plumbob/30"
        aria-label="Paquete anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 md:right-8 z-20 p-3 glass rounded-full active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center text-text-sub hover:text-text-main hover:border-plumbob/30"
        aria-label="Paquete siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {packs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === index
                ? 'w-8 bg-plumbob shadow-lg shadow-plumbob/40'
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Ir al paquete ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
