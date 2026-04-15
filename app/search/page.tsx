"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { searchByQuery } from "@/lib/search-utils"
import GameCard from "@/components/GameCard"
import { ArrowLeft } from "lucide-react"

// 🔥 Helper function to get initials (TG, RG, CD, etc.)
function getDevInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase(); // Single name → first 2 letters
  }
  return (parts[0][0] + parts[1][0]).toUpperCase(); // First letter of first + second words
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const { matchingGames, gamesByTitle, developers } = searchByQuery(query)

  // If exactly one game matches perfectly → redirect
  if (matchingGames.length === 1 && matchingGames[0].title.toLowerCase() === query.toLowerCase()) {
    router.push(`/game/${matchingGames[0].id}`)
    return null
  }

  // If exactly one developer matches the query → redirect
  if (
    developers.length === 1 &&
    matchingGames.every((g) => {
      const devs = Array.isArray(g.developer) ? g.developer : [g.developer]
      return devs.some((d) => d.toLowerCase() === developers[0].toLowerCase())
    })
  ) {
    const slug = developers[0].toLowerCase().replace(/\s+/g, "-")
    router.push(`/explore/developers/${slug}`)
    return null
  }

  const gamesWithSameName = gamesByTitle[query] || []

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-8 px-4">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-red-600 hover:text-red-500 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Search Results
            <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
          </h1>
          <p className="text-gray-400 text-lg">
            {matchingGames.length} result{matchingGames.length !== 1 ? "s" : ""} for "{query}"
          </p>
        </div>

        {/* No Results */}
        {matchingGames.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
            <p className="text-gray-400 mb-6">Try searching with different keywords</p>
            <Link
              href="/"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Go Home
            </Link>
          </div>
        ) : (
          <>
            {/* Games Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {matchingGames.map((game) => (
                <div key={game.id} className="fade-in transform hover:scale-105 transition-transform duration-200">
                  <GameCard game={game} />
                </div>
              ))}
            </div>

            {/* Games with Exact Same Name */}
            {gamesWithSameName.length > 1 && (
              <section className="mt-16">
                <h2 className="text-3xl font-bold text-white mb-6 relative inline-block pb-2">
                  Games with matching title
                  <span className="absolute bottom-0 left-0 w-20 h-1 bg-red-600"></span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gamesWithSameName.map((game) => (
                    <Link
                      key={game.id}
                      href={`/game/${game.id}`}
                      className="group bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#333] transition-colors"
                    >
                      <div className="flex gap-4 p-4">
                        <div className="relative w-32 h-32 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={game.image || "/placeholder.svg"}
                            alt={game.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-red-600 transition-colors mb-2">
                              {game.title}
                            </h3>

                            <p className="text-gray-400 text-sm mb-2">
                              {Array.isArray(game.developer) ? game.developer.join(", ") : game.developer}
                            </p>

                            <p className="text-gray-500 text-sm line-clamp-2">{game.description}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-yellow-500">★ {game.rating}</span>
                            <span className="text-gray-500 text-sm">{game.release_year}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Developers Section */}
            {developers.length > 0 && (
              <section className="mt-16">
                <h2 className="text-3xl font-bold text-white mb-6 relative inline-block pb-2">
                  Matching Developers
                  <span className="absolute bottom-0 left-0 w-20 h-1 bg-red-600"></span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {developers.map((dev) => {
                    const devSlug = dev.toLowerCase().replace(/\s+/g, "-")
                    const devGames = matchingGames.filter((g) => {
                      const devs = Array.isArray(g.developer) ? g.developer : [g.developer]
                      return devs.some((d) => d.toLowerCase() === dev.toLowerCase())
                    })

                    return (
                      <Link
                        key={dev}
                        href={`/explore/developers/${devSlug}`}
                        className="block p-4 bg-[#2a2a2a] rounded-lg hover:bg-red-600/20 transition-colors group"
                      >
                        <h3 className="text-lg font-bold text-white flex items-center gap-3 group-hover:text-red-600 transition-colors">
                          
                          {/* 🔥 Circle initials badge */}
                          <div className="w-10 h-10 rounded-full bg-red-600/30 flex items-center justify-center text-white text-sm font-bold">
                            {getDevInitials(dev)}
                          </div>

                          {/* Full developer name */}
                          {dev}
                        </h3>

                        <p className="text-gray-400 text-sm mt-2">
                          {devGames.length} game{devGames.length !== 1 ? "s" : ""}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
