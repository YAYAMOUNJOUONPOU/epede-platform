import React from 'react';
import { Zap, Leaf, BadgePercent, BatteryCharging } from 'lucide-react';

export const SolarWhyChoose: React.FC = () => {
  const benefits = [
    {
      id: 'lower-bills',
      title: 'Lower Electricity Bills',
      description: 'Cut your monthly energy costs and lock in long-term savings.',
      icon: Zap,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      stat: 'Up to 80% Reduction',
    },
    {
      id: 'clean-energy',
      title: 'Clean Renewable Energy',
      description: 'Reduce your carbon footprint with sustainable solar power.',
      icon: Leaf,
      iconColor: 'text-teal-500',
      iconBg: 'bg-teal-50 text-teal-600 border border-teal-100',
      stat: 'Zero Emissions',
    },
    {
      id: 'gov-incentives',
      title: 'Government Incentives',
      description: 'Take advantage of federal & state solar rebates and tax credits.',
      icon: BadgePercent,
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-50 text-cyan-700 border border-cyan-100',
      stat: '30% Federal ITC',
    },
    {
      id: 'energy-independence',
      title: 'Energy Independence',
      description: 'Gain energy freedom with reliable solar power and backup storage.',
      icon: BatteryCharging,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-100',
      stat: 'Grid Outage Protection',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-gradient-to-b from-[#F4F8FC] via-white to-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E32] tracking-tight">
            Why Go Solar with Solar Shark?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Smart solar engineering engineered for maximum power generation, resilience, and guaranteed long-term ROI.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(11,30,50,0.06)] hover:shadow-[0_10px_30px_rgba(11,30,50,0.12)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center group"
              >
                {/* Icon Container */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform duration-300 ${item.iconBg}`}
                >
                  <Icon className="w-8 h-8" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#0B1E32] mb-2.5">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Micro highlight pill */}
                <div className="mt-4 pt-3 border-t border-slate-100 w-full">
                  <span className="inline-block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {item.stat}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
