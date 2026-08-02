import { createContext, useState, useEffect } from 'react'
import { getExtensions } from '../../../shared/services/extensions'
import i18n from '../../../i18n'

export const ExtensionsContext = createContext(null)

export function ExtensionsProvider({ children }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    function fetchExtensions(lang = i18n.language || 'es') {
      setLoading(true)
      getExtensions(lang)
        .then((result) => {
          if (!cancelled) setData(result)
        })
        .catch((err) => {
          if (!cancelled) setError(err.message)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }

    fetchExtensions(i18n.language || 'es')

    const handleLangChange = (newLang) => {
      if (!cancelled) fetchExtensions(newLang)
    }

    i18n.on('languageChanged', handleLangChange)

    return () => {
      cancelled = true
      i18n.off('languageChanged', handleLangChange)
    }
  }, [])

  return (
    <ExtensionsContext.Provider value={{ data, loading, error }}>
      {children}
    </ExtensionsContext.Provider>
  )
}
