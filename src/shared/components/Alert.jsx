import { AlertCircle, CheckCircle, Info } from 'lucide-react'

const VARIANT_STYLES = {
  success: {
    icon: CheckCircle,
    classes: 'bg-plumbob/10 text-plumbob-dark border-plumbob/20',
  },
  error: {
    icon: AlertCircle,
    classes: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  info: {
    icon: Info,
    classes: 'bg-azure/10 text-azure border-azure/20',
  },
}

function Alert({ variant = 'info', children, className = '' }) {
  const { icon: Icon, classes } = VARIANT_STYLES[variant]

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${classes} ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

export default Alert
