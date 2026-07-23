import { useState, useEffect } from 'react'
import { getExtensions } from '../../../shared/services/extensions'

const HERO_LIMIT = 5

export default function useHeroSection() {
  const [packs, setPacks] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    getExtensions()
      .then((all) => {
        if (!cancelled) setPacks(all.slice(0, HERO_LIMIT))
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? packs.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === packs.length - 1 ? 0 : prev + 1))
  }

  const currentPack = packs[currentIndex] || null

  return { packs, currentPack, currentIndex, setCurrentIndex, prevSlide, nextSlide, loading, error }
}
