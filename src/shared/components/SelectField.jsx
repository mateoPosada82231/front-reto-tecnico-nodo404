import { useId } from 'react'
import useContent from '../hooks/useContent'

function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  defaultPlaceholder,
  disabled = false,
}) {
  const { content: selectDefault } = useContent('select.default')
  const placeholder = defaultPlaceholder ?? selectDefault.placeholder
  const generatedId = useId()
  const id = name || generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-sub">
          {label}
          {required && <span className="text-plumbob ml-0.5">*</span>}
        </label>
      )}

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full min-w-0 rounded-xl border px-4 py-2.5 text-sm bg-surface text-text-main transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-plumbob/50 focus:border-plumbob ${
          error
            ? 'border-red-500/60 focus:ring-red-500/30'
            : 'border-border hover:border-text-dim focus:ring-plumbob/50 focus:border-plumbob-light'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
          <p id={`${id}-error`} className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  )
}

export default SelectField
