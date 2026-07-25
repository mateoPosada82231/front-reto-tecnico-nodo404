import { createContext, useState, useEffect } from 'react'
import { getExtensions } from '../../../shared/services/extensions'

export const ExtensionsContext = createContext(null)

export function ExtensionsProvider({ children }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    getExtensions()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return (
    <ExtensionsContext.Provider value={{ data, loading, error }}>
      {children}
    </ExtensionsContext.Provider>
  )
}
