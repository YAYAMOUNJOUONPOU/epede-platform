import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall } from 'lucide-react';
import { SolarLogo } from './SolarLogo';

interface SolarHeaderProps {
  onOpenQuoteModal: () => void;
  activeNav?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const SolarHeader: React.FC<SolarHeaderProps> = ({
  onOpenQuoteModal,
  activeNav = 'home',
  onNavigateSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Solutions', id: 'solutions' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#091827]/95 backdrop-blur-md shadow-lg py-3 border-b border-cyan-950/40'
          : 'bg-[#091827] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg p-1"
          aria-label="Solar Shark Home"
        >
          <SolarLogo size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 text-sm font-medium text-slate-200">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors duration-150 relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button & Mobile Toggle */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            onClick={onOpenQuoteModal}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-md hover:shadow-emerald-500/25 transition-all duration-200 active:scale-98 cursor-pointer"
          >
            Get Free Solar Quote
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0B1E32] border-b border-cyan-900/40 px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2.5 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  activeNav === item.id
                    ? 'bg-cyan-950/60 text-cyan-300 font-semibold'
                    : 'text-slate-200 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-700/60 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-3 rounded-full text-center text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md active:scale-98"
            >
              Get Free Solar Quote
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call toll-free: <strong>1-800-SOLAR-SHARK</strong></span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
