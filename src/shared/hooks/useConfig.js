import { useContext } from 'react'
import { ContentContext } from '../context/ContentContext'

export default function useConfig(configKey) {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useConfig must be used within ContentProvider')
  const raw = ctx.configs[configKey]
  return {
    config: Array.isArray(raw) ? raw : [],
    loading: ctx.loading,
    error: ctx.error,
  }
}
