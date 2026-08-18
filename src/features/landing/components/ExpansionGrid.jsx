import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from './Card'
import Skeleton from '../../../shared/components/Skeleton'
import useExpansionGrid from '../hooks/useExpansionGrid'
import useContent from '../../../shared/hooks/useContent'
import useAuthStore from '../../../shared/stores/useAuthStore'
import useCartStore from '../../../shared/stores/useCartStore'
import useCartUIStore from '../../../shared/stores/useCartUIStore'
import { parsePlatforms } from '../../../shared/utils/extensionOptions'

export default function ExpansionGrid() {
  const navigate = useNavigate()
  const { extensions, loading, error } = useExpansionGrid()
  const { content } = useContent('landing.grid')
  const { email, isLoggedIn, purchasedItems, fetchPurchases } = useAuthStore()
  const cartItems = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartUIStore((state) => state.open)

  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    if (isLoggedIn && email) {
      fetchPurchases()
    }
  }, [isLoggedIn, email, fetchPurchases])

  const handleAddToCart = async (pack, isInCart, ownedPlatforms = []) => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    if (isInCart) {
      navigate('/car')
      return
    }

    const platformOptions = parsePlatforms(pack.platforms || pack.platform, ownedPlatforms)
    const availableOpt = platformOptions.find((p) => !p.disabled)
    const platformToAssign = availableOpt?.value || platformOptions[0]?.value || 'PC'

    setAddingId(pack.id)
    try {
      await addItem({
        email,
        extensionId: pack.id,
        platform: platformToAssign,
        language: 'Español',
      })
      openCart()
    } catch (err) {
      console.error('Error al añadir al carrito:', err)
    } finally {
      setAddingId(null)
    }
  }

  // Deduplicate extensions array by unique ID
  const uniqueExtensions = Array.isArray(extensions)
    ? extensions.filter((pack, index, self) => index === self.findIndex((p) => p.id === pack.id || p.name === pack.name))
    : []

  const cartIdSet = new Set(cartItems.map((item) => item.extension?.id ?? item.extensionId ?? item.id))

  // Map of pack.id -> array of platforms owned
  const purchasedPlatformMap = new Map()
  if (isLoggedIn && Array.isArray(purchasedItems)) {
    purchasedItems.forEach((item) => {
      const existing = purchasedPlatformMap.get(item.extensionId) || []
      if (!existing.includes(item.platform)) {
        existing.push(item.platform)
      }
      purchasedPlatformMap.set(item.extensionId, existing)
    })
  }

  if (loading) {
    return (
      <section className="w-full max-w-[2400px] mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-main mb-10 tracking-tight">
          {content.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4k:grid-cols-6 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/30 overflow-hidden">
              <Skeleton className="aspect-video rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-2.5 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full max-w-[2400px] mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-main mb-10 tracking-tight">
          {content.title}
        </h2>
        <p className="text-red-400 text-sm">{content.error_prefix}{error}</p>
      </section>
    )
  }

  return (
    <section className="w-full max-w-[2400px] mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-text-main tracking-tight mb-2">
          {content.title}
        </h2>
        <div className="h-1 w-16 rounded-full bg-plumbob/60" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4k:grid-cols-6 gap-6">
        {uniqueExtensions.map((pack, index) => {
          const purchasedPlatforms = isLoggedIn ? (purchasedPlatformMap.get(pack.id) || []) : []
          const isInCart = isLoggedIn && cartIdSet.has(pack.id)

          return (
            <div key={pack.id} style={{ animationDelay: `${index * 60}ms` }} className="animate-slide-up">
              <Card
                image={pack.image || pack.imagen || ''}
                category={pack.category}
                title={pack.name}
                description={pack.description || pack.aboutGame || ''}
                price={pack.price ? pack.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) : ''}
                ctaLabel={content.cta_text}
                href={`/expansion/${pack.id}`}
                onAddToCart={isLoggedIn ? () => handleAddToCart(pack, isInCart, purchasedPlatforms) : null}
                adding={addingId === pack.id}
                purchasedPlatforms={purchasedPlatforms}
                isInCart={isInCart}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
