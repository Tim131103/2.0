import { useState } from 'react';
import { shops } from '../data/shops';

export default function ShopsPage({ userPoints, setUserPoints }) {
  const [checkedIn, setCheckedIn] = useState(new Set());
  const [toast, setToast] = useState(null);

  function handleCheckIn(shop) {
    if (checkedIn.has(shop.id)) return;
    setCheckedIn((prev) => new Set([...prev, shop.id]));
    setUserPoints((prev) => prev + shop.points);
    setToast(`+${shop.points} pts earned at ${shop.name}!`);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#2B2D6E] text-white px-5 py-3 rounded-lg shadow-xl font-semibold">
          ⭐ {toast}
        </div>
      )}

      <div className="mb-10">
        <p className="text-[#C9933A] text-xs font-bold tracking-[0.2em] uppercase mb-1">
          The Stops
        </p>
        <h2
          className="text-4xl font-bold text-[#2B2D6E]"
          style={{ fontFamily: "'Noto Serif TC', serif" }}
        >
          Shops & Attractions
        </h2>
        <p className="text-stone-500 mt-2 max-w-xl">
          Every visit earns points. Tap "Check In" at a shop to collect your points.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {shops.map((shop) => {
          const collected = checkedIn.has(shop.id);
          return (
            <div
              key={shop.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
            >
              <div className="h-2" style={{ background: shop.color }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{shop.icon}</span>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ background: shop.color }}
                  >
                    {shop.category}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "'Noto Serif TC', serif" }}
                >
                  {shop.name}
                </h3>
                <p className="text-stone-400 text-sm mb-1">{shop.nameZh}</p>
                <p className="text-stone-600 text-sm leading-relaxed mt-2 mb-4">
                  {shop.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-400">⏱ {shop.duration}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: shop.color + '22', color: shop.color }}
                    >
                      +{shop.points} pts
                    </span>
                  </div>

                  <button
                    onClick={() => handleCheckIn(shop)}
                    disabled={collected}
                    className={`px-4 py-1.5 rounded text-sm font-semibold transition-all ${
                      collected
                        ? 'bg-stone-100 text-stone-400 cursor-default'
                        : 'text-white hover:brightness-110'
                    }`}
                    style={collected ? {} : { background: shop.color }}
                  >
                    {collected ? '✓ Collected' : 'Check In'}
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
