import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ShopsPage from './components/ShopsPage';
import RewardsPage from './components/RewardsPage';
import RoutePlanner from './components/RoutePlanner';
import EventsPage from './components/EventsPage';

export default function App() {
  const [page, setPage] = useState('home');
  const [userPoints, setUserPoints] = useState(120);

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <Navbar page={page} setPage={setPage} userPoints={userPoints} />

      {page === 'home' && <HomePage setPage={setPage} />}
      {page === 'shops' && <ShopsPage userPoints={userPoints} setUserPoints={setUserPoints} />}
      {page === 'points' && <RewardsPage userPoints={userPoints} />}
      {page === 'route' && <RoutePlanner setPage={setPage} />}
      {page === 'events' && <EventsPage />}

      <Footer setPage={setPage} />
    </div>
  );
}
