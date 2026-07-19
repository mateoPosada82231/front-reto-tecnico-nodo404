import React from 'react';
import HeroSection from './HeroSection';
import ExpansionGrid from './ExpansionGrid';

function LandingPage() {
  return (
    <div className="w-full flex flex-col gap-12 pb-16">
      <HeroSection />
      <ExpansionGrid />
    </div>
  );
}

export default LandingPage;