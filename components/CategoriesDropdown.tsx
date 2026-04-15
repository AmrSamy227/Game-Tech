"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Gamepad2, TrendingUp, Grid3x3, ExternalLink } from "lucide-react";
import { gamesLibrary } from "@/lib/gamesData";

export default function CategoriesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [gradientMap, setGradientMap] = useState<Record<string, { from: string; to: string }>>({});

  const genreCount = useMemo(() => {
    const map: Record<string, number> = {};
    gamesLibrary.forEach((game) => {
      game.genre?.forEach((g) => {
        const key = g.trim();
        map[key] = (map[key] || 0) + 1;
      });
    });
    return map;
  }, []);

  const bigGenres = useMemo(() => {
    return Object.entries(genreCount).filter(([_, count]) => count >= 8).map(([genre]) => genre);
  }, [genreCount]);

  const { popularTags, allGenres } = useMemo(() => {
    const sorted = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .map(([genre]) => genre);
    return {
      popularTags: sorted.slice(0, 12),
      allGenres: sorted,
    };
  }, [genreCount]);

  const displayedGenres = expanded ? allGenres : allGenres.slice(0, 12);

// Tailwind-style gradient classes
const GENRE_COLORS = [
  "from-red-600 to-red-800",
  "from-orange-600 to-orange-800",
  "from-amber-600 to-amber-800",
  "from-cyan-600 to-cyan-800",
  "from-purple-600 to-purple-800",
  "from-pink-600 to-pink-800",
];

// Map Tailwind classes to actual RGB for inline gradient
const gradientMapRGB: Record<string, { from: string; to: string }> = {
  "from-red-600 to-red-800": { from: "rgb(220, 38, 38)", to: "rgb(127, 29, 29)" },
  "from-orange-600 to-orange-800": { from: "rgb(234, 88, 12)", to: "rgb(124, 45, 18)" },
  "from-amber-600 to-amber-800": { from: "rgb(217, 119, 6)", to: "rgb(120, 53, 15)" },
  "from-cyan-600 to-cyan-800": { from: "rgb(34, 211, 238)", to: "rgb(30, 144, 180)" },
  "from-purple-600 to-purple-800": { from: "rgb(147, 51, 234)", to: "rgb(88, 28, 135)" },
  "from-pink-600 to-pink-800": { from: "rgb(236, 72, 153)", to: "rgb(157, 23, 77)" },
};

const generateRandomTopGenres = () => {
  const shuffled = [...bigGenres].sort(() => Math.random() - 0.5).slice(0, 6);
  setTopGenres(shuffled);

  const newGradientMap: Record<string, { from: string; to: string }> = {};
  shuffled.forEach((genre, idx) => {
    const gradientClass = GENRE_COLORS[idx % GENRE_COLORS.length];
    newGradientMap[genre] = gradientMapRGB[gradientClass];
  });

  setGradientMap(newGradientMap);
};

  const toggleDropdown = () => {
    if (!isOpen) generateRandomTopGenres();
    setIsOpen(!isOpen);
  };

  const getGenreBanners = (genre: string) => {
    return gamesLibrary
      .filter((game) => game.genre?.includes(genre))
      .slice(0, 5)
      .map((game) => game.banner);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-red-900/50 font-bold hover:text-red-600 transition-colors relative group flex items-center gap-1"
      >
        Categories
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all"></span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="fixed left-0 right-0 top-35 w-full max-h-[80vh] overflow-y-auto bg-gray-900/30 backdrop-blur-xl border-t-4 border-red-600 shadow-2xl z-50 border border-white/20">
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

              {/* Top Random Genres */}
              {topGenres.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Gamepad2 size={16} className="text-red-600" />
                    <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">
                      Your Top Categories
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {topGenres.map((genre) => {
                      const listGameImages = getGenreBanners(genre);
                      const colors = gradientMap[genre] || gradientMapRGB[0];

                      return (
                        <Link
                          key={genre}
                          href={`/explore/genres/${genre.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => setIsOpen(false)}
                          className="relative overflow-hidden rounded-lg group/card h-28 flex items-center justify-center cursor-pointer"
                        >
                          {/* Collage */}
                          <div className="absolute inset-0 flex">
                            {listGameImages.map((banner, imageIdx) => (
                              <div
                                key={imageIdx}
                                className="flex-1 h-full relative overflow-hidden"
                                style={{
                                  clipPath:
                                    imageIdx === 0
                                      ? "polygon(0 0, 85% 0, 70% 100%, 0 100%)"
                                      : imageIdx === listGameImages.length - 1
                                      ? "polygon(30% 0, 100% 0, 100% 100%, 15% 100%)"
                                      : "polygon(30% 0, 85% 0, 70% 100%, 15% 100%)",
                                  marginLeft: imageIdx > 0 ? "-15%" : "0",
                                }}
                              >
                                {banner && (
                                  <Image
                                    src={banner}
                                    alt={genre}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="opacity-80 group-hover/card:opacity-100 transition-all duration-300"
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Gradient Overlay */}
                          <div
                            className="absolute inset-0 opacity-100 group-hover/card:opacity-0 transition-opacity duration-[800ms] ease-out"
                            style={{
                              backgroundImage: `linear-gradient(135deg, transparent 10%, ${colors.from} 80%, ${colors.to} 100%)`,
                            }}
                          />

                          {/* Genre Label */}
                          <div className="relative z-10 flex items-center justify-center transition-all duration-[800ms] ease-out group-hover/card:translate-y-8">
                            <span className="text-black font-bold text-center text-sm px-3 py-1.5 bg-white/95 rounded shadow-lg transition-all duration-[800ms] ease-out group-hover/card:text-xs">
                              {genre.toUpperCase()}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-red-600" />
                      <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Popular Tags</h3>
                    </div>

                    <Link
                      href="/explore/genres"
                      onClick={() => setIsOpen(false)}
                      className="text-red-600 hover:text-red-500 text-xs font-bold flex items-center gap-1 transition-colors hover:gap-2"
                    >
                      View all tags <ExternalLink size={12} />
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((genre) => (
                      <Link
                        key={genre}
                        href={`/explore/genres/${genre.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-xs font-semibold text-gray-300 bg-gray-800/50 backdrop-blur-md hover:bg-red-600/70 hover:text-white transition-all rounded-full border border-white/20 hover:scale-105"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All Genres */}
              {allGenres.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Grid3x3 size={16} className="text-red-600" />
                      <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">All Genres & Themes</h3>
                    </div>

                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-red-600 hover:text-red-500 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {expanded ? "Collapse" : "Expand"}
                      <ChevronDown size={12} className={`transition-transform ${expanded ? "" : "rotate-180"}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-3">
                    {displayedGenres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/explore/genres/${genre.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setIsOpen(false)}
                        className="text-xs text-gray-300 hover:text-red-600 transition-colors hover:translate-x-1 transform"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
