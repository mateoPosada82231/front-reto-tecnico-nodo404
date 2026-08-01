import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="w-full border-t border-slate-200 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500 md:px-8">
        © {new Date().getFullYear()} {t('footer.rights')}
      </div>
    </footer>
  )
}

export default Footer