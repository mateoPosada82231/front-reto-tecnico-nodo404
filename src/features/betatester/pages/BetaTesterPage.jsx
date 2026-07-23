import BetaTesterForm from '../components/BetaTesterForm'

function BetaTesterPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12 animate-fade-in">
      <div className="text-center max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-plumbob/10 border border-plumbob/30 px-4 py-1.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-plumbob animate-pulse" />
          <span className="text-xs font-semibold text-plumbob uppercase tracking-wider">Beta Program</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-main md:text-4xl mb-3 tracking-tight">
          Conviértete en Beta Tester
        </h1>
        <p className="text-text-sub text-sm md:text-base leading-relaxed">
          Ayúdanos a probar las nuevas expansiones de Los Sims antes que nadie.
        </p>
      </div>

      <BetaTesterForm />
    </section>
  )
}

export default BetaTesterPage
