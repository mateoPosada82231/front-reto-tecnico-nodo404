import InputField from './InputField'
import SelectField from './SelectField'
import Button from '../../../shared/components/Button'
import Alert from './Alert'
import SocialButtons from './SocialButtons'
import useRegisterForm from '../hooks/useRegisterForm'
import useContent from '../../../shared/hooks/useContent'
import useConfig from '../../../shared/hooks/useConfig'

function RegisterForm() {
  const { content } = useContent('auth.register')
  const { config: countries } = useConfig('countries')
  const { form, errors, serverError, loading, success, handleChange, handleSubmit } = useRegisterForm()

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-5 rounded-2xl bg-surface border border-border/50 p-8 shadow-2xl shadow-black/20 animate-scale-in">
      {success && (
        <Alert variant="success">{content.success_message}</Alert>
      )}

      {serverError && !success && (
        <Alert variant="error">{serverError}</Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label={content.fullname_label} name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} placeholder={content.fullname_placeholder} required />
        <InputField label={content.email_label} name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="tu@email.com" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectField label={content.country_label} name="country" value={form.country} onChange={handleChange} options={countries} error={errors.country} required />
        <InputField label={content.birthdate_label} name="birthDate" type="date" value={form.birthDate} onChange={handleChange} error={errors.birthDate} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label={content.id_label} name="identification" value={form.identification} onChange={handleChange} error={errors.identification} placeholder="123456789" required />
        <InputField label={content.phone_label} name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+57 300 123 4567" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField label={content.password_label} name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder={content.password_placeholder} required minLength={8} />
        <InputField label={content.confirm_password_label} name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder={content.confirm_password_placeholder} required />
      </div>

      <Button type="submit" loading={loading} disabled={loading} className="w-full">
        {loading ? content.loading_text : content.submit_text}
      </Button>

      <SocialButtons />
    </form>
  )
}

export default RegisterForm
