import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12 animate-fade-in">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-extrabold text-text-main md:text-4xl mb-3 tracking-tight">
          Iniciar Sesión
        </h1>
        <p className="text-text-sub text-sm md:text-base leading-relaxed">
          Accede con tu cuenta para gestionar tus compras.
        </p>
      </div>

      <LoginForm />
    </section>
  )
}

export default LoginPage
