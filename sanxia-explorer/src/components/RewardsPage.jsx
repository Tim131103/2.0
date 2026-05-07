import { useState, useEffect } from 'react';
import { shops } from '../data/shops';
import { tiers } from '../data/tiers';
import { api } from '../api';

const HOW_IT_WORKS = [
  { step: '1', icon: '🛍️', title: 'Shop', desc: 'Visit any participating shop on Sanxia Old Street' },
  { step: '2', icon: '✅', title: 'Check In', desc: "Tap 'Check In' on the shop page to log your visit" },
  { step: '3', icon: '🎁', title: 'Redeem', desc: 'Exchange points for discounts, free tea, or exclusive souvenirs' },
];

function shopAction(shopId) {
  if (shopId === 'indigo') return 'Book a workshop';
  if (shopId === 'temple') return 'Check-in';
  return 'Any purchase';
}

export default function RewardsPage({ userPoints, token, setUser }) {
  const [redeemResult, setRedeemResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [redeemLoading, setRedeemLoading] = useState(null);

  useEffect(() => {
    if (!token) return;
    api.redeemHistory(token).then(setHistory).catch(() => {});
  }, [token]);

  const currentTier = tiers.slice().reverse().find((t) => userPoints >= t.min) ?? tiers[0];
  const nextTier = tiers.find((t) => t.min > userPoints);
  const progress = nextTier
    ? Math.min(100, ((userPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;

  async function handleRedeem(tier) {
    setRedeemLoading(tier.name);
    try {
      const result = await api.redeem(tier.name, token);
      setRedeemResult(result);
      setUser((prev) => ({ ...prev, points: result.remainingPoints }));
      setHistory((prev) => [{
        rewardCode: result.rewardCode,
        tierName: result.tierName,
        pointsSpent: result.pointsSpent,
        redeemedAt: new Date().toISOString(),
      }, ...prev]);
    } catch (err) {
      alert(err.message);
    } finally {
      setRedeemLoading(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      {/* Redeem code modal */}
      {redeemResult && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-bold text-[#2B2D6E] text-xl mb-2" style={{ fontFamily: "'Noto Serif TC', serif" }}>
              Coupon Redeemed!
            </h3>
            <p className="text-stone-500 text-sm mb-4">Show this code at the shop:</p>
            <div className="bg-[#2B2D6E]/5 border-2 border-dashed border-[#2B2D6E]/20 rounded-xl py-4 px-6 mb-4">
              <span className="text-2xl font-bold text-[#2B2D6E] tracking-widest">{redeemResult.rewardCode}</span>
            </div>
            <p className="text-xs text-stone-400 mb-5">
              {redeemResult.pointsSpent > 0
                ? `${redeemResult.pointsSpent} pts deducted · ${redeemResult.remainingPoints} pts remaining`
                : `Free reward · ${redeemResult.remainingPoints} pts remaining`}
            </p>
            <button
              onClick={() => setRedeemResult(null)}
              className="w-full bg-[#2B2D6E] text-white py-3 rounded-xl font-bold text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <div className="mb-10">
        <p className="text-[#C9933A] text-xs font-bold tracking-[0.2em] uppercase mb-1">
          Loyalty Programme
        </p>
        <h2
          className="text-4xl font-bold text-[#2B2D6E]"
          style={{ fontFamily: "'Noto Serif TC', serif" }}
        >
          Points & Rewards
        </h2>
      </div>

      {/* Points card */}
      <div
        className="rounded-xl p-8 text-white mb-10"
        style={{ background: 'linear-gradient(135deg, #2B2D6E 0%, #1a1c4e 100%)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-sm mb-1">Your Current Points</p>
            <p className="text-5xl font-bold">
              {userPoints}
              <span className="text-2xl ml-1 text-white/60">pts</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-sm mb-1">Current Tier</p>
            <p className="text-2xl font-bold">
              {currentTier.emoji} {currentTier.name}
            </p>
          </div>
        </div>

        {nextTier ? (
          <>
            <div className="flex justify-between text-xs text-white/50 mb-2">
              <span>{currentTier.name}</span>
              <span className="text-white/80 font-semibold">
                {nextTier.min - userPoints} pts to {nextTier.emoji} {nextTier.name}
              </span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #C9933A, #f0b94a)',
                  boxShadow: '0 0 8px rgba(201,147,58,0.6)',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/40 mt-1.5">
              <span>{currentTier.min} pts</span>
              <span>{nextTier.min} pts</span>
            </div>
          </>
        ) : (
          <p className="text-[#C9933A] font-semibold">🎉 You've reached the highest tier!</p>
        )}
      </div>

      {/* How it works */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-[#2B2D6E] mb-6" style={{ fontFamily: "'Noto Serif TC', serif" }}>
          How It Works
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="bg-white border border-stone-100 rounded-xl p-6 shadow-sm">
              <div className="w-8 h-8 bg-[#2B2D6E] text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">
                {item.step}
              </div>
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="font-bold text-[#1A1A1A] mb-1">{item.title}</h4>
              <p className="text-stone-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Points per shop table */}
      <div className="mb-10 bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="font-bold text-[#2B2D6E]" style={{ fontFamily: "'Noto Serif TC', serif" }}>
            Points Per Shop
          </h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 text-xs text-stone-400 uppercase tracking-wider">
              <th className="text-left px-6 py-3">Shop</th>
              <th className="text-left px-6 py-3">Action</th>
              <th className="text-right px-6 py-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop, i) => (
              <tr key={shop.id} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                <td className="px-6 py-3 font-medium text-sm">{shop.icon} {shop.name}</td>
                <td className="px-6 py-3 text-sm text-stone-500">{shopAction(shop.id)}</td>
                <td className="px-6 py-3 text-right">
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: shop.color + '22', color: shop.color }}>
                    +{shop.points} pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tier cards with Redeem buttons */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-[#2B2D6E] mb-6" style={{ fontFamily: "'Noto Serif TC', serif" }}>
          Reward Tiers
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((tier) => {
            const isActive = userPoints >= tier.min && userPoints <= tier.max;
            const canRedeem = userPoints >= tier.requiredPts;
            return (
              <div
                key={tier.name}
                className={`rounded-xl p-6 border-2 transition-all ${
                  isActive ? 'border-[#C9933A] bg-amber-50 shadow-md' : 'border-stone-200 bg-white'
                }`}
              >
                <div className="text-3xl mb-2">{tier.emoji}</div>
                <h4 className="font-bold text-lg text-[#2B2D6E] mb-1">{tier.name}</h4>
                <p className="text-xs text-stone-400 mb-2">
                  {tier.max === Infinity ? `${tier.min}+ pts` : `${tier.min}–${tier.max} pts`}
                </p>
                <p className="text-sm text-stone-600 mb-4">{tier.reward}</p>
                {isActive && (
                  <div className="text-xs font-bold text-[#C9933A] mb-3">← Your current tier</div>
                )}
                <button
                  onClick={() => handleRedeem(tier)}
                  disabled={!canRedeem || redeemLoading === tier.name}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                    canRedeem
                      ? 'bg-[#2B2D6E] text-white active:scale-95'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {redeemLoading === tier.name
                    ? '…'
                    : canRedeem
                    ? tier.cost > 0 ? `Redeem (${tier.cost} pts)` : 'Get Free Coupon'
                    : `Need ${tier.requiredPts} pts`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redemption history */}
      {history.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-[#2B2D6E] mb-4" style={{ fontFamily: "'Noto Serif TC', serif" }}>
            Redemption History
          </h3>
          <div className="space-y-2">
            {history.map((r, i) => (
              <div key={i} className="bg-white border border-stone-100 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
                <div>
                  <span className="font-bold text-sm text-[#2B2D6E] tracking-widest">{r.rewardCode}</span>
                  <span className="ml-3 text-xs text-stone-400">{r.tierName}</span>
                </div>
                <span className="text-xs text-stone-400">
                  {r.pointsSpent > 0 ? `-${r.pointsSpent} pts` : 'Free'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
