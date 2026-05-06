const NAV_LINKS = [
  { label: 'Home', page: 'home' },
  { label: 'Shops', page: 'shops' },
  { label: 'Points', page: 'points' },
  { label: 'Route', page: 'route' },
  { label: 'Events', page: 'events' },
];

export default function Navbar({ page, setPage, userPoints }) {
  return (
    <nav className="sticky top-0 z-50 bg-[#2B2D6E] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <button
          onClick={() => setPage('home')}
          className="text-lg font-bold tracking-wide hover:text-[#C9933A] transition-colors"
          style={{ fontFamily: "'Noto Serif TC', serif" }}
        >
          三峽老街 Explorer
        </button>

        <div className="flex items-center gap-1 flex-wrap">
          {NAV_LINKS.map((link) => (
            <button
              key={link.page}
              onClick={() => setPage(link.page)}
              className={`px-3 py-1.5 text-sm rounded transition-all font-medium ${
                page === link.page
                  ? 'bg-[#C9933A] text-white'
                  : 'hover:bg-white/10 text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="ml-2 bg-[#C9933A] px-3 py-1 rounded-full text-sm font-bold">
            ⭐ {userPoints} pts
          </div>
        </div>
      </div>
    </nav>
  );
}
