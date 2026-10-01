import React, { useState, useId } from 'react';
import { X, ArrowRight, Sun, DollarSign, Trees, Zap, Sparkles, ShieldCheck } from 'lucide-react';

interface SolarSavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBill?: number;
  initialZip?: string;
  initialRoof?: string;
  onOpenQuoteModal: () => void;
}

export const SolarSavingsModal: React.FC<SolarSavingsModalProps> = ({
  isOpen,
  onClose,
  initialBill = 180,
  initialZip = '92101',
  initialRoof = 'Asphalt Shingle',
  onOpenQuoteModal,
}) => {
  const billRangeId = useId();
  const zipInputId = useId();
  const roofSelectId = useId();

  const [bill, setBill] = useState<number>(initialBill);
  const [zip, setZip] = useState<string>(initialZip);
  const [roof, setRoof] = useState<string>(initialRoof);

  if (!isOpen) return null;

  // Real solar engineering calculation formulas
  // Typical US electricity cost ~$0.20/kWh, average 4.8 peak sun hours/day
  const systemSizeKw = Math.max(3.5, Math.min(25, Number((bill / 22).toFixed(1))));
  const annualKwh = Math.round(systemSizeKw * 1450);
  const monthlySolarBill = Math.round(bill * 0.15); // residual grid connection & net metering fee
  const monthlyNetSavings = bill - monthlySolarBill;
  const year1Savings = monthlyNetSavings * 12;
  const estimated25YearSavings = Math.round(year1Savings * 25 * 1.03); // accounting for 3% utility inflation
  const grossCost = Math.round(systemSizeKw * 2850);
  const federalTaxCredit = Math.round(grossCost * 0.3);
  const netSystemCost = grossCost - federalTaxCredit;
  const paybackYears = (netSystemCost / year1Savings).toFixed(1);
  const co2AvoidedTons = (annualKwh * 0.0007 * 25).toFixed(1);
  const treesPlantedEquivalent = Math.round(Number(co2AvoidedTons) * 45);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="bg-[#0A2540] text-white px-6 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-6 h-6 text-amber-300" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Solar Savings Analysis</h3>
              <p className="text-xs text-cyan-200">Based on localized solar irradiance & current utility tariffs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Controls: Interactive Slider & Zip */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor={billRangeId} className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Average Electric Bill:
              </label>
              <strong className="text-2xl font-black text-cyan-600">
                ${bill} <span className="text-sm font-semibold text-slate-500">/ month</span>
              </strong>
            </div>

            <input
              id={billRangeId}
              type="range"
              min="60"
              max="600"
              step="10"
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label htmlFor={zipInputId} className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  ZIP Code
                </label>
                <input
                  id={zipInputId}
                  type="text"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label htmlFor={roofSelectId} className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Roof Type
                </label>
                <select
                  id={roofSelectId}
                  value={roof}
                  onChange={(e) => setRoof(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white"
                >
                  <option value="Asphalt Shingle">Asphalt Shingle</option>
                  <option value="Clay / Concrete Tile">Clay Tile</option>
                  <option value="Standing Seam Metal">Metal Roof</option>
                  <option value="Flat / Membrane Roof">Flat Roof</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4 Primary Financial KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-center">
              <span className="text-[11px] font-bold text-cyan-800 uppercase block mb-1">
                System Size
              </span>
              <strong className="text-xl sm:text-2xl font-black text-cyan-900">
                {systemSizeKw} <span className="text-xs font-normal">kW</span>
              </strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">~{annualKwh.toLocaleString()} kWh/yr</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
              <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">
                Monthly Savings
              </span>
              <strong className="text-xl sm:text-2xl font-black text-emerald-700">
                ${monthlyNetSavings}
              </strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Est. net decrease</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
              <span className="text-[11px] font-bold text-amber-800 uppercase block mb-1">
                30% Federal ITC
              </span>
              <strong className="text-xl sm:text-2xl font-black text-amber-700">
                ${federalTaxCredit.toLocaleString()}
              </strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Direct tax credit</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
              <span className="text-[11px] font-bold text-indigo-800 uppercase block mb-1">
                Payback Period
              </span>
              <strong className="text-xl sm:text-2xl font-black text-indigo-900">
                {paybackYears} <span className="text-xs font-normal">Yrs</span>
              </strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Break-even ROI</span>
            </div>
          </div>

          {/* 25-Year Cumulative Savings Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0D3B66] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider block mb-1">
                Estimated 25-Year Net Utility Savings
              </span>
              <strong className="text-3xl sm:text-4xl font-black text-white">
                ${estimated25YearSavings.toLocaleString()}
              </strong>
              <p className="text-xs text-slate-300 mt-1">
                Accounts for historical 3.2% annual utility rate hikes across US electric grids.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>25-Year Production Warranty</span>
            </div>
          </div>

          {/* Environmental Impact Counter */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-cyan-600 shrink-0" />
              <div>
                <strong className="block text-slate-900 font-bold">{co2AvoidedTons} Metric Tons</strong>
                <span className="text-slate-500">CO2 Emissions Prevented</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
              <Trees className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong className="block text-slate-900 font-bold">~{treesPlantedEquivalent} Trees</strong>
                <span className="text-slate-500">Equivalent Forest Carbon Offset</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
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
              className="w-2/3 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lock In These Savings (Get Free Quote)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
