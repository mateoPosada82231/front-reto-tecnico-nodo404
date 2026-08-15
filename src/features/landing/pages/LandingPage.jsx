import React from 'react'
import { ExtensionsProvider } from '../context/ExtensionsProvider'
import HeroSection from '../components/HeroSection'
import ExpansionGrid from '../components/ExpansionGrid'
import WelcomeModal from '../components/WelcomeModal'

function LandingPage() {
  return (
    <ExtensionsProvider>
      <div className="w-full flex flex-col gap-16 pb-16">
        <WelcomeModal />
        <HeroSection />
        <ExpansionGrid />
      </div>
    </ExtensionsProvider>
  )
}

export default LandingPage
