export default function Navbar({ page, setPage, userPoints, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-[#2B2D6E] text-white shadow-md"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setPage('home')}
          className="flex items-center gap-2"
        >
          <img src="/icon.svg" alt="" className="w-8 h-8 rounded-lg" />
          <div className="leading-tight">
            <div className="text-xs text-white/60 tracking-widest font-medium">三峽老街</div>
            <div className="text-base font-bold tracking-wide" style={{ fontFamily: "'Noto Serif TC', serif" }}>
              Explorer
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage('points')}
            className="flex items-center gap-1.5 bg-[#C9933A] px-3 py-1.5 rounded-full text-sm font-bold shadow active:scale-95 transition-transform"
          >
            <span>⭐</span>
            <span>{userPoints} pts</span>
          </button>
          <button
            onClick={onLogout}
            className="text-white/50 hover:text-white/80 transition-colors px-1 py-1 text-lg leading-none"
            title="Sign out"
          >
            ⏏
          </button>
        </div>
      </div>
    </header>
  );
}
