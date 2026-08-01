import { useTranslation } from 'react-i18next'

function LoginPage() {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-slate-900 md:text-5xl">{t('loginPage.title')}</h1>
      <p className="max-w-xl text-slate-600 md:text-lg">
        {t('loginPage.subtitle')}
      </p>
    </section>
  )
}

export default LoginPage