import { useState } from 'react'
import useExtensionsData from '../hooks/useExtensionsData'

const HERO_LIMIT = 5

export default function useHeroSection() {
  const { data: all, loading, error } = useExtensionsData()
  const [currentIndex, setCurrentIndex] = useState(0)

  const packs = all.slice(0, HERO_LIMIT)

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? packs.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === packs.length - 1 ? 0 : prev + 1))
  }

  const currentPack = packs[currentIndex] || null

  return { packs, currentPack, currentIndex, setCurrentIndex, prevSlide, nextSlide, loading, error }
}
