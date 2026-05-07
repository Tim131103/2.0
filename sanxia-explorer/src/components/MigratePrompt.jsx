import { useState } from 'react';
import { api } from '../api';

export default function MigratePrompt({ token, setUser }) {
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const localPoints  = parseInt(localStorage.getItem('userPoints') ?? '0', 10);
  const localCheckins = JSON.parse(localStorage.getItem('checkedIn') || '[]');

  function clear() {
    localStorage.removeItem('userPoints');
    localStorage.removeItem('checkedIn');
    localStorage.setItem('migrateDone', '1');
    setVisible(false);
  }

  async function handleImport() {
    setLoading(true);
    try {
      const result = await api.migrate(localPoints, localCheckins, token);
      setUser((prev) => ({ ...prev, points: result.points, checkins: result.checkins }));
    } catch {
      // silently skip if server rejects — maybe account already had data
    } finally {
      clear();
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 flex items-end justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="text-2xl mb-3">📦</div>
        <h3 className="font-bold text-[#2B2D6E] text-lg mb-1" style={{ fontFamily: "'Noto Serif TC', serif" }}>
          Import saved progress?
        </h3>
        <p className="text-stone-500 text-sm mb-5">
          We found <span className="font-bold text-[#C9933A]">{localPoints} pts</span> and{' '}
          <span className="font-bold">{localCheckins.length} check-in{localCheckins.length !== 1 ? 's' : ''}</span> saved
          locally. Import them into your new account?
        </p>
        <div className="flex gap-3">
          <button
            onClick={clear}
            className="flex-1 border border-stone-200 text-stone-500 py-2.5 rounded-xl text-sm font-semibold"
          >
            No thanks
          </button>
          <button
            onClick={handleImport}
            disabled={loading}
            className="flex-1 bg-[#2B2D6E] text-white py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? '…' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
