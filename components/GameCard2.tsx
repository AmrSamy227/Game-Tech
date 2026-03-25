// src/app/components/GameCard.tsx (or wherever you placed it)

import React from 'react';
import Image from 'next/image';
import { Star, Clock, CheckCircle, X as XIcon } from 'lucide-react';

// Define the expected structure of a single game object
// This should align with the structure in '../../lib/gamesData'
interface Game {
  id: string;
  title: string;
  coverImage: string; // URL or path to the image
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

  // We use a fixed height and aspect-ratio-friendly image wrapper 
  // to mimic the grid layout from the image.
  return (
    <div 
      className="group relative rounded-lg overflow-hidden shadow-xl cursor-pointer transition-transform duration-300 transform hover:scale-[1.03] hover:shadow-red-600/50"
      onClick={onClick}
    >
      {/* Aspect Ratio Box to mimic the card shape */}
      <div className="w-full aspect-[2/3] relative">
        <Image
          src={game.coverImage}
          alt={game.title}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-500 group-hover:opacity-80"
          // Add a loading placeholder if you have one
        />
      </div>

      {/* Status Badge Overlay */}
      {gameStatus && (
        <div className={`absolute top-2 right-2 p-1 px-2 rounded-full text-white font-semibold text-xs flex items-center gap-1 z-10 ${gameStatus.color}`}>
          {gameStatus.icon}
          <span className="hidden md:inline">{gameStatus.label}</span>
        </div>
      )}

      {/* Hidden Overlay for hover effect / Title */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end p-3">
        <h3 className="text-white text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {game.title}
        </h3>
      </div>
    </div>
  );
};

export default GameCard;