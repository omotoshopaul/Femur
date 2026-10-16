import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { IconCheck, IconX } from './LineIcons';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface PilotModalProps {
  isOpen: boolean;
  targetRole?: string;
  onClose: () => void;
}

export const PilotModal: React.FC<PilotModalProps> = ({
  isOpen,
  targetRole,
  onClose,
}) => {
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<string>(
    targetRole?.includes('Ambulance')
      ? 'Ambulance provider'
      : targetRole?.includes('Hospital')
      ? 'Hospital or clinic'
      : targetRole?.includes('Partner') || targetRole?.includes('Sponsor')
      ? 'NGO or sponsor'
      : 'Hospital or clinic'
  );
  const [state, setState] = useState('Lagos');
  const [lga, setLga] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [usageDescription, setUsageDescription] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Focus restoration & escape key handler
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    }
  }, [isOpen, onClose]);

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [isOpen, submitSuccess]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await addDoc(collection(db, 'pilotRequests'), {
        orgName: orgName.trim(),
        orgType,
        state: state.trim(),
        lga: lga.trim(),
        contactPerson: contactPerson.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        usageDescription: usageDescription.trim() || null,
        agreedToTerms: true,
        status: 'new',
        createdAt: serverTimestamp(),
      });

      setSubmitSuccess(true);
    } catch (err) {
      console.error('Pilot request submission error:', err);
      setErrorMessage(
        "Something went wrong and your request wasn't sent. Your answers are saved. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2E19]/45 backdrop-blur-[2px] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pilot-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-[#FFFFFF] border border-[#CFDACF] rounded-[20px] p-6 sm:p-8 w-[calc(100%-32px)] max-w-[520px] max-h-[90vh] overflow-y-auto relative shadow-xl text-[#0F3F24]"
      >
        {/* Visible close button with accessible name */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-[#4F6B58] hover:text-[#0F3F24] p-2 rounded-[8px] transition-colors focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
          aria-label="Close dialog"
        >
          <IconX size={20} strokeWidth={1.5} />
        </button>

        {submitSuccess ? (
          /* SUCCESS STATE */
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EEF3EC] text-[#247447] flex items-center justify-center mx-auto">
              <IconCheck size={28} strokeWidth={2} />
            </div>
            <div className="space-y-2">
              <h3
                id="pilot-modal-title"
                className="font-editorial-serif text-[28px] text-[#0F3F24] font-normal leading-tight"
              >
                Request received.
              </h3>
              <p className="font-interface-sans text-[15px] text-[#4F6B58] max-w-sm mx-auto leading-relaxed">
                Thank you. We'll review your request and contact you by email.
              </p>
            </div>
            <div className="pt-4">
              <Button
                variant="primary"
                size="md"
                isFullWidth
                onClick={handleResetAndClose}
                accessibleName="Close request confirmation"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <div className="space-y-6">
            <div className="space-y-1.5 pr-8">
              <h3
                id="pilot-modal-title"
                className="font-editorial-serif text-[26px] sm:text-[30px] text-[#0F3F24] font-normal leading-tight"
              >
                Request pilot access
              </h3>
              <p className="font-interface-sans text-[15px] text-[#4F6B58] leading-relaxed">
                Tell us about your organisation. We review every request before approving access.
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-[12px] bg-[#B42318]/10 border border-[#B42318]/30 text-[#B42318] text-[14px] leading-relaxed"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-interface-sans">
              {/* Organisation name */}
              <div>
                <label
                  htmlFor="org-name"
                  className="block text-[14px] font-medium text-[#0F3F24] mb-1.5"
                >
                  Organisation name <span className="text-[#B42318]">*</span>
                </label>
                <input
                  id="org-name"
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Mainland Specialist Hospital"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] placeholder:text-[#4F6B58]/50 text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                />
              </div>

              {/* Organisation type */}
              <div>
                <label
                  htmlFor="org-type"
                  className="block text-[14px] font-medium text-[#0F3F24] mb-1.5"
                >
                  Organisation type <span className="text-[#B42318]">*</span>
                </label>
                <select
                  id="org-type"
                  required
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                >
                  <option value="Hospital or clinic">Hospital or clinic</option>
                  <option value="Ambulance provider">Ambulance provider</option>
                  <option value="NGO or sponsor">NGO or sponsor</option>
                  <option value="Government agency">Government agency</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* State & LGA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="pilot-state"
                    className="block text-[14px] font-medium text-[#0F3F24] mb-1.5"
                  >
                    State <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    id="pilot-state"
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Lagos"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] placeholder:text-[#4F6B58]/50 text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pilot-lga"
                    className="block text-[14px] font-medium text-[#0F3F24] mb-1.5"
                  >
                    LGA <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    id="pilot-lga"
                    type="text"
                    required
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    placeholder="e.g. Ikeja"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] placeholder:text-[#4F6B58]/50 text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                  />
                </div>
              </div>

              {/* Contact Person & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="contact-person"
                    className="block text-[14px] font-medium text-[#0F3F24] mb-1.5"
                  >
                    Contact person <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    id="contact-person"
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Dr. / Mr. / Ms. Name"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] placeholder:text-[#4F6B58]/50 text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pilot-email"
                    className="block text-[14px] font-medium text-[#0F3F24] mb-1.5"
                  >
                    Email <span className="text-[#B42318]">*</span>
                  </label>
                  <input
                    id="pilot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@organisation.org"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] placeholder:text-[#4F6B58]/50 text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                  />
                </div>
              </div>

              {/* Phone (optional) */}
              <div>
                <label
                  htmlFor="pilot-phone"
                  className="block text-[14px] font-medium text-[#0F3F24] mb-1.5"
                >
                  Phone <span className="text-[#4F6B58] text-[13px] font-normal">(optional)</span>
                </label>
                <input
                  id="pilot-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] placeholder:text-[#4F6B58]/50 text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                />
              </div>

              {/* Usage description (optional, 500 chars limit) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="usage-desc"
                    className="block text-[14px] font-medium text-[#0F3F24]"
                  >
                    What would you like to use FEMUR for?{' '}
                    <span className="text-[#4F6B58] text-[13px] font-normal">(optional)</span>
                  </label>
                  <span className="text-[12px] text-[#4F6B58]">
                    {usageDescription.length} / 500
                  </span>
                </div>
                <textarea
                  id="usage-desc"
                  rows={3}
                  maxLength={500}
                  value={usageDescription}
                  onChange={(e) => setUsageDescription(e.target.value)}
                  placeholder="Describe your emergency care operations or integration goals..."
                  className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] placeholder:text-[#4F6B58]/50 text-[14px] resize-none focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                />
              </div>

              {/* Terms checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#CFDACF] text-[#0F3F24] focus:ring-[#0F3F24]"
                  />
                  <span className="text-[14px] text-[#4F6B58] leading-snug">
                    I agree to the Terms and Privacy Policy.
                  </span>
                </label>
              </div>

              {/* Modal buttons: stacked on mobile, right-aligned on desktop */}
              <div className="pt-4 border-t border-[#CFDACF]/60 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  loadingText="Submitting..."
                  disabled={!agreedToTerms || isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Submit request
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
