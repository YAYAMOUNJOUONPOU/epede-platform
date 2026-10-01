import React, { useState, useId } from 'react';
import { X, Phone, Mail, MapPin, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { SolarLogo } from './SolarLogo';

interface SolarContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SolarContactModal: React.FC<SolarContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const contactNameId = useId();
  const contactEmailId = useId();
  const contactMessageId = useId();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
        <div className="bg-[#091827] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SolarLogo size="sm" />
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-widest pl-2 border-l border-slate-700">
              Contact Us
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

        <div className="p-6 sm:p-7">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0B1E32]">
                  Speak with a Solar Shark Advisor
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Have questions about roof eligibility, battery storage, or financing? We respond within 15 minutes during business hours.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor={contactNameId} className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Name
                  </label>
                  <input
                    id={contactNameId}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label htmlFor={contactEmailId} className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    id={contactEmailId}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label htmlFor={contactMessageId} className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Message
                  </label>
                  <textarea
                    id={contactMessageId}
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="I want to know if my roof in San Diego qualifies for the 30% tax credit..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Call directly: <strong>1-800-SOLAR-SHARK</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hours: Mon - Sat 8:00 AM – 7:00 PM EST</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Send Message</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1E32]">Message Sent!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Thank you, {name}. A dedicated Solar Shark solar advisor will reach out to you shortly at {email}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  onClose();
                }}
                className="py-2.5 px-6 rounded-xl text-sm font-bold text-white bg-[#0B2545] hover:bg-[#071A30]"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
