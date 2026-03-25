import Link from "next/link"
import Image from "next/image"
import { gameSeries } from '@/lib/seriesData'
import { Layers, ChevronLeft } from "lucide-react"

export default function SeriesPage() {
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

        <h1 className="text-5xl font-bold mb-4 text-white slide-in flex items-center gap-3 relative">
          <Layers className="text-red-600" size={40} />
          All Game Series
          <span className="block w-20 h-1 bg-red-600 mt-4 rounded absolute left-0 top-24"></span>
        </h1>

        <p className="text-gray-400 mb-12 text-lg">
          Explore {gameSeries.length} game series with multiple entries
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {gameSeries.map((series) => (
            <Link 
              key={series.id} 
              href={`/explore/series/${series.slug}?from=series`} // <-- pass from=series
              className="group"
            >
              <div className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600 h-full">
                <div className="relative aspect-video">
                  <Image 
                    src={series.image || "/placeholder.svg"} 
                    alt={series.name} 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="font-bold text-white text-sm group-hover:text-red-600 transition-colors">
                      {series.name}
                    </h3>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400">{series.gameIds.length} games</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
