"use client";

import { useState } from "react";
import GameCard from "@/components/GameCard";
import { gamesLibrary } from "@/lib/gamesData";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function TopRated() {
  // Sort and filter by rating (highest first)
  const topRatedGames = gamesLibrary
    .filter((game) => game.rating >= 9.0)
    .sort((a, b) => b.rating - a.rating);

  const [games] = useState(topRatedGames);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYearRange, setSelectedYearRange] = useState("All");
  const [selectedDeveloper, setSelectedDeveloper] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState({
    genre: false,
    year: false,
    dev: false,
  });

  // 🎮 Popular Genres
  const popularGenres = [
    "All",
    "Action",
    "Adventure",
    "RPG",
    "Shooter",
    "Horror",
    "Interactive Drama",
    "Sports",
    "Racing",
  ];

  // 📅 Year Ranges
  const yearRanges = [
    { label: "All", min: 0, max: 9999 },
    { label: "2000–2005", min: 2000, max: 2005 },
    { label: "2006–2010", min: 2006, max: 2010 },
    { label: "2011–2015", min: 2011, max: 2015 },
    { label: "2016–2020", min: 2016, max: 2020 },
    { label: "2021–2025", min: 2021, max: 2025 },
  ];

  // 🧠 Unique Developers
  const developers = [
    "All",
    ...new Set(gamesLibrary.map((g) => g.developer).filter(Boolean)),
  ];

  // 🕹️ Filter Logic
  const filteredGames = games.filter((game) => {
    const matchGenre =
      selectedGenre === "All" || game.genre.includes(selectedGenre);

    const matchYearRange = yearRanges.find(
      (range) => range.label === selectedYearRange
    );
    const matchYear =
      selectedYearRange === "All" ||
      (game.release_year >= matchYearRange.min &&
        game.release_year <= matchYearRange.max);

    const matchDeveloper =
      selectedDeveloper === "All" || game.developer === selectedDeveloper;

    return matchGenre && matchYear && matchDeveloper;
  });

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white">
      {/* 🌄 Hero Section with Gradient Effect */}
      <div className="relative w-full">
        {/* Image Container */}
        <div className="relative w-full h-[280px] md:h-[350px] overflow-hidden">
          <Image
            src="https://i.redd.it/sr520hah2o541.jpg"
            alt="Top Rated Games"
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

          {/* Text overlay for desktop only */}
          <div className="hidden md:flex absolute inset-0 flex-col justify-center px-6 md:px-12 z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-2xl">
              Top Rated Games
            </h1>
            <p className="text-gray-200 text-base md:text-lg max-w-2xl drop-shadow-lg">
              Discover the highest-rated masterpieces loved by players around the
              world. Filter by genre, year, or developer to find your next
              favorite.
            </p>
          </div>

          {/* Bottom fade to content area */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1c1c1c] to-transparent pointer-events-none" />
        </div>

        {/* Text below image for mobile only */}
        <div className="md:hidden bg-[#1c1c1c] px-6 py-6">
          <h1 className="text-3xl font-bold mb-3 text-white">
            Top Rated Games
          </h1>
          <p className="text-gray-300 text-base">
            Discover the highest-rated masterpieces.
          </p>
        </div>
      </div>

      {/* 🧩 Page Content */}
      <div className="max-w-[1400px] mx-auto py-12 px-4">
        <p className="text-gray-400 mb-8 text-lg">
          Browse the highest-rated games (Rating 9.0+) —{" "}
          {filteredGames.length} found
        </p>

        {/* 🔥 Red modern dropdown filters */}
        <div className="flex flex-wrap gap-4 mb-10">
          {/* 🎮 Genre Filter */}
          <div className="relative">
            <button
              onClick={() =>
                setDropdownOpen((prev) => ({ ...prev, genre: !prev.genre }))
              }
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-md font-medium transition-all"
            >
              Genre: {selectedGenre}
              <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {dropdownOpen.genre && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 mt-2 w-44 bg-[#2a2a2a] border border-red-600 rounded-xl shadow-lg overflow-hidden"
                >
                  {popularGenres.map((genre) => (
                    <li
                      key={genre}
                      onClick={() => {
                        setSelectedGenre(genre);
                        setDropdownOpen({ ...dropdownOpen, genre: false });
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-red-600 hover:text-white transition-all ${
                        selectedGenre === genre
                          ? "bg-red-700 text-white"
                          : "text-gray-300"
                      }`}
                    >
                      {genre}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* 📅 Year Range Filter */}
          <div className="relative">
            <button
              onClick={() =>
                setDropdownOpen((prev) => ({ ...prev, year: !prev.year }))
              }
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-md font-medium transition-all"
            >
              Year: {selectedYearRange}
              <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {dropdownOpen.year && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 mt-2 w-44 bg-[#2a2a2a] border border-red-600 rounded-xl shadow-lg overflow-hidden"
                >
                  {yearRanges.map((range) => (
                    <li
                      key={range.label}
                      onClick={() => {
                        setSelectedYearRange(range.label);
                        setDropdownOpen({ ...dropdownOpen, year: false });
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-red-600 hover:text-white transition-all ${
                        selectedYearRange === range.label
                          ? "bg-red-700 text-white"
                          : "text-gray-300"
                      }`}
                    >
                      {range.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* 👨‍💻 Developer Filter */}
          <div className="relative">
            <button
              onClick={() =>
                setDropdownOpen((prev) => ({ ...prev, dev: !prev.dev }))
              }
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-md font-medium transition-all"
            >
              Developer: {selectedDeveloper}
              <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {dropdownOpen.dev && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 mt-2 w-56 bg-[#2a2a2a] border border-red-600 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                >
                  {developers.map((dev) => (
                    <li
                      key={dev}
                      onClick={() => {
                        setSelectedDeveloper(dev);
                        setDropdownOpen({ ...dropdownOpen, dev: false });
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-red-600 hover:text-white transition-all ${
                        selectedDeveloper === dev
                          ? "bg-red-700 text-white"
                          : "text-gray-300"
                      }`}
                    >
                      {dev}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 🎮 Responsive Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
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
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <GameCard game={game} />
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-bold">{game.rating}</span>
                  <span className="text-gray-400 text-sm">/ 10</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}