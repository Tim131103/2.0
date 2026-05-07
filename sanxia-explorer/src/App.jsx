import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import InstallBanner from './components/InstallBanner';
import AuthPage from './components/AuthPage';
import MigratePrompt from './components/MigratePrompt';
import HomePage from './components/HomePage';
import ShopsPage from './components/ShopsPage';
import RewardsPage from './components/RewardsPage';
import RoutePlanner from './components/RoutePlanner';
import EventsPage from './components/EventsPage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { token, user, setUser, loading, login, register, logout } = useAuth();

  const [page, setPage] = useState(() => {
    const p = new URLSearchParams(window.location.search).get('page');
    return ['home', 'shops', 'points', 'route', 'events'].includes(p) ? p : 'home';
  });

  const showMigrate =
    user &&
    user.points === 0 &&
    user.checkins.length === 0 &&
    parseInt(localStorage.getItem('userPoints') ?? '0', 10) > 0 &&
    !localStorage.getItem('migrateDone');

  async function handleAuth(mode, email, password) {
    if (mode === 'login') await login(email, password);
    else await register(email, password);
  }

  function handleCheckInSuccess({ totalPoints, shopId }) {
    setUser((prev) => ({
      ...prev,
      points: totalPoints,
      checkins: prev.checkins.includes(shopId) ? prev.checkins : [...prev.checkins, shopId],
    }));
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#2B2D6E]/20 border-t-[#2B2D6E] rounded-full animate-spin" />
    </div>
  );

  if (!user) return <AuthPage onSuccess={handleAuth} />;

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      {showMigrate && <MigratePrompt token={token} setUser={setUser} />}
      <InstallBanner />

      <div className="min-h-screen bg-[#FAF6EF] flex flex-col">
        <Navbar page={page} setPage={setPage} userPoints={user.points} onLogout={logout} />

        <main className="flex-1 pb-28">
          {page === 'home'   && <HomePage setPage={setPage} />}
          {page === 'shops'  && (
            <ShopsPage
              checkedIn={new Set(user.checkins)}
              token={token}
              onCheckInSuccess={handleCheckInSuccess}
            />
          )}
          {page === 'points' && <RewardsPage userPoints={user.points} token={token} setUser={setUser} />}
          {page === 'route'  && <RoutePlanner setPage={setPage} />}
          {page === 'events' && <EventsPage />}
        </main>

        <BottomNav page={page} setPage={setPage} />
      </div>
    </>
  );
}
