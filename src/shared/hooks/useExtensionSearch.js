import { useCallback, useMemo, useRef, useState } from 'react'

const DEFAULT_FIELDS = ['searchText', 'name', 'category', 'distributor', 'aboutGame', 'description']

export function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function matchesAll(text, keywords) {
  return keywords.every((keyword) => text.includes(keyword))
}

function itemMatches(item, keywords, getSearchableText, fields) {
  if (getSearchableText) {
    return matchesAll(normalizeText(getSearchableText(item)), keywords)
  }
  let raw = ''
  for (const field of fields) {
    const value = item?.[field]
    if (value != null && value !== '') {
      raw += ` ${value}`
    }
  }
  return matchesAll(normalizeText(raw), keywords)
}

export default function useExtensionSearch(items = [], options = {}) {
  const { fields = DEFAULT_FIELDS, getSearchableText } = options
  const configRef = useRef({ fields, getSearchableText })

  const [query, setQuery] = useState('')

  const normalizedQuery = normalizeText(query)

  const results = useMemo(() => {
    const source = Array.isArray(items) ? items : []
    if (!normalizedQuery) return source
    const keywords = normalizedQuery.split(/\s+/)
    const { fields: cfgFields, getSearchableText: cfgText } = configRef.current
    return source.filter((item) => itemMatches(item, keywords, cfgText, cfgFields))
  }, [items, normalizedQuery])

  const clearQuery = useCallback(() => setQuery(''), [])

  return {
    query,
    setQuery,
    clearQuery,
    results,
    total: Array.isArray(items) ? items.length : 0,
    isSearching: normalizedQuery.length > 0,
  }
}