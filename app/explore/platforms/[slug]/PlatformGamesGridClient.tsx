"use client";

import { useState } from "react";
import GameCard from '@/components/GameCard';
import { motion, AnimatePresence } from "framer-motion";
import Pagination from '@/components/Pagination';


export default function PlatformGamesGrid({ games }: { games: typeof import('@/lib/gamesData').gamesLibrary }) {
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 32;
  const totalPages = Math.ceil(games.length / gamesPerPage);

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
      >
        <AnimatePresence>
          {currentGames.map(game => (
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
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
    </>
  );
}
