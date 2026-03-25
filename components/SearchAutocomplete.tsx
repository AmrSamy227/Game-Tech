"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { searchByQuery } from "@/lib/search-utils"

interface SearchResult {
  type: "game" | "developer"
  id?: string
  title: string
  developer?: string
  year?: number
  duration?: string
  image: string
  badge?: string
  initials?: string
  _failed?: boolean     // ← Added to detect failed logo
}

export default function SearchAutocomplete() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Helper to generate initials for developers
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase())
      .join("")

  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsOpen(false)
      setResults([])
      return
    }

    const { matchingGames, developers } = searchByQuery(searchQuery)
    const searchResults: SearchResult[] = []

    // Add game results
    matchingGames.slice(0, 5).forEach((game) => {
      searchResults.push({
        type: "game",
        id: game.id,
        title: game.title,
        developer: Array.isArray(game.developer) ? game.developer[0] : game.developer,
        year: game.release_year,
        duration: game.size,
        image: game.image,
        badge: game.steam_status || "Game",
      })
    })

    // Domain map (your full version)
    const domainMap: Record<string, string> = {
      "Ubisoft": "ubisoft.com",
      "Electronic Arts": "ea.com",
      "Rockstar Games": "rockstargames.com",
      "CD Projekt RED": "cdprojektred.com",
      "Nintendo": "nintendo.com",
      "Sony": "playstation.com",
      "Microsoft": "xbox.com",
      "Activision": "activision.com",
      "Blizzard Entertainment": "blizzard.com",
      "Bethesda": "bethesda.net",
      "Square Enix": "square-enix-games.com",
      "Capcom": "capcom.com",
      "FromSoftware": "fromsoftware.jp",
      "Valve": "valvesoftware.com",
      "IO Interactive": "ioi.dk",
      "Obsidian Entertainment": "obsidian.net",
      "Hazelight Studios": "hazelight.se",
      "Kojima Productions": "kojimaproductions.jp",
      "Santa Monica Studio": "sms.playstation.com",
      "Remedy Entertainment": "remedygames.com",
      "DONTNOD Entertainment": "dont-nod.com",
      "Rocksteady Studios": "rocksteadyltd.com",
      "Techland": "techland.net",
      "Guerrilla Games": "guerrilla-games.com",
      "Arkane Studios": "arkane-studios.com",
      "Epic Games": "epicgames.com",
    }

    // Developer results
    const developerResults: SearchResult[] = developers.slice(0, 3).map((dev) => {
      const domain =
        domainMap[dev] || `${dev.toLowerCase().replace(/\s+/g, "")}.com`

      return {
        type: "developer",
        title: dev,
        image: `https://logo.clearbit.com/${domain}`,
        badge: "Developer",
        initials: getInitials(dev),
      }
    })

    setResults([...searchResults, ...developerResults])
    setTotalResults(matchingGames.length + developers.length)
    setIsOpen(true)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "game" && result.id) {
      router.push(`/game/${result.id}`)
    } else if (result.type === "developer") {
      const slug = result.title.toLowerCase().replace(/\s+/g, "-")
      router.push(`/explore/developers/${slug}`)
    }
    setSearchQuery("")
    setIsOpen(false)
  }

  const handleViewAll = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setIsOpen(false)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative flex items-center bg-white rounded-full shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <Search size={18} className="ml-4 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() && setIsOpen(true)}
          placeholder="Search for a Game..."
          className="flex-1 px-4 py-3 bg-transparent text-gray-800 focus:outline-none placeholder-gray-400"
        />
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className={`mr-3 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ${
            !searchQuery ? "hidden" : ""
          }`}
        >
          <X size={18} />
        </button>
        <button
          type="button"
          onClick={handleViewAll}
          className="px-4 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center flex-shrink-0 "
        >
          <Search size={24} />
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/40 backdrop-blur-xl rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto border border-white/10">
          
          <div className="divide-y divide-white/10">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.title}-${index}`}
                onClick={() => handleResultClick(result)}
                className="w-full px-4 py-3 hover:bg-white/20 transition-all flex items-center gap-4 text-left backdrop-blur-sm"
              >
                {result.type === "developer" ? (
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md relative">

                    {/* Image fallback system */}
                    <img
                      src={result.image}
                      alt={result.title}
                      className={`w-full h-full object-contain mix-blend-multiply absolute inset-0 ${
                        result._failed ? "hidden" : ""
                      }`}
                      onError={() => {
                        result._failed = true
                        setResults([...results]) // trigger re-render
                      }}
                    />

                    {/* Initials */}
                    {result._failed && (
                      <span className="text-lg font-bold text-gray-800">
                        {result.initials}
                      </span>
                    )}
                  </div>
                ) : (
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-20 h-12 rounded object-cover flex-shrink-0 shadow-md"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{result.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-200 mt-0.5">
                    {result.year && <span>{result.year}</span>}
                    {result.year && result.duration && <span>•</span>}
                    {result.duration && <span>{result.duration}</span>}
                    {(result.year || result.duration) && <span>•</span>}
                    <span className="text-red-400 font-medium">{result.badge}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {totalResults > results.length && (
            <button
              onClick={handleViewAll}
              className="w-full px-4 py-3 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm transition-colors text-white font-medium text-center"
            >
              View all results →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
