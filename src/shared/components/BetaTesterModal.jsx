import { Beaker, X, CheckCircle, Loader2 } from 'lucide-react'
import Alert from '../../features/auth/components/Alert'

export default function BetaTesterModal({
  open,
  loading,
  success,
  error,
  onConfirm,
  onClose,
}) {
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
          aria-label="Cerrar"
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
              Ya eres Beta Tester
            </h2>

            <p className="text-text-sub mb-6 leading-relaxed text-sm">
              Ahora tienes acceso anticipado a nuevas extensiones y funciones exclusivas.
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-plumbob hover:bg-plumbob-light text-white font-semibold rounded-xl shadow-lg shadow-plumbob/20 hover:shadow-plumbob/40 active:scale-[0.97] transition-all duration-200 cursor-pointer"
            >
              Entendido
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-plumbob/15 flex items-center justify-center">
                <Beaker className="w-8 h-8 text-plumbob" />
              </div>
            </div>

            <h2 className="text-xl font-extrabold mb-3 tracking-tight text-text-main">
              Ser Beta Tester
            </h2>

            <p className="text-text-sub mb-6 leading-relaxed text-sm">
              ¿Seguro que quieres unirte al programa beta? Tendrás acceso anticipado a nuevas extensiones antes que nadie.
            </p>

            {error && (
              <Alert variant="error" className="mb-4">
                {error}
              </Alert>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl border border-border/50 text-text-sub hover:text-text-main hover:bg-hover transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-6 py-2.5 bg-plumbob hover:bg-plumbob-light text-white font-semibold rounded-xl shadow-lg shadow-plumbob/20 hover:shadow-plumbob/40 active:scale-[0.97] transition-all duration-200 cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Procesando
                  </>
                ) : (
                  'Sí, quiero ser beta'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
