import Link from "next/link"
import Image from "next/image"
import { gameTrilogies } from "@/lib/seriesData"
import { ChevronLeft } from "lucide-react"

export default function TrilogiesPage() {
  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-red-400 hover:text-red-500 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Explore
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">Game Trilogies</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gameTrilogies.map((trilogy) => (
            <Link
              key={trilogy.id}
              href={`/explore/trilogies/${trilogy.slug}`}
              className="group bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600"
            >
              <div className="relative aspect-video">
                <Image
                  src={trilogy.image || "/placeholder.svg"}
                  alt={trilogy.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-3">
                <h3 className="text-white font-bold text-lg group-hover:text-red-600 truncate">{trilogy.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{trilogy.gameIds.length} Games</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
