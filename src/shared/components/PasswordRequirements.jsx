import { useState, useEffect, useRef } from 'react'
import { Check, Circle } from 'lucide-react'

function PasswordRequirements({ value = '', requirements = [], visible = false }) {
  const [show, setShow] = useState(false)
  const firstRender = useRef(true)

  useEffect(() => {
    if (visible) {
      setShow(true)
      return
    }
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const t = setTimeout(() => setShow(false), 200)
    return () => clearTimeout(t)
  }, [visible])

  if (!requirements.length) return null

  return (
    <div
      aria-live="polite"
      className={`overflow-hidden transition-all duration-200 ease-out ${
        show ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'
      }`}
    >
      <ul className="space-y-1 rounded-xl border border-border/40 bg-slate-surface/50 px-3.5 py-2.5">
        {requirements.map((req) => {
          const met = Boolean(req.test(value))
          return (
            <li
              key={req.key}
              className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                met ? 'text-plumbob' : 'text-text-sub'
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center transition-transform duration-200 ${
                  met ? 'check-pop' : ''
                }`}
              >
                {met ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  <Circle className="h-2.5 w-2.5 opacity-40" />
                )}
              </span>
              <span className="relative inline-block">
                <span className={`transition-colors duration-200 ${met ? 'line-through' : ''}`}>
                  {req.label}
                </span>
                <span
                  className={`pointer-events-none absolute left-0 top-1/2 h-px origin-left bg-plumbob transition-transform duration-300 ease-out ${
                    met ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ width: '100%', marginTop: '-0.5px' }}
                />
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PasswordRequirements
