import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, CheckCircle, X } from 'lucide-react'
import useCartStore from '../../../shared/stores/useCartStore'
import useAuthStore from '../../../shared/stores/useAuthStore'
import useContent from '../../../shared/hooks/useContent'
import Button from '../../../shared/components/Button'
import Skeleton from '../../../shared/components/Skeleton'
import Alert from '../../../shared/components/Alert'
import { getFriendlyError } from '../../../shared/utils/errors'
import { checkoutCart } from '../../../shared/services/buys'
import CartItem from '../components/CartItem'
import CheckoutForm from '../components/CheckoutForm'
import lang from '../../../shared/lang'

export default function CartPage() {
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

  useEffect(() => {
    if (isLoggedIn && email) fetchCart(email)
  }, [isLoggedIn, email, fetchCart])

  useEffect(() => {
    const unsubscribe = lang.onChange(() => {
      if (isLoggedIn && email) fetchCart(email)
    })
    return unsubscribe
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
      setShowCheckoutForm(false)
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div className="max-w-4xl 3xl:max-w-5xl 4k:max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 mb-6 text-sm text-text-sub hover:text-text-main transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {cartContent.explore_cta}
      </Link>

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
          {cartContent.title}
        </h1>
        {isLoggedIn && items.length > 0 && (
          <span className="text-sm font-semibold text-plumbob bg-plumbob/10 px-3 py-1 rounded-full">
            {itemsCount === 1
              ? cartContent.packages_count?.replace('{{count}}', itemsCount)
              : cartContent.packages_count_plural?.replace('{{count}}', itemsCount)}
          </span>
        )}
      </div>

      {!isLoggedIn && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-border/40 rounded-2xl bg-surface/50 p-8">
          <ShoppingBag className="h-12 w-12 text-text-dim" />
          <h2 className="text-xl font-bold text-text-main">{cartContent.login_required}</h2>
          <Button variant="primary" href="/login">
            {cartContent.login_link}
          </Button>
        </div>
      )}

      {isLoggedIn && loading && !checkoutSuccess && (
        <div className="space-y-4 py-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      )}

      {isLoggedIn && checkoutSuccess && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-border/40 rounded-2xl bg-surface p-8 animate-fade-in">
          <div className="h-16 w-16 rounded-full bg-plumbob/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-plumbob" />
          </div>
          <h2 className="text-2xl font-bold text-text-main">{cartContent.checkout_success_title}</h2>
          <p className="text-sm text-text-sub">{cartContent.checkout_success_subtitle}</p>
          <p className="text-sm text-text-dim">
            {cartContent.checkout_success_items?.replace('{{count}}', checkoutSuccess.itemCount)}
          </p>
          <p className="text-xl font-bold text-plumbob">
            {cartContent.checkout_success_total}: ${Number(checkoutSuccess.totalPrice).toLocaleString('es-CO')}
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button variant="primary" onClick={() => navigate('/')}>
              {cartContent.checkout_success_explore}
            </Button>
          </div>
        </div>
      )}

      {isLoggedIn && checkoutError && (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center border border-red-500/30 rounded-2xl bg-red-500/5 p-8 mb-6">
          <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <X className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-text-main">{cartContent.checkout_error_title}</h2>
          <p className="text-sm text-text-sub">{cartContent.checkout_error_subtitle}</p>
          <Alert variant="error" className="max-w-md">
            {checkoutError}
          </Alert>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-2 items-center">
            <Button variant="secondary" onClick={() => { setCheckoutError(null); setShowCheckoutForm(true) }}>
              {cartContent.checkout_error_retry}
            </Button>
            <Button variant="primary" onClick={() => { setCheckoutError(null); navigate('/') }}>
              {cartContent.checkout_error_continue}
            </Button>
            <Button variant="ghost" onClick={() => setCheckoutError(null)}>
              {cartContent.checkout_error_close}
            </Button>
          </div>
        </div>
      )}

      {isLoggedIn && !loading && !checkoutSuccess && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-border/40 rounded-2xl bg-surface/50 p-8">
          <ShoppingBag className="h-12 w-12 text-text-dim" />
          <h2 className="text-xl font-bold text-text-main">{cartContent.empty_title}</h2>
          <p className="text-sm text-text-dim max-w-sm">{cartContent.empty_subtitle}</p>
          <Button variant="primary" href="/">
            {cartContent.explore_cta}
          </Button>
        </div>
      )}

      {isLoggedIn && !loading && !checkoutSuccess && items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4 border border-border/40 rounded-2xl bg-surface p-6">
            {showCheckoutForm ? (
              <CheckoutForm
                onSubmit={handleCheckoutSubmit}
                onCancel={() => setShowCheckoutForm(false)}
                loading={checkingOut}
              />
            ) : (
              <div className="divide-y divide-border/50">
                {items.map((item) => (
                  <CartItem
                    key={item.id ?? item.cartItemId}
                    item={item}
                    onRemove={handleRemove}
                    removing={removingId === (item.id ?? item.cartItemId)}
                  />
                ))}
              </div>
            )}
          </div>

          {!showCheckoutForm && (
            <div className="lg:col-span-1 border border-border/40 rounded-2xl bg-surface p-6 h-fit space-y-4">
              <h3 className="text-lg font-bold text-text-main pb-3 border-b border-border/50">
                {cartContent.order_summary}
              </h3>

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

              <div className="flex items-center justify-between text-base">
                <span className="text-text-sub">{cartContent.total_label}</span>
                <span className="text-xl font-bold text-plumbob">
                  ${Number(totalPrice).toLocaleString('es-CO')}
                </span>
              </div>

              <Button
                variant="primary"
                className="w-full justify-center py-3 text-base"
                onClick={handleCheckout}
                loading={checkingOut}
              >
                {checkingOut ? cartContent.checkout_processing : cartContent.checkout_cta}
              </Button>

              <button
                type="button"
                onClick={handleClear}
                className="w-full text-center text-xs text-text-dim hover:text-red-400 transition-colors cursor-pointer pt-2"
              >
                {cartContent.clear_cta}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
