import React, { useState, useId } from 'react';
import { ArrowRight, ChevronDown, CheckCircle2, Sparkles } from 'lucide-react';

interface SolarSolutionsSectionProps {
  onOpenQuoteModal: () => void;
  onOpenSavingsModal: (billAmount: number, zipCode: string, roofType: string) => void;
  onOpenSolutionDetail: (solutionType: 'residential' | 'commercial') => void;
}

export const SolarSolutionsSection: React.FC<SolarSolutionsSectionProps> = ({
  onOpenQuoteModal,
  onOpenSavingsModal,
  onOpenSolutionDetail,
}) => {
  const billInputId = useId();
  const zipInputId = useId();
  const roofSelectId = useId();

  const [monthlyBill, setMonthlyBill] = useState<number>(180);
  const [zipCode, setZipCode] = useState<string>('92101');
  const [roofType, setRoofType] = useState<string>('Asphalt Shingle');
  const [showQuickResult, setShowQuickResult] = useState<boolean>(false);

  // Approximate solar math based on bill
  const estimatedSystemKw = (monthlyBill / 22).toFixed(1);
  const estimatedMonthlySavings = Math.round(monthlyBill * 0.72);
  const estimated25YearSavings = Math.round(monthlyBill * 12 * 25 * 0.75).toLocaleString();
  const estimatedFederalTaxCredit = Math.round(Number(estimatedSystemKw) * 2800 * 0.3).toLocaleString();

  const handleCalculateClick = () => {
    setShowQuickResult(true);
    onOpenSavingsModal(monthlyBill, zipCode, roofType);
  };

  return (
    <section
      id="solutions"
      className="relative py-20 sm:py-24 bg-gradient-to-b from-[#0A2540] via-[#0B2A4A] to-[#071F38] text-white overflow-hidden"
    >
      {/* Background Solar Flare Glow Effect in Top Right */}
      <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-amber-300/20 via-cyan-400/15 to-transparent blur-3xl pointer-events-none" />

      {/* Decorative subtle grid background lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-2">
          <span className="inline-block text-xs sm:text-sm font-bold tracking-widest text-cyan-300 uppercase">
            Our Solar Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            See How Much You Can Save with Solar Shark
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto pt-1">
            Tailored solar engineering and battery energy storage for every roof, property size, and energy profile.
          </p>
        </div>

        {/* 3 Columns Layout: Calculator + Residential + Commercial */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
          {/* Card 1: Interactive Savings Estimator (White Card) */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-2xl text-slate-900 flex flex-col justify-between border border-slate-100 relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                  Instant Estimator
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  30% Tax Credit
                </span>
              </div>

              {/* Monthly Bill Input */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between">
                  <label htmlFor={billInputId} className="text-sm font-bold text-[#0B1E32]">
                    Average Monthly Electric Bill
                  </label>
                  <span className="text-lg font-extrabold text-cyan-700">
                    ${monthlyBill} / mo
                  </span>
                </div>

                <input
                  id={billInputId}
                  type="range"
                  min="60"
                  max="600"
                  step="10"
                  value={monthlyBill}
                  onChange={(e) => {
                    setMonthlyBill(Number(e.target.value));
                    setShowQuickResult(false);
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />

                <div className="flex justify-between text-[11px] text-slate-600 font-medium pt-1">
                  <span>$60</span>
                  <span>$250</span>
                  <span>$400</span>
                  <span>$600+</span>
                </div>
              </div>

              {/* Quick Bill Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mb-5">
                {[100, 150, 200, 300].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setMonthlyBill(val);
                      setShowQuickResult(false);
                    }}
                    className={`py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      monthlyBill === val
                        ? 'bg-cyan-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>

              {/* Zip Code Input */}
              <div className="mb-4">
                <label htmlFor={zipInputId} className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                  Your Zip Code
                </label>
                <div className="relative">
                  <input
                    id={zipInputId}
                    type="text"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 5-digit ZIP code"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 font-medium">
                    US Metro
                  </span>
                </div>
              </div>

              {/* Roof Type Dropdown */}
              <div className="mb-6">
                <label htmlFor={roofSelectId} className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                  Roof Type
                </label>
                <div className="relative">
                  <select
                    id={roofSelectId}
                    value={roofType}
                    onChange={(e) => setRoofType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 pr-10 cursor-pointer"
                  >
                    <option value="Asphalt Shingle">Asphalt Shingle (Most Common)</option>
                    <option value="Clay / Concrete Tile">Clay / Concrete Tile</option>
                    <option value="Standing Seam Metal">Standing Seam Metal</option>
                    <option value="Flat / Rubber Roof">Flat / Membrane Roof</option>
                    <option value="Ground Mount Array">Ground Mount Array</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Live Preview Metric Pills */}
              {showQuickResult && (
                <div className="mb-5 p-3.5 rounded-xl bg-cyan-50 border border-cyan-100 text-slate-800 space-y-1.5 text-xs animate-in fade-in">
                  <div className="flex justify-between font-medium">
                    <span>Est. System Size:</span>
                    <strong className="text-cyan-800 font-bold">{estimatedSystemKw} kW</strong>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Est. Monthly Savings:</span>
                    <strong className="text-emerald-700 font-bold">~${estimatedMonthlySavings}/mo</strong>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>25-Year Net Savings:</span>
                    <strong className="text-[#0B1E32] font-bold">${estimated25YearSavings}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Calculate CTA Button */}
            <button
              type="button"
              onClick={handleCalculateClick}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Calculate Your Savings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Residential Solar Systems */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl text-slate-900 flex flex-col justify-between border border-slate-100 transition-all duration-300 hover:-translate-y-1 group">
            <div>
              {/* Image Container */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
                  alt="Residential modern house with rooftop solar panels"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0B2545]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Homeowners
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0B1E32] mb-2">
                  Residential Solar Systems
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Schedule a no-obligation consultation and get expert advice on going solar for your home.
                </p>

                {/* Key Benefits */}
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>$0 down flexible financing & solar leases</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>25-year all-inclusive panel & inverter warranty</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Smart app real-time solar generation tracking</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-6 pt-0">
              <button
                type="button"
                onClick={() => onOpenSolutionDetail('residential')}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#0B2545] hover:bg-[#071A30] shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Card 3: Commercial Solar Installations */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl text-slate-900 flex flex-col justify-between border border-slate-100 transition-all duration-300 hover:-translate-y-1 group">
            <div>
              {/* Image Container */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=800&q=80"
                  alt="Commercial building rooftop solar array"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-teal-800/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Commercial & Industrial
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0B1E32] mb-2">
                  Commercial Solar Installations
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Our certified installers set up your panels for optimal performance, peak demand reduction, and maximum tax write-offs.
                </p>

                {/* Key Benefits */}
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Accelerated MACRS depreciation + 30% tax credit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Peak demand shaving & battery backup resilience</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Turnkey EPC engineering, procurement & permitting</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-6 pt-0">
              <button
                type="button"
                onClick={() => onOpenSolutionDetail('commercial')}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#0B2545] hover:bg-[#071A30] shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
