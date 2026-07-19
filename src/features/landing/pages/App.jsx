import React from 'react';
import HeroSection from './fixtures/landing/components/HeroSection';
import RegisterForm from './fixtures/registration/components/RegisterForm';

function App() {
  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      <HeroSection />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-12 md:py-20 grid grid-cols-1 gap-12 items-center">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl mb-4">¿Listo para cambiar la vida de tus Sims?</h2>
          <p className="text-zinc-400 text-sm md:text-base">
            Buscamos jugadores apasionados ...
          </p>
        </div>
        
        <RegisterForm />
      </main>

      <footer className="bg-zinc-950 text-center py-6 border-t border-zinc-800 text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} Sims Test Laboratory. 
      </footer>
    </div>
  );
}

export default App;