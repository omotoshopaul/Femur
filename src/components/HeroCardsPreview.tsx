import React from 'react';
import { HERO_PREVIEW_DATA, LANDING_CONTENT } from '../content';
import { AvailabilityBadge } from './AvailabilityBadge';
import { IconMapPin, IconAmbulance, IconShieldCheck, IconClock } from './LineIcons';

export const HeroCardsPreview: React.FC = () => {
  const { facility, ambulance, assist } = HERO_PREVIEW_DATA;

  const assistPercent = Math.round((assist.fundsRaisedNgn / assist.verifiedBillAmountNgn) * 100);

  return (
    <div className="w-full max-w-lg mx-auto lg:mr-0 flex flex-col items-center">
      <div className="w-full relative flex flex-col gap-4">
        {/* Dotted connecting line down the left/center */}
        <div
          className="absolute left-7 top-10 bottom-10 w-0 border-l border-dashed border-[#CFDACF] z-0 pointer-events-none"
          aria-hidden="true"
        />

        {/* 1. LOCATE CARD */}
        <div className="relative z-10 pl-6 sm:pl-8">
          {/* Step indicator node on the dotted line */}
          <div
            className="absolute left-0 top-6 w-3 h-3 rounded-full bg-[#FFFFFF] border-2 border-[#0F3F24]"
            aria-hidden="true"
          />
          <div className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-4 sm:p-5 transition-shadow">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#CFDACF]/60">
              <span className="text-[12px] font-interface-sans font-semibold text-[#0F3F24] tracking-wide uppercase">
                1. Locate
              </span>
              <AvailabilityBadge state="confirmed" lastConfirmedTime="Oxygen: Confirmed 12 min ago" />
            </div>
            <div className="pt-2.5 space-y-1">
              <h4 className="font-editorial-heading-3 text-[19px] sm:text-[21px] text-[#0F3F24] font-normal leading-tight">
                {facility.name}
              </h4>
              <div className="flex items-center gap-1.5 text-[14px] font-interface-sans text-[#4F6B58]">
                <IconMapPin size={14} className="shrink-0 text-[#0F3F24]" />
                <span>
                  {facility.location.area}, {facility.location.city} · {facility.location.distanceKm} km away
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. DISPATCH CARD */}
        <div className="relative z-10 pl-6 sm:pl-8">
          <div
            className="absolute left-0 top-6 w-3 h-3 rounded-full bg-[#FFFFFF] border-2 border-[#0F3F24]"
            aria-hidden="true"
          />
          <div className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-4 sm:p-5 transition-shadow">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#CFDACF]/60">
              <span className="text-[12px] font-interface-sans font-semibold text-[#0F3F24] tracking-wide uppercase">
                2. Dispatch
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF9EB] text-[#9A6700] border border-[#9A6700]/30 text-[13px] font-interface-sans font-medium">
                <IconClock size={12} strokeWidth={2} />
                <span>Awaiting acceptance</span>
              </span>
            </div>
            <div className="pt-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-editorial-heading-3 text-[19px] sm:text-[21px] text-[#0F3F24] font-normal leading-tight">
                  {ambulance.providerName}
                </h4>
                <span className="text-[14px] font-interface-sans font-medium text-[#0F3F24] bg-[#EEF3EC] px-2 py-0.5 rounded-[6px]">
                  Est. {ambulance.estimatedResponseTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[14px] font-interface-sans text-[#4F6B58]">
                <IconAmbulance size={14} className="shrink-0 text-[#0F3F24]" />
                <span>{ambulance.vehicleType} · {ambulance.baseLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ASSIST CARD */}
        <div className="relative z-10 pl-6 sm:pl-8">
          <div
            className="absolute left-0 top-6 w-3 h-3 rounded-full bg-[#FFFFFF] border-2 border-[#0F3F24]"
            aria-hidden="true"
          />
          <div className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-4 sm:p-5 transition-shadow">
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#CFDACF]/60">
              <span className="text-[12px] font-interface-sans font-semibold text-[#0F3F24] tracking-wide uppercase">
                3. Assist
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF3EC] text-[#247447] border border-[#247447]/30 text-[13px] font-interface-sans font-medium">
                <IconShieldCheck size={12} strokeWidth={2} />
                <span>Verified by {facility.name}</span>
              </span>
            </div>
            <div className="pt-2.5 space-y-2">
              <div className="flex items-center justify-between text-[14px] font-interface-sans">
                <span className="text-[#0F3F24] font-medium">{assist.medicalProcedure}</span>
                <span className="text-[#4F6B58]">{assistPercent}% funded</span>
              </div>
              <div className="w-full h-2 bg-[#EEF3EC] rounded-full overflow-hidden border border-[#CFDACF]/40">
                <div
                  className="h-full bg-[#0F3F24] rounded-full"
                  style={{ width: `${assistPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption underneath as required */}
      <div className="mt-4 text-center">
        <span className="text-[14px] font-interface-sans text-[#4F6B58] font-normal">
          {LANDING_CONTENT.hero.previewCaption}
        </span>
      </div>
    </div>
  );
};
