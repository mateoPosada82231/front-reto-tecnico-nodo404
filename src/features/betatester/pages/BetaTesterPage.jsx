import BetaTesterForm from '../components/BetaTesterForm'

function BetaTesterPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl mb-2">
          Conviértete en Beta Tester
        </h1>
        <p className="text-slate-600 text-sm md:text-base">
          Ayúdanos a probar las nuevas expansiones de Los Sims antes que nadie.
        </p>
      </div>

      <BetaTesterForm />
    </section>
  )
}

export default BetaTesterPage
