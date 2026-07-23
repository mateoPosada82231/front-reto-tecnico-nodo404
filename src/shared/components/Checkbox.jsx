import { useId } from 'react'

function Checkbox({
  label,
  name,
  checked,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) {
  const generatedId = useId()
  const id = name || generatedId

  return (
    <div className={className}>
      <div className="flex items-start gap-2">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-600"
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm text-slate-700">
            {label}
            {required && <span className="text-red-600"> *</span>}
          </label>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default Checkbox
