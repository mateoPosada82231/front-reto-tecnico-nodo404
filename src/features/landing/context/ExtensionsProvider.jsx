import { useState, useEffect } from 'react'
import { getExtensions } from '../../../shared/services/extensions'
import lang from '../../../shared/lang'
import { ExtensionsContext } from './ExtensionsContext'

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
            setData(Array.isArray(result) ? result : [])
            setError(null)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setData([])
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
