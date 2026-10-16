import React from 'react';
import { FacilitySampleData } from '../types';
import { AvailabilityBadge } from './AvailabilityBadge';
import { Button } from './Button';
import { IconMapPin, IconPhone, IconShieldCheck } from './LineIcons';

export interface FacilityCardProps {
  facility: FacilitySampleData;
  onSelect?: (facility: FacilitySampleData) => void;
  onCall?: (facility: FacilitySampleData) => void;
  className?: string;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  onSelect,
  onCall,
  className = '',
}) => {
  return (
    <article
      className={`bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-5 sm:p-6 transition-colors duration-150 relative flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Card Header: Location Area + Availability state */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#CFDACF]/60">
          <span className="text-[13px] font-interface-sans font-medium text-[#4F6B58] bg-[#EEF3EC] px-2.5 py-0.5 rounded-[8px]">
            {facility.location.area}
          </span>
          <AvailabilityBadge
            state={facility.verificationState}
            lastConfirmedTime={facility.lastConfirmedTime}
          />
        </div>

        {/* Facility Title & Type */}
        <div className="pt-4 space-y-1.5">
          <div className="text-[14px] font-interface-sans text-[#4F6B58] font-medium">
            {facility.facilityType} · {facility.traumaLevel}
          </div>
          <h3 className="font-editorial-heading-3 text-[22px] sm:text-[24px] text-[#0F3F24] font-normal leading-tight">
            {facility.name}
          </h3>
          <div className="flex items-center gap-1.5 text-[14px] font-interface-sans text-[#4F6B58] pt-1">
            <IconMapPin size={16} strokeWidth={1.5} className="shrink-0 text-[#0F3F24]" />
            <span>
              {facility.location.area}, {facility.location.city} ({facility.location.state})
            </span>
            {facility.location.distanceKm && (
              <span className="text-[#0F3F24] font-medium">
                · {facility.location.distanceKm} km away
              </span>
            )}
          </div>
        </div>

        {/* Confirmed Capabilities Grid */}
        <div className="mt-5 pt-4 border-t border-[#CFDACF]/60 space-y-2.5">
          <div className="text-[14px] font-interface-sans font-medium text-[#0F3F24] flex items-center gap-1.5">
            <IconShieldCheck size={16} strokeWidth={1.5} className="text-[#0F3F24]" />
            <span>Confirmed Capabilities</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px] font-interface-sans">
            {facility.verifiedCapabilities.map((cap) => (
              <li
                key={cap.id}
                className="flex items-center gap-2 text-[#0F3F24] bg-[#EEF3EC]/50 px-2.5 py-1.5 rounded-[8px]"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    cap.available ? 'bg-[#247447]' : 'bg-[#CFDACF]'
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate">{cap.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical stats summary */}
        <div className="mt-4 grid grid-cols-3 gap-2 p-3 bg-[#EEF3EC]/40 rounded-[8px] border border-[#CFDACF]/40 text-center text-[14px] font-interface-sans">
          <div>
            <div className="text-[#4F6B58]">Oxygen</div>
            <div className="font-medium text-[#0F3F24]">
              {facility.oxygenAvailable ? 'Available' : 'Unavailable'}
            </div>
          </div>
          <div>
            <div className="text-[#4F6B58]">Blood Bank</div>
            <div className="font-medium text-[#0F3F24]">
              {facility.bloodBankAvailable ? 'Ready' : 'Depleted'}
            </div>
          </div>
          <div>
            <div className="text-[#4F6B58]">ICU Beds</div>
            <div className="font-medium text-[#0F3F24]">
              {facility.icuBedsAvailable !== undefined ? facility.icuBedsAvailable : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-[#CFDACF] flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onSelect && onSelect(facility)}
          accessibleName={`View verified details for ${facility.name}`}
        >
          View Verified Profile
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconPhone size={16} strokeWidth={1.5} />}
          onClick={() => onCall && onCall(facility)}
          accessibleName={`Call emergency line for ${facility.name}`}
        >
          Call Desk
        </Button>
      </div>
    </article>
  );
};
