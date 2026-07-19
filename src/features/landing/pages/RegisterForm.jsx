import React, { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ nombre: '', email: '', packInteres: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados al servidor externo:", formData);
    setEnviado(true);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-800 border border-zinc-700 rounded-2xl p-6 md:p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-2 text-center md:text-left">Inscripción Beta Testers</h2>
      <p className="text-xs md:text-sm text-zinc-400 mb-6 text-center md:text-left">
        Regístrate 
      </p>

      {enviado ? (
        <div className="bg-emerald-950/50 border border-emerald-500 text-emerald-300 p-4 rounded-xl text-center text-sm">
          ¡Inscripción exitosa! 
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Nombre Completo</label>
            <input 
              type="text" 
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez" 
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#26a69a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com" 
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#26a69a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Pack de Interés</label>
            <select 
              name="packInteres"
              required
              value={formData.packInteres}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#26a69a] transition-colors"
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="urbanitas">Los Sims 4: Urbanitas</option>
              <option value="universidad">Los Sims 4: Días de Universidad</option>
              <option value="pueblo">Los Sims 4: Vida en el Pueblo</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#26a69a] hover:bg-[#00897b] text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Enviar
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterForm;