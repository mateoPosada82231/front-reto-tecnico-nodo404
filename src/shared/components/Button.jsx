import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const VARIANT_CLASSES = {
  primary:
    'bg-plumbob text-white hover:bg-plumbob/90 font-bold shadow-md shadow-plumbob/20 hover:shadow-lg hover:shadow-plumbob/30 focus-visible:outline-plumbob',
  secondary:
    'bg-surface text-text-main border border-border/80 hover:bg-surface/80 hover:border-plumbob/40 font-semibold focus-visible:outline-plumbob shadow-xs',
  ghost:
    'bg-transparent text-text-sub hover:text-text-main hover:bg-surface/60 font-medium focus-visible:outline-plumbob',
  outline:
    'bg-transparent text-plumbob border border-plumbob/40 hover:bg-plumbob/10 hover:border-plumbob font-semibold focus-visible:outline-plumbob',
  danger:
    'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 font-semibold focus-visible:outline-red-500',
}

function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  href,
  onClick,
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading
  const baseVariant = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer active:scale-[0.98] ${baseVariant} ${className}`

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </>
  )

  if (href && !isDisabled) {
    return (
      <Link
        to={href}
        className={classes}
        {...props}
      >
        {content}
      </Link>
    )
  }

  return (
    <button type={type} disabled={isDisabled} onClick={onClick} className={classes} {...props}>
      {content}
    </button>
  )
}

export default Button
