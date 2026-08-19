import useContent from '../../../shared/hooks/useContent'
import RegisterForm from '../components/RegisterForm'

function RegisterPage() {
  const { content } = useContent('auth.register')

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12 animate-fade-in">
      <div className="text-center max-w-xl 3xl:max-w-2xl 4k:max-w-3xl">
        <h1 className="text-3xl font-extrabold text-text-main md:text-4xl 3xl:text-5xl mb-3 tracking-tight">
          {content.title}
        </h1>
        <p className="text-text-sub text-sm md:text-base 3xl:text-lg leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      <RegisterForm />
    </section>
  )
}

export default RegisterPage
