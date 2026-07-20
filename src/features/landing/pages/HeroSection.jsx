import React, { useState } from 'react';
import { expansionPacks } from '../../../data/expansionPacks.js';

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? expansionPacks.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === expansionPacks.length - 1 ? 0 : prev + 1));
  };

  const currentPack = expansionPacks[currentIndex];

  return (
    <section className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center">
      <div 
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {expansionPacks.map((pack) => (
          <div 
            key={pack.id}
            className="relative w-full h-full flex-shrink-0 flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url('${pack.imagen}')` }}
          >
            <div className="absolute inset-0 bg-black/65 z-0" />

            <div className="relative z-10 w-full max-w-5xl px-12 md:px-16 text-center md:text-left flex flex-col md:items-start items-center gap-4 text-white">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-3xl drop-shadow-md">
                {pack.name}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl leading-relaxed font-light">
                {pack.description}
              </p>

              <a 
                href={pack.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-200 text-sm md:text-base cursor-pointer inline-block text-center"
              >
                Comprar ahora
              </a>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 md:left-8 z-20 p-3 bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/50 text-white rounded-full active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
        aria-label="Paquete anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 md:right-8 z-20 p-3 bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/50 text-white rounded-full active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center"
        aria-label="Paquete siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {expansionPacks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
              currentIndex === index
                ? 'bg-emerald-400 border-emerald-400 scale-110'
                : 'bg-white/40 border-white/20 hover:bg-white/60'
            }`}
            aria-label={`Ir al paquete ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}