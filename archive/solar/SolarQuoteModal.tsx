import React, { useState, useId } from 'react';
import { X, CheckCircle2, ArrowRight, Sun, Sparkles, Phone, Mail, MapPin } from 'lucide-react';
import { SolarLogo } from './SolarLogo';

interface SolarQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBill?: number;
}

export const SolarQuoteModal: React.FC<SolarQuoteModalProps> = ({
  isOpen,
  onClose,
  defaultBill = 180,
}) => {
  const zipInputId = useId();
  const addressInputId = useId();
  const nameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();

  const [step, setStep] = useState<number>(1);
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial'>('residential');
  const [zip, setZip] = useState<string>('92101');
  const [address, setAddress] = useState<string>('1234 Ocean Drive');
  const [monthlyBill, setMonthlyBill] = useState<number>(defaultBill);
  const [ownHome, setOwnHome] = useState<boolean>(true);
  const [name, setName] = useState<string>('Alex Morgan');
  const [email, setEmail] = useState<string>('alex.morgan@example.com');
  const [phone, setPhone] = useState<string>('(555) 234-5678');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const estimatedKw = (monthlyBill / 22).toFixed(1);
  const estimatedSavings = Math.round(monthlyBill * 12 * 25 * 0.74).toLocaleString();
  const federalCredit = Math.round(Number(estimatedKw) * 2800 * 0.3).toLocaleString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
        {/* Modal Top Header */}
        <div className="bg-[#091827] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SolarLogo size="sm" />
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-widest pl-2 border-l border-slate-700">
              Free Quote
            </span>
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

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {!isSubmitted ? (
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Step {step} of 3
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s === step
                          ? 'w-8 bg-cyan-600'
                          : s < step
                          ? 'w-4 bg-emerald-500'
                          : 'w-4 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: Property and Location */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1E32]">
                      What type of property are you powering?
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      We calibrate sunlight exposure based on your location and roof layout.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPropertyType('residential')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        propertyType === 'residential'
                          ? 'border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/30'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">🏡</span>
                      <strong className="block text-sm font-bold">Residential</strong>
                      <span className="text-xs text-slate-500">Single family & duplex</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPropertyType('commercial')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        propertyType === 'commercial'
                          ? 'border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-500/30'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">🏢</span>
                      <strong className="block text-sm font-bold">Commercial</strong>
                      <span className="text-xs text-slate-500">Warehouses, offices & retail</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor={zipInputId} className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        ZIP Code
                      </label>
                      <input
                        id={zipInputId}
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="e.g. 92101"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label htmlFor={addressInputId} className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Street Address (Optional)
                      </label>
                      <input
                        id={addressInputId}
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 1234 Sunny View Way"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Next: Energy Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Electric Bill & Ownership */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1E32]">
                      What is your average electric bill?
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      This determines the number of high-efficiency panels your roof needs.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-700">Monthly Utility Cost:</span>
                      <strong className="text-2xl font-black text-cyan-600">
                        ${monthlyBill} / mo
                      </strong>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="600"
                      step="10"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Do you own this property?
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOwnHome(true)}
                        className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                          ownHome
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        Yes, I own it
                      </button>
                      <button
                        type="button"
                        onClick={() => setOwnHome(false)}
                        className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                          !ownHome
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        I rent / lease
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-2/3 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Next: Contact Info</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact details and final quote submission */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1E32]">
                      Where should we send your custom design?
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      No obligation. Receive a 3D satellite solar roof preview within 15 minutes.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor={nameInputId} className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        id={nameInputId}
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label htmlFor={emailInputId} className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        id={emailInputId}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label htmlFor={phoneInputId} className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phone Number
                      </label>
                      <input
                        id={phoneInputId}
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl text-xs text-cyan-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>
                      Includes free 30% Federal ITC qualification & 25-year production estimate.
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Get Instant Free Quote</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Confirmation Success State */
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                  Quote Request Confirmed!
                </span>
                <h3 className="text-2xl font-black text-[#0B1E32]">
                  Thank You, {name}!
                </h3>
                <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">
                  Our Solar Shark design specialist has generated your preliminary satellite solar layout for{' '}
                  <strong>{zip}</strong>.
                </p>
              </div>

              {/* Estimate Summary Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-emerald-50 border border-cyan-100 text-left space-y-2.5 text-xs text-slate-800">
                <div className="flex justify-between font-medium">
                  <span>Recommended System:</span>
                  <strong className="text-cyan-900 font-bold">{estimatedKw} kW Tier-1 PV</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Estimated 25-Year Savings:</span>
                  <strong className="text-emerald-700 font-bold">${estimatedSavings}</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Estimated 30% Federal ITC:</span>
                  <strong className="text-[#0B1E32] font-bold">${federalCredit}</strong>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#0B2545] hover:bg-[#071A30] shadow-md transition-all cursor-pointer"
                >
                  Close & View Website
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
