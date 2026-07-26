import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useContent from '../../../shared/hooks/useContent'

function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { content } = useContent('auth.oauth')

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (token && email) {
      localStorage.setItem('token', token)
      localStorage.setItem('userEmail', email)
      window.dispatchEvent(new CustomEvent('token-changed'))
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [searchParams, navigate])

  return (
    <section className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-plumbob/30 border-t-plumbob rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-sub text-sm">{content.loading_text}</p>
      </div>
    </section>
  )
}

export default OAuthCallback
