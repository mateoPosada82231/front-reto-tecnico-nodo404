import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShoppingBag, CheckCircle, Filter, ChevronDown, Lock } from 'lucide-react'
import useCartStore from '../../../shared/stores/useCartStore'
import useAuthStore from '../../../shared/stores/useAuthStore'
import useCartUIStore from '../../../shared/stores/useCartUIStore'
import useContent from '../../../shared/hooks/useContent'
import Button from '../../../shared/components/Button'
import Skeleton from '../../../shared/components/Skeleton'
import { getFriendlyError } from '../../../shared/utils/errors'
import { checkoutCart } from '../../../shared/services/buys'
import CartItem from './CartItem'
import CheckoutForm from './CheckoutForm'
import ProfileAvatar from '../../profile/components/ProfileAvatar'
import lang from '../../../shared/lang'

function CartDrawer() {
  const navigate = useNavigate()
  const { content: cartContent } = useContent('cart')
  const { content: errorsContent } = useContent('errors.common')
  const { isOpen, close } = useCartUIStore()
  const { email, isLoggedIn, user } = useAuthStore()
  const { items, itemsCount, totalPrice, loading, fetchCart, removeItem, clear } = useCartStore()

  const [removingId, setRemovingId] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [checkoutSuccess, setCheckoutSuccess] = useState(null)
  const [checkoutError, setCheckoutError] = useState(null)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('Todos')

  useEffect(() => {
    if (isOpen && isLoggedIn && email) fetchCart(email)
  }, [isOpen, isLoggedIn, email, fetchCart])

  useEffect(() => {
    if (!isOpen) return
    const unsubscribe = lang.onChange(() => {
      if (isLoggedIn && email) fetchCart(email)
    })
    return unsubscribe
  }, [isOpen, isLoggedIn, email, fetchCart])

  useEffect(() => {
    if (!isOpen) {
      setFeedback(null)
      setCheckoutSuccess(null)
      setCheckoutError(null)
      setShowCheckoutForm(false)
    }
  }, [isOpen])

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

  const handleCheckout = () => {
    setShowCheckoutForm(true)
    setFeedback(null)
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

  const handleCheckoutCancel = () => {
    setShowCheckoutForm(false)
  }

  const categories = ['Todos', ...new Set(items.map((i) => i.extension?.category || i.category).filter(Boolean))]

  const filteredItems = items.filter((item) => {
    if (categoryFilter === 'Todos') return true
    const cat = item.extension?.category || item.category
    return cat === categoryFilter
  })

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Steam/EA/Epic Gaming Store Docked Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={cartContent.aria_label || 'Carrito de Compras'}
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-bg border-l border-border/80 shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Gaming Store Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 bg-surface/50">
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <ProfileAvatar
                name={user?.fullName || user?.email || 'Usuario'}
                size="md"
              />
            )}
            <div>
              <h2 className="text-base font-extrabold text-text-main uppercase tracking-wider">
                {cartContent.title || 'CARRITO DE COMPRAS'}
              </h2>
              {isLoggedIn && user?.fullName && (
                <p className="text-xs text-text-dim">{user.fullName}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label={cartContent.close_aria || 'Cerrar'}
            className="p-2 rounded-lg text-text-dim hover:text-text-main hover:bg-surface/80 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!isLoggedIn && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
              <ShoppingBag className="h-10 w-10 text-text-dim" />
              <p className="text-sm text-text-sub">{cartContent.login_required}</p>
              <Button variant="primary" onClick={() => { close(); navigate('/login') }}>
                {cartContent.login_link || 'Iniciar Sesión'}
              </Button>
            </div>
          )}

          {isLoggedIn && loading && !checkoutSuccess && (
            <div className="space-y-4 py-4">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          )}

          {isLoggedIn && checkoutSuccess && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-extrabold text-text-main uppercase">{cartContent.checkout_success_title}</h3>
              <p className="text-sm text-text-sub">{cartContent.checkout_success_subtitle}</p>
              <p className="text-sm text-text-dim">
                {cartContent.checkout_success_items?.replace('{{count}}', checkoutSuccess.itemCount) ?? `${checkoutSuccess.itemCount} paquete(s) comprado(s)`}
              </p>
              <p className="text-lg font-black text-emerald-500">
                {cartContent.checkout_success_total}: ${Number(checkoutSuccess.totalPrice).toLocaleString('es-CO')}
              </p>
            </div>
          )}

          {isLoggedIn && checkoutError && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16 px-4">
              <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <X className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-text-main">{cartContent.checkout_error_title}</h3>
              <p className="text-sm text-text-sub">{cartContent.checkout_error_subtitle}</p>
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 max-w-xs">
                {checkoutError}
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="secondary" onClick={() => { setCheckoutError(null); setShowCheckoutForm(true) }} className="flex-1">
                  {cartContent.checkout_error_retry}
                </Button>
                <Button variant="primary" onClick={() => { setCheckoutError(null); close(); navigate('/') }} className="flex-1">
                  {cartContent.checkout_error_continue}
                </Button>
              </div>
            </div>
          )}

          {isLoggedIn && !loading && !checkoutSuccess && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
              <ShoppingBag className="h-10 w-10 text-text-dim" />
              <p className="text-sm font-bold text-text-main uppercase">{cartContent.empty_title || 'Tu carrito está vacío'}</p>
              <p className="text-xs text-text-dim">{cartContent.empty_subtitle || 'Explora nuestras expansiones para añadir al carrito'}</p>
              <Button variant="primary" onClick={() => { close(); navigate('/') }}>
                {cartContent.explore_cta || 'EXPLORAR TIENDA'}
              </Button>
            </div>
          )}

          {isLoggedIn && !loading && !checkoutSuccess && items.length > 0 && (
            <div className="space-y-3">
              {showCheckoutForm ? (
                <CheckoutForm
                  onSubmit={handleCheckoutSubmit}
                  onCancel={handleCheckoutCancel}
                  loading={checkingOut}
                />
              ) : (
                <>
                  {/* Category Filter Bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-text-sub uppercase font-semibold">
                      <Filter className="h-3.5 w-3.5" />
                      <span>Filtrar:</span>
                    </div>
                    <div className="relative">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="appearance-none bg-surface border border-border/80 rounded-lg px-2.5 py-1 pr-7 text-xs font-semibold text-text-main focus:outline-none focus:border-plumbob cursor-pointer"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-dim pointer-events-none" />
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-1 divide-y divide-border/40">
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
                </>
              )}
            </div>
          )}
        </div>

        {/* Gaming Store Style Cart Footer */}
        {isLoggedIn && !loading && !checkoutSuccess && items.length > 0 && !showCheckoutForm && (
          <div className="border-t border-border/60 px-5 py-4 space-y-3 bg-surface/50">
            {feedback && (
              <div
                className={`rounded-xl border px-3 py-2 text-xs font-medium ${
                  feedback.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-400'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-text-sub uppercase">TOTAL ESTIMADO</span>
              <span className="text-xl font-black text-plumbob">
                ${Number(totalPrice).toLocaleString('es-CO')}
              </span>
            </div>

            {/* Gaming Store Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                className="w-full py-3 text-xs font-extrabold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                onClick={handleCheckout}
                loading={checkingOut}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>{checkingOut ? cartContent.checkout_processing : 'PROCEDER AL PAGO'}</span>
              </Button>

              <Button
                variant="secondary"
                className="w-full text-xs font-bold uppercase tracking-wider border-border/80"
                onClick={() => { close(); navigate('/car') }}
              >
                {(cartContent.view_full_cart || 'VER CARRITO COMPLETO').toUpperCase()}
              </Button>
            </div>

            <div className="flex justify-end text-[11px] text-text-dim pt-1">
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-red-400 transition-colors cursor-pointer"
              >
                {cartContent.clear_cta || 'Vaciar carrito'}
              </button>
            </div>
          </div>
        )}

        {checkoutSuccess && (
          <div className="border-t border-border/60 px-5 py-4 space-y-2 bg-surface/50">
            <Button variant="primary" className="w-full font-bold uppercase" onClick={() => { close(); navigate('/') }}>
              {cartContent.checkout_success_explore || 'EXPLORAR MÁS PAQUETES'}
            </Button>
            <button
              type="button"
              onClick={close}
              className="w-full text-center text-xs text-text-dim hover:text-text-main transition-colors cursor-pointer uppercase font-semibold"
            >
              {cartContent.checkout_success_close || 'CERRAR'}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
