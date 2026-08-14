import React from 'react'
import useHeroSection from '../hooks/useHeroSection'
import useContent from '../../../shared/hooks/useContent'
import Button from '../../../shared/components/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroSection() {
  const { packs, currentIndex, setCurrentIndex, prevSlide, nextSlide, loading, error } = useHeroSection()
  const { content } = useContent('landing.hero')

  if (loading) {
    return (
      <section className="relative w-full h-[var(--hero-height)] overflow-hidden rounded-2xl mx-auto max-w-7xl">
        <img
          src="https://drop-assets.ea.com/images/3HA9acuR0WKaLXXxHzSnVI/06d535194d8b18f42fd68c07dfbe94d5/TS4_Horse-Ranch_Media-Hero-Tile_16x9_03.jpg?im=Resize=(1280)&q=80"
          alt=""
          width={1280}
          height={720}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay z-0" />
        <div className="relative z-10 w-full max-w-5xl px-10 sm:px-16 md:px-24 text-center md:text-left flex flex-col md:items-start items-center gap-5">
          <div className="bg-surface/90 backdrop-blur-sm rounded-2xl p-6 md:p-10 w-full md:w-auto md:max-w-3xl">
            <div className="h-8 md:h-12 bg-hover rounded-lg w-3/4 animate-pulse" />
            <div className="mt-4 h-4 bg-hover rounded w-full animate-pulse" />
            <div className="mt-2 h-4 bg-hover rounded w-5/6 animate-pulse" />
            <div className="mt-6 h-10 bg-plumbob/30 rounded-xl w-36 animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative w-full h-[var(--hero-height)] overflow-hidden rounded-2xl mx-auto max-w-7xl">
        <img
          src="https://drop-assets.ea.com/images/3HA9acuR0WKaLXXxHzSnVI/06d535194d8b18f42fd68c07dfbe94d5/TS4_Horse-Ranch_Media-Hero-Tile_16x9_03.jpg?im=Resize=(1280)&q=80"
          alt=""
          width={1280}
          height={720}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay z-0" />
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <p className="text-red-400 text-sm bg-surface/80 px-4 py-2 rounded-lg">{content.error_prefix}{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full h-[var(--hero-height)] overflow-hidden flex items-center justify-center rounded-2xl mx-auto max-w-7xl">
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {packs.map((pack, index) => {
          const isCurrent = index === currentIndex
          const isNext = index === currentIndex + 1 || (currentIndex === packs.length - 1 && index === 0)
          const isActive = isCurrent || isNext

          return (
            <div
              key={pack.id}
              className="relative w-full h-full flex-shrink-0 flex items-center justify-center"
            >
              <img
                src={isActive ? (pack.image || pack.imagen || '') : undefined}
                alt={pack.name}
                width={1280}
                height={720}
                fetchPriority={isCurrent ? 'high' : undefined}
                loading={isNext ? 'lazy' : undefined}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover bg-center"
              />
              <div className="absolute inset-0 hero-overlay z-0" />

            <div className="relative z-10 w-full max-w-5xl px-10 sm:px-16 md:px-24 text-center md:text-left flex flex-col md:items-start items-center gap-5">
              <div className="bg-surface/90 backdrop-blur-sm rounded-2xl p-6 md:p-10 w-full md:w-auto md:max-w-3xl">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-text-main">
                  {pack.name}
                </h1>

                <p className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed font-light text-text-sub line-clamp-3">
                  {pack.description || pack.aboutGame}
                </p>

                <Button
                  href={`/expansion/${pack.id}`}
                  className="mt-6 px-8 py-3.5 font-bold md:text-base shadow-plumbob/25 hover:shadow-plumbob/40"
                >
                  {content.cta_text}
                </Button>
              </div>
            </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 md:left-8 z-20 p-3 glass rounded-full active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center text-text-sub hover:text-text-main hover:border-plumbob/30"
        aria-label={content.prev_aria}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 md:right-8 z-20 p-3 glass rounded-full active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center text-text-sub hover:text-text-main hover:border-plumbob/30"
        aria-label={content.next_aria}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 glass px-3 py-1.5 rounded-full border shadow-lg">
        {packs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === index
                ? 'w-8 bg-plumbob shadow-lg shadow-plumbob/40'
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`${content.slide_aria_prefix} ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

