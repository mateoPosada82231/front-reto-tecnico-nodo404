import React from 'react';
import HeroSection from './HeroSection';
import ExpansionGrid from './ExpansionGrid';
import WelcomeModal from '../../../shared/components/molecules/WelcomeModal';

function LandingPage() {
  return (
    <div className="w-full flex flex-col gap-12 pb-16">

      <WelcomeModal />

      <HeroSection />

      <ExpansionGrid />

    </div>
  );
}

export default LandingPage;