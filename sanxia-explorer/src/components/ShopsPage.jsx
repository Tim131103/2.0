import { useState, useCallback } from 'react';
import { shops } from '../data/shops';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

export default function ShopsPage({ userPoints, addPoints }) {
  const [checkedIn, setCheckedIn] = useState(() => {
    return new Set(JSON.parse(localStorage.getItem('checkedIn') || '[]'));
  });
  const [toast, setToast] = useState(null);

  function handleCheckIn(shop) {
    if (checkedIn.has(shop.id)) return;
    const next = new Set([...checkedIn, shop.id]);
    setCheckedIn(next);
    localStorage.setItem('checkedIn', JSON.stringify([...next]));
    addPoints(shop.points);
    setToast(`+${shop.points} pts earned at ${shop.name}!`);
    setTimeout(() => setToast(null), 2500);
  }

  const handleRefresh = useCallback(() => {
    return new Promise((res) => setTimeout(res, 800));
  }, []);

  const { refreshing, pullIndicator } = usePullToRefresh(handleRefresh);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      {/* Pull-to-refresh indicator */}
      <div
        className="flex justify-center overflow-hidden transition-all duration-200"
        style={{ height: pullIndicator > 0 || refreshing ? 48 : 0 }}
      >
        <div className="flex items-center gap-2 text-[#2B2D6E] text-sm font-medium">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ animation: refreshing ? 'spinSlow 0.8s linear infinite' : undefined }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          {refreshing ? 'Refreshing…' : 'Release to refresh'}
        </div>
      </div>

      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#2B2D6E] text-white px-5 py-3 rounded-lg shadow-xl font-semibold animate-bounce">
          ⭐ {toast}
        </div>
      )}

      <div className="mb-10">
        <p className="text-[#C9933A] text-xs font-bold tracking-[0.2em] uppercase mb-1">The Stops</p>
        <h2 className="text-4xl font-bold text-[#2B2D6E]" style={{ fontFamily: "'Noto Serif TC', serif" }}>
          Shops & Attractions
        </h2>
        <p className="text-stone-500 mt-2 max-w-xl">
          Every visit earns points. Tap "Check In" at a shop to collect your points.
        </p>
        <div className="mt-3 text-sm text-stone-400">
          {checkedIn.size}/{shops.length} visited
          {checkedIn.size > 0 && (
            <button
              className="ml-3 text-xs text-red-400 underline"
              onClick={() => {
                setCheckedIn(new Set());
                localStorage.removeItem('checkedIn');
              }}
            >
              reset
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {shops.map((shop) => {
          const collected = checkedIn.has(shop.id);
          return (
            <div
              key={shop.id}
              className={`bg-white rounded-xl overflow-hidden shadow-sm border transition-all ${
                collected ? 'border-green-200 opacity-80' : 'border-stone-100 hover:shadow-md'
              }`}
            >
              <div className="h-2" style={{ background: shop.color }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{shop.icon}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: shop.color }}>
                    {shop.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Noto Serif TC', serif" }}>
                  {shop.name}
                </h3>
                <p className="text-stone-400 text-sm mb-1">{shop.nameZh}</p>
                <p className="text-stone-600 text-sm leading-relaxed mt-2 mb-4">{shop.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-400">⏱ {shop.duration}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: shop.color + '22', color: shop.color }}>
                      +{shop.points} pts
                    </span>
                  </div>

                  <button
                    onClick={() => handleCheckIn(shop)}
                    disabled={collected}
                    className={`px-4 py-1.5 rounded text-sm font-semibold transition-all active:scale-95 ${
                      collected
                        ? 'bg-green-50 text-green-600 cursor-default'
                        : 'text-white hover:brightness-110'
                    }`}
                    style={collected ? {} : { background: shop.color }}
                  >
                    {collected ? '✓ Visited' : 'Check In'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
