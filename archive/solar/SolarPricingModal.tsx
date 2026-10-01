import React from 'react';
import { X, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface SolarPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal: () => void;
}

export const SolarPricingModal: React.FC<SolarPricingModalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal,
}) => {
  if (!isOpen) return null;

  const tiers = [
    {
      name: 'Essential Solar',
      target: '1-2 Bedroom Homes',
      kw: '5.5 kW System',
      monthly: '$89 / mo',
      zeroDown: '$0 Down Financing',
      features: [
        '14 Tier-1 Monocrystalline Panels',
        'Enphase IQ8 Microinverter Array',
        '25-Year Equipment Warranty',
        'Standard App Energy Tracking',
        'Net Metering Interconnection',
      ],
      popular: false,
    },
    {
      name: 'Signature Solar + Power',
      target: '3-4 Bedroom Family Homes',
      kw: '9.2 kW System',
      monthly: '$139 / mo',
      zeroDown: '$0 Down Financing',
      features: [
        '23 All-Black Ultra-Efficiency Panels',
        'Dual Circuit EV Charger Integration',
        'Enphase IQ Battery 5P Ready',
        '25-Year Production & Roof Leak Guarantee',
        'Priority 24/7 Grid Monitoring',
      ],
      popular: true,
    },
    {
      name: 'Complete Independence',
      target: 'Large Homes & High Usage',
      kw: '14.8 kW + Battery Backup',
      monthly: '$219 / mo',
      zeroDown: '$0 Down Financing',
      features: [
        '37 Tier-1 High-Wattage Panels',
        'Tesla Powerwall 3 Integrated Battery',
        'Full Whole-Home Outage Protection',
        'Smart Load Management Panel',
        'Lifetime VIP Concierge Dispatch',
      ],
      popular: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="bg-[#091827] text-white px-6 sm:px-8 py-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Transparent Solar Pricing
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              $0 Down Options with Locked-in Predictable Rates
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between border transition-all ${
                  tier.popular
                    ? 'border-cyan-500 bg-cyan-50/40 shadow-xl ring-2 ring-cyan-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  {tier.popular && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-700 bg-cyan-100 px-2.5 py-0.5 rounded-full mb-2">
                      <Sparkles className="w-3 h-3" /> Most Popular
                    </span>
                  )}
                  <h4 className="text-lg font-bold text-[#0B1E32]">{tier.name}</h4>
                  <span className="text-xs text-slate-500 block mb-3">{tier.target}</span>

                  <div className="mb-4 pb-4 border-b border-slate-200">
                    <strong className="text-2xl sm:text-3xl font-black text-[#0B1E32]">
                      {tier.monthly}
                    </strong>
                    <span className="text-xs text-slate-500 block mt-0.5 font-medium">
                      {tier.zeroDown} · {tier.kw}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700 mb-6">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenQuoteModal();
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    tier.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:from-emerald-400 hover:to-teal-400'
                      : 'bg-[#0B2545] text-white hover:bg-[#071A30]'
                  }`}
                >
                  <span>Select Plan & Get Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
            <p>
              * All packages qualify for the <strong>30% Federal Clean Energy Tax Credit</strong> and local utility net metering credits. Custom system sizing is provided for your specific roof geometry.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
