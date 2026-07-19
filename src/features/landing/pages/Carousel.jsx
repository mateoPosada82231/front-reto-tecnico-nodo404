import React, { useState } from 'react';
import { expansionPacks } from '../../../data/expansionPacks.js';

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? expansionPacks.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === expansionPacks.length - 1 ? 0 : prev + 1));
  };

  const currentPack = expansionPacks[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center gap-6">
      
      <div className="w-full aspect-[21/9] bg-white border border-zinc-200 rounded-3xl shadow-md flex items-center justify-center transition-all duration-300">
        <span className="text-zinc-300 font-medium tracking-wider uppercase text-sm">
          [ Espacio para Imagen {currentIndex + 1} ]
        </span>
      </div>

      <div className="flex justify-center gap-2 mt-2">
        {expansionPacks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full border transition-all duration-200 cursor-pointer ${
              currentIndex === index
                ? 'bg-zinc-800 border-zinc-800 scale-110'
                : 'bg-white border-zinc-300 hover:border-zinc-500'
            }`}
            aria-label={`Ir al paquete ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {currentPack.categoria}
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 transition-all duration-300">
          {currentPack.nombre}
        </h2>
      </div>

      <div className="w-full flex items-center justify-between gap-6">
        
        <button
          type="button"
          onClick={prevSlide}
          className="p-3 border border-zinc-300 rounded-full hover:bg-zinc-50 hover:border-zinc-500 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center text-zinc-600 shrink-0"
          aria-label="Paquete anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>


        <div className="flex flex-col items-center gap-5 text-center max-w-2xl">
          <p className="text-zinc-600 text-sm md:text-base leading-relaxed font-light transition-all duration-300 min-h-[4.5rem]">
            {currentPack.descripcion}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <span className="text-base md:text-lg font-bold text-slate-900 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
              {currentPack.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
            </span>
            <a
              href={currentPack.linkTienda}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/10 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer inline-flex text-center"
            >
              Comprar en EA Store
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="p-3 border border-zinc-300 rounded-full hover:bg-zinc-50 hover:border-zinc-500 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center text-zinc-600 shrink-0"
          aria-label="Paquete siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

      </div>

    </div>
  );
}
