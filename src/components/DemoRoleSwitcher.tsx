import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import { IconCheck, IconX, IconShieldCheck } from './LineIcons';

export interface DemoRoleSwitcherProps {
  onNavigateToDashboard?: () => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ onNavigateToDashboard }) => {
  const { activeRole, demoRole, setDemoRole, userDoc } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <button
        type="button"
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#CFDACF] text-[12px] font-interface-sans font-medium text-[#0F3F24] shadow-sm hover:bg-[#EEF3EC] transition-colors"
        title="Open demo role switcher"
      >
        Demo role: <span className="font-semibold capitalize">{activeRole.replace('_', ' ')}</span>
      </button>
    );
  }

  const roles: { id: UserRole; label: string; description: string }[] = [
    {
      id: 'patient',
      label: 'Patient / Caregiver',
      description: 'Active requests, saved facilities, family members & assistance',
    },
    {
      id: 'hospital',
      label: 'Hospital Staff',
      description: 'Intake status, incoming patients, resource confirmations & estimates',
    },
    {
      id: 'ambulance_provider',
      label: 'Ambulance Provider',
      description: 'Dispatch acceptance, live trip tracking, and fleet status',
    },
    {
      id: 'sponsor',
      label: 'NGO / Sponsor Partner',
      description: 'Verified cases seeking support, pledges & hospital updates',
    },
    {
      id: 'admin',
      label: 'FEMUR Administrator',
      description: 'Pending verifications queue, platform pulse & audit log',
    },
  ];

  const handleSelectRole = (role: UserRole) => {
    setDemoRole(role);
    setIsOpen(false);
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    } else {
      window.location.hash = '#/dashboard';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-interface-sans">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0F3F24] text-[#FFFFFF] text-[13px] font-medium shadow-md hover:bg-[#0A2E19] transition-all border border-[#0F3F24]"
          aria-expanded={isOpen}
          aria-label="Demo role switcher"
        >
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
          <span>Role: <strong className="capitalize">{activeRole.replace('_', ' ')}</strong></span>
          <span className="text-[11px] opacity-80">▾</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] shadow-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#CFDACF]">
            <div>
              <div className="text-[12px] font-semibold text-[#0F3F24] tracking-wide uppercase">
                Demo mode — switch role to preview
              </div>
              <p className="text-[12px] text-[#4F6B58]">
                Switch role to preview dedicated workflows.
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#4F6B58] hover:text-[#0F3F24] p-1"
                aria-label="Minimize"
              >
                <span className="text-[16px] leading-none">−</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="text-[#4F6B58] hover:text-[#0F3F24] p-1"
                aria-label="Dismiss"
              >
                <IconX size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {roles.map((r) => {
              const isSelected = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRole(r.id)}
                  className={`w-full text-left p-2.5 rounded-[8px] border transition-colors flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'border-[#0F3F24] bg-[#EEF3EC] text-[#0F3F24]'
                      : 'border-[#CFDACF]/70 bg-[#FFFFFF] text-[#4F6B58] hover:border-[#0F3F24]/40 hover:bg-[#EEF3EC]/30'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-[14px] font-medium text-[#0F3F24] flex items-center gap-1.5">
                      <span>{r.label}</span>
                      {isSelected && (
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-[#0F3F24] text-[#FFFFFF] font-normal">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#4F6B58] leading-tight">
                      {r.description}
                    </p>
                  </div>
                  {isSelected && (
                    <IconCheck size={16} className="text-[#0F3F24] shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {demoRole && (
            <div className="pt-2 border-t border-[#CFDACF]/60 flex items-center justify-between text-[12px]">
              <span className="text-[#4F6B58]">Demo override active</span>
              <button
                type="button"
                onClick={() => {
                  setDemoRole(null);
                  setIsOpen(false);
                }}
                className="text-[#0F3F24] font-medium hover:underline"
              >
                Reset to default ({userDoc?.role || 'patient'})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
