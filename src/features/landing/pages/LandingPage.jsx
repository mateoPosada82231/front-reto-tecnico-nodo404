import React from 'react';
import HeroSection from '../components/HeroSection';
import ExpansionGrid from '../components/ExpansionGrid';
import WelcomeModal from '../components/WelcomeModal';

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