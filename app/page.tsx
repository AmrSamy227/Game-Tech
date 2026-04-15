"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GameCard from '@/components/GameCard';
import { gamesLibrary } from '@/lib/gamesData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- Calculate trending games based on rating + release_year ---
  const currentYear = new Date().getFullYear();
  const trendingGames = [...gamesLibrary]
    .map((game) => {
      const yearScore = Math.max(0, 10 - (currentYear - game.release_year)); // newer games score higher
      const trendingScore = (game.rating * 2) + yearScore; // combine rating + recency
      return { ...game, trendingScore };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 8);

  // --- Recommended & Most Downloaded (static slices for now) ---
  const recommendedGames = gamesLibrary.slice(8, 16);
  const mostDownloadedGames = gamesLibrary.slice(16, 24);

  // --- Featured Games (Hero Carousel) ---
  const defaultFeaturedIds = [1, 2, 3, 4, 5]; // replace with actual IDs
  const [featuredGames, setFeaturedGames] = useState(() =>
    gamesLibrary.filter((game) => defaultFeaturedIds.includes(game.id))
  );

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      localStorage.setItem("hasVisited", "true");
    } else {
      const randomFive = [...gamesLibrary].sort(() => Math.random() - 0.5).slice(0, 5);
      setFeaturedGames(randomFive);
    }
  }, []);

  // Carousel navigation
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (featuredGames.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  return (
    <div className="min-h-screen bg-[#1c1c1c]">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] bg-gray-900 overflow-hidden">
        {featuredGames.map((game, index) => (
          <div
            key={game.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(28,28,28,0.95)), url(${game.background || game.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        <div className="relative h-full flex flex-col justify-end pb-12 md:pb-20 px-4 md:px-12 z-10">
          {featuredGames.length > 0 && (
            <div className="mb-6 md:mb-8 max-w-2xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                {featuredGames[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-6 drop-shadow-lg">
                {featuredGames[currentSlide].description}
              </p>
              <Link
                href={`/game/${featuredGames[currentSlide].id}`}
                className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all hover:scale-105 shadow-2xl inline-block"
              >
                View Game
              </Link>
            </div>
          )}

          {/* Thumbnail Navigation */}
          <div className="flex items-center gap-3 md:gap-4 max-w-6xl select-none">
            <button
              onClick={prevSlide}
              className="bg-black/50 hover:bg-black/70 p-2 md:p-3 rounded-full transition-all z-20"
            >
              <ChevronLeft size={20} className="text-white md:w-6 md:h-6" />
            </button>

            <div
              className="flex gap-3 md:gap-4 flex-1 overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onWheel={(e) => {
                e.currentTarget.scrollLeft += e.deltaY;
                e.preventDefault();
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {featuredGames.map((game, index) => (
                <button
                  key={game.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative flex-shrink-0 w-36 h-20 md:w-48 md:h-28 rounded-lg overflow-hidden transition-all ${
                    index === currentSlide
                      ? "ring-4 ring-red-600 scale-105"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2 md:p-3">
                    <span className="text-white text-xs md:text-sm font-semibold truncate">
                      {game.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="bg-black/50 hover:bg-black/70 p-2 md:p-3 rounded-full transition-all z-20"
            >
              <ChevronRight size={20} className="text-white md:w-6 md:h-6" />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 mt-4 md:mt-6 justify-center md:justify-start">
            {featuredGames.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentSlide ? "bg-red-600 w-12" : "bg-white/30 w-8"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1c1c1c] to-transparent pointer-events-none" />
      </section>

      {/* Trending Now Section */}
      <section className="py-8 px-4 max-w-[1400px] mx-auto">
        <h3 className="text-3xl font-bold mb-6 relative inline-block slide-in text-white">
          Trending Now{' '}
          <span className="absolute -bottom-2 left-0 w-12 h-1 bg-red-600 rounded"></span>
        </h3>
        <div className="overflow-x-auto pb-4 scrollbar-custom">
          <div className="flex gap-6 min-w-min">
            {trendingGames.map((game) => (
              <div key={game.id} className="flex-shrink-0 w-[252px] fade-in">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            href="/games"
            className="bg-[#ff2d20] hover:bg-[#ff1a1a] text-white px-6 py-3 rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 inline-block pulse"
          >
            View All Games
          </Link>
        </div>
      </section>

      {/* Recommended For You Section */}
      <section className="py-8 px-4 max-w-[1400px] mx-auto">
        <h3 className="text-3xl font-bold mb-6 relative inline-block slide-in text-white">
          Recommended For You{' '}
          <span className="absolute -bottom-2 left-0 w-12 h-1 bg-red-600 rounded"></span>
        </h3>
        <div className="overflow-x-auto pb-4 scrollbar-custom">
          <div className="flex gap-6 min-w-min">
            {recommendedGames.map((game) => (
              <div key={game.id} className="flex-shrink-0 w-[252px] fade-in">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            href="/games"
            className="bg-[#ff2d20] hover:bg-[#ff1a1a] text-white px-6 py-3 rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 inline-block pulse"
          >
            View All Games
          </Link>
        </div>
      </section>

      {/* Most Downloaded Games Section */}
      <section className="py-8 px-4 max-w-[1400px] mx-auto">
        <h3 className="text-3xl font-bold mb-6 relative inline-block slide-in text-white">
          Most Downloaded Games{' '}
          <span className="absolute -bottom-2 left-0 w-12 h-1 bg-red-600 rounded"></span>
        </h3>
        <div className="overflow-x-auto pb-4 scrollbar-custom">
          <div className="flex gap-6 min-w-min">
            {mostDownloadedGames.map((game) => (
              <div key={game.id} className="flex-shrink-0 w-[252px] fade-in">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            href="/games"
            className="bg-[#ff2d20] hover:bg-[#ff1a1a] text-white px-6 py-3 rounded-full font-bold transition-all hover:shadow-lg hover:-translate-y-1 inline-block pulse"
          >
            View All Games
          </Link>
        </div>
      </section>

      {/* CTA Section */}
<section
  className="py-24 px-4 text-center my-15 fade-in"
  style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://wallpaperaccess.com/full/3645178.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="max-w-3xl mx-auto">
    <h2 className="text-5xl font-bold mb-6 text-white">Explore our catalogue</h2>

    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
      There are a lot of games waiting for you to explore. Browse by genre, features, size, and more to find your next favorite game.
    </p>

    <div className="flex flex-col sm:flex-row justify-center gap-4">
      {/* Existing Button */}
      <Link
        href="/games"
        className="inline-block bg-[#ff2d20] hover:bg-[#ff1a1a] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-1"
      >
        See all games
      </Link>

      {/* New Explore Button */}
      <Link
        href="/explore"
        className="inline-block bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-1 border border-white/40"
      >
        Explore
      </Link>
    </div>
  </div>
</section>

    </div>
  );
}
