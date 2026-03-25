'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';
import { gamesLibrary } from '../../lib/gamesData';
import GameCard from './components/GameCard';
import GameDetail from './GameDetail/page';
import AuthModal from './components/AuthModal';
import Pagination from '../../components/Pagination';
import { Star, Clock, CheckCircle, X as XIcon, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Game {
  id: string;
  title: string;
  release_year: number;
  size?: number | string;
  developer?: string | string[];
  genre?: string[];
  popularity?: number;
  trending?: number;
  rating?: number;
  playTime?: number;
  finishTime?: number;
  [key: string]: any;
}

type SortKey = 'title' | 'trending' | 'release_year' | 'popularity' | 'rating';

export default function GameTracker() {
  const { user } = useAuth();

  // ------------------- State -------------------
  const [activeTab, setActiveTab] = useState<'all' | 'playing' | 'played' | 'wishlist' | 'dropped'>('all');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userGameStatuses, setUserGameStatuses] = useState<Record<string, string>>({});
  const [statusCounts, setStatusCounts] = useState({ playing: 0, played: 0, wishlist: 0, dropped: 0 });

  const [sortType, setSortType] = useState<SortKey>('popularity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 36;

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: 'all',
    size: 'all',
    developer: 'all',
    releaseYear: 'all',
    searchQuery: '',
  });

  // ------------------- Filter Helpers -------------------
  const matchSize = (size: number, filter: string) => {
    if (filter === 'small') return size < 5;
    if (filter === 'medium') return size >= 5 && size < 50;
    if (filter === 'large') return size >= 50 && size < 100;
    if (filter === 'xlarge') return size >= 100;
    return true;
  };

  const matchYear = (year: number, filter: string) => {
    if (filter === '2000-2005') return year >= 2000 && year <= 2005;
    if (filter === '2006-2010') return year >= 2006 && year <= 2010;
    if (filter === '2011-2015') return year >= 2011 && year <= 2015;
    if (filter === '2016-2020') return year >= 2016 && year <= 2020;
    if (filter === '2021-2025') return year >= 2021 && year <= 2025;
    return true;
  };

  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  // ------------------- User Statuses -------------------
  const loadUserGameStatuses = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('game_statuses')
        .select('game_id, status')
        .eq('user_id', user.id);

      if (data) {
        const statusMap: Record<string, string> = {};
        data.forEach(item => (statusMap[item.game_id] = item.status));
        setUserGameStatuses(statusMap);

        setStatusCounts({
          playing: data.filter(s => s.status === 'playing').length,
          played: data.filter(s => s.status === 'played').length,
          wishlist: data.filter(s => s.status === 'wishlist').length,
          dropped: data.filter(s => s.status === 'dropped').length,
        });
      }
    } catch (e) {
      console.error('Error loading statuses:', e);
    }
  };

  useEffect(() => {
    if (!user) setShowAuthModal(true);
    else loadUserGameStatuses();
  }, [user]);

  // ------------------- Tabs -------------------
  const handleTabChange = useCallback((tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const tabs = [
    { id: 'all', label: 'All Games', icon: null },
    { id: 'playing', label: 'Playing', icon: <Clock size={20} /> },
    { id: 'played', label: 'Played', icon: <CheckCircle size={20} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Star size={20} /> },
    { id: 'dropped', label: 'Dropped', icon: <XIcon size={20} /> },
  ];

  // ------------------- Trending Calculation -------------------
  const typedGamesLibrary = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return gamesLibrary.map(game => {
      const yearScore = Math.max(0, 10 - (currentYear - game.release_year));
      const trendingScore = (game.rating || 0) * 2 + yearScore;
      return { ...game, trending: trendingScore };
    }) as Game[];
  }, []);

  // ------------------- Sorting / Filtering -------------------
  const sortedGames = useMemo(() => {
    let games = [...typedGamesLibrary];

    // Tab filter
    if (activeTab !== 'all') {
      games = games.filter(game => userGameStatuses[game.id] === activeTab);
    }

    // Filters
    games = games.filter(game => {
      const genreMatch =
        filters.genre === 'all' ||
        game.genre?.some(g => g.toLowerCase() === filters.genre.toLowerCase());

      const sizeMatch =
        filters.size === 'all' ||
        matchSize(Number(game.size), filters.size);

      const devMatch =
        filters.developer === 'all' ||
        (Array.isArray(game.developer)
          ? game.developer.some(d => d.toLowerCase().includes(filters.developer.toLowerCase()))
          : (game.developer?.toString() || '').toLowerCase().includes(filters.developer.toLowerCase()));

      const yearMatch =
        filters.releaseYear === 'all' ||
        matchYear(Number(game.release_year), filters.releaseYear);

      const searchMatch =
        filters.searchQuery === '' ||
        game.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (Array.isArray(game.developer)
          ? game.developer.some(d => d.toLowerCase().includes(filters.searchQuery.toLowerCase()))
          : (game.developer?.toString() || '').toLowerCase().includes(filters.searchQuery.toLowerCase())) ||
        game.genre?.some(g => g.toLowerCase().includes(filters.searchQuery.toLowerCase()));

      return genreMatch && sizeMatch && devMatch && yearMatch && searchMatch;
    });

    // Sorting
    games.sort((a, b) => {
      let aValue: number | string = a[sortType as keyof Game];
      let bValue: number | string = b[sortType as keyof Game];

      if (sortType === 'trending') {
        aValue = (a as any).trending;
        bValue = (b as any).trending;
      }

      let comparison = sortType === 'title'
        ? String(aValue).localeCompare(String(bValue))
        : (aValue as number) - (bValue as number);

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return games;
  }, [typedGamesLibrary, activeTab, userGameStatuses, sortType, sortDirection, filters]);

  // ------------------- Pagination -------------------
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = sortedGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(sortedGames.length / gamesPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // ------------------- Developers / Filter Options -------------------
  const genres = ['all', 'action', 'adventure', 'rpg', 'shooter', 'strategy', 'sports', 'racing', 'horror', 'fantasy', 'multiplayer', 'survival', 'indie'];
  const sizes = ['all', 'small', 'medium', 'large', 'xlarge'];
  const years = ['all', '2000-2005', '2006-2010', '2011-2015', '2016-2020', '2021-2025'];
  const developers = [
    'all',
    ...Array.from(
      new Set(
        gamesLibrary.flatMap(g => (Array.isArray(g.developer) ? g.developer : [g.developer]))
      )
    ).filter(Boolean),
  ];

  // ------------------- UI Components -------------------
  const FilterSection = ({
    title,
    options,
    selected,
    onChange,
  }: {
    title: string;
    options: string[];
    selected: string;
    onChange: (v: string) => void;
  }) => (
    <div className="mb-6">
      <h3 className="text-gray-400 uppercase font-bold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selected === opt ? 'bg-red-600 text-white' : 'bg-[#333] text-gray-300 hover:bg-[#444]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const handleSortTypeCycle = () => {
    const sortOptions: SortKey[] = ['title', 'trending', 'release_year', 'popularity', 'rating'];
    const nextIndex = (sortOptions.indexOf(sortType) + 1) % sortOptions.length;
    setSortType(sortOptions[nextIndex]);
  };

  const selectedGameData = selectedGame ? typedGamesLibrary.find(g => g.id === selectedGame) : null;

  // ------------------- Render -------------------
  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-bold mb-4 text-white">Game Tracker</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Track your gaming journey and organize your collection
        </p>

        {/* Status Cards */}
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

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3 py-3 rounded-full font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Sort + Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <label className="text-gray-300 text-sm font-medium">Sort By:</label>
            <div
              onClick={handleSortTypeCycle}
              className="text-red-500 text-sm font-medium cursor-pointer transition-colors hover:text-red-400"
            >
              {sortType}
            </div>
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="text-gray-300 text-sm font-medium"
            >
              {sortDirection === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
            </button>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 bg-red-600 rounded-lg flex items-center gap-2 text-white"
          >
            <Filter size={18} /> Filter
          </button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
          {currentGames.length > 0 ? (
            currentGames.map(game => (
              <div key={game.id} className="w-full">
                <GameCard
                  game={game}
                  status={userGameStatuses[game.id]}
                  onClick={() => setSelectedGame(game.id)}
                  className="w-full"
                />
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-[#2a2a2a] rounded-xl col-span-full">
              <p className="text-xl text-gray-400">No games found matching your filters 😔</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
        )}

        {/* Modals */}
        {selectedGameData && (
          <GameDetail game={selectedGameData} onClose={() => setSelectedGame(null)} />
        )}
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-[300px] bg-[#1a1a1a] z-50 p-6 shadow-xl overflow-y-auto"
            >
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <XIcon size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-white text-center">Filters</h2>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={e => handleFilterChange('searchQuery', e.target.value)}
                placeholder="Search games..."
                className="w-full px-4 py-2 rounded-lg bg-[#2a2a2a] text-white mb-4"
              />
              <FilterSection
                title="Genre"
                options={genres}
                selected={filters.genre}
                onChange={v => handleFilterChange('genre', v)}
              />
              <FilterSection
                title="Size"
                options={sizes}
                selected={filters.size}
                onChange={v => handleFilterChange('size', v)}
              />
              <FilterSection
                title="Developer"
                options={developers}
                selected={filters.developer}
                onChange={v => handleFilterChange('developer', v)}
              />
              <FilterSection
                title="Release Year"
                options={years}
                selected={filters.releaseYear}
                onChange={v => handleFilterChange('releaseYear', v)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}