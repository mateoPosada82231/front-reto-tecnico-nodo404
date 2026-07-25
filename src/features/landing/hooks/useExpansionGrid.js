import useExtensionsData from './useExtensionsData'

export default function useExpansionGrid() {
  const { data, loading, error } = useExtensionsData()
  return { extensions: data, loading, error }
}
