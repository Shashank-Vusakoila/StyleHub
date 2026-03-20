'use client';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import AdminDashboard from './AdminDashboard';

export default function AdminModal({ onClose }) {
  const [user,   setUser]   = useState(null);
  const [email,  setEmail]  = useState('');
  const [pass,   setPass]   = useState('');
  const [error,  setError]  = useState('');
  const [loading,setLoading]= useState(false);
  const [checking,setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      setError(err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : err.message);
    } finally { setLoading(false); }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background:'rgba(26,26,26,0.6)', backdropFilter:'blur(12px)' }}>

      <div className="relative bg-cream w-full max-w-5xl max-h-[95vh] rounded-4xl overflow-hidden shadow-soft-xl
        flex flex-col border border-ink/8 animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-ink/6">
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl text-ink font-400" style={{ fontStyle:'italic' }}>StyleHub</span>
            <span className="font-sans text-[7px] tracking-[0.3em] text-green font-500 uppercase -mt-0.5">Admin Panel</span>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-sans text-xs font-300 text-ink-muted">{user.email}</span>
              </div>
              <button suppressHydrationWarning onClick={handleLogout}
                className="font-sans text-xs font-400 text-ink-muted border border-ink/10
                  rounded-pill px-3 py-1.5 hover:border-rose-400 hover:text-rose-500 transition-all">
                Sign Out
              </button>
            </div>
          )}
          <button suppressHydrationWarning onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-ink/5 transition-all ml-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {checking ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 rounded-full border-2 border-green/20 border-t-green animate-spin" />
            </div>
          ) : user ? (
            <AdminDashboard user={user} />
          ) : (
            <LoginForm
              email={email} setEmail={setEmail}
              pass={pass} setPass={setPass}
              error={error} loading={loading}
              onSubmit={handleLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function LoginForm({ email, setEmail, pass, setPass, error, loading, onSubmit }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl text-ink font-300 mb-2" style={{ fontStyle:'italic' }}>
            Admin Access
          </h2>
          <p className="font-sans text-sm font-300 text-ink-muted">
            Sign in to manage your content
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-[10px] font-500 tracking-widest uppercase text-green mb-2">
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="input-cream" placeholder="admin@stylehubdecors.co" required />
          </div>
          <div>
            <label className="block font-sans text-[10px] font-500 tracking-widest uppercase text-green mb-2">
              Password
            </label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              className="input-cream" placeholder="••••••••" required />
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
              <p className="font-sans text-xs text-rose-600">{error}</p>
            </div>
          )}

          <button suppressHydrationWarning type="submit" disabled={loading}
            className="btn-primary w-full justify-center py-4 text-sm">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In →'}
          </button>
        </form>

        <p className="text-center mt-6 font-sans text-xs font-300 text-ink-faint">
          Set up in Firebase Authentication
        </p>
      </div>
    </div>
  );
}
