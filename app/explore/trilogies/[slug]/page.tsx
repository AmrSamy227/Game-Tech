import Link from "next/link"
import Image from "next/image"
import { gameTrilogies } from "@/lib/seriesData"
import { getGameById } from "@/lib/gamesData"
import { ChevronLeft } from "lucide-react"

export function generateStaticParams() {
  return gameTrilogies.map((trilogy) => ({
    slug: trilogy.slug,
  }))
}

export default function TrilogyDetailPage({ params }: { params: { slug: string } }) {
  const trilogy = gameTrilogies.find((t) => t.slug === params.slug)

  if (!trilogy) return <div className="text-center py-20 text-white">Trilogy not found</div>

  const games = trilogy.gameIds
    .map((id) => getGameById(id))
    .filter((game): game is NonNullable<typeof game> => game !== undefined)

  const backgroundImage = games[games.length - 1]?.background || "/placeholder-background.jpg"

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Black gradient overlay at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />

      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/explore/trilogies"
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-500 mb-6 transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Trilogies
          </Link>

          {/* Trilogy Header */}
          <div className="py-12 px-6 rounded-lg mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">{trilogy.name}</h1>
            <p className="text-gray-300 text-lg mb-6">{trilogy.description}</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-red-600 px-4 py-2 rounded">
                <span className="text-white font-bold">{games.length} Games</span>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {games.map((game) => (
              <Link key={game.id} href={`/game/${game.id}`} className="group">
                <div className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600">
                  <div className="relative aspect-video">
                    <Image
                      src={game.image || "/placeholder.svg"}
                      alt={game.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-white text-sm truncate group-hover:text-red-600 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{game.release_year}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
