import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { SectionHeading } from './components/SectionHeading';
import { Eyebrow } from './components/Eyebrow';
import { Button } from './components/Button';
import { CheckTile } from './components/CheckTile';
import { AvailabilityBadge } from './components/AvailabilityBadge';
import { ChatBubble } from './components/ChatBubble';
import { HeroCardsPreview } from './components/HeroCardsPreview';
import { PilotModal } from './components/PilotModal';
import { DecorativeParallelCurves } from './components/DecorativeParallelCurves';
import { DemoRoleSwitcher } from './components/DemoRoleSwitcher';
import {
  IconServiceLocate,
  IconServiceVerify,
  IconServiceDispatch,
  IconServiceAssist,
  IconShieldCheck,
  IconArrowRight,
} from './components/LineIcons';
import { LANDING_CONTENT, EMERGENCY_CONFIG } from './content';

// Views
import { SignInView } from './views/auth/SignInView';
import { SignUpView } from './views/auth/SignUpView';
import { GoogleRoleSetupView } from './views/auth/GoogleRoleSetupView';
import { PendingVerificationView, RejectedVerificationView } from './views/auth/VerificationStatusViews';
import { PatientDashboardView } from './views/dashboard/PatientDashboardView';
import {
  HospitalDashboardView,
  AmbulanceProviderDashboardView,
  SponsorDashboardView,
} from './views/dashboard/OrganizationDashboards';
import { AdminDashboardView } from './views/dashboard/AdminDashboardView';

