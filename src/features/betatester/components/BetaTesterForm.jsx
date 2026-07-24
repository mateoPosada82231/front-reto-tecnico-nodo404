import InputField from '../../auth/components/InputField'
import SelectField from '../../auth/components/SelectField'
import Button from '../../../shared/components/Button'
import Alert from '../../auth/components/Alert'
import useBetaTesterForm from '../hooks/useBetaTesterForm'

const countries = [
  { value: 'CO', label: 'Colombia' },
  { value: 'MX', label: 'México' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
  { value: 'PE', label: 'Perú' },
  { value: 'ES', label: 'España' },
  { value: 'US', label: 'Estados Unidos' },
  { value: 'BR', label: 'Brasil' },
]

function BetaTesterForm() {
  const { form, errors, serverError, loading, success, handleChange, handleSubmit } = useBetaTesterForm()

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-5 rounded-2xl bg-surface border border-border/50 p-8 shadow-2xl shadow-black/20 animate-scale-in">
      {success && (
        <Alert variant="success">
          ¡Registro exitoso! Ya eres un Beta Tester.
        </Alert>
      )}

      {serverError && !success && (
        <Alert variant="error">{serverError}</Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Nombre completo" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} placeholder="Juan Pérez" required />
        <InputField label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="tu@email.com" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField label="País" name="country" value={form.country} onChange={handleChange} options={countries} error={errors.country} required />
        <InputField label="Fecha de nacimiento" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} error={errors.birthDate} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Número de identificación" name="identification" value={form.identification} onChange={handleChange} error={errors.identification} placeholder="123456789" required />
        <InputField label="Número de celular" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+57 300 123 4567" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="Mayúscula, número y carácter especial" required minLength={8} />
        <InputField label="Confirmar contraseña" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="Repite tu contraseña" required />
      </div>

      <Button type="submit" loading={loading} disabled={loading} className="w-full beta-shimmer text-white font-bold">
        {loading ? 'Registrando...' : 'Ser Beta Tester'}
      </Button>
    </form>
  )
}

export default BetaTesterForm
