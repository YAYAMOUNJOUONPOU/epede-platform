import React, { useState } from 'react';
import { SolarHeader } from './SolarHeader';
import { SolarHero } from './SolarHero';
import { SolarWhyChoose } from './SolarWhyChoose';
import { SolarHowItWorks } from './SolarHowItWorks';
import { SolarSolutionsSection } from './SolarSolutionsSection';
import { SolarTestimonials } from './SolarTestimonials';
import { SolarTrustBar } from './SolarTrustBar';
import { SolarFooter } from './SolarFooter';
import { SolarQuoteModal } from './SolarQuoteModal';
import { SolarSavingsModal } from './SolarSavingsModal';
import { SolarSolutionDetailModal } from './SolarSolutionDetailModal';
import { SolarPricingModal } from './SolarPricingModal';
import { SolarContactModal } from './SolarContactModal';

export const SolarHomeView: React.FC = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState<boolean>(false);
  const [savingsInitialBill, setSavingsInitialBill] = useState<number>(180);
  const [savingsInitialZip, setSavingsInitialZip] = useState<string>('92101');
  const [savingsInitialRoof, setSavingsInitialRoof] = useState<string>('Asphalt Shingle');
  const [solutionDetailType, setSolutionDetailType] = useState<'residential' | 'commercial' | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  const handleOpenSavingsModal = (bill: number, zip: string, roof: string) => {
    setSavingsInitialBill(bill);
    setSavingsInitialZip(zip);
    setSavingsInitialRoof(roof);
    setIsSavingsModalOpen(true);
  };

  const handleScrollToCalculator = () => {
    const el = document.getElementById('solutions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'pricing') {
      setIsPricingModalOpen(true);
      return;
    }
    if (sectionId === 'contact') {
      setIsContactModalOpen(true);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      {/* 1. Header Navigation */}
      <SolarHeader
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        activeNav={activeSection}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Sections matching image exactly */}
      <main className="flex-grow">
        {/* 2. Hero Section */}
        <SolarHero
          onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
          onScrollToCalculator={handleScrollToCalculator}
        />

        {/* 3. Why Go Solar with Solar Shark? (4 Feature Cards) */}
        <SolarWhyChoose />

        {/* 4. Our Solar Energy Works (4 Steps with Arrows) */}
        <SolarHowItWorks onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

        {/* 5. Our Solar Solutions + Savings Estimator & Residential/Commercial Cards */}
        <SolarSolutionsSection
          onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
          onOpenSavingsModal={handleOpenSavingsModal}
          onOpenSolutionDetail={(type) => setSolutionDetailType(type)}
        />

        {/* 6. What Our Customers Say (Solar array backdrop + 3 review cards) */}
        <SolarTestimonials />

        {/* 7. Trust Ribbon (Trusted by homeowners & businesses nationwide) */}
        <SolarTrustBar />
      </main>

      {/* 8. Footer */}
      <SolarFooter
        onNavigateSection={handleNavigateSection}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
      />

      {/* Interactive Modals */}
      <SolarQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        defaultBill={savingsInitialBill}
      />

      <SolarSavingsModal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
        initialBill={savingsInitialBill}
        initialZip={savingsInitialZip}
        initialRoof={savingsInitialRoof}
        onOpenQuoteModal={() => {
          setIsSavingsModalOpen(false);
          setIsQuoteModalOpen(true);
        }}
      />

      <SolarSolutionDetailModal
        isOpen={solutionDetailType !== null}
        onClose={() => setSolutionDetailType(null)}
        solutionType={solutionDetailType}
        onOpenQuoteModal={() => {
          setSolutionDetailType(null);
          setIsQuoteModalOpen(true);
        }}
      />

      <SolarPricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onOpenQuoteModal={() => {
          setIsPricingModalOpen(false);
          setIsQuoteModalOpen(true);
        }}
      />

      <SolarContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};
