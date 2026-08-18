import { useEffect, useRef, useState, useCallback } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeAriaLabel = 'Cerrar',
  autoDismiss,
}) {
  const dialogRef = useRef(null)
  const [remaining, setRemaining] = useState(autoDismiss || 0)
  const [paused, setPaused] = useState(false)
  const elapsedRef = useRef(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  const dismiss = useCallback(() => {
    onClose?.()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open || !autoDismiss || autoDismiss <= 0) return

    elapsedRef.current = 0
    startRef.current = null
    setRemaining(autoDismiss)

    const tick = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp
      if (!paused) {
        elapsedRef.current += timestamp - startRef.current
        startRef.current = timestamp
        const left = Math.max(0, autoDismiss - elapsedRef.current)
        setRemaining(left)
        if (left <= 0) {
          dismiss()
          return
        }
      } else {
        startRef.current = timestamp
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [open, autoDismiss, paused, dismiss])

  if (!open) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }

  const handleBackdrop = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) onClose?.()
  }

  const progress = autoDismiss ? remaining / autoDismiss : 0

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      style={{ animation: 'modalBackdrop 0.3s ease-out' }}
      onClick={handleBackdrop}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={`bg-surface border border-border/50 rounded-2xl shadow-2xl shadow-black/40 p-8 w-full ${sizeClasses[size]} relative overflow-hidden`}
        style={{ animation: 'modalContent 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => autoDismiss && setPaused(true)}
        onMouseLeave={() => autoDismiss && setPaused(false)}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-plumbob/60 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-text-dim hover:text-text-main hover:bg-hover transition-all duration-200 cursor-pointer"
          aria-label={closeAriaLabel}
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <h2 className="text-xl font-extrabold mb-4 tracking-tight text-text-main pr-8">
            {title}
          </h2>
        )}

        <div className="mb-0">{children}</div>

        {footer && (
          <div className="mt-6 flex gap-3 justify-end">{footer}</div>
        )}

        {autoDismiss > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/20">
            <div
              className="h-full bg-plumbob/40 transition-none"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
