import { useState, useEffect } from 'react'
import lang from '../lang'
import useContent from '../hooks/useContent'

function LanguageToggle() {
  const [currentLang, setCurrentLang] = useState(lang.get())
  const { content } = useContent('header')

  useEffect(() => lang.onChange(setCurrentLang), [])

  const toggle = () => {
    lang.toggle()
  }

  return (
    <button
      onClick={toggle}
      type="button"
      className="inline-flex items-center justify-center min-w-[2.75rem] min-h-[2.75rem] w-11 h-11 rounded-xl border border-border/60 bg-surface/60 hover:bg-hover text-xs font-bold tracking-wider text-text-sub hover:text-text-main transition-all duration-200 cursor-pointer select-none"
      aria-label={currentLang === 'es' ? content.switch_language_aria_en : content.switch_language_aria_es}
    >
      {currentLang.toUpperCase()}
    </button>
  )
}

export default LanguageToggle

