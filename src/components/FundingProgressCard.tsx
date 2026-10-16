import React from 'react';
import { FundingAssistanceSampleData } from '../types';
import { AvailabilityBadge } from './AvailabilityBadge';
import { Button } from './Button';
import { IconHospital, IconShieldCheck } from './LineIcons';

export interface FundingProgressCardProps {
  assistCase: FundingAssistanceSampleData;
  onContribute?: (assistCase: FundingAssistanceSampleData) => void;
  onVerifyAudit?: (assistCase: FundingAssistanceSampleData) => void;
  className?: string;
}

export const FundingProgressCard: React.FC<FundingProgressCardProps> = ({
  assistCase,
  onContribute,
  onVerifyAudit,
  className = '',
}) => {
  const percent = Math.min(
    100,
    Math.round((assistCase.fundsRaisedNgn / assistCase.verifiedBillAmountNgn) * 100)
  );

  const formatNgn = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <article
      className={`bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-5 sm:p-6 transition-colors relative flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#CFDACF]/60">
          <span className="text-[13px] font-interface-sans font-medium text-[#4F6B58] bg-[#EEF3EC] px-2.5 py-0.5 rounded-[8px]">
            {assistCase.caseRef}
          </span>
          <AvailabilityBadge
            state={assistCase.verificationState}
            lastConfirmedTime={assistCase.lastAuditTime}
          />
        </div>

        {/* Case Title & Hospital Info */}
        <div className="pt-4 space-y-1.5">
          <div className="text-[14px] font-interface-sans text-[#4F6B58] font-medium">
            {assistCase.assistanceType}
          </div>
          <h3 className="font-editorial-heading-3 text-[22px] sm:text-[24px] text-[#0F3F24] font-normal leading-tight">
            {assistCase.patientInitials}
          </h3>
          <p className="text-[15px] font-interface-sans text-[#0F3F24] pt-0.5 font-medium">
            {assistCase.medicalProcedure}
          </p>
          <div className="flex items-center gap-1.5 text-[14px] font-interface-sans text-[#4F6B58] pt-1">
            <IconHospital size={16} strokeWidth={1.5} className="shrink-0 text-[#0F3F24]" />
            <span>Facility: {assistCase.verifiedHospitalName}</span>
          </div>
        </div>

        {/* Progress & Financial Verification Breakdown */}
        <div className="mt-5 pt-4 border-t border-[#CFDACF]/60 space-y-3">
          <div className="flex items-baseline justify-between text-[14px] font-interface-sans">
            <span className="text-[#4F6B58]">Hospital-Verified Total</span>
            <span className="font-semibold text-[#0F3F24] text-[16px]">
              {formatNgn(assistCase.verifiedBillAmountNgn)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-[#EEF3EC] rounded-full overflow-hidden border border-[#CFDACF]/50">
              <div
                className="h-full bg-[#0F3F24] rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Funded ${percent}% of hospital bill`}
              />
            </div>
            <div className="flex items-center justify-between text-[14px] font-interface-sans text-[#4F6B58]">
              <span>Disbursed/Committed: {formatNgn(assistCase.fundsRaisedNgn)}</span>
              <span className="font-medium text-[#0F3F24]">{percent}%</span>
            </div>
          </div>

          <div className="p-3 bg-[#EEF3EC]/50 rounded-[8px] border border-[#CFDACF]/50 flex items-start gap-2 text-[14px] font-interface-sans text-[#4F6B58]">
            <IconShieldCheck size={16} strokeWidth={1.5} className="shrink-0 text-[#247447] mt-0.5" />
            <span>{assistCase.statusText}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-[#CFDACF] flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onContribute && onContribute(assistCase)}
          accessibleName={`Explore support for case ${assistCase.caseRef}`}
        >
          Explore Assistance
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onVerifyAudit && onVerifyAudit(assistCase)}
          accessibleName={`Audit hospital verification sheet for ${assistCase.caseRef}`}
        >
          Audit Sheet
        </Button>
      </div>
    </article>
  );
};
