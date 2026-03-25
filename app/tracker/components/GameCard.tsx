import React from 'react';
// import Image from 'next/image'; // Removed problematic import
import { Star, Clock, CheckCircle, X as XIcon } from 'lucide-react';

// Define the expected structure of a single game object
interface Game {
  id: string;
  title: string;
  banner: string; // URL to the game banner image
  // Add other properties you might need to display, like genre, rating, etc.
}

// Define the prop structure for GameCard
interface GameCardProps {
  game: Game;
  onClick: () => void;
  // Optional: Pass the game status from the parent component (GameTracker)
  status?: 'playing' | 'played' | 'wishlist' | 'dropped' | string;
}

const statusMap: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  playing: { icon: <Clock size={16} />, color: 'bg-yellow-600', label: 'Playing' },
  played: { icon: <CheckCircle size={16} />, color: 'bg-green-600', label: 'Played' },
  wishlist: { icon: <Star size={16} />, color: 'bg-blue-600', label: 'Wishlist' },
  dropped: { icon: <XIcon size={16} />, color: 'bg-red-600', label: 'Dropped' },
};

const GameCard: React.FC<GameCardProps> = ({ game, onClick, status }) => {
  const gameStatus = status && statusMap[status] ? statusMap[status] : null;

  return (
    <div 
      className="group relative rounded-lg overflow-hidden shadow-xl cursor-pointer transition-transform duration-300 transform hover:scale-[1.03] hover:shadow-red-600/50"
      onClick={onClick}
    >
      {/* Aspect Ratio Box to mimic the card shape */}
      <div className="w-full aspect-[2/3] relative">
        <img // UPDATED: Using standard <img> tag
          src={game.banner}
          alt={game.title}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-80"
          // In a standard React setup, you handle dimensions via CSS classes
        />
      </div>


      {/* Hidden Overlay for hover effect / Title and Status */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-end p-4">
        {gameStatus && (
          // This status badge is hidden by default and appears on hover
          <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full text-white ${gameStatus.color} shadow-lg`}>
              {gameStatus.label}
            </span>
          </div>
        )}
        <h3 className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {game.title}
        </h3>
      </div>
    </div>
  );
};

export default GameCard;