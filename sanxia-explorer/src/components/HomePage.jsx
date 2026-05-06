const STATS = [
  { icon: '🪐', label: '4 Shops', sub: 'All earn points' },
  { icon: '⭐', label: 'Loyalty Points', sub: 'Redeem for rewards' },
  { icon: '🗺️', label: 'Walking Routes', sub: 'Custom to your picks' },
  { icon: '📅', label: '4 Upcoming Events', sub: 'Workshops & festivals' },
];

const FEATURE_CARDS = [
  {
    page: 'shops',
    emoji: '🛍️',
    title: 'Explore the Shops',
    desc: 'From indigo dyeing to temple visits to golden pastries — discover each unique stop.',
    cta: 'See All Shops',
    bg: '#2B2D6E',
  },
  {
    page: 'events',
    emoji: '📅',
    title: 'Upcoming Events',
    desc: 'Open days, night markets, tea ceremonies — something is always happening on Old Street.',
    cta: 'See Events',
    bg: '#3A6B3A',
  },
  {
    page: 'points',
    emoji: '⭐',
    title: 'Earn & Redeem Points',
    desc: 'Shop, check in, share — earn points at every stop and redeem for exclusive local rewards.',
    cta: 'How Points Work',
    bg: '#C9933A',
  },
  {
    page: 'route',
    emoji: '🗺️',
    title: 'Build Your Route',
    desc: "Pick the shops you want to visit and get a step-by-step walking route with estimated times.",
    cta: 'Plan My Route',
    bg: '#6B4423',
  },
];

export default function HomePage({ setPage }) {
  return (
    <div className="relative">
      {/* Hero */}
      <div
        className="relative h-[520px] flex items-end overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1a1c4e 0%, #2B2D6E 40%, #6B4423 80%, #C9933A 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div
          className="absolute right-8 top-8 text-white/5 font-bold select-none"
          style={{ fontSize: '280px', fontFamily: "'Noto Serif TC', serif", lineHeight: 1 }}
        >
          街
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 w-full">
          <p className="text-[#C9933A] text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Sanxia, New Taipei City · Taiwan
          </p>
          <h1
            className="text-white text-5xl md:text-6xl font-bold leading-tight mb-4"
            style={{ fontFamily: "'Noto Serif TC', serif" }}
          >
            Discover
            <br />
            <span className="text-[#C9933A]">Sanxia Old Street</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-8">
            Temples, indigo craft, golden pastries & tea — earn points as you explore
            Taiwan's most storied historic street.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPage('route')}
              className="bg-[#C9933A] hover:bg-[#b07e2a] text-white px-6 py-3 rounded font-semibold transition-all shadow-lg hover:-translate-y-0.5"
            >
              Plan My Visit →
            </button>
            <button
              onClick={() => setPage('shops')}
              className="border border-white/40 hover:border-white text-white px-6 py-3 rounded font-semibold transition-all hover:bg-white/10"
            >
              View All Shops
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="font-bold text-[#2B2D6E] text-sm">{stat.label}</div>
                <div className="text-xs text-stone-500">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-6">
        {FEATURE_CARDS.map((card) => (
          <div
            key={card.page}
            className="rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setPage(card.page)}
          >
            <div
              className="p-8 text-white h-full transition-all group-hover:brightness-110"
              style={{ background: card.bg }}
            >
              <div className="text-4xl mb-4">{card.emoji}</div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "'Noto Serif TC', serif" }}
              >
                {card.title}
              </h2>
              <p className="text-white/70 text-sm mb-5 leading-relaxed">{card.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold border border-white/40 px-4 py-1.5 rounded-full group-hover:bg-white/20 transition-all">
                {card.cta} →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
