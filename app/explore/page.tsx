// app/explore/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { gamesLibrary } from '@/lib/gamesData';
import { gameSeries, gameTrilogies } from '@/lib/seriesData';
import { Gamepad2, Users, Monitor, Layers, Award } from 'lucide-react';

export default function ExplorePage() {
  const allGenres = Array.from(
    new Set(gamesLibrary.flatMap(game => game.genre))
  ).sort();

  const allDevelopers = Array.from(
    new Set(gamesLibrary.flatMap(game => 
      Array.isArray(game.developer) ? game.developer : [game.developer]
    ))
  ).sort();

  const allPlatforms = Array.from(
    new Set(gamesLibrary.flatMap(game => game.platforms))
  ).sort();

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-white slide-in">
          Explore Games
          <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
        </h1>
        <p className="text-gray-400 mb-12 text-lg">
          Browse games by genres, developers, platforms, series, and trilogies
        </p>

        {/* Main Browse Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Genres */}
          <Link href="/explore/genres" className="group">
            <div className="bg-[#2a2a2a] rounded-lg p-8 hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-600 p-4 rounded-lg">
                  <Gamepad2 size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Genres</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Explore {allGenres.length} different game genres
              </p>
              <div className="flex flex-wrap gap-2">
                {allGenres.slice(0, 6).map((genre) => (
                  <span key={genre} className="text-xs bg-[#1c1c1c] px-2 py-1 rounded text-gray-300">
                    {genre}
                  </span>
                ))}
                {allGenres.length > 6 && (
                  <span className="text-xs bg-red-600 px-2 py-1 rounded text-white">
                    +{allGenres.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Developers */}
          <Link href="/explore/developers" className="group">
            <div className="bg-[#2a2a2a] rounded-lg p-8 hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-600 p-4 rounded-lg">
                  <Users size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Developers</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Browse {allDevelopers.length} game developers
              </p>
              <div className="flex flex-wrap gap-2">
                {allDevelopers.slice(0, 4).map((dev) => (
                  <span key={dev} className="text-xs bg-[#1c1c1c] px-2 py-1 rounded text-gray-300">
                    {dev}
                  </span>
                ))}
                {allDevelopers.length > 4 && (
                  <span className="text-xs bg-red-600 px-2 py-1 rounded text-white">
                    +{allDevelopers.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Platforms */}
          <Link href="/explore/platforms" className="group">
            <div className="bg-[#2a2a2a] rounded-lg p-8 hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-600 p-4 rounded-lg">
                  <Monitor size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Platforms</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Discover games on {allPlatforms.length} platforms
              </p>
              <div className="flex flex-wrap gap-2">
                {allPlatforms.slice(0, 6).map((platform) => (
                  <span key={platform} className="text-xs bg-[#1c1c1c] px-2 py-1 rounded text-gray-300">
                    {platform}
                  </span>
                ))}
                {allPlatforms.length > 6 && (
                  <span className="text-xs bg-red-600 px-2 py-1 rounded text-white">
                    +{allPlatforms.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Game Series Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Layers className="text-red-600" size={36} />
                Game Series
              </h2>
              <span className="block w-20 h-1 bg-red-600 rounded"></span>
            </div>
            <Link 
              href="/explore/series" 
              className="text-red-400 hover:text-red-500 transition-colors font-semibold"
            >
              View All {gameSeries.length} Series →
            </Link>
          </div>
          
          <p className="text-gray-400 mb-6">
            Explore iconic game series with multiple entries
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {gameSeries.slice(0, 12).map((series) => (
              <Link 
                key={series.id} 
                href={`/explore/series/${series.slug}?from=explore`} // <-- pass from=explore
                className="group"
              >
                <div className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600">
                  <div className="relative aspect-video">
                    <Image
                      src={series.image}
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
                    <p className="text-xs text-gray-400">
                      {series.gameIds.length} games
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Game Trilogies Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Award className="text-red-600" size={36} />
                Game Trilogies
              </h2>
              <span className="block w-20 h-1 bg-red-600 rounded"></span>
            </div>
            <Link 
              href="/explore/trilogies" 
              className="text-red-400 hover:text-red-500 transition-colors font-semibold"
            >
              View All {gameTrilogies.length} Trilogies →
            </Link>
          </div>
          
          <p className="text-gray-400 mb-6">
            Complete three-part story experiences
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {gameTrilogies.slice(0, 12).map((trilogy) => (
              <Link 
                key={trilogy.id} 
                href={`/explore/trilogies/${trilogy.slug}?from=explore`} // <-- pass from=explore
                className="group"
              >
                <div className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600">
                  <div className="relative aspect-video">
                    <Image
                      src={trilogy.image}
                      alt={trilogy.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="font-bold text-white text-sm group-hover:text-red-600 transition-colors">
                        {trilogy.name}
                      </h3>
                    </div>
                    <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded text-xs font-bold">
                      Trilogy
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400">
                      3 games
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
