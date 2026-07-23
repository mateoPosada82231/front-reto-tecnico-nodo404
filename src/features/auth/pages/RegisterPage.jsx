import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl mb-2">
          Crear Cuenta
        </h1>
        <p className="text-slate-600 text-sm md:text-base">
          Regístrate para acceder a todas las funcionalidades.
        </p>
      </div>

      <RegisterForm />
    </section>
  );
}

export default RegisterPage;