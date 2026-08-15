import { useId, useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const SHOW_PASSWORD_TIMEOUT_MS = 1000

function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  ...props
}) {
  const generatedId = useId()
  const id = name || generatedId
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const isDate = type === 'date'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  useEffect(() => {
    if (!showPassword) return
    const timer = setTimeout(() => setShowPassword(false), SHOW_PASSWORD_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [showPassword])

  return (
    <div className={`min-w-0 flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-muted">
          {label}
          {required && <span className="text-plumbob ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full min-w-0 rounded-xl border px-4 py-2.5 text-sm text-text-primary placeholder:text-text-dim bg-slate-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-plumbob/40 focus:border-plumbob ${
          error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-slate-border hover:border-text-dim'
        }`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400 mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
}

export default InputField
