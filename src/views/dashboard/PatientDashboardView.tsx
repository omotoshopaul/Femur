import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Alert } from '../../components/Alert';
import { FacilityCard } from '../../components/FacilityCard';
import { AvailabilityBadge } from '../../components/AvailabilityBadge';
import {
  IconCheck,
  IconX,
  IconClock,
  IconMapPin,
  IconAmbulance,
  IconShieldCheck,
  IconPhone,
  IconPlus,
} from '../../components/LineIcons';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { PersonDependent, EmergencyRequestDoc, PatientProfileDoc } from '../../types/auth';
import { DEMO_PATIENT_DATA } from '../../content/sampleRoleData';

export const PatientDashboardView: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { currentUser, userDoc, deleteAccountAndData, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Requests state
  const [requests, setRequests] = useState<EmergencyRequestDoc[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // People / Dependents state
  const [people, setPeople] = useState<PersonDependent[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [personModalOpen, setPersonModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PersonDependent | null>(null);

  // Person form
  const [pName, setPName] = useState('');
  const [pRel, setPRel] = useState('Parent');
  const [pBlood, setPBlood] = useState('');
  const [pAllergies, setPAllergies] = useState('');
  const [pNotes, setPNotes] = useState('');

  // New Request Form Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reqType, setReqType] = useState<'care' | 'transport' | 'assistance'>('care');
  const [reqSummary, setReqSummary] = useState('');
  const [reqLocation, setReqLocation] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);

  // Settings profile state
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Delete account confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const uid = currentUser?.uid;

  // Load requests
  const loadRequests = async () => {
    if (!uid) {
      setRequests([DEMO_PATIENT_DATA.activeRequest, ...DEMO_PATIENT_DATA.pastRequests]);
      return;
    }
    setLoadingRequests(true);
    try {
      const q = query(
        collection(db, 'requests'),
        where('createdByUid', '==', uid)
      );
      const snap = await getDocs(q);
      const list: EmergencyRequestDoc[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      if (list.length === 0) {
        setRequests([DEMO_PATIENT_DATA.activeRequest, ...DEMO_PATIENT_DATA.pastRequests]);
      } else {
        setRequests(list);
      }
    } catch (err) {
      console.error('Error fetching requests', err);
      setRequests([DEMO_PATIENT_DATA.activeRequest, ...DEMO_PATIENT_DATA.pastRequests]);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Load dependents
  const loadPeople = async () => {
    if (!uid) {
      setPeople(DEMO_PATIENT_DATA.dependents);
      return;
    }
    setLoadingPeople(true);
    try {
      const snap = await getDocs(collection(db, 'patientProfiles', uid, 'people'));
      const list: PersonDependent[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      if (list.length === 0) {
        setPeople(DEMO_PATIENT_DATA.dependents);
      } else {
        setPeople(list);
      }
    } catch (err) {
      console.error('Error fetching people', err);
      setPeople(DEMO_PATIENT_DATA.dependents);
    } finally {
      setLoadingPeople(false);
    }
  };

  // Load profile settings
  const loadProfile = async () => {
    if (!uid) {
      setPhone(DEMO_PATIENT_DATA.profile.phone);
      setEmergencyContact(DEMO_PATIENT_DATA.profile.emergencyContact);
      return;
    }
    try {
      const snap = await getDoc(doc(db, 'patientProfiles', uid));
      if (snap.exists()) {
        const data = snap.data() as PatientProfileDoc;
        setPhone(data.phone || DEMO_PATIENT_DATA.profile.phone);
        setEmergencyContact(data.emergencyContact || DEMO_PATIENT_DATA.profile.emergencyContact);
      } else {
        setPhone(DEMO_PATIENT_DATA.profile.phone);
        setEmergencyContact(DEMO_PATIENT_DATA.profile.emergencyContact);
      }
    } catch (err) {
      console.error('Error fetching profile', err);
    }
  };

  useEffect(() => {
    loadRequests();
    loadPeople();
    loadProfile();
  }, [uid]);

  // Handle saving new request
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqSummary.trim() || !reqLocation.trim()) return;

    setSubmittingReq(true);
    try {
      if (uid) {
        await addDoc(collection(db, 'requests'), {
          createdByUid: uid,
          type: reqType,
          status: 'pending',
          needSummary: reqSummary.trim(),
          locationText: reqLocation.trim(),
          sharedWith: [],
          createdAt: serverTimestamp(),
        });
      }
      const newReq: EmergencyRequestDoc = {
        id: `req-${Date.now()}`,
        createdByUid: uid || 'demo-user',
        type: reqType,
        status: 'pending',
        needSummary: reqSummary.trim(),
        locationText: reqLocation.trim(),
        sharedWith: [],
        createdAt: { seconds: Math.floor(Date.now() / 1000) },
      };
      setRequests((prev) => [newReq, ...prev]);
      setRequestModalOpen(false);
      setReqSummary('');
      setReqLocation('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'requests');
    } finally {
      setSubmittingReq(false);
    }
  };

  // Handle saving dependent
  const handleSavePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    const personData = {
      name: pName.trim(),
      relationship: pRel,
      bloodGroup: pBlood.trim() || undefined,
      allergies: pAllergies.trim() || undefined,
      notes: pNotes.trim() || undefined,
    };

    try {
      if (uid) {
        if (editingPerson) {
          await updateDoc(
            doc(db, 'patientProfiles', uid, 'people', editingPerson.id),
            personData
          );
        } else {
          await addDoc(collection(db, 'patientProfiles', uid, 'people'), personData);
        }
      }
      if (editingPerson) {
        setPeople((prev) =>
          prev.map((p) => (p.id === editingPerson.id ? { ...p, ...personData } : p))
        );
      } else {
        setPeople((prev) => [{ id: `dep-${Date.now()}`, ...personData }, ...prev]);
      }
      setPersonModalOpen(false);
      setEditingPerson(null);
      setPName('');
      setPBlood('');
      setPAllergies('');
      setPNotes('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `patientProfiles/${uid}/people`);
    }
  };

  const handleDeletePerson = async (id: string) => {
    try {
      if (uid) {
        await deleteDoc(doc(db, 'patientProfiles', uid, 'people', id));
      }
      setPeople((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `patientProfiles/${uid}/people/${id}`);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      if (uid) {
        await setDoc(
          doc(db, 'patientProfiles', uid),
          {
            phone: phone.trim() || null,
            emergencyContact: emergencyContact.trim() || null,
          },
          { merge: true }
        );
      }
      setSettingsSuccess(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `patientProfiles/${uid}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDownloadData = () => {
    const data = {
      user: userDoc || DEMO_PATIENT_DATA.profile,
      people,
      requests,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `femur-patient-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'people', label: 'My people' },
    { id: 'facilities', label: 'Saved facilities' },
    { id: 'assistance', label: 'Assistance' },
    { id: 'settings', label: 'Settings' },
  ];

  const activeEmergency = requests.find((r) => r.status === 'in_progress' || r.status === 'matched');

  return (
    <DashboardLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateHome={onNavigateHome}
    >
      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top Greeting + Quick Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#CFDACF]">
            <div>
              <h2 className="font-editorial-serif text-[28px] sm:text-[34px] text-[#0F3F24] font-normal leading-tight">
                Hello, {userDoc?.displayName?.split(' ')[0] || DEMO_PATIENT_DATA.profile.displayName.split(' ')[0]}
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Your emergency care and transport coordination overview.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setRequestModalOpen(true)}
              leftIcon={<IconPlus size={16} />}
            >
              New request
            </Button>
          </div>

          {/* Quick Active Emergency / Transfer Status Notice */}
          {activeEmergency && (
            <div className="p-5 bg-[#EEF3EC] border border-[#0F3F24]/30 rounded-[12px] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#247447] animate-pulse" />
                  <span className="font-interface-sans text-[13px] font-semibold text-[#0F3F24] uppercase tracking-wider">
                    Active Transport In Progress
                  </span>
                </div>
                <StatusBadge label="Ambulance En Route" tone="success" />
              </div>
              <div className="space-y-1">
                <h4 className="font-editorial-serif text-[20px] text-[#0F3F24] font-normal">
                  {activeEmergency.needSummary}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px] text-[#4F6B58] pt-1">
                  <div className="flex items-center gap-1.5">
                    <IconAmbulance size={16} className="text-[#0F3F24] shrink-0" />
                    <span>Unit: {activeEmergency.ambulanceProviderName || 'Swift Response Ambulance'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IconClock size={16} className="text-[#0F3F24] shrink-0" />
                    <span>Estimated Arrival: ~{activeEmergency.etaMinutes || 8} mins</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Active Requests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                Active requests
              </h3>
              <span className="text-[13px] text-[#4F6B58] font-medium">
                {requests.length} total recorded
              </span>
            </div>

            {loadingRequests ? (
              <div className="p-8 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] text-center text-[14px] text-[#4F6B58]">
                Loading requests...
              </div>
            ) : requests.length === 0 ? (
              <div className="p-8 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] text-center space-y-3">
                <p className="text-[15px] font-medium text-[#0F3F24]">
                  No active requests. When you ask for help, it will appear here.
                </p>
                <Button variant="secondary" size="sm" onClick={() => setRequestModalOpen(true)}>
                  Create first request
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-3 hover:border-[#0F3F24]/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#0F3F24] text-[16px] capitalize">
                          {req.type === 'care'
                            ? 'Hospital Care Request'
                            : req.type === 'transport'
                            ? 'Ambulance Transport'
                            : 'Assistance Verification'}
                        </span>
                        <StatusBadge
                          label={
                            req.status === 'in_progress'
                              ? 'Ambulance dispatched'
                              : req.status === 'matched'
                              ? 'Searching provider'
                              : req.status === 'completed'
                              ? 'Arrived at hospital'
                              : 'Pending acceptance'
                          }
                          tone={
                            req.status === 'in_progress'
                              ? 'success'
                              : req.status === 'completed'
                              ? 'neutral'
                              : 'warning'
                          }
                        />
                      </div>
                      <span className="text-[13px] text-[#4F6B58]">
                        Location: {req.locationText}
                      </span>
                    </div>

                    <p className="text-[14px] text-[#4F6B58] leading-relaxed">{req.needSummary}</p>

                    {req.ambulanceProviderName && (
                      <div className="pt-2 border-t border-[#CFDACF]/60 flex items-center justify-between text-[13px] text-[#0F3F24]">
                        <span>Assigned Provider: {req.ambulanceProviderName}</span>
                        <span>Destination: {req.hospitalName || 'Verified Facility'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Saved Facilities Preview */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                Saved facilities
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('facilities')}
                className="text-[14px] text-[#0F3F24] hover:underline font-medium"
              >
                View all ({DEMO_PATIENT_DATA.savedFacilities.length}) →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEMO_PATIENT_DATA.savedFacilities.map((fac) => (
                <FacilityCard
                  key={fac.id}
                  facility={fac}
                  onCall={() => window.open(`tel:${fac.emergencyContact}`)}
                  onSelect={() => {
                    setReqSummary(`Transport to ${fac.name}`);
                    setReqType('transport');
                    setRequestModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Section: Assistance Preview */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                Assistance
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('assistance')}
                className="text-[14px] text-[#0F3F24] hover:underline font-medium"
              >
                View status →
              </button>
            </div>
            <div className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-[#4F6B58] uppercase tracking-wide">
                      {DEMO_PATIENT_DATA.assistance.caseRef}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF3EC] text-[#247447] border border-[#247447]/30 text-[12px] font-medium">
                      <IconShieldCheck size={13} strokeWidth={2} />
                      <span>Verified by LUTH</span>
                    </span>
                  </div>
                  <h4 className="font-editorial-serif text-[20px] text-[#0F3F24]">
                    {DEMO_PATIENT_DATA.assistance.medicalProcedure}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[20px] font-editorial-serif font-light text-[#0F3F24]">
                    ₦{DEMO_PATIENT_DATA.assistance.fundsRaisedNgn.toLocaleString()}
                  </span>
                  <p className="text-[12px] text-[#4F6B58]">
                    of <span className="font-editorial-serif font-medium">₦</span>{DEMO_PATIENT_DATA.assistance.verifiedBillAmountNgn.toLocaleString()} target
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-[#EEF3EC] rounded-full overflow-hidden border border-[#CFDACF]/40">
                <div
                  className="h-full bg-[#0F3F24] rounded-full"
                  style={{
                    width: `${Math.round(
                      (DEMO_PATIENT_DATA.assistance.fundsRaisedNgn /
                        DEMO_PATIENT_DATA.assistance.verifiedBillAmountNgn) *
                        100
                    )}%`,
                  }}
                />
              </div>

              <div className="pt-2 border-t border-[#CFDACF]/60 flex items-center justify-between text-[13px] text-[#4F6B58]">
                <span>{DEMO_PATIENT_DATA.assistance.lastAuditTime}</span>
                <span className="text-[#0F3F24] font-medium">Disbursement Direct to Hospital</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MY PEOPLE / DEPENDENTS */}
      {activeTab === 'people' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#CFDACF]">
            <div>
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Saved people / dependents
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Family members and dependents saved for rapid triage and emergency identification.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingPerson(null);
                setPName('');
                setPBlood('');
                setPAllergies('');
                setPNotes('');
                setPersonModalOpen(true);
              }}
              leftIcon={<IconPlus size={16} />}
            >
              Add person
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {people.map((p) => (
              <div
                key={p.id}
                className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-editorial-heading-3 text-[20px] text-[#0F3F24] leading-snug">
                      {p.name}
                    </h4>
                    <span className="text-[13px] text-[#4F6B58] font-medium">
                      {p.relationship}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPerson(p);
                        setPName(p.name);
                        setPRel(p.relationship);
                        setPBlood(p.bloodGroup || '');
                        setPAllergies(p.allergies || '');
                        setPNotes(p.notes || '');
                        setPersonModalOpen(true);
                      }}
                      className="text-[13px] text-[#0F3F24] hover:underline px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePerson(p.id)}
                      className="text-[13px] text-[#B42318] hover:underline px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="text-[13px] space-y-1 pt-2 border-t border-[#CFDACF]/60 text-[#4F6B58]">
                  {p.bloodGroup && (
                    <p>
                      <span className="font-medium text-[#0F3F24]">Blood Group:</span> {p.bloodGroup}
                    </p>
                  )}
                  {p.allergies && (
                    <p>
                      <span className="font-medium text-[#0F3F24]">Allergies:</span> {p.allergies}
                    </p>
                  )}
                  {p.notes && (
                    <p>
                      <span className="font-medium text-[#0F3F24]">Notes:</span> {p.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SAVED FACILITIES */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          <div className="pb-4 border-b border-[#CFDACF]">
            <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
              Saved facilities
            </h2>
            <p className="text-[14px] text-[#4F6B58] mt-1">
              Confirmed emergency facilities with verified capabilities and live availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEMO_PATIENT_DATA.savedFacilities.map((fac) => (
              <FacilityCard
                key={fac.id}
                facility={fac}
                onCall={() => window.open(`tel:${fac.emergencyContact}`)}
                onSelect={() => {
                  setReqSummary(`Transport to ${fac.name}`);
                  setReqType('transport');
                  setRequestModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. ASSISTANCE */}
      {activeTab === 'assistance' && (
        <div className="space-y-6">
          <div className="pb-4 border-b border-[#CFDACF]">
            <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
              Assistance & Hospital Verification
            </h2>
            <p className="text-[14px] text-[#4F6B58] mt-1">
              Active fundraising, NGO grants, and hospital-verified medical support.
            </p>
          </div>

          <div className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#0F3F24]">
                    {DEMO_PATIENT_DATA.assistance.caseRef}
                  </span>
                  <AvailabilityBadge
                    state="confirmed"
                    lastConfirmedTime="Verified by LUTH Medical Director"
                  />
                </div>
                <h3 className="font-editorial-serif text-[24px] text-[#0F3F24]">
                  {DEMO_PATIENT_DATA.assistance.medicalProcedure}
                </h3>
                <p className="text-[14px] text-[#4F6B58]">
                  Verified facility: {DEMO_PATIENT_DATA.assistance.verifiedHospitalName}
                </p>
              </div>

              <div className="text-right">
                <div className="text-[28px] font-editorial-serif font-light text-[#0F3F24] leading-tight">
                  ₦{DEMO_PATIENT_DATA.assistance.fundsRaisedNgn.toLocaleString()}
                </div>
                <div className="text-[13px] text-[#4F6B58]">
                  of <span className="font-editorial-serif font-medium">₦</span>{DEMO_PATIENT_DATA.assistance.verifiedBillAmountNgn.toLocaleString()} total verified
                </div>
              </div>
            </div>

            <div className="w-full h-3 bg-[#EEF3EC] rounded-full overflow-hidden border border-[#CFDACF]/40">
              <div
                className="h-full bg-[#0F3F24] rounded-full"
                style={{
                  width: `${Math.round(
                    (DEMO_PATIENT_DATA.assistance.fundsRaisedNgn /
                      DEMO_PATIENT_DATA.assistance.verifiedBillAmountNgn) *
                      100
                  )}%`,
                }}
              />
            </div>

            <div className="p-4 bg-[#EEF3EC]/50 rounded-[8px] border border-[#CFDACF]/60 text-[14px] text-[#4F6B58] leading-relaxed">
              Hospital verification guarantees that all raised funds disburse directly to LUTH for surgical theater fees, post-operative intensive care, and medical oxygen.
            </div>
          </div>
        </div>
      )}

      {/* 5. SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-xl">
          <div className="pb-4 border-b border-[#CFDACF]">
            <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
              Settings
            </h2>
            <p className="text-[14px] text-[#4F6B58] mt-1">
              Personal contact details and privacy preferences.
            </p>
          </div>

          {settingsSuccess && (
            <Alert severity="success">Profile settings updated successfully.</Alert>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-[14px] font-medium text-[#0F3F24] mb-1">
                Full name
              </label>
              <input
                type="text"
                disabled
                value={userDoc?.displayName || DEMO_PATIENT_DATA.profile.displayName}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#EEF3EC]/50 text-[#4F6B58] text-[14px]"
              />
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#0F3F24] mb-1">
                Email address
              </label>
              <input
                type="email"
                disabled
                value={userDoc?.email || DEMO_PATIENT_DATA.profile.email}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#EEF3EC]/50 text-[#4F6B58] text-[14px]"
              />
            </div>

            <div>
              <label htmlFor="settings-phone" className="block text-[14px] font-medium text-[#0F3F24] mb-1">
                Phone number (optional)
              </label>
              <input
                id="settings-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] text-[14px]"
              />
            </div>

            <div>
              <label htmlFor="settings-emergency-contact" className="block text-[14px] font-medium text-[#0F3F24] mb-1">
                Emergency contact (optional)
              </label>
              <input
                id="settings-emergency-contact"
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Dr. Tayo / +234 801 111 2222"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] text-[14px]"
              />
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={savingSettings}>
              Save changes
            </Button>
          </form>

          {/* Data Export & Account Deletion */}
          <div className="pt-6 border-t border-[#CFDACF] space-y-4">
            <h3 className="font-editorial-heading-3 text-[20px] text-[#0F3F24]">Data & Account</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDownloadData}
              >
                Download my data
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setDeleteConfirmOpen(true)}
                className="text-[#B42318] border-[#B42318]/50 hover:bg-[#FEF3F2]"
              >
                Delete my account and data
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Dependent Person */}
      {personModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2E19]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#CFDACF]">
              <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                {editingPerson ? 'Edit person' : 'Add person'}
              </h3>
              <button
                type="button"
                onClick={() => setPersonModalOpen(false)}
                className="text-[#4F6B58] hover:text-[#0F3F24]"
                aria-label="Close"
              >
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePerson} className="space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#0F3F24] mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="e.g. Samuel Ade"
                  className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0F3F24] mb-1">
                  Relationship
                </label>
                <select
                  value={pRel}
                  onChange={(e) => setPRel(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] text-[14px]"
                >
                  <option value="Parent">Parent</option>
                  <option value="Child / Dependent">Child / Dependent</option>
                  <option value="Spouse / Partner">Spouse / Partner</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0F3F24] mb-1">
                  Blood group (optional)
                </label>
                <input
                  type="text"
                  value={pBlood}
                  onChange={(e) => setPBlood(e.target.value)}
                  placeholder="e.g. O+, A-, B+"
                  className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0F3F24] mb-1">
                  Known allergies (optional)
                </label>
                <input
                  type="text"
                  value={pAllergies}
                  onChange={(e) => setPAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Latex"
                  className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0F3F24] mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={pNotes}
                  onChange={(e) => setPNotes(e.target.value)}
                  placeholder="e.g. Diabetic, pacemaker"
                  className="w-full px-3 py-2 rounded-[8px] border border-[#CFDACF] text-[14px]"
                />
              </div>

              <p className="text-[13px] text-[#4F6B58] pt-1">
                Only add what you&apos;re comfortable sharing. You can delete this anytime.
              </p>

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setPersonModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingPerson ? 'Update' : 'Save person'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Start New Request */}
      {requestModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2E19]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#CFDACF]">
              <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                Start a new request
              </h3>
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="text-[#4F6B58] hover:text-[#0F3F24]"
                aria-label="Close"
              >
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#0F3F24] mb-1">
                  Request type
                </label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value as any)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] text-[14px]"
                >
                  <option value="care">Emergency Facility Care</option>
                  <option value="transport">Ambulance Transport</option>
                  <option value="assistance">Financial Verification Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0F3F24] mb-1">
                  Need summary
                </label>
                <textarea
                  required
                  rows={3}
                  value={reqSummary}
                  onChange={(e) => setReqSummary(e.target.value)}
                  placeholder="Describe the medical situation in plain language..."
                  className="w-full px-3 py-2 rounded-[8px] border border-[#CFDACF] text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0F3F24] mb-1">
                  Current location / Area
                </label>
                <input
                  type="text"
                  required
                  value={reqLocation}
                  onChange={(e) => setReqLocation(e.target.value)}
                  placeholder="e.g. Ikeja, Lagos"
                  className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] text-[14px]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setRequestModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={submittingReq}>
                  Submit request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: Delete Account */}
      {deleteConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2E19]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-6 max-w-md w-full space-y-4">
            <h3 className="font-editorial-serif text-[22px] text-[#B42318] font-normal">
              Delete account and data?
            </h3>
            <p className="text-[14px] text-[#4F6B58] leading-relaxed">
              This action is permanent. All your saved people, medical profiles, and requests will be deleted from FEMUR immediately.
            </p>
            <div className="pt-3 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="bg-[#B42318] border-[#B42318]"
                onClick={async () => {
                  setDeleteConfirmOpen(false);
                  await deleteAccountAndData();
                  onNavigateHome();
                }}
              >
                Yes, delete my data
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
