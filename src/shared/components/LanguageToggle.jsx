import { Languages } from 'lucide-react'
import { useState, useEffect } from 'react'
import lang from '../lang'

function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState(lang.get())

  useEffect(() => lang.onChange(setCurrentLang), [])

  const toggle = () => {
    lang.toggle()
  }

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-lg text-text-dim hover:text-text-primary hover:bg-slate-surface/50 transition-all duration-200 cursor-pointer"
      aria-label={currentLang === 'es' ? 'Switch to English' : 'Cambiar a español'}
    >
      <span className="relative block w-5 h-5">
        <Languages className="absolute inset-0 w-5 h-5 transition-all duration-300" />
      </span>
      <span className="absolute -bottom-0.5 -right-0.5 text-[0.5rem] font-bold text-text-dim bg-bg rounded px-0.5 leading-none">
        {currentLang.toUpperCase()}
      </span>
    </button>
  )
}

export default LanguageToggle
