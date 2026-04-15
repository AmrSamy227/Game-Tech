"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameCard from "@/components/GameCard";
import { gamesLibrary } from "@/lib/gamesData";
import Image from "next/image";

export default function PopularGames() {
  // 🎮 Filter games with POPULAR, HOT, or BEST badges
  const popularGames = gamesLibrary.filter(
    (game) =>
      game.badge === "POPULAR" ||
      game.badge === "HOT" ||
      game.badge === "BEST"
  );

  const [selectedRange, setSelectedRange] = useState("All");

  // 🕹️ Year Ranges
  const yearRanges = [
    { label: "All", min: 0, max: Infinity },
    { label: "2000 - 2005", min: 2000, max: 2005 },
    { label: "2006 - 2010", min: 2006, max: 2010 },
    { label: "2011 - 2015", min: 2011, max: 2015 },
    { label: "2016 - 2020", min: 2016, max: 2020 },
    { label: "2021 - 2025", min: 2021, max: 2025 },
  ];

  // 🧩 Filter games by selected range
  const filteredGames =
    selectedRange === "All"
      ? popularGames
      : popularGames.filter((game) => {
          const range = yearRanges.find((r) => r.label === selectedRange);
          return game.release_year >= range.min && game.release_year <= range.max;
        });

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white">
      {/* HERO SECTION */}
      <section className="relative w-full">
        {/* Image Container */}
        <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
          {/* Background Image */}
          <Image
            src="assets/1763051489619.webp"
            alt="Popular Games"
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
              <motion.h1
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-2xl"
              >
                Popular Games
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-gray-200 text-base md:text-lg drop-shadow-lg"
              >
                Explore the most popular, best-selling, and trending games loved by players worldwide.
              </motion.p>
            </div>
          </div>

          {/* Bottom fade to content area */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1c1c1c] to-transparent pointer-events-none" />
        </div>

        {/* Text below image for Mobile */}
        <div className="md:hidden bg-[#1c1c1c] px-6 py-6">
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold mb-3 text-white"
          >
            Popular Games
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-300 text-base"
          >
            Explore the most popular, best-selling, and trending games loved by players worldwide.
          </motion.p>
        </div>
      </section>

      {/* 🕹️ MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-8">
        <p className="text-gray-400 mb-8 text-lg">
          Showing {filteredGames.length} popular games
        </p>

        {/* 🎮 Year Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          {yearRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => setSelectedRange(range.label)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedRange === range.label
                  ? "bg-red-600 text-white scale-105"
                  : "bg-gray-800 text-gray-300 hover:bg-red-500 hover:text-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* 🧩 Game Grid */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-4 text-white">
              No popular games found
            </h3>
            <p className="text-gray-400">Try another year range.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
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
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}