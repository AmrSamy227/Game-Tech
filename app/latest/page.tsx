"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameCard from "@/components/GameCard";
import { gamesLibrary } from "@/lib/gamesData";
import Image from "next/image";

export default function LatestReleases() {
  const latestGames = gamesLibrary
    .filter((game) => game.release_year >= 2023)
    .sort((a, b) => b.release_year - a.release_year);

  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const genres = ["All", "Action", "Adventure", "RPG", "Racing", "Shooter"];
  const platforms = ["All", "PC", "PS5", "Xbox Series X|S", "Nintendo Switch"];
  const sortOptions = ["Newest", "Oldest", "Rating", "A-Z"];

  const filteredGames = latestGames
    .filter((game) =>
      selectedGenre === "All" ? true : game.genre.includes(selectedGenre)
    )
    .filter((game) =>
      selectedPlatform === "All"
        ? true
        : game.platforms.includes(selectedPlatform)
    )
    .sort((a, b) => {
      if (sortOption === "Newest") return b.release_year - a.release_year;
      if (sortOption === "Oldest") return a.release_year - b.release_year;
      if (sortOption === "Rating") return b.rating - a.rating;
      if (sortOption === "A-Z") return a.title.localeCompare(b.title);
      return 0;
    });

  const Dropdown = ({
    label,
    options,
    selected,
    onSelect,
  }: {
    label: string;
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
  }) => (
    <div className="relative">
      <button
        onClick={() =>
          setOpenMenu(openMenu === label ? null : label)
        }
        className={`flex items-center justify-between min-w-[160px] px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border border-red-600 hover:bg-red-600/20 transition-all duration-200 ${
          openMenu === label ? "ring-2 ring-red-600" : ""
        }`}
      >
        {selected}
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            openMenu === label ? "rotate-180 text-red-500" : "rotate-0 text-gray-400"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {openMenu === label && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-full bg-[#1e1e1e] border border-red-600 rounded-lg shadow-xl z-20 overflow-hidden"
          >
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setOpenMenu(null);
                }}
                className={`px-4 py-2 cursor-pointer transition-all duration-200 ${
                  selected === opt
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-red-600/20 hover:text-white"
                }`}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white">
      {/* HERO SECTION */}
      <section className="relative w-full">
        {/* Image Container */}
        <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
          {/* Background Image */}
          <Image
            src="https://i.ytimg.com/vi/56mbauSON90/maxresdefault.jpg"
            alt="Latest Releases"
            fill
            className="object-cover object-top"
            priority
          />

          {/* Gradient Overlay - Same as Home Page */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(28,28,28,0.95))",
            }}
          />

          {/* Text Content for Desktop */}
          <div className="hidden md:flex absolute inset-0 items-center px-6 md:px-12 z-10">
            <div className="max-w-[700px]">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-2xl">
                Latest Releases
                <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
              </h1>
              <p className="text-gray-200 text-base md:text-lg drop-shadow-lg">
                Explore the latest releases from 2023 and beyond
              </p>
            </div>
          </div>

          {/* Bottom fade to content area */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1c1c1c] to-transparent pointer-events-none" />
        </div>

        {/* Text below image for Mobile */}
        <div className="md:hidden bg-[#1c1c1c] px-6 py-6">
          <h1 className="text-3xl font-bold mb-3 text-white">
            Latest Releases
            <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
          </h1>
          <p className="text-gray-300 text-base">
            Explore the latest releases from 2023 and beyond
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto py-12 px-4">
        <p className="text-gray-400 mb-8 text-lg">
          {filteredGames.length} games found
        </p>

        {/* 🎮 Modern Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-10 relative z-10">
          <Dropdown
            label="Genre"
            options={genres}
            selected={selectedGenre}
            onSelect={setSelectedGenre}
          />
          <Dropdown
            label="Platform"
            options={platforms}
            selected={selectedPlatform}
            onSelect={setSelectedPlatform}
          />
          <Dropdown
            label="Sort"
            options={sortOptions}
            selected={sortOption}
            onSelect={setSortOption}
          />
        </div>

        {/* 🧩 Animated Game Grid */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-4 text-white">
              No games found
            </h3>
            <p className="text-gray-400">Try adjusting your filters.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="
              grid 
              grid-cols-2 
              sm:grid-cols-3 
              md:grid-cols-4 
              lg:grid-cols-3 
              xl:grid-cols-4 
              2xl:grid-cols-5 
              gap-3 
              sm:gap-4 
              md:gap-6 
              lg:gap-8
            "
          >
            <AnimatePresence>
              {filteredGames.map((game) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="transform hover:scale-105 transition-transform duration-200 lg:scale-110"
                >
                  <GameCard game={game} />
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-red-600 text-sm font-semibold">
                      {game.release_year}
                    </span>
                    {game.badge && (
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        {game.badge}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}