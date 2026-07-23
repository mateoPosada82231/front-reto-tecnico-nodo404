import { Loader2 } from 'lucide-react'

const VARIANT_CLASSES = {
  primary:
    'bg-plumbob text-white hover:bg-plumbob-light font-semibold shadow-lg shadow-plumbob/20 hover:shadow-plumbob/40 focus-visible:outline-plumbob',
  secondary:
    'bg-surface text-text-main border border-border hover:bg-hover hover:border-text-dim focus-visible:outline-plumbob',
  ghost:
    'bg-transparent text-text-sub hover:text-text-main hover:bg-surface/50 focus-visible:outline-plumbob',
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
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] ${VARIANT_CLASSES[variant]} ${className}`

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </>
  )

  if (href && !isDisabled) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} disabled={isDisabled} onClick={onClick} className={classes} {...props}>
      {content}
    </button>
  )
}

export default Button
