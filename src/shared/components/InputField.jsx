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
      <div className="relative">
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`min-w-0 w-full rounded-xl border px-4 py-2.5 text-sm text-text-main placeholder:text-text-dim bg-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-plumbob/40 focus:border-plumbob ${
            isPassword ? 'pr-11' : ''
          } ${
            error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-border hover:border-text-dim'}
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted transition-colors duration-200 cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400 mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
}

export default InputField
