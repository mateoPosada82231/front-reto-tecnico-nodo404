import { Beaker, CheckCircle } from 'lucide-react'
import Button from './Button'
import Alert from './Alert'
import Modal from './Modal'
import useContent from '../hooks/useContent'

export default function BetaTesterModal({
  open,
  loading,
  success,
  error,
  onConfirm,
  onClose,
}) {
  const { content } = useContent('beta_modal')

  return (
    <Modal open={open} onClose={onClose} size="md">
      {success ? (
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-plumbob/15 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-plumbob" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold mb-3 tracking-tight text-text-main">
            {content.already_title}
          </h2>

          <p className="text-text-sub mb-6 leading-relaxed text-sm">
            {content.already_description}
          </p>

          <div className="flex justify-center">
            <Button onClick={onClose}>
              {content.already_cta}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-plumbob/15 flex items-center justify-center">
              <Beaker className="w-8 h-8 text-plumbob" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold mb-3 tracking-tight text-text-main">
            {content.confirm_title}
          </h2>

          <p className="text-text-sub mb-6 leading-relaxed text-sm">
            {content.confirm_description}
          </p>

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              {content.cancel_text}
            </Button>
            <Button onClick={onConfirm} loading={loading}>
              {content.confirm_cta}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
