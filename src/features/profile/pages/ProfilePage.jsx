import { Navigate } from 'react-router-dom'
import { Pencil, X, Check } from 'lucide-react'
import Button from '../../shared/components/Button'
import InputField from '../../shared/components/InputField'
import Skeleton from '../../shared/components/Skeleton'
import ProfileAvatar from '../components/ProfileAvatar'
import useProfile from '../hooks/useProfile'

function ProfilePage() {
  const {
    user,
    email,
    loading,
    isLoggedIn,
    form,
    errors,
    editing,
    saving,
    feedback,
    handleChange,
    startEditing,
    cancelEditing,
    saveProfile,
  } = useProfile()

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-24 w-24 rounded-full mx-auto" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
        <div className="flex flex-col items-center gap-3 text-center border-b border-border/60 pb-6 mb-6">
          <ProfileAvatar name={user?.fullName} />
          <div>
            <h1 className="text-xl font-semibold text-text-main md:text-2xl">
              {user?.fullName || 'Sin nombre'}
            </h1>
            <p className="text-sm text-text-sub">{email}</p>
          </div>
          {user?.betaTester && (
            <span className="inline-flex items-center rounded-full bg-plumbob/15 border border-plumbob/30 px-2.5 py-0.5 text-xs font-semibold text-plumbob">
              Beta tester
            </span>
          )}
        </div>

        {feedback && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-plumbob/30 bg-plumbob/10 text-plumbob'
                : 'border-red-500/30 bg-red-500/10 text-red-400'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={saveProfile} className="space-y-5">
          <InputField
            label="Nombre completo"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
            disabled={!editing}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="País"
              name="country"
              value={form.country}
              onChange={handleChange}
              error={errors.country}
              disabled={!editing}
            />
            <InputField
              label="Número de identificación"
              name="identification"
              value={form.identification}
              onChange={handleChange}
              error={errors.identification}
              disabled={!editing}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Número de celular"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              error={errors.mobileNumber}
              disabled={!editing}
            />
            <InputField
              label="Fecha de nacimiento"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {!editing ? (
              <Button type="button" variant="secondary" onClick={startEditing}>
                <Pencil className="h-4 w-4" />
                Editar perfil
              </Button>
            ) : (
              <>
                <Button type="button" variant="ghost" onClick={cancelEditing} disabled={saving}>
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" loading={saving}>
                  <Check className="h-4 w-4" />
                  Guardar cambios
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage