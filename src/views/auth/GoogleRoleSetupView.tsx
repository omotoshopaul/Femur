import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { Button } from '../../components/Button';
import { FemurLogo } from '../../components/FemurLogo';
import { Alert } from '../../components/Alert';

export const GoogleRoleSetupView: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { completeGoogleRoleSetup } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [orgName, setOrgName] = useState('');
  const [state, setState] = useState('Lagos');
  const [lga, setLga] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isOrgRole = selectedRole !== 'patient';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consentGiven) {
      setError('You must agree to the Terms and Privacy Policy to continue.');
      return;
    }

    if (isOrgRole && (!orgName.trim() || !lga.trim())) {
      setError('Please provide your organization name and LGA.');
      return;
    }

    setLoading(true);
    try {
      await completeGoogleRoleSetup(
        selectedRole,
        isOrgRole ? { name: orgName, state, lga } : undefined
      );
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Unable to save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <FemurLogo />
        <h2 className="font-editorial-serif text-[32px] font-light text-[#0F3F24] tracking-tight">
          Complete your profile
        </h2>
        <p className="font-interface-sans text-[15px] text-[#4F6B58]">
          Select how you will be using FEMUR to configure your workspace.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 border border-[#CFDACF] rounded-[12px] space-y-6">
          {error && <Alert severity="danger">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-interface-sans text-[14px] font-medium text-[#0F3F24] mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'patient', label: 'Patient or caregiver' },
                  { id: 'hospital', label: 'Hospital or clinic' },
                  { id: 'ambulance_provider', label: 'Ambulance provider' },
                  { id: 'sponsor', label: 'NGO or sponsor' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedRole(opt.id as UserRole)}
                    className={`min-h-[44px] px-3.5 py-2.5 text-left rounded-[8px] border text-[14px] font-interface-sans font-medium transition-colors ${
                      selectedRole === opt.id
                        ? 'border-[#0F3F24] bg-[#EEF3EC] text-[#0F3F24] font-semibold'
                        : 'border-[#CFDACF] bg-[#FFFFFF] text-[#4F6B58] hover:border-[#0F3F24]/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {isOrgRole && (
              <div className="p-4 bg-[#EEF3EC]/50 rounded-[8px] border border-[#CFDACF] space-y-3 mt-2">
                <div>
                  <label
                    htmlFor="google-org-name"
                    className="block font-interface-sans text-[13px] font-medium text-[#0F3F24] mb-1"
                  >
                    Organization name
                  </label>
                  <input
                    id="google-org-name"
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Apex Health Clinic"
                    className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] font-interface-sans text-[14px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="google-state"
                      className="block font-interface-sans text-[13px] font-medium text-[#0F3F24] mb-1"
                    >
                      State
                    </label>
                    <select
                      id="google-state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] font-interface-sans text-[14px]"
                    >
                      {[
                        'Lagos',
                        'Abuja (FCT)',
                        'Rivers',
                        'Kano',
                        'Oyo',
                        'Delta',
                        'Kaduna',
                        'Enugu',
                        'Ogun',
                        'Edo',
                      ].map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="google-lga"
                      className="block font-interface-sans text-[13px] font-medium text-[#0F3F24] mb-1"
                    >
                      LGA
                    </label>
                    <input
                      id="google-lga"
                      type="text"
                      required
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      placeholder="e.g. Ikeja"
                      className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] font-interface-sans text-[14px]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-[#CFDACF] text-[#0F3F24] focus:ring-[#0F3F24]"
                />
                <span className="font-interface-sans text-[14px] text-[#4F6B58] leading-snug">
                  I agree to the Terms and Privacy Policy
                </span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isFullWidth
                isLoading={loading}
                disabled={!consentGiven}
              >
                Continue to Dashboard
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
