import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SolarHowItWorksProps {
  onOpenQuoteModal: () => void;
}

export const SolarHowItWorks: React.FC<SolarHowItWorksProps> = ({ onOpenQuoteModal }) => {
  const steps = [
    {
      step: '01',
      badgeColor: 'bg-[#0B2545] text-white shadow-md shadow-[#0B2545]/20',
      title: 'Free Solar Consultation',
      description:
        'Schedule a no-obligation consultation and get expert advice on going solar.',
    },
    {
      step: '02',
      badgeColor: 'bg-[#0EA5E9] text-white shadow-md shadow-sky-500/25',
      title: 'Custom System Design',
      description:
        'We design a tailored solar solution to maximize your energy savings.',
    },
    {
      step: '03',
      badgeColor: 'bg-[#0B2545] text-white shadow-md shadow-[#0B2545]/20',
      title: 'Professional Installation',
      description:
        'Our certified installers set up your panels for optimal performance.',
    },
    {
      step: '04',
      badgeColor: 'bg-[#0EA5E9] text-white shadow-md shadow-sky-500/25',
      title: 'Start Saving with Solar',
      description:
        'Generate your own clean energy and watch your utility bills drop!',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E32] tracking-tight">
            Our Solar Energy Works
          </h2>
          <p className="mt-3 text-base text-slate-600">
            A seamless, stress-free path from consultation to turning on your clean power plant.
          </p>
        </div>

        {/* 4 Steps Flow with Arrow Connectors */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-6 relative">
            {steps.map((item, index) => {
              const isLast = index === steps.length - 1;
              return (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Numbered Circle Badge */}
                  <div className="relative mb-5">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-black tracking-tight transition-transform duration-300 group-hover:scale-110 ${item.badgeColor}`}
                    >
                      {item.step}
                    </div>

                    {/* Connecting Arrow for Desktop (between steps) */}
                    {!isLast && (
                      <div className="hidden md:flex absolute top-1/2 -right-8 lg:-right-6 -translate-y-1/2 z-10 text-sky-400">
                        <ArrowRight className="w-6 h-6 stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  {/* Step Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B1E32] mb-2 px-2">
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-sm text-slate-600 leading-relaxed max-w-xs px-2">
                    {item.description}
                  </p>

                  {/* Mobile downward connector */}
                  {!isLast && (
                    <div className="md:hidden mt-6 text-sky-400 rotate-90">
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Callout banner */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={onOpenQuoteModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-[#0B2545] hover:bg-[#07192F] shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          >
            <span>Book Your Free Consultation Today</span>
            <ArrowRight className="w-4 h-4 text-cyan-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
