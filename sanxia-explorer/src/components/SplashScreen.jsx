import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1300);
    const t2 = setTimeout(() => onDone(), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF6EF] transition-opacity duration-500"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'auto' }}
    >
      <img
        src="/icon.svg"
        alt=""
        className="w-24 h-24 rounded-2xl shadow-xl mb-6"
        style={{ animation: 'splashPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}
      />
      <div className="text-center">
        <div className="text-xs text-[#C9933A] tracking-widest font-bold uppercase mb-1">三峽老街</div>
        <div className="text-3xl font-bold text-[#2B2D6E]" style={{ fontFamily: "'Noto Serif TC', serif" }}>
          Explorer
        </div>
      </div>
      <div className="flex gap-1.5 mt-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#2B2D6E]/25"
            style={{ animation: `splashDot 1.2s ${i * 0.2}s ease-in-out infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
