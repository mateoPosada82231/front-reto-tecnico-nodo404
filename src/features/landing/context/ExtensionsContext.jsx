import { createContext, useState, useEffect } from 'react'
import { getExtensions } from '../../../shared/services/extensions'
import lang from '../../../shared/lang'
import { expansionPacks, getTranslatedPacks } from '../../../data/expansionPacks'

export const ExtensionsContext = createContext(null)

export function ExtensionsProvider({ children }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    function fetchExtensions(currentLang = lang.get()) {
      setLoading(true)
      getExtensions(currentLang)
        .then((result) => {
          if (!cancelled) {
            const rawList = Array.isArray(result) && result.length > 0 ? result : expansionPacks
            setData(getTranslatedPacks(rawList, currentLang))
            setError(null)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setData(getTranslatedPacks(expansionPacks, currentLang))
            setError(null)
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }

    fetchExtensions(lang.get())

    const handleLangChange = (newLang) => {
      if (!cancelled) fetchExtensions(newLang)
    }

    const unsubscribe = lang.onChange(handleLangChange)

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  return (
    <ExtensionsContext.Provider value={{ data, loading, error }}>
      {children}
    </ExtensionsContext.Provider>
  )
}
