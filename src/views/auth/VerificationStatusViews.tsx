import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { FemurLogo } from '../../components/FemurLogo';
import { IconClock, IconAlertTriangle } from '../../components/LineIcons';

export const PendingVerificationView: React.FC = () => {
  const { signOut, refreshUserData } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <FemurLogo />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 border border-[#CFDACF] rounded-[12px] text-center space-y-6">
          <div className="w-12 h-12 rounded-[12px] bg-[#FFF9EB] border border-[#9A6700]/30 flex items-center justify-center text-[#9A6700] mx-auto">
            <IconClock size={24} strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h2 className="font-editorial-serif text-[28px] sm:text-[32px] font-light text-[#0F3F24] leading-tight">
              Your account is awaiting verification.
            </h2>
            <p className="font-interface-sans text-[15px] text-[#4F6B58] leading-relaxed">
              We review hospitals, ambulance providers and sponsors before they can use FEMUR. We&apos;ll update this page once you&apos;re approved.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              isFullWidth
              onClick={() => refreshUserData()}
            >
              Check status
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              isFullWidth
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RejectedVerificationView: React.FC<{ reason?: string }> = ({
  reason = 'Documentation submitted was incomplete or unverified.',
}) => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <FemurLogo />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 border border-[#CFDACF] rounded-[12px] text-center space-y-6">
          <div className="w-12 h-12 rounded-[12px] bg-[#FEF3F2] border border-[#B42318]/30 flex items-center justify-center text-[#B42318] mx-auto">
            <IconAlertTriangle size={24} strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h2 className="font-editorial-serif text-[28px] sm:text-[32px] font-light text-[#0F3F24] leading-tight">
              We couldn&apos;t verify this account.
            </h2>
            <p className="font-interface-sans text-[15px] text-[#4F6B58] leading-relaxed">
              Reason: {reason}. You can contact us to appeal.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="mailto:support@femur.health?subject=Verification Appeal"
              className="w-full"
            >
              <Button type="button" variant="primary" size="md" isFullWidth>
                Contact FEMUR
              </Button>
            </a>
            <Button
              type="button"
              variant="secondary"
              size="md"
              isFullWidth
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
