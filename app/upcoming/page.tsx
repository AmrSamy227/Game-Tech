'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getUpcomingGames } from "@/lib/upcomingGamesData";
import { Calendar, Play, Clock } from "lucide-react";

export default function UpcomingGamesPage() {
  const upcomingGames = getUpcomingGames();
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  // Sort games by release date
  const sortedGames = [...upcomingGames].sort((a, b) => {
    const dateA = a.release_date ? new Date(a.release_date).getTime() : Infinity;
    const dateB = b.release_date ? new Date(b.release_date).getTime() : Infinity;
    return dateA - dateB;
  });

  const formatReleaseDate = (dateString?: string) => {
    if (!dateString) return "TBA";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return "TBA";
    }
  };

  const getDaysUntilRelease = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const releaseDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      releaseDate.setHours(0, 0, 0, 0);
      const diffTime = releaseDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1b2838]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#1b2838] via-[#16202d] to-[#1b2838] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4">Upcoming Games</h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover the most anticipated games coming soon
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedGames.map((game) => {
            const daysUntil = getDaysUntilRelease(game.release_date);
            const isHovered = hoveredGame === game.id;
            
            return (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className="group relative bg-[#1e2329] rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                {/* Game Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-900">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Trailer Play Button */}
                  {game.trailer && (
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="bg-black/70 rounded-full p-4 backdrop-blur-sm">
                        <Play className="w-12 h-12 text-white" fill="white" />
                      </div>
                    </div>
                  )}

                  {/* Badge */}
                  {game.badge && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
                      {game.badge}
                    </div>
                  )}

                  {/* Days Until Release */}
                  {daysUntil && daysUntil > 0 && (
                    <div className="absolute top-2 right-2 bg-blue-600/90 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {daysUntil}d
                    </div>
                  )}
                </div>

                {/* Game Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
                    {game.title}
                  </h3>
                  
                  {/* Developer */}
                  <p className="text-sm text-gray-400 mb-3 line-clamp-1">
                    {Array.isArray(game.developer) ? game.developer.join(", ") : game.developer}
                  </p>

                  {/* Release Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span>{formatReleaseDate(game.release_date)}</span>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {game.genre.slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  {/* Screenshots Preview (4 thumbnails) */}
                  {game.screenshots && game.screenshots.length > 0 && (
                    <div className="grid grid-cols-4 gap-1 mt-3">
                      {game.screenshots.slice(0, 4).map((screenshot, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded overflow-hidden bg-gray-800"
                        >
                          <Image
                            src={screenshot}
                            alt={`${game.title} screenshot ${idx + 1}`}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 border-2 border-red-600 rounded-lg pointer-events-none transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {sortedGames.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No upcoming games found.</p>
        </div>
      )}
    </div>
  );
}

