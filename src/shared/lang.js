const STORAGE_KEY = 'app_language'
const EVENT_NAME = 'app:languageChanged'
export const SUPPORTED_LANGS = ['es', 'en']
const DEFAULT_LANG = 'es'

function detectInitial() {
  if (typeof window === 'undefined') return DEFAULT_LANG

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved

  const nav = navigator.language || (navigator.languages && navigator.languages[0]) || ''
  if (nav.toLowerCase().startsWith('en')) return 'en'

  return DEFAULT_LANG
}

const lang = {
  get() {
    if (typeof window === 'undefined') return DEFAULT_LANG
    const current = localStorage.getItem(STORAGE_KEY)
    return SUPPORTED_LANGS.includes(current) ? current : detectInitial()
  },

  set(next) {
    const normalized = SUPPORTED_LANGS.includes(next) ? next : DEFAULT_LANG
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, normalized)
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: normalized }))
    }
  },

  toggle() {
    this.set(this.get() === 'es' ? 'en' : 'es')
  },

  onChange(cb) {
    if (typeof window === 'undefined') return () => {}
    const handler = (e) => cb(e.detail)
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  },
}

if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
  const detected = detectInitial()
  localStorage.setItem(STORAGE_KEY, detected)
}

export default lang
