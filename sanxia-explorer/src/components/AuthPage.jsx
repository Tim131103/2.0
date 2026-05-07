import { useState } from 'react';

export default function AuthPage({ onSuccess }) {
  const [mode, setMode]     = useState('login');
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSuccess(mode, email.trim(), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/icon.svg" alt="" className="w-16 h-16 rounded-2xl shadow-lg mb-3" />
          <div className="text-xs text-[#C9933A] tracking-widest font-bold uppercase">三峽老街</div>
          <div className="text-2xl font-bold text-[#2B2D6E]" style={{ fontFamily: "'Noto Serif TC', serif" }}>
            Explorer
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(43,45,110,0.10)] border border-[#2B2D6E]/8 p-6">
          {/* Toggle */}
          <div className="flex bg-stone-100 rounded-xl p-1 mb-6">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m ? 'bg-white shadow text-[#2B2D6E]' : 'text-stone-400'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B2D6E] transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B2D6E] transition-colors"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center bg-red-50 rounded-lg py-2 px-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2B2D6E] text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-all disabled:opacity-60"
            >
              {loading ? '…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          Your points are saved to your account and sync across devices.
        </p>
      </div>
    </div>
  );
}
