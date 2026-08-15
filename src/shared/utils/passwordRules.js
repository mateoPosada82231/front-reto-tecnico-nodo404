export const PASSWORD_RULES = [
  { key: 'min_length', test: (v) => v.length >= 8 },
  { key: 'uppercase', test: (v) => /[A-Z]/.test(v) },
  { key: 'number', test: (v) => /[0-9]/.test(v) },
  { key: 'special', test: (v) => /[$@$!%*?&#]/.test(v) },
]

export function buildPasswordRequirements(messages) {
  return [
    { key: 'min_length', label: messages.password_min_length, test: (v) => v.length >= 8 },
    { key: 'uppercase', label: messages.password_uppercase, test: (v) => /[A-Z]/.test(v) },
    { key: 'number', label: messages.password_number, test: (v) => /[0-9]/.test(v) },
    { key: 'special', label: messages.password_special, test: (v) => /[$@$!%*?&#]/.test(v) },
  ]
}
