"use client"

import { useState, useEffect } from "react"
import GameCard from "@/components/GameCard"
import { gamesLibrary } from "@/lib/gamesData"
import { Filter, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function AllGamesPage() {
  const [filteredGames, setFilteredGames] = useState(gamesLibrary)
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedSize, setSelectedSize] = useState("size-all")
  const [selectedDeveloper, setSelectedDeveloper] = useState("all")
  const [selectedYear, setSelectedYear] = useState("year-all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const gamesPerPage = 32

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const developerMatches = (gameDeveloper: string | string[], selectedDev: string): boolean => {
    if (selectedDev === "all") return true
    if (Array.isArray(gameDeveloper)) {
      return gameDeveloper.some((dev) => dev === selectedDev)
    }
    return gameDeveloper === selectedDev
  }

  const developerIncludesQuery = (gameDeveloper: string | string[], query: string): boolean => {
    const lowerQuery = query.toLowerCase()
    if (Array.isArray(gameDeveloper)) {
      return gameDeveloper.some((dev) => dev.toLowerCase().includes(lowerQuery))
    }
    return gameDeveloper.toLowerCase().includes(lowerQuery)
  }

  const genres = [
    "all",
    "action",
    "adventure",
    "rpg",
    "shooter",
    "strategy",
    "sports",
    "racing",
    "horror",
    "fantasy",
    "Interactive Drama",
    "multiplayer",
    "survival",
    "open world",
    "FPS",
    "co-op",
    "indie",
  ]

  const sizes = [
    { id: "size-all", label: "All", count: gamesLibrary.length },
    { id: "size-small", label: "Under 5GB", count: gamesLibrary.filter((g) => Number.parseFloat(g.size) < 5).length },
    {
      id: "size-medium",
      label: "5GB - 50GB",
      count: gamesLibrary.filter((g) => Number.parseFloat(g.size) >= 5 && Number.parseFloat(g.size) < 50).length,
    },
    {
      id: "size-large",
      label: "50GB - 100GB",
      count: gamesLibrary.filter((g) => Number.parseFloat(g.size) >= 50 && Number.parseFloat(g.size) < 100).length,
    },
    {
      id: "size-xlarge",
      label: "Over 100GB",
      count: gamesLibrary.filter((g) => Number.parseFloat(g.size) >= 100).length,
    },
  ]

  const yearRanges = [
    { id: "year-all", label: "All Years" },
    { id: "year-2000-2005", label: "2000 - 2005" },
    { id: "year-2006-2010", label: "2006 - 2010" },
    { id: "year-2011-2015", label: "2011 - 2015" },
    { id: "year-2016-2020", label: "2016 - 2020" },
    { id: "year-2021-2025", label: "2021 - 2025" },
  ]

  const developers = [
    "all",
    ...Array.from(
      new Set(gamesLibrary.flatMap((game) => (Array.isArray(game.developer) ? game.developer : [game.developer]))),
    ).filter((dev) => {
      const devGameCount = gamesLibrary.filter((game) => developerMatches(game.developer, dev)).length
      return devGameCount >= 3
    }),
  ]

  const applyFilters = (genre: string, size: string, developer: string, year: string, query: string) => {
    let filtered = [...gamesLibrary]

    if (genre !== "all") {
      filtered = filtered.filter((game) => game.genre.some((g) => g.toLowerCase() === genre.toLowerCase()))
    }

    if (size !== "size-all") {
      filtered = filtered.filter((game) => {
        const sizeInGB = Number.parseFloat(game.size)
        if (size === "size-small") return sizeInGB < 5
        if (size === "size-medium") return sizeInGB >= 5 && sizeInGB < 50
        if (size === "size-large") return sizeInGB >= 50 && sizeInGB < 100
        if (size === "size-xlarge") return sizeInGB >= 100
        return true
      })
    }

    if (developer !== "all") {
      filtered = filtered.filter((game) => developerMatches(game.developer, developer))
    }

    if (year !== "year-all") {
      filtered = filtered.filter((game) => {
        const y = Number.parseInt(String(game.release_year))
        if (year === "year-2000-2005") return y >= 2000 && y <= 2005
        if (year === "year-2006-2010") return y >= 2006 && y <= 2010
        if (year === "year-2011-2015") return y >= 2011 && y <= 2015
        if (year === "year-2016-2020") return y >= 2016 && y <= 2020
        if (year === "year-2021-2025") return y >= 2021 && y <= 2025
        return true
      })
    }

    if (query.trim()) {
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(query.toLowerCase()) ||
          developerIncludesQuery(game.developer, query) ||
          game.genre.some((g) => g.toLowerCase().includes(query.toLowerCase())),
      )
    }

    setFilteredGames(filtered)
    setCurrentPage(1)
  }

  const handleFilterChange = (type: string, value: string) => {
    if (type === "genre") setSelectedGenre(value)
    if (type === "size") setSelectedSize(value)
    if (type === "developer") setSelectedDeveloper(value)
    if (type === "year") setSelectedYear(value)

    applyFilters(
      type === "genre" ? value : selectedGenre,
      type === "size" ? value : selectedSize,
      type === "developer" ? value : selectedDeveloper,
      type === "year" ? value : selectedYear,
      searchQuery,
    )
  }

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage)
  const indexOfLastGame = currentPage * gamesPerPage
  const indexOfFirstGame = indexOfLastGame - gamesPerPage
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i)
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
      }
    }
    return pages
  }

  const FilterSection = ({ title, options, selected, onChange }: { title: string; options: string[]; selected: string; onChange: (value: string) => void }) => (
    <div className="bg-[#111] p-6 rounded-xl mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-400" />
        <h3 className="text-sm uppercase font-bold text-gray-400">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selected === opt || selected === opt.id
                ? "bg-red-600 text-white"
                : "bg-[#333] text-gray-300 hover:bg-[#444]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )

  const FilterContent = () => (
    <>
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            applyFilters(selectedGenre, selectedSize, selectedDeveloper, selectedYear, e.target.value)
          }}
          placeholder="Search games..."
          className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white border border-[#1c1c1c] focus:outline-none focus:border-red-600"
        />
      </div>

      <FilterSection
        title="Category"
        options={genres}
        selected={selectedGenre}
        onChange={(val) => handleFilterChange("genre", val)}
      />
      <FilterSection
        title="Release Year"
        options={yearRanges.map((y) => y.label)}
        selected={yearRanges.find((y) => y.id === selectedYear)?.label}
        onChange={(val) => {
          const selected = yearRanges.find((y) => y.label === val)
          handleFilterChange("year", selected.id)
        }}
      />
      <FilterSection
        title="Developer"
        options={developers}
        selected={selectedDeveloper}
        onChange={(val) => handleFilterChange("developer", val)}
      />
      
    </>
  )

  return (
    <div className="min-h-screen bg-[#1c1c1c]">
      {/* Hero Section with Gradient Effect */}
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[300px] md:h-[400px]">
          <Image
            src="https://wallpaperaccess.com/full/3645178.jpg"
            alt="Premium Games Collection"
            fill
            className="object-cover object-center"
            priority
          />
          
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(28,28,28,0.95))",
            }}
          />

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-6 max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
                Premium Games Collection
              </h1>
              <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg">
                Discover the ultimate collection of PC games. From action-packed adventures to immersive RPGs, find your next favorite game.
              </p>
            </div>
          </div>

          {/* Bottom fade to content area */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1c1c1c] to-transparent pointer-events-none" />
        </div>
      </div>

      

      <div className="max-w-7xl mx-auto px-4 sm:px-0 py-8">
        {isMobile && (
          <div className="flex justify-between items-center mb-4 gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                applyFilters(selectedGenre, selectedSize, selectedDeveloper, selectedYear, e.target.value)
              }}
              placeholder="Search games..."
              className="flex-1 px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-[#1c1c1c] focus:outline-none focus:border-red-600 text-sm"
            />
            <button
              onClick={() => setShowFilters(true)}
              className="bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 text-white whitespace-nowrap"
            >
              <Filter size={18} /> Filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {!isMobile && <div className="lg:col-span-1">{FilterContent()}</div>}

          <div className="lg:col-span-3">
            <div className="mb-4 text-gray-400">
              Showing {filteredGames.length} of {gamesLibrary.length} games
            </div>

            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="
                grid 
                grid-cols-2 
                sm:grid-cols-3 
                md:grid-cols-4 
                lg:grid-cols-3 
                xl:grid-cols-4 
                2xl:grid-cols-4
                gap-3 
                sm:gap-4 
                md:gap-6 
                lg:gap-8
              "
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
                    className="
                      transform 
                      hover:scale-105 
                      transition-transform 
                      duration-200 
                      lg:scale-110
                    "
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2 flex-wrap justify-center max-w-full">
                {/* First Page */}
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
                    currentPage === 1
                      ? "bg-[#222] text-gray-500 cursor-not-allowed"
                      : "bg-[#333] text-gray-300 hover:bg-[#444]"
                  }`}
                >
                  «
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
                    currentPage === 1
                      ? "bg-[#222] text-gray-500 cursor-not-allowed"
                      : "bg-[#333] text-gray-300 hover:bg-[#444]"
                  }`}
                >
                  ‹
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {getPageNumbers().map((num) => (
                    <button
                      key={num}
                      onClick={() => paginate(num)}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
                        currentPage === num ? "bg-red-600 text-white" : "bg-[#333] text-gray-300 hover:bg-[#444]"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Next Page */}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
                    currentPage === totalPages
                      ? "bg-[#222] text-gray-500 cursor-not-allowed"
                      : "bg-[#333] text-gray-300 hover:bg-[#444]"
                  }`}
                >
                  ›
                </button>

                {/* Last Page */}
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
                    currentPage === totalPages
                      ? "bg-[#222] text-gray-500 cursor-not-allowed"
                      : "bg-[#333] text-gray-300 hover:bg-[#444]"
                  }`}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1a1a1a] w-[90%] max-h-[85%] overflow-y-auto rounded-2xl p-6 relative"
            >
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-white text-center">Filter Games</h2>
              {FilterContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
