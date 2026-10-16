import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { AvailabilityBadge } from '../../components/AvailabilityBadge';
import {
  IconCheck,
  IconX,
  IconClock,
  IconAmbulance,
  IconShieldCheck,
  IconMapPin,
  IconAlertTriangle,
  IconPlus,
} from '../../components/LineIcons';
import {
  DEMO_HOSPITAL_DATA,
  DEMO_AMBULANCE_DATA,
  DEMO_SPONSOR_DATA,
} from '../../content/sampleRoleData';
import { HospitalResourceState, IncomingPatient, AssistanceVerificationItem, DispatchRequest, AmbulanceVehicle, SponsorCase } from '../../types/auth';

/**
 * =========================================================================
 * 1. HOSPITAL DASHBOARD VIEW
 * =========================================================================
 */
export const HospitalDashboardView: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { orgDoc } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive emergency intake status: Open / Divert / Full
  const [intakeStatus, setIntakeStatus] = useState<'Open' | 'Divert' | 'Full'>(
    DEMO_HOSPITAL_DATA.initialIntakeStatus
  );

  // Incoming patients state
  const [incomingPatients, setIncomingPatients] = useState<IncomingPatient[]>(
    DEMO_HOSPITAL_DATA.incomingPatients
  );

  // Resource availability state with one-tap confirm
  const [resources, setResources] = useState<HospitalResourceState[]>(
    DEMO_HOSPITAL_DATA.resources
  );

  // Assistance verification cases
  const [assistanceCases, setAssistanceCases] = useState<AssistanceVerificationItem[]>(
    DEMO_HOSPITAL_DATA.assistanceCases
  );

  // Quick confirm resource status
  const handleConfirmResource = (id: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              lastConfirmedTime: 'Confirmed just now',
              lastConfirmedDate: new Date(),
            }
          : r
      )
    );
  };

  // Toggle resource availability
  const handleToggleResourceAvailability = (id: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              isAvailable: !r.isAvailable,
              lastConfirmedTime: 'Updated just now',
              lastConfirmedDate: new Date(),
            }
          : r
      )
    );
  };

  // Acknowledge incoming patient
  const handleAcknowledgePatient = (id: string) => {
    setIncomingPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'acknowledged' } : p))
    );
  };

  // Verify assistance case
  const handleVerifyAssistance = (id: string) => {
    setAssistanceCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, verified: true } : c))
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'incoming', label: 'Incoming patients' },
    { id: 'resources', label: 'Resource availability' },
    { id: 'assistance', label: 'Assistance verification' },
    { id: 'settings', label: 'Settings' },
  ];

  const hospitalName = orgDoc?.name || DEMO_HOSPITAL_DATA.org.name;

  return (
    <DashboardLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateHome={onNavigateHome}
    >
      <div className="space-y-8">
        {/* Top Header: Hospital Name, Verification Badge & Emergency Intake Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#CFDACF]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h2 className="font-editorial-serif text-[28px] sm:text-[34px] text-[#0F3F24] font-normal leading-tight">
                {hospitalName}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF3EC] text-[#247447] border border-[#247447]/30 text-[12px] font-medium">
                <IconShieldCheck size={14} strokeWidth={2} />
                <span>Verified Facility</span>
              </span>
            </div>
            <p className="text-[14px] text-[#4F6B58]">
              Emergency Department Operations · {orgDoc?.lga || 'Surulere'}, {orgDoc?.state || 'Lagos State'}
            </p>
          </div>

          {/* Quick Toggle: Emergency intake Open / Divert / Full */}
          <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#CFDACF] p-1.5 rounded-[10px]">
            <span className="text-[13px] font-medium text-[#4F6B58] px-2">
              Emergency Intake:
            </span>
            {(['Open', 'Divert', 'Full'] as const).map((mode) => {
              const isSelected = intakeStatus === mode;
              const toneClasses =
                mode === 'Open'
                  ? isSelected
                    ? 'bg-[#247447] text-[#FFFFFF]'
                    : 'text-[#4F6B58] hover:bg-[#EEF3EC]'
                  : mode === 'Divert'
                  ? isSelected
                    ? 'bg-[#9A6700] text-[#FFFFFF]'
                    : 'text-[#4F6B58] hover:bg-[#FFF9EB]'
                  : isSelected
                  ? 'bg-[#B42318] text-[#FFFFFF]'
                  : 'text-[#4F6B58] hover:bg-[#FEF3F2]';

              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setIntakeStatus(mode)}
                  className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-colors ${toneClasses}`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-1">
                <span className="text-[13px] text-[#4F6B58] font-medium uppercase tracking-wide">
                  Incoming En Route
                </span>
                <div className="font-editorial-serif text-[36px] font-light text-[#0F3F24] leading-none">
                  {incomingPatients.filter((p) => p.status === 'en_route').length}
                </div>
                <p className="text-[12px] text-[#4F6B58]">Transport units approaching ED</p>
              </div>

              <div className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-1">
                <span className="text-[13px] text-[#4F6B58] font-medium uppercase tracking-wide">
                  Oxygen Reserves
                </span>
                <div className="font-editorial-serif text-[36px] font-light text-[#247447] leading-none">
                  100%
                </div>
                <p className="text-[12px] text-[#4F6B58]">Verified pipeline & cylinders</p>
              </div>

              <div className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-1">
                <span className="text-[13px] text-[#4F6B58] font-medium uppercase tracking-wide">
                  Pending Assistance
                </span>
                <div className="font-editorial-serif text-[36px] font-light text-[#0F3F24] leading-none">
                  {assistanceCases.filter((c) => !c.verified).length}
                </div>
                <p className="text-[12px] text-[#4F6B58]">Cases awaiting clinical audit</p>
              </div>
            </div>

            {/* Section: Incoming Patients Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                  Incoming patients
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('incoming')}
                  className="text-[14px] text-[#0F3F24] hover:underline font-medium"
                >
                  View all ({incomingPatients.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {incomingPatients.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#0F3F24]/50 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-medium text-[#0F3F24] text-[16px]">
                          Patient {p.patientInitials}
                        </span>
                        <StatusBadge
                          label={
                            p.acuity === 'immediate'
                              ? 'Immediate (Red)'
                              : p.acuity === 'urgent'
                              ? 'Urgent (Yellow)'
                              : 'Stable (Green)'
                          }
                          tone={
                            p.acuity === 'immediate'
                              ? 'danger'
                              : p.acuity === 'urgent'
                              ? 'warning'
                              : 'neutral'
                          }
                        />
                        <span className="text-[13px] font-medium text-[#0F3F24] bg-[#EEF3EC] px-2 py-0.5 rounded-[6px]">
                          ETA: ~{p.etaMinutes} mins
                        </span>
                      </div>
                      <p className="text-[14px] text-[#4F6B58]">{p.triageSummary}</p>
                      <p className="text-[12px] text-[#4F6B58]/80">Transport Unit: {p.transportUnit}</p>
                    </div>

                    <div className="shrink-0">
                      {p.status === 'en_route' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAcknowledgePatient(p.id)}
                          className="border-[#0F3F24] text-[#0F3F24]"
                        >
                          Acknowledge intake
                        </Button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#247447]">
                          <IconCheck size={16} />
                          <span>Intake Acknowledged</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Resource Availability */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                    Resource availability
                  </h3>
                  <p className="text-[13px] text-[#4F6B58]">
                    Single-tap confirmation ensures accurate visibility for emergency dispatchers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('resources')}
                  className="text-[14px] text-[#0F3F24] hover:underline font-medium"
                >
                  Manage resources →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[#0F3F24] text-[16px]">{r.name}</h4>
                          <StatusBadge
                            label={r.isAvailable ? 'Available' : 'Restricted'}
                            tone={r.isAvailable ? 'success' : 'danger'}
                          />
                        </div>
                        <p className="text-[13px] text-[#4F6B58]">{r.statusText}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#CFDACF]/60 flex items-center justify-between">
                      <span className="text-[12px] text-[#4F6B58]">{r.lastConfirmedTime}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleConfirmResource(r.id)}
                        className="text-[12px] py-1 h-auto"
                      >
                        Confirm current status
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. INCOMING PATIENTS FULL VIEW */}
        {activeTab === 'incoming' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Incoming patients & Triage
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Real-time tracking of patients en route via FEMUR Dispatch with ETAs and acuity levels.
              </p>
            </div>

            <div className="space-y-4">
              {incomingPatients.map((p) => (
                <div
                  key={p.id}
                  className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-editorial-serif text-[22px] text-[#0F3F24]">
                        Patient {p.patientInitials}
                      </h3>
                      <StatusBadge
                        label={
                          p.acuity === 'immediate'
                            ? 'Immediate Priority (Red)'
                            : p.acuity === 'urgent'
                            ? 'Urgent (Yellow)'
                            : 'Stable (Green)'
                        }
                        tone={
                          p.acuity === 'immediate'
                            ? 'danger'
                            : p.acuity === 'urgent'
                            ? 'warning'
                            : 'neutral'
                        }
                      />
                    </div>
                    <span className="text-[15px] font-semibold text-[#0F3F24] bg-[#EEF3EC] px-3 py-1 rounded-[6px]">
                      ETA: ~{p.etaMinutes} minutes
                    </span>
                  </div>

                  <p className="text-[15px] text-[#4F6B58] leading-relaxed">{p.triageSummary}</p>

                  <div className="pt-3 border-t border-[#CFDACF]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]">
                    <span className="text-[#4F6B58]">
                      Coordination Partner: <strong className="text-[#0F3F24]">{p.transportUnit}</strong>
                    </span>

                    {p.status === 'en_route' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAcknowledgePatient(p.id)}
                      >
                        Acknowledge & Prepare Trauma Bay
                      </Button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#247447]">
                        <IconCheck size={18} />
                        <span>Trauma Bay Assigned & Ready</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. RESOURCE AVAILABILITY FULL VIEW */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Resource availability & verification
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Keep critical capabilities verified. Listings show last-confirmed timestamps to emergency coordinators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((r) => (
                <div
                  key={r.id}
                  className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-editorial-heading-3 text-[20px] text-[#0F3F24]">{r.name}</h3>
                      <p className="text-[14px] text-[#4F6B58] mt-1">{r.statusText}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleResourceAvailability(r.id)}
                      className={`text-[12px] font-medium px-2.5 py-1 rounded-[6px] border ${
                        r.isAvailable
                          ? 'bg-[#EEF3EC] text-[#247447] border-[#247447]/30'
                          : 'bg-[#FEF3F2] text-[#B42318] border-[#B42318]/30'
                      }`}
                    >
                      {r.isAvailable ? 'Active & Ready' : 'Diverted / Depleted'}
                    </button>
                  </div>

                  <div className="pt-3 border-t border-[#CFDACF]/60 flex items-center justify-between">
                    <span className="text-[13px] text-[#4F6B58]">{r.lastConfirmedTime}</span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConfirmResource(r.id)}
                    >
                      Confirm status now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ASSISTANCE VERIFICATION */}
        {activeTab === 'assistance' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Assistance verification
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Requests from patients at this hospital awaiting clinical audit of medical need and itemized estimates.
              </p>
            </div>

            <div className="space-y-4">
              {assistanceCases.map((c) => (
                <div
                  key={c.id}
                  className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-[#4F6B58] uppercase">
                          Case {c.id}
                        </span>
                        <StatusBadge
                          label={c.verified ? 'Hospital Verified' : 'Awaiting Audit'}
                          tone={c.verified ? 'success' : 'warning'}
                        />
                      </div>
                      <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] mt-1">
                        Patient {c.patientInitials} — {c.diagnosis}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-[24px] font-editorial-serif font-light text-[#0F3F24]">
                        ₦{c.estimatedCostNgn.toLocaleString()}
                      </div>
                      <div className="text-[12px] text-[#4F6B58]">Estimated Hospital Fee</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#CFDACF]/60 flex items-center justify-between">
                    <span className="text-[13px] text-[#4F6B58]">Submitted {c.submittedTime}</span>
                    {!c.verified ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => alert('Itemized fee breakdown requested from billing.')}
                        >
                          Request breakdown
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleVerifyAssistance(c.id)}
                        >
                          Verify estimate
                        </Button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#247447]">
                        <IconShieldCheck size={18} />
                        <span>Verified for Donor Matching</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-xl">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Facility details
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Official hospital credentials and operational contacts.
              </p>
            </div>

            <div className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-4">
              <div>
                <span className="text-[12px] font-semibold text-[#4F6B58] uppercase">Facility Name</span>
                <p className="font-medium text-[#0F3F24] text-[16px]">{hospitalName}</p>
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#4F6B58] uppercase">Location</span>
                <p className="font-medium text-[#0F3F24] text-[15px]">
                  {orgDoc?.lga || 'Surulere'}, {orgDoc?.state || 'Lagos'}
                </p>
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#4F6B58] uppercase">Verification Status</span>
                <p className="font-medium text-[#247447] text-[15px] flex items-center gap-1.5 mt-0.5">
                  <IconShieldCheck size={16} /> Verified Acute Care Center
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/**
 * =========================================================================
 * 2. AMBULANCE PROVIDER DASHBOARD VIEW
 * =========================================================================
 */
export const AmbulanceProviderDashboardView: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { orgDoc } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Toggle: Accepting dispatches On / Off
  const [acceptingDispatches, setAcceptingDispatches] = useState(
    DEMO_AMBULANCE_DATA.initialAcceptingDispatches
  );

  // Incoming dispatch requests
  const [incomingRequests, setIncomingRequests] = useState<DispatchRequest[]>(
    DEMO_AMBULANCE_DATA.incomingRequests
  );

  // Active trip state
  const [activeTrip, setActiveTrip] = useState<typeof DEMO_AMBULANCE_DATA.activeTrip | null>(
    DEMO_AMBULANCE_DATA.activeTrip
  );

  // Fleet list
  const [fleet, setFleet] = useState<AmbulanceVehicle[]>(DEMO_AMBULANCE_DATA.fleet);

  // Actions
  const handleAcceptRequest = (id: string) => {
    const req = incomingRequests.find((r) => r.id === id);
    if (!req) return;
    setIncomingRequests((prev) => prev.filter((r) => r.id !== id));
    setActiveTrip({
      id: `trip-${id}`,
      patientSummary: `Transport for ${req.patientAcuity} patient from ${req.pickupLocation}`,
      pickupLocation: req.pickupLocation,
      destinationHospital: req.destinationHospital,
      hospitalCapacityStatus: 'Intake: Open · Confirmed',
      stage: 'at_pickup',
    });
  };

  const handleDeclineRequest = (id: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'dispatches', label: 'Dispatch requests' },
    { id: 'trip', label: 'Active trip' },
    { id: 'fleet', label: 'Fleet status' },
    { id: 'settings', label: 'Settings' },
  ];

  const providerName = orgDoc?.name || DEMO_AMBULANCE_DATA.org.name;

  return (
    <DashboardLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateHome={onNavigateHome}
    >
      <div className="space-y-8">
        {/* Top Header: Provider Name, Verification & Accepting Dispatches Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#CFDACF]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h2 className="font-editorial-serif text-[28px] sm:text-[34px] text-[#0F3F24] font-normal leading-tight">
                {providerName}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF3EC] text-[#247447] border border-[#247447]/30 text-[12px] font-medium">
                <IconShieldCheck size={14} strokeWidth={2} />
                <span>Verified Fleet</span>
              </span>
            </div>
            <p className="text-[14px] text-[#4F6B58]">
              Emergency Ambulance Dispatch & Transport Hub · {orgDoc?.lga || 'Ikeja'}, {orgDoc?.state || 'Lagos'}
            </p>
          </div>

          {/* Toggle: Accepting Dispatches On / Off */}
          <div className="flex items-center gap-3 bg-[#FFFFFF] border border-[#CFDACF] p-2 rounded-[10px]">
            <span className="text-[13px] font-medium text-[#4F6B58]">
              Accepting dispatches:
            </span>
            <button
              type="button"
              onClick={() => setAcceptingDispatches(!acceptingDispatches)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                acceptingDispatches ? 'bg-[#0F3F24]' : 'bg-[#CFDACF]'
              }`}
              role="switch"
              aria-checked={acceptingDispatches}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#FFFFFF] shadow-lg ring-0 transition duration-200 ease-in-out ${
                  acceptingDispatches ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-[13px] font-semibold ${
                acceptingDispatches ? 'text-[#0F3F24]' : 'text-[#B42318]'
              }`}
            >
              {acceptingDispatches ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Active Trip Notice if exists */}
            {activeTrip && (
              <div className="p-6 bg-[#EEF3EC] border border-[#0F3F24]/30 rounded-[12px] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#247447] animate-pulse" />
                    <span className="font-semibold text-[#0F3F24] text-[13px] uppercase tracking-wider">
                      Live Trip In Progress
                    </span>
                  </div>
                  <StatusBadge
                    label={
                      activeTrip.stage === 'at_pickup'
                        ? 'At Pickup Location'
                        : activeTrip.stage === 'in_transit'
                        ? 'In Transit to Hospital'
                        : 'Arrived at Destination'
                    }
                    tone="success"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-[15px] font-medium text-[#0F3F24]">{activeTrip.patientSummary}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px] text-[#4F6B58] pt-1">
                    <div>
                      <span className="font-semibold text-[#0F3F24]">Destination: </span>
                      {activeTrip.destinationHospital}
                    </div>
                    <div>
                      <span className="font-semibold text-[#0F3F24]">Capacity Status: </span>
                      {activeTrip.hospitalCapacityStatus}
                    </div>
                  </div>
                </div>

                {/* Progress Controls */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {activeTrip.stage === 'at_pickup' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveTrip({ ...activeTrip, stage: 'in_transit' })}
                    >
                      Start transport to hospital
                    </Button>
                  )}
                  {activeTrip.stage === 'in_transit' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveTrip({ ...activeTrip, stage: 'arrived' })}
                    >
                      Mark arrived at hospital
                    </Button>
                  )}
                  {activeTrip.stage === 'arrived' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveTrip(null)}
                      className="border-[#0F3F24] text-[#0F3F24]"
                    >
                      Complete & Clear Trip
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Section: Incoming Dispatch Requests */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                    Incoming dispatch requests
                  </h3>
                  <p className="text-[13px] text-[#4F6B58]">
                    Requires explicit provider confirmation prior to ambulance dispatch.
                  </p>
                </div>
                <span className="text-[13px] text-[#4F6B58] font-medium">
                  {incomingRequests.length} pending
                </span>
              </div>

              {incomingRequests.length === 0 ? (
                <div className="p-8 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] text-center space-y-2">
                  <p className="text-[15px] font-medium text-[#0F3F24]">
                    No incoming dispatch requests.
                  </p>
                  <p className="text-[13px] text-[#4F6B58]">
                    You will receive instant alerts when patients or hospitals request transport in your coverage area.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#0F3F24]/50 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[12px] font-semibold text-[#4F6B58] uppercase">
                            {req.id}
                          </span>
                          <StatusBadge
                            label={req.patientAcuity}
                            tone={req.patientAcuity.includes('Red') ? 'danger' : 'warning'}
                          />
                          <span className="text-[13px] text-[#4F6B58]">{req.distanceKm} km away</span>
                        </div>
                        <div className="text-[15px] font-medium text-[#0F3F24]">
                          Pickup: {req.pickupLocation}
                        </div>
                        <div className="text-[14px] text-[#4F6B58]">
                          Destination: {req.destinationHospital} · Received {req.timeReceived}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDeclineRequest(req.id)}
                          className="border-[#B42318] text-[#B42318] hover:bg-[#FEF3F2]"
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAcceptRequest(req.id)}
                        >
                          Accept dispatch
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section: Fleet Status */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                  Fleet status
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('fleet')}
                  className="text-[14px] text-[#0F3F24] hover:underline font-medium"
                >
                  Manage fleet ({fleet.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fleet.map((v) => (
                  <div
                    key={v.id}
                    className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-[#0F3F24] text-[16px]">{v.callSign}</h4>
                        <span className="text-[13px] text-[#4F6B58]">{v.vehicleType}</span>
                      </div>
                      <StatusBadge
                        label={v.status}
                        tone={
                          v.status === 'Available'
                            ? 'success'
                            : v.status === 'En route'
                            ? 'warning'
                            : 'neutral'
                        }
                      />
                    </div>
                    <div className="pt-2 border-t border-[#CFDACF]/60 text-[13px] text-[#4F6B58]">
                      Crew: {v.crewMembers}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. DISPATCH REQUESTS FULL TAB */}
        {activeTab === 'dispatches' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Dispatch requests
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Real-time transport requests matched by location and capability.
              </p>
            </div>

            <div className="space-y-4">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#4F6B58]">{req.id}</span>
                    <StatusBadge
                      label={req.patientAcuity}
                      tone={req.patientAcuity.includes('Red') ? 'danger' : 'warning'}
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[15px]">
                      <strong className="text-[#0F3F24]">Pickup Location:</strong> {req.pickupLocation}
                    </p>
                    <p className="text-[15px]">
                      <strong className="text-[#0F3F24]">Target Facility:</strong> {req.destinationHospital}
                    </p>
                    <p className="text-[14px] text-[#4F6B58]">
                      Distance: {req.distanceKm} km · Received {req.timeReceived}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#CFDACF]/60 flex items-center justify-end gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeclineRequest(req.id)}
                      className="text-[#B42318] border-[#B42318]"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAcceptRequest(req.id)}
                    >
                      Accept dispatch
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. ACTIVE TRIP */}
        {activeTab === 'trip' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Active trip
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Current patient transport route, status updates, and emergency hospital handoff.
              </p>
            </div>

            {activeTrip ? (
              <div className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial-serif text-[22px] text-[#0F3F24]">
                    Trip #{activeTrip.id}
                  </h3>
                  <StatusBadge
                    label={
                      activeTrip.stage === 'at_pickup'
                        ? 'At Pickup'
                        : activeTrip.stage === 'in_transit'
                        ? 'In Transit'
                        : 'Arrived at Hospital'
                    }
                    tone="success"
                  />
                </div>

                <div className="space-y-2 text-[15px]">
                  <p>
                    <strong className="text-[#0F3F24]">Patient Acuity & Summary: </strong>
                    <span className="text-[#4F6B58]">{activeTrip.patientSummary}</span>
                  </p>
                  <p>
                    <strong className="text-[#0F3F24]">Origin: </strong>
                    <span className="text-[#4F6B58]">{activeTrip.pickupLocation}</span>
                  </p>
                  <p>
                    <strong className="text-[#0F3F24]">Hospital Destination: </strong>
                    <span className="text-[#4F6B58]">{activeTrip.destinationHospital}</span>
                  </p>
                  <p>
                    <strong className="text-[#0F3F24]">Hospital Intake Capacity: </strong>
                    <span className="text-[#247447]">{activeTrip.hospitalCapacityStatus}</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-[#CFDACF] flex items-center gap-3">
                  {activeTrip.stage === 'at_pickup' && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setActiveTrip({ ...activeTrip, stage: 'in_transit' })}
                    >
                      Mark departed with patient
                    </Button>
                  )}
                  {activeTrip.stage === 'in_transit' && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setActiveTrip({ ...activeTrip, stage: 'arrived' })}
                    >
                      Mark arrived at hospital
                    </Button>
                  )}
                  {activeTrip.stage === 'arrived' && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setActiveTrip(null)}
                    >
                      Complete patient handoff
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] text-center text-[15px] text-[#4F6B58]">
                No trip currently active. When an ambulance is dispatched, route and patient details display here.
              </div>
            )}
          </div>
        )}

        {/* 4. FLEET TAB */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Fleet status
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Manage registered ambulance vehicles, medical equipment grade, and on-duty crew.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fleet.map((v) => (
                <div
                  key={v.id}
                  className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-[#0F3F24] text-[17px]">{v.callSign}</h4>
                      <p className="text-[13px] text-[#4F6B58]">{v.vehicleType}</p>
                    </div>
                    <select
                      value={v.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as any;
                        setFleet((prev) =>
                          prev.map((item) => (item.id === v.id ? { ...item, status: newStatus } : item))
                        );
                      }}
                      className="text-[13px] font-medium border border-[#CFDACF] rounded-[6px] px-2 py-1 bg-[#FFFFFF] text-[#0F3F24]"
                    >
                      <option value="Available">Available</option>
                      <option value="En route">En route</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="text-[13px] text-[#4F6B58] pt-2 border-t border-[#CFDACF]/60">
                    Crew: {v.crewMembers}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-xl">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Provider profile
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Transport provider licensing and base coordinates.
              </p>
            </div>

            <div className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-4">
              <div>
                <span className="text-[12px] font-semibold text-[#4F6B58] uppercase">Provider Name</span>
                <p className="font-medium text-[#0F3F24] text-[16px]">{providerName}</p>
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#4F6B58] uppercase">Base Depot</span>
                <p className="font-medium text-[#0F3F24] text-[15px]">
                  {orgDoc?.lga || 'Ikeja'}, {orgDoc?.state || 'Lagos'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/**
 * =========================================================================
 * 3. SPONSOR DASHBOARD VIEW
 * =========================================================================
 */
export const SponsorDashboardView: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { orgDoc } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(DEMO_SPONSOR_DATA.stats);
  const [seekingCases, setSeekingCases] = useState<SponsorCase[]>(
    DEMO_SPONSOR_DATA.casesSeekingSupport
  );
  const [pledgedCases, setPledgedCases] = useState<SponsorCase[]>(
    DEMO_SPONSOR_DATA.pledgedCases
  );

  // Pledge modal state
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<SponsorCase | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState<number>(50000);

  const handleConfirmPledge = () => {
    if (!selectedCase) return;
    setSeekingCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? { ...c, fundedAmountNgn: c.fundedAmountNgn + pledgeAmount }
          : c
      )
    );
    setStats((prev) => ({
      ...prev,
      totalFundsDeployedNgn: prev.totalFundsDeployedNgn + pledgeAmount,
    }));
    setPledgeModalOpen(false);
    setSelectedCase(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'cases', label: 'Verified cases seeking support' },
    { id: 'pledged', label: 'Pledged & active cases' },
    { id: 'settings', label: 'Settings' },
  ];

  const sponsorName = orgDoc?.name || DEMO_SPONSOR_DATA.org.name;

  return (
    <DashboardLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateHome={onNavigateHome}
    >
      <div className="space-y-8">
        {/* Top Header: Sponsor Name, Stats (Total funds deployed, Patients supported) */}
        <div className="pb-6 border-b border-[#CFDACF] space-y-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-editorial-serif text-[28px] sm:text-[34px] text-[#0F3F24] font-normal leading-tight">
                {sponsorName}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF3EC] text-[#247447] border border-[#247447]/30 text-[12px] font-medium">
                <IconShieldCheck size={14} strokeWidth={2} />
                <span>Verified Funding Partner</span>
              </span>
            </div>
            <p className="text-[14px] text-[#4F6B58] mt-1">
              Emergency Care Sponsorship & Direct Hospital Grant Management
            </p>
          </div>

          {/* Large Serif Numerals for Statistics with Small Sans Captions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-1">
              <div className="font-editorial-serif text-[42px] sm:text-[48px] font-light text-[#0F3F24] leading-none tracking-tight">
                ₦{(stats.totalFundsDeployedNgn / 1000000).toFixed(1)}M
              </div>
              <p className="font-interface-sans text-[15px] text-[#4F6B58]">
                Total funds deployed directly to verified hospital accounts
              </p>
            </div>

            <div className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-1">
              <div className="font-editorial-serif text-[42px] sm:text-[48px] font-light text-[#0F3F24] leading-none tracking-tight">
                {stats.patientsSupportedCount}
              </div>
              <p className="font-interface-sans text-[15px] text-[#4F6B58]">
                Patients supported through emergency procedures and trauma care
              </p>
            </div>
          </div>
        </div>

        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Section: Verified cases seeking support */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                    Verified cases seeking support
                  </h3>
                  <p className="text-[13px] text-[#4F6B58]">
                    Hospital-verified medical necessity and audited treatment costs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('cases')}
                  className="text-[14px] text-[#0F3F24] hover:underline font-medium"
                >
                  View all ({seekingCases.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {seekingCases.map((c) => {
                  const percent = Math.min(100, Math.round((c.fundedAmountNgn / c.requiredAmountNgn) * 100));
                  return (
                    <div
                      key={c.id}
                      className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] flex flex-col justify-between space-y-4 hover:border-[#0F3F24]/50 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-semibold text-[#4F6B58] uppercase">
                            Case {c.id}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#247447] bg-[#EEF3EC] px-2 py-0.5 rounded">
                            <IconShieldCheck size={13} />
                            <span>{c.verifiedHospitalName}</span>
                          </span>
                        </div>

                        <h4 className="font-editorial-serif text-[20px] text-[#0F3F24] leading-snug">
                          {c.procedure}
                        </h4>

                        <div className="flex items-baseline justify-between text-[14px] pt-1">
                          <span className="text-[#0F3F24] font-medium">
                            <span className="font-editorial-serif">₦</span>{c.fundedAmountNgn.toLocaleString()} funded
                          </span>
                          <span className="text-[#4F6B58]">
                            of <span className="font-editorial-serif">₦</span>{c.requiredAmountNgn.toLocaleString()} target
                          </span>
                        </div>

                        <div className="w-full h-2 bg-[#EEF3EC] rounded-full overflow-hidden border border-[#CFDACF]/40">
                          <div
                            className="h-full bg-[#0F3F24] rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#CFDACF]/60 flex items-center justify-between">
                        <span className="text-[12px] text-[#4F6B58]">{c.verifiedTime}</span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedCase(c);
                            setPledgeModalOpen(true);
                          }}
                        >
                          Pledge support
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section: Pledged & active cases */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                    Pledged & active cases
                  </h3>
                  <p className="text-[13px] text-[#4F6B58]">
                    Real-time status updates from hospitals on sponsored patients.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('pledged')}
                  className="text-[14px] text-[#0F3F24] hover:underline font-medium"
                >
                  View status ({pledgedCases.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {pledgedCases.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#0F3F24] text-[16px]">
                          Patient {c.patientInitials} — {c.procedure}
                        </span>
                        <StatusBadge
                          label={c.status === 'discharged' ? 'Discharged' : 'Under Treatment'}
                          tone={c.status === 'discharged' ? 'success' : 'neutral'}
                        />
                      </div>
                      <p className="text-[13px] text-[#4F6B58]">{c.verifiedTime}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[16px] font-editorial-serif text-[#0F3F24]">
                        ₦{c.fundedAmountNgn.toLocaleString()}
                      </span>
                      <p className="text-[12px] text-[#4F6B58]">Fully Funded</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. VERIFIED CASES SEEKING SUPPORT FULL TAB */}
        {activeTab === 'cases' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Verified cases seeking support
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Audited clinical cases awaiting emergency sponsorship. Grants disburse directly to treating hospitals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seekingCases.map((c) => {
                const percent = Math.min(100, Math.round((c.fundedAmountNgn / c.requiredAmountNgn) * 100));
                return (
                  <div
                    key={c.id}
                    className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#4F6B58] uppercase">
                        {c.id}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#247447] bg-[#EEF3EC] px-2.5 py-0.5 rounded">
                        <IconShieldCheck size={14} />
                        <span>Verified by {c.verifiedHospitalName}</span>
                      </span>
                    </div>

                    <h3 className="font-editorial-serif text-[22px] text-[#0F3F24]">
                      {c.procedure}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between text-[14px]">
                        <span className="font-medium text-[#0F3F24]">
                          <span className="font-editorial-serif">₦</span>{c.fundedAmountNgn.toLocaleString()} funded ({percent}%)
                        </span>
                        <span className="text-[#4F6B58]">
                          Required: <span className="font-editorial-serif">₦</span>{c.requiredAmountNgn.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#EEF3EC] rounded-full overflow-hidden border border-[#CFDACF]/40">
                        <div
                          className="h-full bg-[#0F3F24] rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#CFDACF]/60 flex items-center justify-between">
                      <span className="text-[13px] text-[#4F6B58]">{c.verifiedTime}</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedCase(c);
                          setPledgeModalOpen(true);
                        }}
                      >
                        Pledge support
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. PLEDGED & ACTIVE CASES TAB */}
        {activeTab === 'pledged' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Pledged & active cases
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Post-operative recovery tracking and clinical updates from hospital partners.
              </p>
            </div>

            <div className="space-y-4">
              {pledgedCases.map((c) => (
                <div
                  key={c.id}
                  className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial-serif text-[22px] text-[#0F3F24]">
                      Patient {c.patientInitials} — {c.procedure}
                    </h3>
                    <StatusBadge
                      label={c.status === 'discharged' ? 'Discharged' : 'Under Treatment'}
                      tone={c.status === 'discharged' ? 'success' : 'neutral'}
                    />
                  </div>
                  <p className="text-[14px] text-[#4F6B58] leading-relaxed">{c.verifiedTime}</p>
                  <div className="pt-2 border-t border-[#CFDACF]/60 flex items-center justify-between text-[13px] text-[#4F6B58]">
                    <span>Treating Facility: {c.verifiedHospitalName}</span>
                    <span className="font-medium text-[#0F3F24]">
                      Grant Disbursed: <span className="font-editorial-serif">₦</span>{c.fundedAmountNgn.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-xl">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Partner settings
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Sponsor verification credentials and direct disbursement accounts.
              </p>
            </div>

            <div className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-4">
              <div>
                <span className="text-[12px] font-semibold text-[#4F6B58] uppercase">Organization</span>
                <p className="font-medium text-[#0F3F24] text-[16px]">{sponsorName}</p>
              </div>
              <div>
                <span className="text-[12px] font-semibold text-[#4F6B58] uppercase">Headquarters</span>
                <p className="font-medium text-[#0F3F24] text-[15px]">
                  {orgDoc?.lga || 'Victoria Island'}, {orgDoc?.state || 'Lagos'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PLEDGE SUPPORT MODAL */}
      {pledgeModalOpen && selectedCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2E19]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-6 max-w-md w-full space-y-4 font-interface-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#CFDACF]">
              <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                Pledge Support
              </h3>
              <button
                type="button"
                onClick={() => setPledgeModalOpen(false)}
                className="text-[#4F6B58] hover:text-[#0F3F24]"
                aria-label="Close"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[13px] text-[#4F6B58]">Case: {selectedCase.procedure}</span>
              <p className="text-[14px] text-[#0F3F24] font-medium">
                Verified at: {selectedCase.verifiedHospitalName}
              </p>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0F3F24] mb-2">
                Pledge amount (NGN)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[50000, 100000, 200000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPledgeAmount(amt)}
                    className={`py-2 px-2 text-[13px] font-medium rounded-[6px] border ${
                      pledgeAmount === amt
                        ? 'border-[#0F3F24] bg-[#EEF3EC] text-[#0F3F24]'
                        : 'border-[#CFDACF] text-[#4F6B58]'
                    }`}
                  >
                    ₦{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={pledgeAmount}
                onChange={(e) => setPledgeAmount(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] text-[15px]"
              />
            </div>

            <p className="text-[12px] text-[#4F6B58]">
              Funds disburse directly to {selectedCase.verifiedHospitalName} upon medical receipt audit.
            </p>

            <div className="pt-3 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPledgeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmPledge}
              >
                Confirm ₦{pledgeAmount.toLocaleString()} Pledge
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
