import { useState } from 'react';
import { shops } from '../data/shops';

export default function RoutePlanner({ setPage }) {
  const [selected, setSelected] = useState(new Set(shops.map((s) => s.id)));

  function toggleShop(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const route = shops.filter((s) => selected.has(s.id));
  const totalMinutes =
    route.reduce((sum, s) => sum + parseInt(s.duration.replace('~', '').replace(' min', '')), 0) +
    (route.length > 1 ? (route.length - 1) * 4 : 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="mb-10">
        <p className="text-[#C9933A] text-xs font-bold tracking-[0.2em] uppercase mb-1">
          Plan Your Visit
        </p>
        <h2
          className="text-4xl font-bold text-[#2B2D6E]"
          style={{ fontFamily: "'Noto Serif TC', serif" }}
        >
          Route Planner
        </h2>
        <p className="text-stone-500 mt-2">
          Choose the shops you'd like to visit and we'll map out your walk.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Stop selector */}
        <div>
          <h3
            className="font-bold text-[#2B2D6E] mb-4 text-lg"
            style={{ fontFamily: "'Noto Serif TC', serif" }}
          >
            Select Your Stops
          </h3>
          <div className="space-y-3">
            {shops.map((shop) => {
              const active = selected.has(shop.id);
              return (
                <div
                  key={shop.id}
                  onClick={() => toggleShop(shop.id)}
                  className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex items-center gap-4 ${
                    active
                      ? 'border-[#2B2D6E] bg-[#2B2D6E]/5'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      active ? 'bg-[#2B2D6E] border-[#2B2D6E]' : 'border-stone-300'
                    }`}
                  >
                    {active && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-2xl">{shop.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{shop.name}</div>
                    <div className="text-xs text-stone-400">
                      {shop.category} · {shop.duration}
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                    style={{ background: shop.color + '22', color: shop.color }}
                  >
                    +{shop.points} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Route display */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold text-[#2B2D6E] text-lg"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            >
              Your Route
            </h3>
            {route.length > 0 && (
              <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                ~{totalMinutes} min total
              </span>
            )}
          </div>

          {route.length === 0 ? (
            <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl p-10 text-center">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="text-stone-400 text-sm">Select at least one shop to see your route</p>
            </div>
          ) : (
            <>
              <div className="relative">
                {route.map((shop, i) => (
                  <div key={shop.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10"
                        style={{ background: shop.color }}
                      >
                        {i + 1}
                      </div>
                      {i < route.length - 1 && (
                        <div
                          className="w-0.5 flex-1 my-1"
                          style={{ background: shop.color + '40', minHeight: '40px' }}
                        />
                      )}
                    </div>
                    <div className={`pb-4 flex-1 ${i === route.length - 1 ? 'pb-0' : ''}`}>
                      <div className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{shop.icon}</span>
                          <span className="font-bold text-sm">{shop.name}</span>
                        </div>
                        <div className="text-xs text-stone-400 mb-1">
                          {shop.nameZh} · {shop.duration}
                        </div>
                        {i < route.length - 1 && (
                          <div className="text-xs text-stone-400 mt-1">
                            🚶 {shop.walkToNext || '~5 min walk'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Route summary */}
              <div className="mt-4 bg-[#2B2D6E] text-white rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Stops</span>
                  <span className="font-bold">{route.length}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/70">Points to earn</span>
                  <span className="font-bold text-[#C9933A]">
                    +{route.reduce((sum, s) => sum + s.points, 0)} pts
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/70">Estimated time</span>
                  <span className="font-bold">~{totalMinutes} min</span>
                </div>
              </div>

              {/* Mock map */}
              <div
                className="mt-6 rounded-xl overflow-hidden border border-stone-200 flex items-center justify-center h-44 relative"
                style={{ background: 'linear-gradient(135deg, #e8e4da 0%, #d4cfc4 100%)' }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(#2B2D6E33 1px, transparent 1px), linear-gradient(90deg, #2B2D6E33 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                  }}
                />
                {route.map((shop, i) => (
                  <div
                    key={shop.id}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${15 + 22 * i}%`, top: `${30 + (i % 2) * 25}%` }}
                  >
                    <div
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-md border-2 border-white"
                      style={{ background: shop.color }}
                    >
                      {i + 1}
                    </div>
                    <div className="bg-white text-xs px-1.5 py-0.5 rounded shadow mt-1 font-medium">
                      {shop.icon}
                    </div>
                  </div>
                ))}
                <p className="relative z-10 text-stone-500 text-xs bg-white/80 px-3 py-1 rounded-full mt-20">
                  Interactive map coming soon
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
