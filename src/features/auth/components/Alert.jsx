import { AlertCircle, CheckCircle, Info } from 'lucide-react'

const VARIANT_STYLES = {
  success: {
    icon: CheckCircle,
    classes: 'bg-green-50 text-green-800 border-green-200',
  },
  error: {
    icon: AlertCircle,
    classes: 'bg-red-50 text-red-800 border-red-200',
  },
  info: {
    icon: Info,
    classes: 'bg-slate-50 text-slate-700 border-slate-200',
  },
}

function Alert({ variant = 'info', children, className = '' }) {
  const { icon: Icon, classes } = VARIANT_STYLES[variant]

  return (
    <div role="alert" className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${classes} ${className}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

export default Alert
