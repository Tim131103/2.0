const TABS = [
  {
    page: 'home',
    label: 'Home',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    page: 'shops',
    label: 'Shops',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    page: 'points',
    label: 'Points',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    page: 'route',
    label: 'Route',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="19" r="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.3 : 0} />
        <circle cx="18" cy="5" r="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.3 : 0} />
        <path d="M6 17V7a2 2 0 0 1 2-2h3" />
        <path d="M18 7v10a2 2 0 0 1-2 2h-3" />
      </svg>
    ),
  },
  {
    page: 'events',
    label: 'Events',
    icon: (active) => (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.12 : 0} />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <rect x="8" y="14" width="2" height="2" rx="0.3" fill="currentColor" stroke="none" />
        <rect x="14" y="14" width="2" height="2" rx="0.3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function BottomNav({ page, setPage }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 px-3"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(43,45,110,0.13)] border border-[#2B2D6E]/10">
        <div className="flex items-center">
          {TABS.map((tab) => {
            const active = page === tab.page;
            return (
              <button
                key={tab.page}
                onClick={() => setPage(tab.page)}
                className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all active:scale-95"
              >
                <span className={`transition-colors ${active ? 'text-[#C9933A]' : 'text-gray-400'}`}>
                  {tab.icon(active)}
                </span>
                <span
                  className={`text-[10px] tracking-wide transition-all ${
                    active ? 'text-[#C9933A] font-bold' : 'text-gray-400 font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
