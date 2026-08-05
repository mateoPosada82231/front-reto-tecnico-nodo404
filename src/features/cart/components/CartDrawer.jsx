import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShoppingBag, CheckCircle } from 'lucide-react'
import useContent from '../../../shared/hooks/useContent'
import useCart from '../../../shared/hooks/useCart'
import useAuthStore from '../../../shared/stores/useAuthStore'
import useCartUIStore from '../../../shared/stores/useCartUIStore'
import Button from '../../../shared/components/Button'
import Skeleton from '../../../shared/components/Skeleton'
import { getFriendlyError } from '../../../shared/utils/errors'
import { checkoutCart } from '../../../shared/services/buys'
import CartItem from './CartItem'
import CheckoutForm from './CheckoutForm'

function CartDrawer() {
  const { content: cartContent } = useContent('cart')
  const { content: errorsContent } = useContent('errors.common')
  const navigate = useNavigate()
  const { isOpen, close } = useCartUIStore()
  const { email, isLoggedIn } = useAuthStore()
  const { items, itemsCount, totalPrice, loading, fetchCart, removeItem, clear } = useCart()

  const [removingId, setRemovingId] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [checkoutSuccess, setCheckoutSuccess] = useState(null)
  const [checkoutError, setCheckoutError] = useState(null)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)

  useEffect(() => {
    if (isOpen && isLoggedIn && email) fetchCart(email)
  }, [isOpen, isLoggedIn, email, fetchCart])

  useEffect(() => {
    if (!isOpen) {
      setFeedback(null)
      setCheckoutSuccess(null)
      setCheckoutError(null)
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

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={cartContent.aria_label}
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-bg border-l border-border/60 shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <h2 className="text-lg font-bold text-text-main">{cartContent.title}</h2>
          <button
            type="button"
            onClick={close}
            aria-label={cartContent.close_aria}
            className="p-2 rounded-lg text-text-dim hover:text-text-main hover:bg-surface/50 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {!isLoggedIn && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
              <ShoppingBag className="h-10 w-10 text-text-dim" />
              <p className="text-sm text-text-sub">{cartContent.login_required}</p>
              <Button variant="secondary" onClick={() => { close(); navigate('/login') }}>
                {cartContent.login_link}
              </Button>
            </div>
          )}

          {isLoggedIn && loading && !checkoutSuccess && (
            <div className="space-y-4 py-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {isLoggedIn && checkoutSuccess && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="h-16 w-16 rounded-full bg-plumbob/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-plumbob" />
              </div>
              <h3 className="text-xl font-bold text-text-main">{cartContent.checkout_success_title}</h3>
              <p className="text-sm text-text-sub">{cartContent.checkout_success_subtitle}</p>
              <p className="text-sm text-text-dim">
                {(cartContent.checkout_success_items || '{{count}}').replace('{{count}}', checkoutSuccess.itemCount)}
              </p>
              <p className="text-lg font-bold text-plumbob">
                {cartContent.checkout_success_total}: ${Number(checkoutSuccess.totalPrice).toLocaleString('es-CO')}
              </p>
            </div>
          )}

          {isLoggedIn && checkoutError && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16 px-6">
              <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <X className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-text-main">{cartContent.checkout_error_title}</h3>
              <p className="text-sm text-text-sub">{cartContent.checkout_error_subtitle}</p>
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 max-w-xs">
                {checkoutError}
              </div>
              <div className="flex gap-2">
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
              <p className="text-sm font-medium text-text-main">{cartContent.empty_title}</p>
              <p className="text-xs text-text-dim">{cartContent.empty_subtitle}</p>
              <Button variant="secondary" onClick={() => { close(); navigate('/') }}>
                {cartContent.explore_cta}
              </Button>
            </div>
          )}

          {isLoggedIn && !loading && !checkoutSuccess && items.length > 0 && (
            <div>
              {showCheckoutForm ? (
                <CheckoutForm
                  onSubmit={handleCheckoutSubmit}
                  onCancel={handleCheckoutCancel}
                  loading={checkingOut}
                />
              ) : (
                <>
                  {items.map((item) => (
                    <CartItem
                      key={item.id ?? item.cartItemId}
                      item={item}
                      onRemove={handleRemove}
                      removing={removingId === (item.id ?? item.cartItemId)}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {isLoggedIn && !loading && !checkoutSuccess && items.length > 0 && !showCheckoutForm && (
          <div className="border-t border-border/50 px-5 py-4 space-y-3">
            {feedback && (
              <div
                className={`rounded-xl border px-3 py-2 text-xs ${
                  feedback.type === 'success'
                    ? 'border-plumbob/30 bg-plumbob/10 text-plumbob'
                    : 'border-red-500/30 bg-red-500/10 text-red-400'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-sub">{cartContent.total_label}</span>
              <span className="text-lg font-bold text-plumbob">
                ${Number(totalPrice).toLocaleString('es-CO')}
              </span>
            </div>

            <Button variant="primary" className="w-full" onClick={handleCheckout} loading={checkingOut}>
              {checkingOut ? cartContent.checkout_processing : cartContent.checkout_cta}
            </Button>

            <button
              type="button"
              onClick={handleClear}
              className="w-full text-center text-xs text-text-dim hover:text-red-400 transition-colors cursor-pointer"
            >
              {cartContent.clear_cta}
            </button>
          </div>
        )}

        {checkoutSuccess && (
          <div className="border-t border-border/50 px-5 py-4 space-y-2">
            <Button variant="primary" className="w-full" onClick={() => { close(); navigate('/') }}>
              {cartContent.checkout_success_explore}
            </Button>
            <button
              type="button"
              onClick={close}
              className="w-full text-center text-xs text-text-dim hover:text-text-main transition-colors cursor-pointer"
            >
              {cartContent.checkout_success_close}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default CartDrawer