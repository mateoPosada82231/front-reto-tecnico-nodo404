import { useNavigate } from 'react-router-dom'
import InputField from './InputField'
import Button from '../../../shared/components/Button'
import Alert from './Alert'
import useLoginForm from '../hooks/useLoginForm'

function LoginForm() {
  const navigate = useNavigate()
  const { form, errors, serverError, loading, success, handleChange, handleSubmit } = useLoginForm({
    onSuccess: () => setTimeout(() => navigate('/'), 1500),
  })

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-lg">
      {success && (
        <Alert variant="success">Inicio de sesión exitoso. Redirigiendo...</Alert>
      )}

      {serverError && !success && (
        <Alert variant="error">{serverError}</Alert>
      )}

      <InputField
        label="Correo electrónico"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <InputField
        label="Contraseña"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <Button type="submit" loading={loading} disabled={loading} className="w-full">
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}

export default LoginForm
