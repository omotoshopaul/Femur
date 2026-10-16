import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { IconX, IconShieldCheck, IconClock, IconAlertTriangle } from '../../components/LineIcons';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { OrganizationDoc, UserDoc, AuditLogItem } from '../../types/auth';
import { DEMO_ADMIN_DATA } from '../../content/sampleRoleData';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboardView: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { currentUser, demoRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Organizations queue
  const [organizations, setOrganizations] = useState<OrganizationDoc[]>(DEMO_ADMIN_DATA.pendingVerifications);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  // Users list
  const [usersList, setUsersList] = useState<{ id: string; data: UserDoc }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Platform pulse
  const [pulse, setPulse] = useState(DEMO_ADMIN_DATA.pulseStats);

  // Audit log
  const [auditLog, setAuditLog] = useState<AuditLogItem[]>(DEMO_ADMIN_DATA.auditLog);

  // Dialog state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDoc | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request_info'>('approve');
  const [rejectionReason, setRejectionReason] = useState('Verification documentation incomplete.');
  const [submittingAction, setSubmittingAction] = useState(false);

  const loadOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const snap = await getDocs(collection(db, 'organizations'));
      const list: OrganizationDoc[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as any) });
      });
      if (list.length > 0) {
        setOrganizations(list);
      }
    } catch (err) {
      console.error('Error fetching orgs', err);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: { id: string; data: UserDoc }[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, data: d.data() as UserDoc });
      });
      setUsersList(list);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (currentUser && !demoRole) {
      loadOrganizations();
      loadUsers();
    }
  }, [currentUser, demoRole]);

  const handleConfirmAction = async () => {
    if (!selectedOrg) return;
    setSubmittingAction(true);

    try {
      const newStatus =
        actionType === 'approve'
          ? 'approved'
          : actionType === 'reject'
          ? 'rejected'
          : 'pending';

      if (selectedOrg.id && !selectedOrg.id.startsWith('org-pend-')) {
        const orgRef = doc(db, 'organizations', selectedOrg.id);
        const userRef = doc(db, 'users', selectedOrg.ownerUid);

        await updateDoc(orgRef, {
          verificationStatus: newStatus,
          ...(actionType === 'reject' ? { rejectionReason } : {}),
        });

        await updateDoc(userRef, {
          verificationStatus: newStatus,
        });
      }

      // Update local state
      setOrganizations((prev) =>
        prev.map((o) =>
          o.id === selectedOrg.id ? { ...o, verificationStatus: newStatus } : o
        )
      );

      // Add to audit log
      const newLogItem: AuditLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: 'FEMUR Admin Operations',
        action:
          actionType === 'approve'
            ? `Approved verification credentials for ${selectedOrg.name}`
            : actionType === 'reject'
            ? `Rejected verification credentials for ${selectedOrg.name}`
            : `Requested additional clinical documents from ${selectedOrg.name}`,
        target: selectedOrg.name,
        severity: actionType === 'approve' ? 'info' : 'warning',
      };
      setAuditLog((prev) => [newLogItem, ...prev]);

      setConfirmModalOpen(false);
      setSelectedOrg(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `organizations/${selectedOrg.id}`);
    } finally {
      setSubmittingAction(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Platform overview' },
    { id: 'verification', label: 'Pending verifications' },
    { id: 'audit', label: 'Audit log' },
    { id: 'users', label: 'Registered users' },
  ];

  return (
    <DashboardLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onNavigateHome={onNavigateHome}
    >
      <div className="space-y-8">
        {/* Top Header */}
        <div className="pb-6 border-b border-[#CFDACF]">
          <div className="flex items-center gap-2.5">
            <h2 className="font-editorial-serif text-[28px] sm:text-[34px] text-[#0F3F24] font-normal leading-tight">
              FEMUR Operations Center
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0F3F24] text-[#FFFFFF] text-[12px] font-medium">
              Administrator
            </span>
          </div>
          <p className="text-[14px] text-[#4F6B58] mt-1">
            Platform governance, provider verification, and real-time infrastructure pulse.
          </p>
        </div>

        {/* 1. OVERVIEW (Platform pulse + Pending verifications preview + Audit log) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Section: Platform Pulse */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                    Platform pulse
                  </h3>
                  <p className="text-[13px] text-[#4F6B58]">
                    Real-time counts of active network capacity across Nigeria.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-1">
                  <div className="font-editorial-serif text-[40px] sm:text-[46px] font-light text-[#0F3F24] leading-none">
                    {pulse.activeRequests}
                  </div>
                  <p className="font-interface-sans text-[14px] text-[#4F6B58]">
                    Active emergency requests
                  </p>
                </div>

                <div className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-1">
                  <div className="font-editorial-serif text-[40px] sm:text-[46px] font-light text-[#0F3F24] leading-none">
                    {pulse.availableAmbulances}
                  </div>
                  <p className="font-interface-sans text-[14px] text-[#4F6B58]">
                    Available ambulances on call
                  </p>
                </div>

                <div className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-1">
                  <div className="font-editorial-serif text-[40px] sm:text-[46px] font-light text-[#0F3F24] leading-none">
                    {pulse.openHospitals}
                  </div>
                  <p className="font-interface-sans text-[14px] text-[#4F6B58]">
                    Open acute care hospitals
                  </p>
                </div>

                <div className="p-5 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-1">
                  <div className="font-editorial-serif text-[40px] sm:text-[46px] font-light text-[#0F3F24] leading-none">
                    ₦{(pulse.fundsDeployedNgn / 1000000).toFixed(1)}M
                  </div>
                  <p className="font-interface-sans text-[14px] text-[#4F6B58]">
                    Verified funds deployed
                  </p>
                </div>
              </div>
            </div>

            {/* Section: Pending Verifications Preview */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                    Pending verifications
                  </h3>
                  <p className="text-[13px] text-[#4F6B58]">
                    Provider and partner onboarding review queue.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('verification')}
                  className="text-[14px] text-[#0F3F24] hover:underline font-medium"
                >
                  View queue ({organizations.filter((o) => o.verificationStatus === 'pending').length}) →
                </button>
              </div>

              <div className="border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] divide-y divide-[#CFDACF]/60">
                {organizations.slice(0, 3).map((org) => (
                  <div
                    key={org.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h4 className="font-medium text-[#0F3F24] text-[16px]">{org.name}</h4>
                        <span className="text-[12px] capitalize text-[#4F6B58] bg-[#EEF3EC] px-2 py-0.5 rounded">
                          {org.type.replace('_', ' ')}
                        </span>
                        <StatusBadge
                          label={org.verificationStatus}
                          tone={
                            org.verificationStatus === 'approved'
                              ? 'success'
                              : org.verificationStatus === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }
                        />
                      </div>
                      <p className="text-[13px] text-[#4F6B58]">
                        Location: {org.lga}, {org.state}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {org.verificationStatus === 'pending' ? (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedOrg(org);
                              setActionType('request_info');
                              setConfirmModalOpen(true);
                            }}
                          >
                            Request info
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedOrg(org);
                              setActionType('approve');
                              setConfirmModalOpen(true);
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedOrg(org);
                              setActionType('reject');
                              setConfirmModalOpen(true);
                            }}
                            className="text-[#B42318] border-[#B42318]"
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-[13px] text-[#4F6B58] font-medium">Processed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Audit Log Preview */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                    Audit log
                  </h3>
                  <p className="text-[13px] text-[#4F6B58]">
                    Recent verification actions and critical status changes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('audit')}
                  className="text-[14px] text-[#0F3F24] hover:underline font-medium"
                >
                  View full audit ({auditLog.length}) →
                </button>
              </div>

              <div className="border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] divide-y divide-[#CFDACF]/60">
                {auditLog.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-[13px]">
                    <div className="space-y-0.5">
                      <p className="font-medium text-[#0F3F24]">{log.action}</p>
                      <p className="text-[#4F6B58]">
                        Actor: {log.actor} · Target: {log.target}
                      </p>
                    </div>
                    <span className="text-[#4F6B58] whitespace-nowrap">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. PENDING VERIFICATIONS FULL VIEW */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Pending verifications
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                List of hospital, ambulance, and sponsor registrations with review actions: Approve, Request info, Reject.
              </p>
            </div>

            <div className="space-y-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="p-6 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-editorial-serif text-[22px] text-[#0F3F24]">
                          {org.name}
                        </h3>
                        <StatusBadge
                          label={org.verificationStatus}
                          tone={
                            org.verificationStatus === 'approved'
                              ? 'success'
                              : org.verificationStatus === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }
                        />
                      </div>
                      <p className="text-[14px] text-[#4F6B58] mt-0.5">
                        Type: <span className="capitalize">{org.type.replace('_', ' ')}</span> · Location: {org.lga}, {org.state}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {org.verificationStatus === 'pending' ? (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedOrg(org);
                              setActionType('request_info');
                              setConfirmModalOpen(true);
                            }}
                          >
                            Request info
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedOrg(org);
                              setActionType('approve');
                              setConfirmModalOpen(true);
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedOrg(org);
                              setActionType('reject');
                              setConfirmModalOpen(true);
                            }}
                            className="text-[#B42318] border-[#B42318]"
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-[13px] text-[#4F6B58]">Verification processed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. AUDIT LOG TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Audit log
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Tamper-evident record of critical capability confirmations and compliance reviews.
              </p>
            </div>

            <div className="border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] divide-y divide-[#CFDACF]/60">
              {auditLog.map((log) => (
                <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-[14px]">
                  <div className="space-y-1">
                    <p className="font-medium text-[#0F3F24]">{log.action}</p>
                    <p className="text-[13px] text-[#4F6B58]">
                      Authorized by: <strong className="text-[#0F3F24]">{log.actor}</strong> · Subject: {log.target}
                    </p>
                  </div>
                  <span className="text-[12px] text-[#4F6B58] whitespace-nowrap">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. REGISTERED USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#CFDACF]">
              <h2 className="font-editorial-serif text-[28px] sm:text-[32px] text-[#0F3F24] font-normal leading-tight">
                Registered accounts
              </h2>
              <p className="text-[14px] text-[#4F6B58] mt-1">
                Read-only directory of authenticated users and authorization levels.
              </p>
            </div>

            {loadingUsers ? (
              <div className="p-8 border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] text-center text-[14px] text-[#4F6B58]">
                Loading users...
              </div>
            ) : (
              <div className="border border-[#CFDACF] rounded-[12px] bg-[#FFFFFF] overflow-x-auto">
                <table className="w-full text-left border-collapse text-[14px]">
                  <thead>
                    <tr className="border-b border-[#CFDACF] bg-[#EEF3EC]/60 text-[#4F6B58] text-[13px] font-semibold">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CFDACF]/60">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 px-4 text-center text-[#4F6B58]">
                          No live users registered in database yet.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-[#EEF3EC]/30">
                          <td className="py-3 px-4 font-medium text-[#0F3F24]">{u.data.displayName}</td>
                          <td className="py-3 px-4 text-[#4F6B58]">{u.data.email}</td>
                          <td className="py-3 px-4 capitalize text-[#0F3F24]">
                            {u.data.role.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge
                              label={u.data.verificationStatus}
                              tone={
                                u.data.verificationStatus === 'approved'
                                  ? 'success'
                                  : u.data.verificationStatus === 'rejected'
                                  ? 'danger'
                                  : 'neutral'
                              }
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONFIRMATION / ACTION MODAL */}
      {confirmModalOpen && selectedOrg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2E19]/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[12px] p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#CFDACF]">
              <h3 className="font-editorial-serif text-[22px] text-[#0F3F24] font-normal">
                {actionType === 'approve'
                  ? 'Approve Organization'
                  : actionType === 'reject'
                  ? 'Reject Organization'
                  : 'Request Documentation'}
              </h3>
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="text-[#4F6B58] hover:text-[#0F3F24]"
                aria-label="Close"
              >
                <IconX size={20} />
              </button>
            </div>

            <p className="text-[14px] text-[#4F6B58] leading-relaxed">
              {actionType === 'approve'
                ? `Grant operational verification to ${selectedOrg.name}. This activates their live dispatch and resource capabilities on FEMUR.`
                : actionType === 'reject'
                ? `Reject registration for ${selectedOrg.name}. Provide a reason to guide their appeal.`
                : `Send a formal notice to ${selectedOrg.name} requesting additional clinical licenses and equipment certificates.`}
            </p>

            {actionType === 'reject' && (
              <div>
                <label className="block text-[13px] font-medium text-[#0F3F24] mb-1">
                  Rejection Reason
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#CFDACF] text-[14px]"
                />
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={submittingAction}
                className={actionType === 'reject' ? 'bg-[#B42318] border-[#B42318]' : ''}
                onClick={handleConfirmAction}
              >
                {actionType === 'approve'
                  ? 'Confirm Approval'
                  : actionType === 'reject'
                  ? 'Confirm Rejection'
                  : 'Send Request'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
