import { Loader2 } from 'lucide-react'

const VARIANT_CLASSES = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
  secondary:
    'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus-visible:outline-indigo-600',
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
  const classes = `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`

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
