import { Beaker, X, CheckCircle } from 'lucide-react'
import Button from './Button'
import Alert from '../../features/auth/components/Alert'
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

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      style={{ animation: 'modalBackdrop 0.3s ease-out' }}
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border/50 rounded-2xl shadow-2xl shadow-black/40 p-8 max-w-md w-full text-center relative overflow-hidden"
        style={{ animation: 'modalContent 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-plumbob/60 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-text-dim hover:text-text-main hover:bg-hover transition-all duration-200 cursor-pointer"
          aria-label={content.close_aria}
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <>
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

            <Button onClick={onClose}>
              {content.already_cta}
            </Button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
