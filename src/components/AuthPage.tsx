import { useEffect, useRef, useState } from 'react';
import { Sprout, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth, postJSON, type AuthUser } from '@/lib/auth';

type Mode = 'login' | 'signup';
type LoginMethod = 'password' | 'emailotp' | 'phoneotp';
type SignupMethod = 'email' | 'phone';
type AuthResponse = { token: string; user: AuthUser };

const inputCls =
  'w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm disabled:bg-stone-50 disabled:text-stone-500';
const otpCls =
  'w-full px-3 py-2.5 rounded-lg border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-center text-2xl tracking-[0.5em] font-mono';
const primaryBtn =
  'w-full py-3 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

export function AuthPage({
  mode, onModeChange, onSuccess,
}: {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  onSuccess: () => void;
}) {
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
  const [signupMethod, setSignupMethod] = useState<SignupMethod>('email');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const resetOtp = () => {
    setOtpSent(false);
    setOtp('');
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const clearMessages = () => { setError(null); setInfo(null); };

  const switchLoginMethod = (m: LoginMethod) => { setLoginMethod(m); resetOtp(); clearMessages(); };
  const switchSignupMethod = (m: SignupMethod) => { setSignupMethod(m); clearMessages(); };
  const switchMode = (m: Mode) => { onModeChange(m); resetOtp(); clearMessages(); setPassword(''); setConfirmPassword(''); };

  const startTimer = () => {
    setTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const run = async (fn: () => Promise<void>) => {
    clearMessages();
    setLoading(true);
    try {
      await fn();
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const finish = (data: AuthResponse) => {
    login(data.token, data.user);
    onSuccess();
  };

  // Password Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const { ok, data } = await postJSON<AuthResponse>('/api/auth/verify-password', { email, password });
      if (ok) finish(data);
      else setError(data.error || 'Invalid credentials');
    });
  };

  // Email / Phone OTP
  const handleOtpSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const byEmail = loginMethod === 'emailotp';
    if (!byEmail && phoneNumber.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }
    run(async () => {
      const { ok, data } = await postJSON(
        byEmail ? '/api/auth/send-email-otp' : '/api/auth/send-phone-otp',
        byEmail ? { email } : { phoneNumber },
      );
      if (ok) {
        setOtpSent(true);
        setOtp('');
        setInfo(data.message || (byEmail ? 'OTP sent to your email' : 'OTP sent to your phone'));
        startTimer();
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    });
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const byEmail = loginMethod === 'emailotp';
    run(async () => {
      const { ok, data } = await postJSON<AuthResponse>(
        byEmail ? '/api/auth/verify-email-otp' : '/api/auth/verify-phone-otp',
        byEmail ? { email, otp } : { phoneNumber, otp },
      );
      if (ok) finish(data);
      else setError(data.error || 'Invalid OTP');
    });
  };

  // Signup
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupMethod === 'phone' && phoneNumber.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }
    if (signupMethod === 'email' && phoneNumber && phoneNumber.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    run(async () => {
      const { ok, data } = signupMethod === 'email'
        ? await postJSON<AuthResponse>('/api/auth/signup-email', { fullName, email, password, phoneNumber: phoneNumber || null })
        : await postJSON<AuthResponse>('/api/auth/signup-phone', { fullName, phoneNumber, password });
      if (ok) finish(data);
      else setError(data.error || 'Signup failed');
    });
  };

  const otpBlock = (
    <>
      {otpSent && (
        <div>
          <Label required>Enter OTP</Label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className={otpCls}
            autoFocus
            required
          />
          {timer > 0 && <p className="text-xs text-stone-500 mt-2 text-center">Resend in {timer}s</p>}
        </div>
      )}
      <button type="submit" disabled={loading || (otpSent && otp.length !== 6)} className={primaryBtn}>
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
      </button>
      {otpSent && (
        <div className="flex gap-2">
          <button type="button" onClick={() => { resetOtp(); clearMessages(); }} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition">
            Change {loginMethod === 'emailotp' ? 'email' : 'number'}
          </button>
          <button type="button" onClick={() => handleOtpSend()} disabled={timer > 0 || loading} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
            {timer > 0 ? 'Wait...' : 'Resend OTP'}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-gradient-to-br from-stone-50 to-emerald-50/40 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-xl p-6 sm:p-8">
        <div className="text-center mb-7">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center shadow-sm">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-stone-900">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="text-stone-500 mt-1 text-sm">AGROVISTA · Pure Jaggery &amp; Natural Honey</p>
        </div>

        {mode === 'login' ? (
          <Tabs
            value={loginMethod}
            onChange={(v) => switchLoginMethod(v as LoginMethod)}
            options={[['password', 'Password'], ['emailotp', 'Email OTP'], ['phoneotp', 'Phone OTP']]}
          />
        ) : (
          <Tabs
            value={signupMethod}
            onChange={(v) => switchSignupMethod(v as SignupMethod)}
            options={[['email', 'Sign up with email'], ['phone', 'Sign up with phone']]}
          />
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> <span>{error}</span>
          </div>
        )}
        {info && !error && (
          <div className="mb-4 flex items-start gap-2 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> <span>{info}</span>
          </div>
        )}

        {mode === 'login' && loginMethod === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <Label required>Email address</Label>
              <input type="email" autoComplete="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <Label required>Password</Label>
              <input type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required />
            </div>
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        )}

        {mode === 'login' && loginMethod === 'emailotp' && (
          <form onSubmit={otpSent ? handleOtpVerify : handleOtpSend} className="space-y-4">
            <div>
              <Label required>Email address</Label>
              <input type="email" autoComplete="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent} className={inputCls} required />
            </div>
            {otpBlock}
          </form>
        )}

        {mode === 'login' && loginMethod === 'phoneotp' && (
          <form onSubmit={otpSent ? handleOtpVerify : handleOtpSend} className="space-y-4">
            <div>
              <Label required>Phone number</Label>
              <PhoneInput value={phoneNumber} onChange={setPhoneNumber} disabled={otpSent} required />
            </div>
            {otpBlock}
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label required>Full name</Label>
              <input type="text" autoComplete="name" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} required />
            </div>
            {signupMethod === 'email' ? (
              <>
                <div>
                  <Label required>Email address</Label>
                  <input type="email" autoComplete="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
                </div>
                <div>
                  <Label>Phone number</Label>
                  <PhoneInput value={phoneNumber} onChange={setPhoneNumber} placeholder="9999999999 (optional)" />
                </div>
              </>
            ) : (
              <div>
                <Label required>Phone number</Label>
                <PhoneInput value={phoneNumber} onChange={setPhoneNumber} required />
              </div>
            )}
            <div>
              <Label required>Password</Label>
              <input type="password" autoComplete="new-password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required />
            </div>
            <div>
              <Label required>Confirm password</Label>
              <input type="password" autoComplete="new-password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} required />
            </div>
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Continue'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-stone-600">
          {mode === 'login' ? (
            <>New to Agrovista?{' '}
              <button onClick={() => switchMode('signup')} className="text-emerald-700 hover:text-emerald-800 font-semibold">Create an account</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => switchMode('login')} className="text-emerald-700 hover:text-emerald-800 font-semibold">Log in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-stone-700 mb-1.5">
      {children}{required && <span className="text-red-500"> *</span>}
    </label>
  );
}

function PhoneInput({
  value, onChange, disabled, required, placeholder = '9999999999',
}: {
  value: string; onChange: (v: string) => void; disabled?: boolean; required?: boolean; placeholder?: string;
}) {
  return (
    <div className="flex">
      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-200 bg-stone-50 text-sm text-stone-500">+91</span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
        maxLength={10}
        disabled={disabled}
        required={required}
        className={`${inputCls} rounded-l-none`}
      />
    </div>
  );
}

function Tabs({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="grid mb-6 p-1 rounded-xl bg-stone-100" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-medium transition ${
            value === v ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
