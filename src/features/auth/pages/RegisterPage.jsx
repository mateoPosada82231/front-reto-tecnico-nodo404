import RegisterForm from '../components/RegisterForm'

function RegisterPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12 animate-fade-in">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-extrabold text-text-main md:text-4xl mb-3 tracking-tight">
          Crear Cuenta
        </h1>
        <p className="text-text-sub text-sm md:text-base leading-relaxed">
          Regístrate para acceder a todas las funcionalidades.
        </p>
      </div>

      <RegisterForm />
    </section>
  )
}

export default RegisterPage
