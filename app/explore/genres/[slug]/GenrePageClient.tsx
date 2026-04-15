"use client";

import { useState, useEffect } from "react";
import GameCard from "@/components/GameCard";
import { motion, AnimatePresence } from "framer-motion";

export default function GenrePageClient({
  genreName,
  allGamesInGenre,
}: {
  genreName: string;
  allGamesInGenre: typeof import('@/lib/gamesData').gamesLibrary;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const gamesPerPage = 32;

  // ---- RESPONSIVE ----
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---- PAGINATION ----
  const totalPages = Math.ceil(allGamesInGenre.length / gamesPerPage);
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = allGamesInGenre.slice(indexOfFirstGame, indexOfLastGame);
  const paginate = (num: number) => setCurrentPage(num);

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-white slide-in">
          {genreName} Games
          <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          {allGamesInGenre.length} {allGamesInGenre.length === 1 ? 'game' : 'games'} found
        </p>

        {allGamesInGenre.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-4 text-white">No games found</h3>
            <p className="text-gray-400">Check our full catalog</p>
          </div>
        ) : (
          <motion.div
  key={currentPage} // <-- triggers animation on page change
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
>
  <AnimatePresence>
    {currentGames.map((game) => (
      <motion.div
        key={game.id}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <GameCard game={game} />
      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>
        )}

        {/* Pagination */}
        <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
      </div>
    </div>
  );
}

// ---- Pagination Component ----
const Pagination = ({ totalPages, currentPage, paginate }: { totalPages: number; currentPage: number; paginate: (num: number) => void }) => (
  <div className="flex justify-center mt-8">
    <div className="flex items-center gap-2 flex-wrap justify-center max-w-full overflow-x-auto px-2 sm:px-0">
      <button onClick={() => paginate(1)} disabled={currentPage === 1} className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${currentPage === 1 ? "bg-[#222] text-gray-500 cursor-not-allowed" : "bg-[#333] text-gray-300 hover:bg-[#444]"}`}>«</button>
      <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${currentPage === 1 ? "bg-[#222] text-gray-500 cursor-not-allowed" : "bg-[#333] text-gray-300 hover:bg-[#444]"}`}>‹</button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button key={num} onClick={() => paginate(num)} className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${currentPage === num ? "bg-red-600 text-white" : "bg-[#333] text-gray-300 hover:bg-[#444]"}`}>{num}</button>
      ))}
      <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${currentPage === totalPages ? "bg-[#222] text-gray-500 cursor-not-allowed" : "bg-[#333] text-gray-300 hover:bg-[#444]"}`}>›</button>
      <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${currentPage === totalPages ? "bg-[#222] text-gray-500 cursor-not-allowed" : "bg-[#333] text-gray-300 hover:bg-[#444]"}`}>»</button>
    </div>
  </div>
);