function AppContent() {
  const { currentUser, userDoc, activeRole, needsRoleSelection, demoRole } = useAuth();

  // URL Hash based routing
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || '';
  });

  // State-preserving redirect: target route before requiring auth
  const [returnRoute, setReturnRoute] = useState<string>('dashboard');

  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const [pilotRole, setPilotRole] = useState('Healthcare Facility / Provider');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      setCurrentRoute(hash || '');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route ? `#/${route}` : '#';
    setCurrentRoute(route);
  };

  const openPilot = (role: string = 'Healthcare Facility / Provider') => {
    setPilotRole(role);
    setPilotModalOpen(true);
  };

  const scrollToServices = () => {
    if (currentRoute !== '') {
      navigateTo('');
      setTimeout(() => {
        const el = document.getElementById('services');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('services');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // State-preserving auth navigation
  const triggerAuthRequired = (desiredDestination: string = 'dashboard') => {
    setReturnRoute(desiredDestination);
    navigateTo('signin');
  };

  // 1. SIGN IN ROUTE
  if (currentRoute === 'signin') {
    return (
      <div className="relative">
        <SignInView
          onSuccess={() => navigateTo(returnRoute || 'dashboard')}
          onNavigateToSignUp={() => navigateTo('signup')}
          onNavigateToHome={() => navigateTo('')}
        />
        <DemoRoleSwitcher onNavigateToDashboard={() => navigateTo('dashboard')} />
      </div>
    );
  }

  // 2. SIGN UP ROUTE
  if (currentRoute === 'signup') {
    return (
      <div className="relative">
        <SignUpView
          onSuccess={() => navigateTo(returnRoute || 'dashboard')}
          onNavigateToSignIn={() => navigateTo('signin')}
          onNavigateToHome={() => navigateTo('')}
        />
        <DemoRoleSwitcher onNavigateToDashboard={() => navigateTo('dashboard')} />
      </div>
    );
  }

  // 3. DASHBOARD ROUTE
  if (currentRoute === 'dashboard') {
    // If user signed in with Google and needs to pick their initial role (when not demo mode override)
    if (needsRoleSelection && !demoRole) {
      return (
        <div className="relative">
          <GoogleRoleSetupView onSuccess={() => navigateTo('dashboard')} />
          <DemoRoleSwitcher onNavigateToDashboard={() => navigateTo('dashboard')} />
        </div>
      );
    }

    // If user is pending verification (when not in demo override)
    if (userDoc?.verificationStatus === 'pending' && !demoRole) {
      return (
        <div className="relative">
          <PendingVerificationView />
          <DemoRoleSwitcher onNavigateToDashboard={() => navigateTo('dashboard')} />
        </div>
      );
    }

    // If user was rejected (when not in demo override)
    if (userDoc?.verificationStatus === 'rejected' && !demoRole) {
      return (
        <div className="relative">
          <RejectedVerificationView reason={userDoc.rejectionReason} />
          <DemoRoleSwitcher onNavigateToDashboard={() => navigateTo('dashboard')} />
        </div>
      );
    }

    // Render Dashboard by active role (Patient, Hospital, Ambulance, Sponsor, Admin)
    return (
      <div className="relative">
        {activeRole === 'patient' && (
          <PatientDashboardView onNavigateHome={() => navigateTo('')} />
        )}
        {activeRole === 'hospital' && (
          <HospitalDashboardView onNavigateHome={() => navigateTo('')} />
        )}
        {activeRole === 'ambulance_provider' && (
          <AmbulanceProviderDashboardView onNavigateHome={() => navigateTo('')} />
        )}
        {activeRole === 'sponsor' && (
          <SponsorDashboardView onNavigateHome={() => navigateTo('')} />
        )}
        {activeRole === 'admin' && (
          <AdminDashboardView onNavigateHome={() => navigateTo('')} />
        )}

        <DemoRoleSwitcher onNavigateToDashboard={() => navigateTo('dashboard')} />
      </div>
    );
  }

  // 4. MAIN LANDING PAGE ROUTE
  const {
    hero,
    resources,
    services,
    howItWorks,
    trust,
    audiences,
    navigator,
    finalCta,
  } = LANDING_CONTENT;

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#0F3F24] flex flex-col antialiased selection:bg-[#EEF3EC] selection:text-[#0A2E19]">
      {/* 1. Global Navigation */}
      <Nav
        onPilotClick={openPilot}
        onFindCareClick={scrollToServices}
        onNavigateToSignIn={() => triggerAuthRequired('dashboard')}
        onNavigateToDashboard={() => navigateTo('dashboard')}
      />

      <main className="flex-1 pb-20 lg:pb-0">
        {/* =========================================================================
            SECTION 1: HERO
           ========================================================================= */}
        <section className="femur-container pt-12 sm:pt-20 lg:pt-24 pb-16 lg:pb-24 border-b border-[#CFDACF]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Editorial Headline & Subhead */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="font-editorial-serif text-scale-display font-light text-[#0F3F24] leading-[1.02] tracking-tight [text-wrap:balance]">
                {hero.headlineLine1}
                <br />
                {hero.headlineLine2}
              </h1>

              <p className="font-interface-sans text-scale-body text-[#4F6B58] max-w-[44ch] leading-relaxed">
                {hero.subhead}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={scrollToServices}
                  accessibleName="Find care now"
                >
                  {hero.primaryCta}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => openPilot('Hospitals & Ambulance Providers')}
                  className="border-[#0F3F24] text-[#0F3F24] hover:bg-[#EEF3EC]"
                  accessibleName="Information for hospitals and providers"
                >
                  {hero.secondaryCta}
                </Button>
              </div>

              {/* Slim Emergency Notice directly under hero CTA (not a banner) */}
              <div className="pt-3 max-w-xl">
                <p className="font-interface-sans text-[14px] text-[#4F6B58] leading-normal">
                  In immediate danger? Contact your local emergency services (
                  <span className="font-semibold text-[#0F3F24]">
                    {EMERGENCY_CONFIG.primaryNumber}
                  </span>
                  ) first. FEMUR supports, and does not replace, emergency care.
                </p>
              </div>
            </div>

            {/* Right Column: Connected Preview Cards */}
            <div className="lg:col-span-5">
              <HeroCardsPreview />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: RESOURCES (Editorial Word List + Statement)
           ========================================================================= */}
        <section className="femur-container py-20 lg:py-32 border-b border-[#CFDACF]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Five centered serif words stacked with varied sizes and generous spacing */}
            <div className="lg:col-span-5 flex flex-col items-start justify-center space-y-4 py-4 border-l-0 lg:border-r border-[#CFDACF]/60 lg:pr-8">
              <span className="font-editorial-serif font-light text-[38px] sm:text-[46px] text-[#0F3F24]/70 leading-none">
                {resources.wordList[0]}
              </span>
              <span className="font-editorial-serif font-light text-[48px] sm:text-[58px] text-[#0F3F24] leading-none pl-4 sm:pl-8">
                {resources.wordList[1]}
              </span>
              <span className="font-editorial-serif font-light text-[34px] sm:text-[42px] text-[#0F3F24]/60 leading-none pl-2">
                {resources.wordList[2]}
              </span>
              <span className="font-editorial-serif font-light text-[44px] sm:text-[52px] text-[#0F3F24]/85 leading-none pl-6 sm:pl-12">
                {resources.wordList[3]}
              </span>
              <span className="font-editorial-serif font-light text-[32px] sm:text-[38px] text-[#0F3F24]/50 leading-none pl-3">
                {resources.wordList[4]}
              </span>
            </div>

            {/* Right Column: Statement + 2 Large Light-Serif Stats */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <Eyebrow>{resources.eyebrow}</Eyebrow>
                <h2 className="font-editorial-serif text-scale-h2 font-light text-[#0F3F24] leading-[1.08] [text-wrap:balance]">
                  {resources.statement}
                </h2>
              </div>

              {/* Two large light-serif stats with captions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-[#CFDACF]/60">
                {resources.stats.map((stat) => (
                  <div key={stat.id} className="space-y-2">
                    <div className="font-editorial-serif font-light text-[48px] sm:text-[56px] text-[#0F3F24] leading-none tracking-tight">
                      {stat.numeral}
                    </div>
                    <p className="font-interface-sans text-[15px] text-[#4F6B58] leading-snug">
                      {stat.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: SERVICES ("Four services, one connected path")
           ========================================================================= */}
        <section id="services" className="femur-container py-20 lg:py-32 border-b border-[#CFDACF] scroll-mt-24">
          <SectionHeading
            eyebrow={services.eyebrow}
            title={services.heading}
            className="mb-14"
          />

          {/* Four columns on desktop (2x2 tablet, stacked mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.items.map((svc) => (
              <div
                key={svc.id}
                className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-[#0F3F24]/60 transition-colors"
              >
                <div className="space-y-4">
                  {/* Distinct thin geometric outline SVG icon */}
                  <div className="w-10 h-10 rounded-[8px] bg-[#EEF3EC] flex items-center justify-center text-[#0F3F24]">
                    {svc.id === 'locate' && <IconServiceLocate size={22} />}
                    {svc.id === 'verify' && <IconServiceVerify size={22} />}
                    {svc.id === 'dispatch' && <IconServiceDispatch size={22} />}
                    {svc.id === 'assist' && <IconServiceAssist size={22} />}
                  </div>

                  <div className="space-y-1">
                    <span className="font-interface-sans text-[13px] font-semibold text-[#4F6B58] uppercase tracking-wider">
                      {svc.name}
                    </span>
                    <h3 className="font-editorial-serif text-[22px] sm:text-[24px] text-[#0F3F24] font-normal leading-tight">
                      {svc.title}
                    </h3>
                  </div>

                  <p className="font-interface-sans text-[15px] text-[#4F6B58] leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#CFDACF]/60">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser) {
                        navigateTo('dashboard');
                      } else {
                        triggerAuthRequired('dashboard');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 font-interface-sans text-[14px] font-medium text-[#0F3F24] hover:text-[#0A2E19] group py-1"
                  >
                    <span>Explore {svc.name}</span>
                    <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: HOW IT WORKS
           ========================================================================= */}
        <section id="how-it-works" className="femur-container py-20 lg:py-32 border-b border-[#CFDACF] scroll-mt-24">
          <SectionHeading
            eyebrow={howItWorks.eyebrow}
            title={howItWorks.heading}
            className="mb-14"
          />

          <div className="relative">
            <div
              className="hidden lg:block absolute top-7 left-12 right-12 h-0 border-t border-dashed border-[#CFDACF] z-0 pointer-events-none"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {howItWorks.steps.map((step) => (
                <div key={step.number} className="space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#FFFFFF] border border-[#CFDACF] flex items-center justify-center text-[#0F3F24] shadow-none">
                    <span className="font-editorial-serif font-light text-[28px] leading-none">
                      {step.number}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal leading-tight">
                      {step.title}
                    </h3>
                    <p className="font-interface-sans text-[15px] text-[#4F6B58] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 p-5 sm:p-6 bg-[#EEF3EC] border border-[#CFDACF] rounded-[12px] flex items-center gap-4">
            <CheckTile checked className="shrink-0" />
            <p className="font-interface-sans text-[15px] sm:text-[16px] text-[#0F3F24] font-medium leading-relaxed">
              {howItWorks.stripNote}
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: TRUST ("Verified, not assumed")
           ========================================================================= */}
        <section className="femur-container py-20 lg:py-32 border-b border-[#CFDACF]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Badges Stack */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <Eyebrow>{trust.eyebrow}</Eyebrow>
                <h2 className="font-editorial-serif text-scale-h2 font-light text-[#0F3F24] leading-[1.08] [text-wrap:balance]">
                  {trust.heading}
                </h2>
              </div>

              {/* Clean stack of 3 AvailabilityBadges */}
              <div className="p-6 bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] space-y-3.5">
                {trust.badgeStates.map((b, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div>
                      <AvailabilityBadge state={b.state} lastConfirmedTime={b.label} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: 2x3 Grid of CheckTiles */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {trust.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] flex items-start gap-3.5"
                  >
                    <CheckTile checked className="shrink-0" />
                    <p className="font-interface-sans text-[15px] text-[#0F3F24] leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: WHO FEMUR SERVES
           ========================================================================= */}
        <section className="femur-container py-20 lg:py-32 border-b border-[#CFDACF]">
          <SectionHeading
            eyebrow={audiences.eyebrow}
            title={audiences.heading}
            className="mb-14"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            {/* Left: Large muted-green abstract line-art panel */}
            <div className="lg:col-span-5 bg-[#EEF3EC] border border-[#CFDACF] rounded-[12px] p-8 flex items-center justify-center relative overflow-hidden min-h-[340px]">
              <div className="w-full opacity-75 pointer-events-none">
                <DecorativeParallelCurves color="#4F6B58" />
              </div>
            </div>

            {/* Right: List of four audiences */}
            <div className="lg:col-span-7 divide-y divide-[#CFDACF] border-t border-b border-[#CFDACF]">
              {audiences.items.map((aud) => (
                <div key={aud.id} id={aud.id} className="py-6 space-y-2 scroll-mt-24">
                  <h3 className="font-editorial-serif text-[22px] sm:text-[24px] text-[#0F3F24] font-normal">
                    {aud.title}
                  </h3>
                  <p className="font-interface-sans text-[15px] text-[#4F6B58] leading-relaxed">
                    {aud.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser) {
                        navigateTo('dashboard');
                      } else {
                        triggerAuthRequired('dashboard');
                      }
                    }}
                    className="inline-flex items-center gap-1 font-interface-sans text-[14px] font-medium text-[#0F3F24] hover:text-[#0A2E19] pt-1"
                  >
                    <span>{aud.linkText}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: AI EMERGENCY NAVIGATOR
           ========================================================================= */}
        <section className="femur-container py-20 lg:py-32 border-b border-[#CFDACF]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            <div className="lg:col-span-5 space-y-4">
              <Eyebrow>{navigator.eyebrow}</Eyebrow>
              <h2 className="font-editorial-serif text-scale-h2 font-light text-[#0F3F24] leading-[1.08] [text-wrap:balance]">
                {navigator.heading}
              </h2>
              <p className="font-interface-sans text-scale-body text-[#4F6B58] leading-relaxed pt-2">
                {navigator.description}
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#CFDACF]/60">
                  <span className="font-interface-sans text-[13px] font-medium text-[#4F6B58]">
                    {navigator.caption}
                  </span>
                </div>

                <div className="space-y-4">
                  {navigator.conversation.map((msg, idx) => (
                    <ChatBubble
                      key={idx}
                      message={{
                        id: `nav-msg-${idx}`,
                        sender: msg.sender,
                        text: msg.text,
                        timestamp: idx === 0 ? '10:14 AM' : '10:15 AM',
                        isDisclaimer: msg.sender === 'navigator',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {navigator.guardrails.map((g, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-[#EEF3EC]/50 border border-[#CFDACF]/60 rounded-[8px] text-[13px] font-interface-sans text-[#0F3F24]"
                  >
                    <IconShieldCheck size={16} className="shrink-0 text-[#247447]" />
                    <span className="font-medium">{g}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: FINAL CTA
            (Note: Central 'Find care now' button at the bottom removed per user request)
           ========================================================================= */}
        <section className="femur-container py-20 lg:py-32">
          <div className="relative bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-8 sm:p-14 lg:p-16 overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none hidden md:block">
              <DecorativeParallelCurves color="#0F3F24" />
            </div>

            <div className="relative z-10 max-w-xl space-y-6">
              <h2 className="font-editorial-serif text-scale-h2 font-light text-[#0F3F24] leading-[1.05] [text-wrap:balance]">
                {finalCta.headline}
              </h2>
              <p className="font-interface-sans text-scale-body text-[#4F6B58] leading-relaxed">
                {finalCta.subcopy}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => openPilot('Prospective Ecosystem Partner')}
                  accessibleName="Request pilot access (final section)"
                >
                  {finalCta.secondaryButton}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer (only single prototype notice line allowed) */}
      <Footer onPlaceholderClick={(label) => openPilot(`Footer Link: ${label}`)} />

      {/* Pilot Request Modal */}
      <PilotModal
        isOpen={pilotModalOpen}
        targetRole={pilotRole}
        onClose={() => setPilotModalOpen(false)}
      />

      {/* Floating Demo Role Switcher across app */}
      <DemoRoleSwitcher onNavigateToDashboard={() => navigateTo('dashboard')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
