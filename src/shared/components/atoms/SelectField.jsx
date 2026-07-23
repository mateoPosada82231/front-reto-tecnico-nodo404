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
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-slate-700">
                    {label}
                    {required && <span className="text-red-600"> *</span>}
                </label>
            )}

            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`rounded-md border px-3 py-2 text-sm ${
                    error
                        ? 'border-red-500'
                        : 'border-slate-300'
                }`}
            >
                <option value="">Seleccione...</option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

export default SelectField;