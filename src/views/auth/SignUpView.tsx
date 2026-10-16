import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { Button } from '../../components/Button';
import { FemurLogo } from '../../components/FemurLogo';
import { Alert } from '../../components/Alert';

export const SignUpView: React.FC<{
  onSuccess: () => void;
  onNavigateToSignIn: () => void;
  onNavigateToHome: () => void;
}> = ({ onSuccess, onNavigateToSignIn, onNavigateToHome }) => {
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [orgName, setOrgName] = useState('');
  const [state, setState] = useState('Lagos');
  const [lga, setLga] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isOrgRole = selectedRole !== 'patient';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consentGiven) {
      setError('You must agree to the Terms and Privacy Policy to create an account.');
      return;
    }

    if (isOrgRole && (!orgName.trim() || !lga.trim())) {
      setError('Please provide your organization name, state, and local government area (LGA).');
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(
        email,
        password,
        fullName,
        selectedRole,
        consentGiven,
        isOrgRole ? { name: orgName, state, lga } : undefined
      );
      onSuccess();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account already exists with this email address. Please sign in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Unable to complete sign up. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-up could not be completed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <button
          type="button"
          onClick={onNavigateToHome}
          className="inline-block focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
        >
          <FemurLogo />
        </button>
        <h2 className="font-editorial-serif text-[32px] sm:text-[36px] font-light text-[#0F3F24] tracking-tight">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 border border-[#CFDACF] rounded-[12px] space-y-6">
          {error && <Alert severity="danger">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="signup-name"
                className="block font-interface-sans text-[14px] font-medium text-[#0F3F24] mb-1.5"
              >
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Ngozi Eze / Chukwuma Okonkwo"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] font-interface-sans text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block font-interface-sans text-[14px] font-medium text-[#0F3F24] mb-1.5"
              >
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.ng"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] font-interface-sans text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block font-interface-sans text-[14px] font-medium text-[#0F3F24] mb-1.5"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] font-interface-sans text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
              />
            </div>

            {/* "I am a:" 4 options */}
            <div className="pt-2">
              <label className="block font-interface-sans text-[14px] font-medium text-[#0F3F24] mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'patient',
                    label: 'Patient or caregiver',
                    description: 'Immediate access. Find care, arrange transport, and manage family profiles.',
                  },
                  {
                    id: 'hospital',
                    label: 'Hospital or clinic',
                    description: 'Requires verification. Update intake status, confirm live resources, and verify bill estimates.',
                  },
                  {
                    id: 'ambulance_provider',
                    label: 'Ambulance provider',
                    description: 'Requires verification. Receive and accept dispatch requests, and track fleet ambulances.',
                  },
                  {
                    id: 'sponsor',
                    label: 'NGO or sponsor',
                    description: 'Requires verification. Review hospital-verified cases, pledge grants, and track recovery.',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedRole(opt.id as UserRole)}
                    className={`min-h-[64px] p-3 text-left rounded-[8px] border transition-colors flex flex-col justify-between ${
                      selectedRole === opt.id
                        ? 'border-[#0F3F24] bg-[#EEF3EC] text-[#0F3F24]'
                        : 'border-[#CFDACF] bg-[#FFFFFF] text-[#4F6B58] hover:border-[#0F3F24]/50'
                    }`}
                  >
                    <span className="text-[14px] font-semibold text-[#0F3F24]">{opt.label}</span>
                    <span className="text-[12px] text-[#4F6B58] leading-tight mt-1">
                      {opt.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Organization Specific Fields */}
            {isOrgRole && (
              <div className="p-4 bg-[#EEF3EC]/50 rounded-[8px] border border-[#CFDACF] space-y-3.5 mt-2">
                <div className="text-[13px] font-interface-sans font-semibold text-[#0F3F24]">
                  Organization Information (Subject to Admin Verification)
                </div>

                <div>
                  <label
                    htmlFor="signup-org-name"
                    className="block font-interface-sans text-[13px] font-medium text-[#0F3F24] mb-1"
                  >
                    Organization name
                  </label>
                  <input
                    id="signup-org-name"
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Apex Health Clinic / Swift Transport Ltd"
                    className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] font-interface-sans text-[14px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="signup-state"
                      className="block font-interface-sans text-[13px] font-medium text-[#0F3F24] mb-1"
                    >
                      State
                    </label>
                    <select
                      id="signup-state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] font-interface-sans text-[14px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
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
                      htmlFor="signup-lga"
                      className="block font-interface-sans text-[13px] font-medium text-[#0F3F24] mb-1"
                    >
                      LGA
                    </label>
                    <input
                      id="signup-lga"
                      type="text"
                      required
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      placeholder="e.g. Ikeja / Garki"
                      className="w-full min-h-[44px] px-3 py-2 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] font-interface-sans text-[14px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Unchecked Consent Checkbox */}
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
                loadingText="Creating account..."
                disabled={!consentGiven}
              >
                Create account
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#CFDACF]" />
            </div>
            <div className="relative flex justify-center text-[13px] font-interface-sans">
              <span className="bg-[#FFFFFF] px-3 text-[#4F6B58]">Or sign up with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="md"
            isFullWidth
            isLoading={googleLoading}
            onClick={handleGoogleSignUp}
            leftIcon={
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            }
          >
            Google Sign-Up
          </Button>

          <div className="text-center pt-2 border-t border-[#CFDACF]/60">
            <span className="font-interface-sans text-[14px] text-[#4F6B58]">
              Already have an account?{' '}
            </span>
            <button
              type="button"
              onClick={onNavigateToSignIn}
              className="font-interface-sans text-[14px] font-medium text-[#0F3F24] hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
