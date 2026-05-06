const FOOTER_LINKS = ['shops', 'points', 'route', 'events'];

function linkLabel(page) {
  if (page === 'route') return 'Route Planner';
  if (page === 'points') return 'Points Programme';
  return page.charAt(0).toUpperCase() + page.slice(1);
}

export default function Footer({ setPage }) {
  return (
    <footer className="bg-[#2B2D6E] text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            >
              三峽老街
              <br />
              Explorer
            </h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Preserving culture.
              <br />
              Welcoming visitors.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/50 mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((page) => (
                <li key={page}>
                  <button
                    onClick={() => setPage(page)}
                    className="text-white/70 hover:text-[#C9933A] transition-colors text-sm"
                  >
                    {linkLabel(page)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/50 mb-4">
              Location
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Sanxia Old Street
              <br />
              三峽老街, Sanxia District
              <br />
              New Taipei City, Taiwan
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-8 h-8 bg-white/10 hover:bg-[#C9933A] rounded flex items-center justify-center transition-colors text-xs font-bold"
              >
                f
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-white/10 hover:bg-[#C9933A] rounded flex items-center justify-center transition-colors text-xs font-bold"
              >
                ig
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex items-center justify-between">
          <p className="text-white/40 text-xs">
            © 2025 Sanxia Old Street Explorer. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">Made with ❤️ in Taiwan</p>
        </div>
      </div>
    </footer>
  );
}
