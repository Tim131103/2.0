import { useState } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import HomePage from './components/HomePage';
import ShopsPage from './components/ShopsPage';
import RewardsPage from './components/RewardsPage';
import RoutePlanner from './components/RoutePlanner';
import EventsPage from './components/EventsPage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [page, setPage] = useState(() => {
    const p = new URLSearchParams(window.location.search).get('page');
    return ['home', 'shops', 'points', 'route', 'events'].includes(p) ? p : 'home';
  });

  const [userPoints, setUserPoints] = useState(() => {
    return parseInt(localStorage.getItem('userPoints') ?? '120', 10);
  });

  function addPoints(delta) {
    setUserPoints((prev) => {
      const next = prev + delta;
      localStorage.setItem('userPoints', next);
      return next;
    });
  }

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div className="min-h-screen bg-[#FAF6EF] flex flex-col">
        <Navbar page={page} setPage={setPage} userPoints={userPoints} />

        <main className="flex-1 pb-20">
          {page === 'home' && <HomePage setPage={setPage} />}
          {page === 'shops' && <ShopsPage userPoints={userPoints} addPoints={addPoints} />}
          {page === 'points' && <RewardsPage userPoints={userPoints} />}
          {page === 'route' && <RoutePlanner setPage={setPage} />}
          {page === 'events' && <EventsPage />}
        </main>

        <BottomNav page={page} setPage={setPage} />
      </div>
    </>
  );
}
