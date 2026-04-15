'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gamesLibrary } from '../lib/gamesData';
import GameCard from '../components/GameCard';
import GameDetail from '../GameDetail/page'; // استدعاء الـ component مباشرة وليس page.tsx
import AuthModal from '../components/AuthModal';
import { Star, Clock, CheckCircle, X as XIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function GameTracker() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'playing' | 'played' | 'wishlist' | 'dropped'>('all');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    playing: 0,
    played: 0,
    wishlist: 0,
    dropped: 0,
  });

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      loadStatusCounts();
    }
  }, [user]);

  const loadStatusCounts = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('game_statuses')
      .select('status')
      .eq('user_id', user.id);

    if (data) {
      setStatusCounts({
        playing: data.filter(s => s.status === 'playing').length,
        played: data.filter(s => s.status === 'played').length,
        wishlist: data.filter(s => s.status === 'wishlist').length,
        dropped: data.filter(s => s.status === 'dropped').length,
      });
    }
  };

  const tabs = [
    { id: 'all', label: 'All Games', icon: null },
    { id: 'playing', label: 'Playing', icon: <Clock size={20} /> },
    { id: 'played', label: 'Played', icon: <CheckCircle size={20} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Star size={20} /> },
    { id: 'dropped', label: 'Dropped', icon: <XIcon size={20} /> },
  ];

  const game = selectedGame ? gamesLibrary.find(g => g.id === selectedGame) : null;

  const filteredGames = activeTab === 'all'
    ? gamesLibrary
    : gamesLibrary.filter(game => game.status === activeTab); // لو عندك status لكل لعبة

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-white">
          Game Tracker
          <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
        </h1>
        <p className="text-gray-400 mb-8 text-lg">Track your gaming journey and organize your collection</p>

        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-yellow-600" size={24} />
                <h3 className="text-white font-bold">Playing</h3>
              </div>
              <p className="text-4xl font-bold text-white">{statusCounts.playing}</p>
            </div>

            <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-600" size={24} />
                <h3 className="text-white font-bold">Played</h3>
              </div>
              <p className="text-4xl font-bold text-white">{statusCounts.played}</p>
            </div>

            <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Star className="text-blue-600" size={24} />
                <h3 className="text-white font-bold">Wishlist</h3>
              </div>
              <p className="text-4xl font-bold text-white">{statusCounts.wishlist}</p>
            </div>

            <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <XIcon className="text-red-600" size={24} />
                <h3 className="text-white font-bold">Dropped</h3>
              </div>
              <p className="text-4xl font-bold text-white">{statusCounts.dropped}</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game.id)} />
          ))}
        </div>
      </div>

      {game && <GameDetail game={game} onClose={() => setSelectedGame(null)} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
