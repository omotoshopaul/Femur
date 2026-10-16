import React from 'react';
import { AmbulanceProviderSampleData } from '../types';
import { AvailabilityBadge } from './AvailabilityBadge';
import { Button } from './Button';
import { IconAmbulance, IconMapPin, IconPhone } from './LineIcons';
import { StatusBadge } from './StatusBadge';

export interface AmbulanceProviderCardProps {
  provider: AmbulanceProviderSampleData;
  onRequestDispatch?: (provider: AmbulanceProviderSampleData) => void;
  className?: string;
}

export const AmbulanceProviderCard: React.FC<AmbulanceProviderCardProps> = ({
  provider,
  onRequestDispatch,
  className = '',
}) => {
  return (
    <article
      className={`bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-5 sm:p-6 transition-colors relative flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#CFDACF]/60">
          <span className="text-[13px] font-interface-sans font-medium text-[#4F6B58] bg-[#EEF3EC] px-2.5 py-0.5 rounded-[8px]">
            {provider.baseLocation}
          </span>
          <AvailabilityBadge
            state={provider.verificationState}
            lastConfirmedTime={provider.lastConfirmedTime}
          />
        </div>

        {/* Provider Title & Vehicle Type */}
        <div className="pt-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <StatusBadge
              label={provider.operationalStatus}
              tone={provider.operationalStatus === 'Available on Call' ? 'success' : 'warning'}
            />
            <span className="text-[14px] font-interface-sans text-[#4F6B58]">
              {provider.vehicleType}
            </span>
          </div>
          <h3 className="font-editorial-heading-3 text-[22px] sm:text-[24px] text-[#0F3F24] font-normal leading-tight pt-1">
            {provider.providerName}
          </h3>
          <div className="flex items-center gap-1.5 text-[14px] font-interface-sans text-[#4F6B58] pt-1">
            <IconMapPin size={16} strokeWidth={1.5} className="shrink-0 text-[#0F3F24]" />
            <span>Base: {provider.baseLocation}</span>
          </div>
        </div>

        {/* Coverage Areas */}
        <div className="mt-4 pt-3 border-t border-[#CFDACF]/60">
          <div className="text-[14px] font-interface-sans font-medium text-[#0F3F24] mb-2">
            Designated Coverage Zones
          </div>
          <div className="flex flex-wrap gap-1.5">
            {provider.coverageAreas.map((area, idx) => (
              <span
                key={idx}
                className="text-[14px] font-interface-sans bg-[#EEF3EC] text-[#0F3F24] px-2.5 py-1 rounded-[8px]"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Provider acceptance notice */}
        <div className="mt-4 p-3 bg-[#EEF3EC]/50 rounded-[8px] border border-[#CFDACF]/50 text-[14px] font-interface-sans text-[#4F6B58]">
          <span className="font-medium text-[#0F3F24]">Notice: </span>
          {provider.providerNotice}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-[#CFDACF] flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          leftIcon={<IconAmbulance size={16} strokeWidth={1.5} />}
          onClick={() => onRequestDispatch && onRequestDispatch(provider)}
          accessibleName={`Coordinate dispatch with ${provider.providerName}`}
        >
          Coordinate Dispatch
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconPhone size={16} strokeWidth={1.5} />}
          onClick={() => onRequestDispatch && onRequestDispatch(provider)}
          accessibleName={`Contact dispatch desk for ${provider.providerName}`}
        >
          Dispatch Line
        </Button>
      </div>
    </article>
  );
};
