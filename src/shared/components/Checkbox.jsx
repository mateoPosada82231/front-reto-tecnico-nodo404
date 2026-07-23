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
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 h-4 w-4 rounded border-border bg-surface text-plumbob focus:ring-2 focus:ring-plumbob/40 focus:ring-offset-0"
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm text-text-sub">
            {label}
            {required && <span className="text-plumbob ml-0.5">*</span>}
          </label>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export default Checkbox
