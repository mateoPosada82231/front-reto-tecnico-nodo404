import { useState, useEffect, useRef, useCallback } from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

const VARIANT_STYLES = {
  success: {
    icon: CheckCircle,
    classes: 'bg-plumbob/10 text-plumbob-dark border-plumbob/20',
    barColor: 'bg-plumbob/40',
  },
  error: {
    icon: AlertCircle,
    classes: 'bg-red-500/10 text-red-400 border-red-500/20',
    barColor: 'bg-red-400/40',
  },
  info: {
    icon: Info,
    classes: 'bg-azure/10 text-azure border-azure/20',
    barColor: 'bg-azure/40',
  },
}

function Alert({ variant = 'info', children, className = '', autoDismiss, onDismiss }) {
  const { icon: Icon, classes, barColor } = VARIANT_STYLES[variant]
  const [remaining, setRemaining] = useState(autoDismiss || 0)
  const [paused, setPaused] = useState(false)
  const elapsedRef = useRef(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  const dismiss = useCallback(() => {
    if (onDismiss) onDismiss()
  }, [onDismiss])

  useEffect(() => {
    if (!autoDismiss || autoDismiss <= 0) return

    const tick = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp
      if (!paused) {
        elapsedRef.current += timestamp - (startRef.current || timestamp)
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
  }, [autoDismiss, paused, dismiss])

  const progress = autoDismiss ? remaining / autoDismiss : 0

  return (
    <div
      role="alert"
      className={`relative overflow-hidden flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${classes} ${className}`}
      onMouseEnter={() => autoDismiss && setPaused(true)}
      onMouseLeave={() => autoDismiss && setPaused(false)}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="flex-1">{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {autoDismiss > 0 && (
        <div
          className={`absolute bottom-0 left-0 h-0.5 ${barColor} transition-none`}
          style={{ width: `${progress * 100}%` }}
        />
      )}
    </div>
  )
}

export default Alert
