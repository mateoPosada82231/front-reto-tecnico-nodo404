import useExtensions from './useExtensions'
import { getExtensions } from '../../../shared/services/extensions'

export default function useExpansionGrid() {
  const { data, loading, error } = useExtensions(getExtensions)
  return { extensions: data, loading, error }
}
