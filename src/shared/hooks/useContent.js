import { useContext } from 'react'
import { ContentContext } from '../context/ContentContext'

export default function useContent(sectionKey) {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return {
    content: ctx.sections[sectionKey] || {},
    loading: ctx.loading,
    error: ctx.error,
  }
}
