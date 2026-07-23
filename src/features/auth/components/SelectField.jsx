function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-sub">
          {label}
          {required && <span className="text-plumbob ml-0.5">*</span>}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`rounded-xl border px-4 py-2.5 text-sm bg-surface text-text-main transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-plumbob/40 focus:border-plumbob ${
          error
            ? 'border-red-500/60 focus:ring-red-500/30'
            : 'border-border hover:border-text-dim'
        }`}
      >
        <option value="">Seleccione...</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  )
}

export default SelectField
