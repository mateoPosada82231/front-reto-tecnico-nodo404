import { useEffect } from 'react'
import { KeyRound, CheckCircle } from 'lucide-react'
import Modal from '../../../shared/components/Modal'
import InputField from '../../../shared/components/InputField'
import Button from '../../../shared/components/Button'
import useChangePassword from '../hooks/useChangePassword'
import useContent from '../../../shared/hooks/useContent'

export default function ChangePasswordModal({ open, onClose }) {
  const { content: errorsContent } = useContent('errors.common')
  const { content } = useContent('profile.password')
  const { content: common } = useContent('common')
  const { content: validation } = useContent('validation.password')
  const {
    form,
    errors,
    loading,
    feedback,
    handleChange,
    submit,
    close,
  } = useChangePassword()

  const isSuccess = feedback?.type === 'success'

  useEffect(() => {
    if (!open) close()
  }, [open, close])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await submit({ validation, errorsContent, content })
    if (ok) {
      setTimeout(() => onClose?.(), 1500)
    }
  }

  const footer = isSuccess ? (
    <Button variant="primary" onClick={onClose}>
      {content.success_cta}
    </Button>
  ) : (
    <>
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        {content.cancel_text}
      </Button>
      <Button type="submit" loading={loading} disabled={loading}>
        {content.submit_text}
      </Button>
    </>
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isSuccess ? null : content.title}
      footer={isSuccess ? footer : null}
      size="md"
      closeAriaLabel={common.close_aria}
    >
      {isSuccess ? (
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-plumbob/15 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-plumbob" />
            </div>
          </div>
          <p className="text-text-sub leading-relaxed text-sm mb-6">
            {feedback.message}
          </p>
          <div className="flex justify-center">{footer}</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-plumbob/15 flex items-center justify-center">
              <KeyRound className="h-7 w-7 text-plumbob" />
            </div>
          </div>

          {feedback?.type === 'error' && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-3 text-sm">
              {feedback.message}
            </div>
          )}

          <InputField
            label={content.current_label}
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            required
            autoFocus
          />
          <InputField
            label={content.new_label}
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            required
            placeholder={content.new_placeholder}
          />
          <InputField
            label={content.confirm_label}
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <div className="flex gap-3 justify-end pt-2">{footer}</div>
        </form>
      )}
    </Modal>
  )
}
