import React from 'react';
import { Star, MapPin, Quote } from 'lucide-react';

export const SolarTestimonials: React.FC = () => {
  const reviews = [
    {
      id: 'john-m',
      name: 'John M.',
      location: 'San Diego, CA',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 5,
      systemSize: '8.4 kW Solar Array',
      quote:
        'Solar Shark installed our panels quickly and smoothly. Our electricity bills have dropped by over 70%!',
      savings: '$190/mo saved',
    },
    {
      id: 'lisa-t',
      name: 'Lisa T.',
      location: 'Phoenix, AZ',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 5,
      systemSize: '11.2 kW + Battery Storage',
      quote:
        "We're saving over $150 on our electricity costs thanks to Solar Shark. The installation crew was top-notch.",
      savings: '$215/mo saved',
    },
    {
      id: 'sarah-d',
      name: 'Sarah D.',
      location: 'Miami, FL',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 5,
      systemSize: '9.6 kW Premium All-Black',
      quote:
        'Best decision we’ve made for our home. The financing options made it easy, and customer service is stellar!',
      savings: '$175/mo saved',
    },
  ];

  return (
    <section
      id="reviews"
      className="relative py-20 sm:py-28 bg-[#091E36] overflow-hidden text-white"
    >
      {/* Background Image: Angled Solar Panels Field */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=2000&q=85"
          alt="Photovoltaic solar panels array under bright sunlight"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />

        {/* Deep Ocean Blue Overlay for Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/95 via-[#0A2645]/80 to-[#0B1E32]/75" />

        {/* Ambient Top Right Sun Flare */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-cyan-300 uppercase block mb-1.5">
            Verified Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-slate-200 text-sm sm:text-base">
            Over 12,000+ homes and facilities powered by Solar Shark clean energy.
          </p>
        </div>

        {/* 3 Floating Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 text-slate-900 shadow-2xl border border-white/40 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              <div>
                {/* Header: Avatar, Name, Stars */}
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    referrerPolicy="no-referrer"
                    className="w-13 h-13 rounded-full object-cover border-2 border-cyan-500/40 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <strong className="block text-base font-bold text-[#0B1E32]">
                      {review.name}
                    </strong>
                    <span className="text-[11px] font-semibold text-emerald-600 block">
                      {review.systemSize}
                    </span>
                  </div>
                </div>

                {/* Quote text */}
                <div className="relative mb-5">
                  <Quote className="w-5 h-5 text-cyan-200 absolute -top-1 -left-1 -z-1 opacity-60" />
                  <p className="text-sm text-slate-700 leading-relaxed font-normal italic pl-2">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Footer: Location & Verified Pill */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                  <span>{review.location}</span>
                </div>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                  {review.savings}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
