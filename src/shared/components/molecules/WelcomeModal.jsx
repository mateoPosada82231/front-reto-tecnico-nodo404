import { useState } from "react";

export default function WelcomeModal() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-[90%] text-center relative">

        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-4">
          ¡Bienvenido a Los Sims 4!
        </h2>

        <p className="text-gray-600 mb-6">
          Explora todos los paquetes de expansión y descubre nuevas aventuras para tus Sims.
        </p>

        <button
          onClick={() => setOpen(false)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
        >
          Explorar
        </button>

      </div>
    </div>
  );
}