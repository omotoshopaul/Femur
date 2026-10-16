import React, { useState, useEffect } from 'react';
import { FemurLogo } from './FemurLogo';
import { Button } from './Button';
import { StatusBadge } from './StatusBadge';
import { IconMenu, IconX } from './LineIcons';
import { LANDING_CONTENT } from '../content';
import { useAuth } from '../contexts/AuthContext';

export interface NavProps {
  onPilotClick: (role?: string) => void;
  onFindCareClick: () => void;
  onNavigateToSignIn?: () => void;
  onNavigateToDashboard?: () => void;
}

export const Nav: React.FC<NavProps> = ({
  onPilotClick,
  onNavigateToSignIn,
  onNavigateToDashboard,
}) => {
  const { currentUser, userDoc, activeRole } = useAuth();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Detect scroll for hairline border
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);

      // Track active section for nav highlight
      const sections = ['services', 'how-it-works', 'for-hospitals', 'for-providers', 'for-partners'];
      const scrollPos = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSignIn = () => {
    if (onNavigateToSignIn) {
      onNavigateToSignIn();
    } else {
      window.location.hash = '#/signin';
    }
  };

  const handleDashboard = () => {
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    } else {
      window.location.hash = '#/dashboard';
    }
  };

  const roleLabels: Record<string, string> = {
    patient: 'Patient',
    hospital: 'Hospital',
    ambulance_provider: 'Ambulance',
    sponsor: 'Sponsor',
    admin: 'Admin',
  };

  const firstName = userDoc?.displayName?.split(' ')[0] || (currentUser?.email ? currentUser.email.split('@')[0] : '');

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-[#FFFFFF] transition-all duration-200 ${
          hasScrolled ? 'border-b border-[#CFDACF]' : 'border-b border-transparent'
        }`}
      >
        <div className="femur-container">
          {/* Three-zone layout: Logo (Zone 1) | Center links (Zone 2) | Actions (Zone 3, shrink-0) */}
          <div className="flex items-center justify-between gap-6 h-20">
            {/* Zone 1: Logo */}
            <div className="shrink-0">
              <a
                href="#"
                className="flex items-center focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                aria-label="FEMUR Homepage"
              >
                <FemurLogo />
              </a>
            </div>

            {/* Zone 2: Center Links (Collapsed below 1100px into mobile menu) */}
            <nav
              className="hidden min-[1100px]:flex items-center gap-7 xl:gap-8 text-[15px] font-interface-sans font-medium text-[#4F6B58]"
              aria-label="Main Navigation"
            >
              {LANDING_CONTENT.navigation.links.map((link) => {
                const targetId = link.href.replace('#', '');
                const isActive = activeSection === targetId;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('#/')) {
                        e.preventDefault();
                        onPilotClick(link.label);
                      }
                    }}
                    className={`transition-colors whitespace-nowrap shrink-0 py-1 hover:text-[#0F3F24] ${
                      isActive ? 'text-[#0F3F24] font-semibold underline underline-offset-4 decoration-[#0F3F24]' : ''
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Zone 3: Actions (shrink-0, Request Pilot Access collapsed below 1100px into mobile menu) */}
            <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
              {currentUser ? (
                // Signed In State
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    <StatusBadge
                      label={roleLabels[activeRole] || 'Member'}
                      tone="neutral"
                      className="text-[12px] py-0.5"
                    />
                    <span className="text-[14px] font-medium text-[#0F3F24]">
                      {firstName}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDashboard}
                    accessibleName="Go to Dashboard"
                  >
                    Dashboard
                  </Button>
                </div>
              ) : (
                // Signed Out State
                <div className="flex items-center gap-3.5 sm:gap-5">
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="font-interface-sans text-[15px] font-medium text-[#0F3F24] hover:text-[#0A2E19] transition-colors whitespace-nowrap cursor-pointer py-2 px-1 focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                  >
                    Sign in
                  </button>

                  {/* "Request pilot access" visible ONLY at >= 1100px, collapsed below 1100px */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPilotClick('Platform Partner')}
                    className="hidden min-[1100px]:inline-flex border-[#0F3F24] text-[#0F3F24] hover:bg-[#EEF3EC]"
                    accessibleName="Request pilot access (top navigation)"
                  >
                    {LANDING_CONTENT.navigation.cta}
                  </Button>
                </div>
              )}

              {/* Mobile / Tablet Menu Button (Visible below 1100px) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="min-[1100px]:hidden w-11 h-11 flex items-center justify-center rounded-[12px] border border-[#CFDACF] text-[#0F3F24] hover:bg-[#EEF3EC] transition-colors focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <IconMenu size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full-Width Drawer Sheet */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 min-[1100px]:hidden bg-[#0A2E19]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#FFFFFF] p-6 flex flex-col justify-between border-l border-[#CFDACF]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#CFDACF]">
                <FemurLogo />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-11 h-11 flex items-center justify-center rounded-[12px] border border-[#CFDACF] text-[#0F3F24] hover:bg-[#EEF3EC] transition-colors focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                  aria-label="Close navigation menu"
                >
                  <IconX size={20} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex flex-col gap-4 py-6" aria-label="Mobile Menu Links">
                {LANDING_CONTENT.navigation.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (link.href.startsWith('#/')) {
                        onPilotClick(link.label);
                      }
                    }}
                    className="font-editorial-serif text-[22px] text-[#0F3F24] hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#CFDACF] space-y-3">
              {/* Below 1100px, "Request pilot access" is housed here */}
              <Button
                variant="primary"
                size="md"
                isFullWidth
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onPilotClick('Healthcare Facility / Provider');
                }}
                accessibleName="Request pilot access (mobile menu)"
              >
                {LANDING_CONTENT.navigation.cta}
              </Button>

              {currentUser ? (
                <Button
                  variant="secondary"
                  size="md"
                  isFullWidth
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDashboard();
                  }}
                >
                  Dashboard ({roleLabels[activeRole] || 'Member'})
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  isFullWidth
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignIn();
                  }}
                >
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
