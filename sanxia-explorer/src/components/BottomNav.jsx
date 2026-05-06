const TABS = [
  {
    page: 'home',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M10.707 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 19 11h-1v9a1 1 0 0 1-1 1h-4v-5H11v5H7a1 1 0 0 1-1-1v-9H5a1 1 0 0 1-.707-1.707l7-7z" />
      </svg>
    ),
  },
  {
    page: 'shops',
    label: 'Shops',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4 4h16l-1.5 9H5.5L4 4zm0 0H2M5.5 13l-1 5h15l-1-5M9 17v2m6-2v2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M4 4l1.5 9h13L20 4H4z" fill="currentColor" fillOpacity="0.15" />
        <path d="M8 4V3a1 1 0 0 1 2 0v1M14 4V3a1 1 0 0 1 2 0v1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    page: 'points',
    label: 'Points',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    page: 'route',
    label: 'Route',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" fill="currentColor" fillOpacity="0.2" />
        <path d="M15 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" fill="currentColor" fillOpacity="0.2" />
        <path d="M6 10v4a4 4 0 0 0 4 4h4" />
        <path d="M18 14V7h-5" />
      </svg>
    ),
  },
  {
    page: 'events',
    label: 'Events',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <rect x="7" y="13" width="3" height="3" rx="0.5" fill="currentColor" />
        <rect x="14" y="13" width="3" height="3" rx="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function BottomNav({ page, setPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch">
        {TABS.map((tab) => {
          const active = page === tab.page;
          return (
            <button
              key={tab.page}
              onClick={() => setPage(tab.page)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                active ? 'text-[#2B2D6E]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className={`transition-transform ${active ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-[#2B2D6E]' : ''}`}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute top-0 h-0.5 w-8 bg-[#2B2D6E] rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
