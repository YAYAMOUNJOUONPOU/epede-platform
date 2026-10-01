import React from 'react';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

export const SolarTrustBar: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title with decorative flanking divider lines */}
        <div className="flex items-center justify-center gap-4 mb-8 sm:mb-10">
          <div className="h-px bg-slate-200 flex-1 max-w-xs" />
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase text-center">
            Trusted by homeowners & businesses nationwide
          </span>
          <div className="h-px bg-slate-200 flex-1 max-w-xs" />
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center opacity-85 hover:opacity-100 transition-opacity">
          {/* Badge 1: KABGEP / Clean Energy Council */}
          <div className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-black text-sm">
              ☀️
            </div>
            <div className="text-left leading-tight font-sans">
              <strong className="block text-xs font-black text-slate-800 tracking-wider">
                KABGEP
              </strong>
              <span className="text-[10px] text-slate-500 font-medium">Clean Energy</span>
            </div>
          </div>

          {/* Badge 2: NABCEP Certified */}
          <div className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xs">
              <Award className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-left leading-tight font-sans">
              <strong className="block text-xs font-black text-slate-800 tracking-wider">
                NABCEP
              </strong>
              <span className="text-[10px] text-slate-500 font-medium">Certified PV Pros</span>
            </div>
          </div>

          {/* Badge 3: 25 Year Warranty Gold Badge */}
          <div className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
              25
            </div>
            <div className="text-left leading-tight font-sans">
              <strong className="block text-xs font-black text-slate-800 tracking-wider">
                25 YEARS
              </strong>
              <span className="text-[10px] text-slate-500 font-medium">Full Warranty</span>
            </div>
          </div>

          {/* Badge 4: SEIA Member */}
          <div className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-left leading-tight font-sans">
              <strong className="block text-xs font-black text-slate-800 tracking-wider">
                SEIA
              </strong>
              <span className="text-[10px] text-slate-500 font-medium">Solar Industry</span>
            </div>
          </div>

          {/* Badge 5: BBB Accredited A+ */}
          <div className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-md bg-blue-900 text-white flex items-center justify-center font-black text-xs">
              BBB
            </div>
            <div className="text-left leading-tight font-sans">
              <strong className="block text-xs font-black text-slate-800 tracking-wider">
                A+ RATED
              </strong>
              <span className="text-[10px] text-slate-500 font-medium">Accredited Biz</span>
            </div>
          </div>

          {/* Badge 6: Top Solar Contractor 2025 */}
          <div className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-left leading-tight font-sans">
              <strong className="block text-xs font-black text-slate-800 tracking-wider">
                TOP 1%
              </strong>
              <span className="text-[10px] text-slate-500 font-medium">Solar Contractor</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
