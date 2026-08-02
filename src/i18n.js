import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'es'

  // 1. Prefiere la selección guardada manualmente por el usuario
  const savedLanguage = localStorage.getItem('app_language')
  if (savedLanguage) return savedLanguage

  // 2. Detecta el idioma del sistema/navegador del ordenador
  const systemLanguage = navigator.language || (navigator.languages && navigator.languages[0]) || ''
  if (systemLanguage.toLowerCase().startsWith('en')) {
    return 'en'
  }

  return 'es'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  })

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app_language', lng)
  }
})

export default i18n
