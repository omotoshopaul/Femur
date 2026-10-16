import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { FemurLogo } from '../../components/FemurLogo';
import { Alert } from '../../components/Alert';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const SignInView: React.FC<{
  onSuccess: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToHome: () => void;
}> = ({ onSuccess, onNavigateToSignUp, onNavigateToHome }) => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      onSuccess();
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up.');
      } else {
        setError(err.message || 'Unable to sign in. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-interface-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <button
          type="button"
          onClick={onNavigateToHome}
          className="inline-block focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
        >
          <FemurLogo />
        </button>
        <h2 className="font-editorial-serif text-[32px] sm:text-[36px] font-light text-[#0F3F24] tracking-tight">
          Sign in to FEMUR
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 border border-[#CFDACF] rounded-[12px] space-y-6">
          {error && <Alert severity="danger">{error}</Alert>}
          {resetSent && (
            <Alert severity="success">
              Password reset link sent to your email. Please check your inbox.
            </Alert>
          )}

          {!forgotPasswordOpen ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="signin-email"
                    className="block text-[14px] font-medium text-[#0F3F24] mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="signin-password"
                      className="block text-[14px] font-medium text-[#0F3F24]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        setForgotPasswordOpen(true);
                      }}
                      className="text-[13px] text-[#4F6B58] hover:text-[#0F3F24] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="signin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] text-[15px] focus-visible:outline-2 focus-visible:outline-[#0F3F24]"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isFullWidth
                    isLoading={loading}
                    loadingText="Signing in..."
                  >
                    Sign in
                  </Button>
                </div>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#CFDACF]" />
                </div>
                <div className="relative flex justify-center text-[13px]">
                  <span className="bg-[#FFFFFF] px-3 text-[#4F6B58]">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="md"
                isFullWidth
                isLoading={googleLoading}
                onClick={handleGoogleSignIn}
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
                Google Sign-In
              </Button>

              <div className="text-center pt-2 border-t border-[#CFDACF]/60">
                <span className="text-[14px] text-[#4F6B58]">
                  Don&apos;t have an account?{' '}
                </span>
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="text-[14px] font-medium text-[#0F3F24] hover:underline"
                >
                  Sign up
                </button>
              </div>
            </>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <h3 className="text-[18px] font-medium text-[#0F3F24]">Reset your password</h3>
                <p className="text-[14px] text-[#4F6B58] mt-1">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-[14px] font-medium text-[#0F3F24] mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] border border-[#CFDACF] bg-[#FFFFFF] text-[#0F3F24] text-[15px]"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setForgotPasswordOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={resetLoading}
                >
                  Send reset link
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
