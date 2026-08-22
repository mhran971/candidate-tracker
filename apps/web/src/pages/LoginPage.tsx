import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Sparkles, Lock, Mail, Loader2, ShieldCheck, AlertCircle, LogIn, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const AUTHORIZED_ADMIN_EMAIL = 'mhranabwdqt971@gmail.com';

// Official Brand SVG Icons
function GoogleIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function LinkedInIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export function LoginPage() {
  const { user, signIn, signInWithOAuth, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSocialSubmitting, setIsSocialSubmitting] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect to destination or home
  const from = location.state?.from?.pathname || '/';
  if (user && !isLoading) {
    return <Navigate to={from} replace />;
  }

  const handleOAuthSignIn = async (provider: 'google' | 'linkedin_oidc') => {
    setErrorMessage(null);
    setIsSocialSubmitting(provider);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'OAuth sign in failed');
      toast.error(err.message || 'OAuth sign in failed');
    } finally {
      setIsSocialSubmitting(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your administrator email and password.');
      return;
    }

    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setErrorMessage('Access denied: This dashboard is private and restricted exclusively to the authorized platform owner.');
      toast.error('Unauthorized email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(cleanEmail, password);
      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else {
        toast.success(`Welcome back, Mahran! Access granted.`);
        navigate(from, { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-background text-foreground relative overflow-hidden">
      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <ThemeToggle />
      </div>

      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 ring-4 ring-primary/10">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Candidate Tracker
          </h1>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Authorized Administrator Portal</span>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="border-border shadow-xl backdrop-blur-md bg-card/95">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold w-fit">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Owner Access Only</span>
            </div>
            <CardTitle className="text-lg font-bold mt-2">
              Administrator Sign In
            </CardTitle>
            <CardDescription className="text-xs">
              Sign in with your Google / LinkedIn account or enter your master credentials.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Social Authentication Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthSignIn('google')}
                disabled={isSubmitting || isSocialSubmitting !== null}
                className="h-11 font-semibold text-xs border-border bg-card hover:bg-accent gap-2 shadow-2xs transition-transform active:scale-95"
              >
                {isSocialSubmitting === 'google' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon className="h-4 w-4 shrink-0" />
                )}
                <span>Google / Gmail</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthSignIn('linkedin_oidc')}
                disabled={isSubmitting || isSocialSubmitting !== null}
                className="h-11 font-semibold text-xs border-border bg-card hover:bg-accent gap-2 shadow-2xs transition-transform active:scale-95"
              >
                {isSocialSubmitting === 'linkedin_oidc' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LinkedInIcon className="h-4 w-4 shrink-0" />
                )}
                <span>LinkedIn</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-600 dark:text-muted-foreground uppercase tracking-wider">
                Or continue with password
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Standard Sign In Form (Preserved) */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="mhranabwdqt971@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting || isSocialSubmitting !== null}
                    className="pl-9 h-10 text-sm font-medium bg-background"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting || isSocialSubmitting !== null}
                    className="pl-9 h-10 text-sm font-medium bg-background"
                    autoFocus
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isSocialSubmitting !== null}
                className="w-full h-11 text-sm font-bold shadow-md shadow-primary/25 gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Sign In with Password</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Footer Note */}
        <p className="text-center text-[11px] text-muted-foreground font-medium">
          Protected with end-to-end Supabase Auth (OAuth 2.0 & encrypted JWT sessions).
        </p>
      </div>
    </div>
  );
}
