import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Trash2, CheckCircle, Lock, Filter, ChevronDown } from 'lucide-react'
import useCartStore from '../../../shared/stores/useCartStore'
import useAuthStore from '../../../shared/stores/useAuthStore'
import useContent from '../../../shared/hooks/useContent'
import Button from '../../../shared/components/Button'
import Skeleton from '../../../shared/components/Skeleton'
import { getFriendlyError } from '../../../shared/utils/errors'
import { checkoutCart } from '../../../shared/services/buys'
import CartItem from '../components/CartItem'
import CheckoutForm from '../components/CheckoutForm'

function CartPage() {
  const navigate = useNavigate()
  const { content: cartContent } = useContent('cart')
  const { content: errorsContent } = useContent('errors.common')
  const { email, isLoggedIn } = useAuthStore()
  const { items, itemsCount, totalPrice, loading, fetchCart, removeItem, clear } = useCartStore()

  const [removingId, setRemovingId] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [checkoutSuccess, setCheckoutSuccess] = useState(null)
  const [checkoutError, setCheckoutError] = useState(null)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('Todos')

  useEffect(() => {
    if (isLoggedIn && email) {
      fetchCart(email)
    }
  }, [isLoggedIn, email, fetchCart])

  const handleRemove = async (cartItemId) => {
    setRemovingId(cartItemId)
    setFeedback(null)
    try {
      await removeItem(cartItemId, email)
    } catch (err) {
      setFeedback({ type: 'error', message: getFriendlyError(errorsContent, err) })
    } finally {
      setRemovingId(null)
    }
  }

  const handleClear = async () => {
    setFeedback(null)
    try {
      await clear(email)
    } catch (err) {
      setFeedback({ type: 'error', message: getFriendlyError(errorsContent, err) })
    }
  }

  const handleCheckoutSubmit = async (formData) => {
    setCheckingOut(true)
    setFeedback(null)
    setCheckoutError(null)
    try {
      const result = await checkoutCart({ userEmail: email, paymentMethod: formData.paymentMethod })
      setCheckoutSuccess({
        itemCount: result.itemsCount ?? itemsCount,
        totalPrice: result.totalPrice ?? totalPrice,
      })
      setShowCheckoutForm(false)
      await fetchCart(email)
    } catch (err) {
      setCheckoutError(getFriendlyError(errorsContent, err))
    } finally {
      setCheckingOut(false)
    }
  }

  const categories = ['Todos', ...new Set(items.map((i) => i.extension?.category || i.category).filter(Boolean))]

  const filteredItems = items.filter((item) => {
    if (categoryFilter === 'Todos') return true
    const cat = item.extension?.category || item.category
    return cat === categoryFilter
  })

  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="p-4 rounded-full bg-surface/50 inline-block text-text-dim">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-text-main uppercase">Inicia sesión para ver tu carrito</h2>
        <p className="text-sm text-text-sub">Necesitas una cuenta activa para guardar tus expansiones y gestionar tus compras.</p>
        <Button variant="primary" onClick={() => navigate('/login')} className="uppercase font-extrabold">
          Iniciar Sesión
        </Button>
      </div>
    )
  }

  if (checkoutSuccess) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
          <CheckCircle className="h-12 w-12 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-text-main uppercase">{cartContent.checkout_success_title || '¡COMPRA EXITOSA!'}</h2>
        <p className="text-sm text-text-sub">{cartContent.checkout_success_subtitle || 'Tus expansiones ya están disponibles en tu biblioteca.'}</p>
        <p className="text-base font-black text-emerald-500">
          Total pagado: ${Number(checkoutSuccess.totalPrice).toLocaleString('es-CO')}
        </p>
        <Button variant="primary" className="w-full uppercase font-bold" onClick={() => navigate('/')}>
          EXPLORAR MÁS PAQUETES
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 rounded-xl border border-border/60 hover:bg-surface/60 transition-colors text-text-sub hover:text-text-main"
            title="Volver a la tienda"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-text-main uppercase">CARRITO DE COMPRAS</h1>
            <p className="text-xs text-text-dim">Edita tus selecciones, cambia plataformas e idiomas y completa tu pedido</p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface border border-border/60 text-text-sub uppercase">
          {itemsCount} paquete(s)
        </span>
      </div>

      {loading && (
        <div className="space-y-4 py-8">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
          <div className="p-4 rounded-full bg-surface/50 inline-block text-text-dim">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-bold text-text-main uppercase">{cartContent.empty_title || 'TU CARRITO ESTÁ VACÍO'}</h3>
          <p className="text-sm text-text-dim">{cartContent.empty_subtitle || 'No tienes ninguna expansión añadida al carrito.'}</p>
          <Button variant="primary" onClick={() => navigate('/')} className="uppercase font-bold">
            {cartContent.explore_cta || 'EXPLORAR TIENDA'}
          </Button>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Cart Items List */}
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-surface/30">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-text-sub">
                <Filter className="h-4 w-4" />
                <span>Filtrar por categoría:</span>
              </div>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-bg border border-border/80 rounded-lg px-3 py-1 pr-8 text-xs font-semibold text-text-main focus:outline-none focus:border-plumbob cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-dim pointer-events-none" />
              </div>
            </div>

            {/* Items Container */}
            <div className="rounded-2xl border border-border/60 bg-surface/20 overflow-hidden divide-y divide-border/40">
              {filteredItems.map((item, idx) => (
                <CartItem
                  key={item.id ?? item.cartItemId}
                  item={item}
                  onRemove={handleRemove}
                  removing={removingId === (item.id ?? item.cartItemId)}
                  isHighlighted={idx === 0}
                />
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-dim hover:text-red-400 transition-colors uppercase"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{cartContent.clear_cta || 'Vaciar carrito'}</span>
              </button>
              <Link to="/" className="text-xs font-bold text-plumbob hover:underline uppercase">
                + Añadir más expansiones
              </Link>
            </div>
          </div>

          {/* Checkout & Summary Panel (Steam/EA Gaming Store style) */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border/60 bg-surface/40 p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-text-main pb-2 border-b border-border/50 uppercase tracking-wider">
                RESUMEN DEL PEDIDO
              </h3>

              {feedback && (
                <div
                  className={`rounded-xl border px-3 py-2 text-xs ${
                    feedback.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-red-500/30 bg-red-500/10 text-red-400'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {checkoutError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 space-y-2">
                  <p className="font-semibold">Error en la compra:</p>
                  <p>{checkoutError}</p>
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-text-sub">
                  <span>Subtotal ({itemsCount} paquetes):</span>
                  <span className="font-semibold text-text-main">${Number(totalPrice).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-text-sub">
                  <span>Impuestos incluidos:</span>
                  <span className="font-semibold text-text-main">$0</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/50 text-sm font-bold text-text-main">
                  <span>TOTAL ESTIMADO:</span>
                  <span className="text-lg font-black text-plumbob">${Number(totalPrice).toLocaleString('es-CO')}</span>
                </div>
              </div>

              {showCheckoutForm ? (
                <CheckoutForm
                  onSubmit={handleCheckoutSubmit}
                  onCancel={() => setShowCheckoutForm(false)}
                  loading={checkingOut}
                />
              ) : (
                <Button
                  variant="primary"
                  className="w-full font-extrabold py-3 text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                  onClick={() => setShowCheckoutForm(true)}
                  loading={checkingOut}
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{checkingOut ? cartContent.checkout_processing : 'PROCEDER AL PAGO'}</span>
                </Button>
              )}


            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
