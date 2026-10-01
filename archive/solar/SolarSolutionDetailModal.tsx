import React from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Sun, Building, Home, Battery, Sparkles } from 'lucide-react';

interface SolarSolutionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  solutionType: 'residential' | 'commercial' | null;
  onOpenQuoteModal: () => void;
}

export const SolarSolutionDetailModal: React.FC<SolarSolutionDetailModalProps> = ({
  isOpen,
  onClose,
  solutionType,
  onOpenQuoteModal,
}) => {
  if (!isOpen || !solutionType) return null;

  const isResidential = solutionType === 'residential';

  const details = isResidential
    ? {
        title: 'Residential Solar Systems',
        tagline: 'Engineered for maximum home aesthetic elegance, zero-down affordability, and energy resilience.',
        heroImg:
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        specs: [
          { label: 'Panel Efficiency', value: '22.8% Monocrystalline' },
          { label: 'Warranty', value: '25-Year Production & Labor' },
          { label: 'Average Payback', value: '5 to 7 Years' },
          { label: 'Tax Credit', value: '30% Federal Clean Energy' },
        ],
        features: [
          'All-black sleek aesthetic panels with concealed mounting hardware',
          'Enphase IQ8 microinverters for per-panel peak sunlight harvesting',
          'Optional Tesla Powerwall or Enphase battery storage integration',
          'Real-time smartphone generation and consumption telemetry app',
          'Full permitting, utility interconnection and HOA compliance handled by Solar Shark',
        ],
      }
    : {
        title: 'Commercial Solar Installations',
        tagline: 'Commercial EPC solar power solutions delivering corporate cost reduction, ESG compliance, and tax optimization.',
        heroImg:
          'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
        specs: [
          { label: 'Capacity Range', value: '50 kW to 2.5 MW+' },
          { label: 'Depreciation', value: '1-Year MACRS Accelerated' },
          { label: 'Tax Credit', value: '30% ITC + Local RECs' },
          { label: 'Monitoring', value: 'SCADA & Industrial IoT' },
        ],
        features: [
          'Non-penetrating ballasted flat-roof racking systems protecting membrane warranties',
          'Commercial string inverters with integrated rapid shutdown and arc fault protection',
          'Peak demand shaving algorithms to slash utility demand surcharges',
          'Solar carports and EV charging fleet integration packages',
          'Turnkey PPA, solar lease, and capital purchase financing structures',
        ],
      };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
        {/* Header with image */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-900">
          <img
            src={details.heroImg}
            alt={details.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091827] via-[#091827]/60 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on Image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
              {isResidential ? <Home className="w-4 h-4" /> : <Building className="w-4 h-4" />}
              <span>Solar Shark Engineering Series</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">{details.title}</h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            {details.tagline}
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {details.specs.map((spec, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  {spec.label}
                </span>
                <strong className="text-xs sm:text-sm font-bold text-[#0B1E32]">
                  {spec.value}
                </strong>
              </div>
            ))}
          </div>

          {/* Features List */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Included Engineering Deliverables
            </h4>
            <ul className="space-y-2.5">
              {details.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Footer */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenQuoteModal();
              }}
              className="w-2/3 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Free {isResidential ? 'Home' : 'Commercial'} Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
