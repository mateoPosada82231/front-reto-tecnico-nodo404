import { useState, useEffect } from 'react'
import { getUserBuys } from '../services/buys'
import useAuthStore from '../stores/useAuthStore'
import lang from '../lang'

export default function useOwnedPlatforms() {
  const { isLoggedIn, email } = useAuthStore()
  const [ownedMap, setOwnedMap] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !email) {
      setOwnedMap({})
      return
    }

    let cancelled = false

    const load = (currentLang) => {
      setLoading(true)
      getUserBuys(email, currentLang)
        .then((buys) => {
          if (cancelled) return
          const map = {}
          for (const buy of buys) {
            const extId = buy.extension?.id
            if (extId == null) continue
            if (!map[extId]) map[extId] = []
            if (buy.platform && !map[extId].includes(buy.platform)) {
              map[extId].push(buy.platform)
            }
          }
          setOwnedMap(map)
        })
        .catch(() => {
          if (!cancelled) setOwnedMap({})
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }

    load(lang.get())

    const unsubscribe = lang.onChange((newLang) => {
      if (!cancelled) load(newLang)
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [isLoggedIn, email])

  return { ownedMap, loading }
}
