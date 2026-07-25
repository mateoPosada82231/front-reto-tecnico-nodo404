import { useContext } from 'react'
import { ExtensionsContext } from '../context/ExtensionsContext'

export default function useExtensionsData() {
  const context = useContext(ExtensionsContext)
  if (!context) {
    throw new Error('useExtensionsData must be used within an ExtensionsProvider')
  }
  return context
}
