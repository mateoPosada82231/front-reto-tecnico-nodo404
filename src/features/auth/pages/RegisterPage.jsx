import React from 'react';
import { useTranslation } from 'react-i18next';
import RegisterForm from '../../landing/pages/RegisterForm';

function RegisterPage() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl mb-2">
          {t('registerPage.title')}
        </h1>
        <p className="text-slate-600 text-sm md:text-base">
          {t('registerPage.subtitle')}
        </p>
      </div>

      <RegisterForm />
    </section>
  );
}

export default RegisterPage;