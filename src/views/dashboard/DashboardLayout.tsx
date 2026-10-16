import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FemurLogo } from '../../components/FemurLogo';
import { StatusBadge } from '../../components/StatusBadge';
import { IconBell, IconX, IconCheck, IconShieldCheck } from '../../components/LineIcons';
import { UserRole } from '../../types/auth';

export interface DashboardTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface DashboardLayoutProps {
  tabs: DashboardTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  onNavigateHome: () => void;
  onOpenRoleSwitcher?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  onNavigateHome,
  onOpenRoleSwitcher,
}) => {
  const { userDoc, currentUser, signOut, activeRole, setDemoRole } = useAuth();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const roleLabels: Record<UserRole, string> = {
    patient: 'Patient / Caregiver',
    hospital: 'Hospital Staff',
    ambulance_provider: 'Ambulance Provider',
    sponsor: 'NGO / Sponsor Partner',
    admin: 'FEMUR Administrator',
  };

  const roleName = roleLabels[activeRole] || 'Member';

  const notifications = [
    {
      id: 'notif-1',
      title: 'Availability Confirmed',
      message: 'Oxygen supply status verified by medical director 12 min ago.',
      time: '12m ago',
    },
    {
      id: 'notif-2',
      title: 'Dispatch Coordination Active',
      message: 'Ambulance Unit 02 is en route to tertiary care center.',
      time: '28m ago',
    },
    {
      id: 'notif-3',
      title: 'Financial Case Verified',
      message: 'Hospital audit completed for Emergency Case #AST-098.',
      time: '1h ago',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#0F3F24] flex flex-col font-interface-sans antialiased">
      {/* Top Bar with Logo, Role Badge, Notification Bell & Avatar Menu */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#CFDACF] h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
              aria-label="Return to FEMUR home"
            >
              <FemurLogo />
            </button>
            <span className="hidden sm:inline-block w-px h-5 bg-[#CFDACF]" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[13px] text-[#4F6B58] font-medium">Workspace:</span>
              <StatusBadge label={roleName} tone="neutral" className="text-[13px] py-0.5" />
            </div>
          </div>

          {/* Right Actions: Notification Bell + Avatar Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-10 h-10 rounded-[8px] border border-[#CFDACF] flex items-center justify-center text-[#0F3F24] hover:bg-[#EEF3EC] transition-colors relative focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <IconBell size={18} strokeWidth={1.5} />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B42318]" />
              </button>

              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-[#FFFFFF] rounded-[12px] border border-[#CFDACF] shadow-lg py-2 z-50 text-[14px]">
                    <div className="px-4 py-2 border-b border-[#CFDACF]/60 flex items-center justify-between">
                      <span className="font-semibold text-[#0F3F24]">Notifications</span>
                      <span className="text-[12px] text-[#4F6B58]">3 unread</span>
                    </div>
                    <div className="divide-y divide-[#CFDACF]/40 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3.5 hover:bg-[#EEF3EC]/50 transition-colors">
                          <div className="flex items-center justify-between text-[13px] font-medium text-[#0F3F24]">
                            <span>{n.title}</span>
                            <span className="text-[11px] text-[#4F6B58]">{n.time}</span>
                          </div>
                          <p className="text-[12px] text-[#4F6B58] mt-1 leading-snug">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-[8px] hover:bg-[#EEF3EC] transition-colors focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                aria-expanded={avatarMenuOpen}
                aria-label="User navigation menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#0F3F24] text-[#FFFFFF] flex items-center justify-center font-medium text-[14px]">
                  {userDoc?.displayName?.charAt(0).toUpperCase() ||
                    currentUser?.email?.charAt(0).toUpperCase() ||
                    'U'}
                </div>
                <div className="hidden md:block text-left text-[14px] leading-tight">
                  <div className="font-medium text-[#0F3F24] truncate max-w-[140px]">
                    {userDoc?.displayName || 'Active Account'}
                  </div>
                  <div className="text-[12px] text-[#4F6B58] truncate max-w-[140px]">
                    {currentUser?.email || 'Demo Mode'}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {avatarMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAvatarMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-[#FFFFFF] rounded-[12px] border border-[#CFDACF] shadow-lg py-1.5 z-50 text-[14px] font-interface-sans">
                    <div className="px-4 py-2 border-b border-[#CFDACF]/60">
                      <p className="font-medium text-[#0F3F24] truncate">
                        {userDoc?.displayName || 'FEMUR User'}
                      </p>
                      <p className="text-[12px] text-[#4F6B58] truncate">
                        {currentUser?.email || 'demo@femur.health'}
                      </p>
                      <div className="mt-1.5">
                        <span className="text-[11px] font-medium text-[#0F3F24] bg-[#EEF3EC] px-2 py-0.5 rounded">
                          {roleName}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        onTabChange('overview');
                      }}
                      className="w-full text-left px-4 py-2 text-[#0F3F24] hover:bg-[#EEF3EC] transition-colors"
                    >
                      Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        onTabChange('settings');
                      }}
                      className="w-full text-left px-4 py-2 text-[#0F3F24] hover:bg-[#EEF3EC] transition-colors"
                    >
                      Settings
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        onNavigateHome();
                      }}
                      className="w-full text-left px-4 py-2 text-[#0F3F24] hover:bg-[#EEF3EC] transition-colors"
                    >
                      Return to Website
                    </button>

                    <div className="border-t border-[#CFDACF]/60 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        setRoleModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-[#0F3F24] hover:bg-[#EEF3EC] transition-colors font-medium flex items-center justify-between"
                    >
                      <span>Switch role (demo only)</span>
                      <span className="text-[12px] text-[#4F6B58]">▾</span>
                    </button>

                    <div className="border-t border-[#CFDACF]/60 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        signOut();
                        onNavigateHome();
                      }}
                      className="w-full text-left px-4 py-2 text-[#B42318] hover:bg-[#FEF3F2] transition-colors font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-8 pb-20 md:pb-8">
        {/* Left Sidebar on Desktop */}
        <aside className="hidden md:block w-56 shrink-0 space-y-1">
          <div className="text-[12px] font-semibold text-[#4F6B58] uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-[8px] text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EEF3EC] text-[#0F3F24] font-semibold border border-[#CFDACF]/60'
                    : 'text-[#4F6B58] hover:bg-[#EEF3EC]/50 hover:text-[#0F3F24]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Dynamic Section Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>

      {/* Bottom Tab Bar on Mobile */}
      <nav
        className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-[#FFFFFF] border-t border-[#CFDACF] px-2 py-1.5 flex items-center justify-around shadow-sm"
        aria-label="Mobile Dashboard Navigation"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-2 text-center text-[13px] font-medium transition-colors ${
                isActive ? 'text-[#0F3F24] font-semibold' : 'text-[#4F6B58]'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="block w-6 h-0.5 bg-[#0F3F24] rounded-full mx-auto mt-1" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Demo Role Switcher Modal */}
      {roleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2E19]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#CFDACF]">
              <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                Switch role (demo only)
              </h3>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="text-[#4F6B58] hover:text-[#0F3F24]"
                aria-label="Close"
              >
                <IconX size={20} />
              </button>
            </div>
            <p className="text-[14px] text-[#4F6B58]">
              Select a role to preview its custom dashboard and live coordination views:
            </p>
            <div className="space-y-2">
              {(
                [
                  ['patient', 'Patient / Caregiver'],
                  ['hospital', 'Hospital Staff'],
                  ['ambulance_provider', 'Ambulance Provider'],
                  ['sponsor', 'NGO / Sponsor Partner'],
                  ['admin', 'FEMUR Administrator'],
                ] as [UserRole, string][]
              ).map(([rId, rLabel]) => (
                <button
                  key={rId}
                  type="button"
                  onClick={() => {
                    setDemoRole(rId);
                    setRoleModalOpen(false);
                    onTabChange('overview');
                  }}
                  className={`w-full text-left p-3 rounded-[8px] border text-[14px] font-medium transition-colors flex items-center justify-between ${
                    activeRole === rId
                      ? 'border-[#0F3F24] bg-[#EEF3EC] text-[#0F3F24]'
                      : 'border-[#CFDACF] bg-[#FFFFFF] text-[#4F6B58] hover:border-[#0F3F24]/50'
                  }`}
                >
                  <span>{rLabel}</span>
                  {activeRole === rId && <IconCheck size={16} className="text-[#0F3F24]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
