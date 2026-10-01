import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp } from 'lucide-react';
import { SolarLogo } from './SolarLogo';

interface SolarFooterProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenQuoteModal: () => void;
}

export const SolarFooter: React.FC<SolarFooterProps> = ({
  onNavigateSection,
  onOpenQuoteModal,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Solutions', id: 'solutions' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#071426] text-slate-300 pt-12 sm:pt-16 pb-8 border-t border-cyan-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-slate-800/80">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToTop}
              className="focus:outline-none cursor-pointer text-left"
              aria-label="Solar Shark Home"
            >
              <SolarLogo size="md" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className="hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <a
              href="#facebook"
              onClick={(e) => e.preventDefault()}
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-cyan-900/60 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#twitter"
              onClick={(e) => e.preventDefault()}
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-cyan-900/60 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors"
              aria-label="Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#linkedin"
              onClick={(e) => e.preventDefault()}
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-cyan-900/60 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#instagram"
              onClick={(e) => e.preventDefault()}
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-cyan-900/60 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Secondary Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Solar Shark Inc. Clean energy for homes and businesses. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span>License #CSLB-994820</span>
            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="hover:text-cyan-300 transition-colors"
            >
              Request Free Estimate
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
