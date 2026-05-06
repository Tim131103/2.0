import { useCallback } from 'react';
import { shops } from '../data/shops';
import { events } from '../data/events';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

export default function EventsPage() {
  const handleRefresh = useCallback(() => new Promise((res) => setTimeout(res, 800)), []);
  const { refreshing, pullIndicator } = usePullToRefresh(handleRefresh);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div
        className="flex justify-center overflow-hidden transition-all duration-200"
        style={{ height: pullIndicator > 0 || refreshing ? 48 : 0 }}
      >
        <div className="flex items-center gap-2 text-[#2B2D6E] text-sm font-medium">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ animation: refreshing ? 'spinSlow 0.8s linear infinite' : undefined }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          {refreshing ? 'Refreshing…' : 'Release to refresh'}
        </div>
      </div>
      <div className="mb-10">
        <p className="text-[#C9933A] text-xs font-bold tracking-[0.2em] uppercase mb-1">
          What's On
        </p>
        <h2
          className="text-4xl font-bold text-[#2B2D6E]"
          style={{ fontFamily: "'Noto Serif TC', serif" }}
        >
          Upcoming Events
        </h2>
        <p className="text-stone-500 mt-2 max-w-xl">
          Workshops, festivals, and ceremonies — there's always something happening on Sanxia
          Old Street.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => {
          const shop = shops.find((s) => s.id === event.shopId);
          return (
            <div
              key={event.id}
              className="bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {shop && <div className="h-1.5" style={{ background: shop.color }} />}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{shop?.icon}</span>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ background: event.badgeColor }}
                  >
                    {event.badge}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold text-[#1A1A1A] mb-1"
                  style={{ fontFamily: "'Noto Serif TC', serif" }}
                >
                  {event.title}
                </h3>

                <div className="flex flex-wrap gap-3 text-xs text-stone-500 mb-3">
                  <span>📅 {event.date}</span>
                  <span>🕐 {event.time}</span>
                  <span>📍 {event.location}</span>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  {event.description}
                </p>

                <EventButton badge={event.badge} color={event.badgeColor} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Newsletter signup */}
      <div
        className="mt-12 rounded-xl p-8 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #2B2D6E 0%, #1a1c4e 100%)' }}
      >
        <h3
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Noto Serif TC', serif" }}
        >
          Never miss an event
        </h3>
        <p className="text-white/70 mb-5 text-sm">
          Get notified about upcoming festivals, workshops, and exclusive deals.
        </p>
        <div className="flex max-w-sm mx-auto gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white/10 border border-white/30 text-white placeholder-white/40 px-4 py-2 rounded text-sm focus:outline-none focus:border-white/60"
          />
          <button className="bg-[#C9933A] hover:bg-[#b07e2a] text-white px-4 py-2 rounded text-sm font-semibold transition-colors whitespace-nowrap">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
}

function EventButton({ badge, color }) {
  return (
    <button
      className="text-sm font-semibold px-4 py-1.5 rounded border-2 transition-all hover:text-white"
      style={{ borderColor: color, color: color }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = color;
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = color;
      }}
    >
      {badge === 'Free Entry' ? 'Learn More' : 'Register →'}
    </button>
  );
}
