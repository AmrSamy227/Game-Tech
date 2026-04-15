import Link from 'next/link';
import { gamesLibrary } from '@/lib/gamesData';
import { Monitor, Smartphone, Gamepad2 } from 'lucide-react';

export default function PlatformsPage() {
  const platformStats = gamesLibrary.reduce((acc, game) => {
    game.platforms.forEach(p => {
      if (!acc[p]) {
        acc[p] = { count: 0, games: [] };
      }
      acc[p].count++;
      acc[p].games.push(game);
    });
    return acc;
  }, {} as Record<string, { count: number; games: typeof gamesLibrary }>);

  const sortedPlatforms = Object.entries(platformStats).sort((a, b) => b[1].count - a[1].count);

  const getPlatformIcon = (platform: string) => {
    if (platform.toLowerCase().includes('pc')) return Monitor;
    if (platform.toLowerCase().includes('mobile')) return Smartphone;
    return Gamepad2;
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-white slide-in">
          All Platforms
          <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          Browse games by platform - {sortedPlatforms.length} platforms available
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedPlatforms.map(([platform, data]) => {
            const slug = platform.toLowerCase().replace(/\s+/g, '-');
            const topGames = data.games.slice(0, 4);
            const Icon = getPlatformIcon(platform);

            return (
              <Link key={platform} href={`/explore/platforms/${slug}`}>
                <div className="bg-[#2a2a2a] rounded-lg p-6 hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-red-600 p-2 rounded">
                      <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-600 transition-colors">
                      {platform}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    {data.count} {data.count === 1 ? 'game' : 'games'}
                  </p>
                  <div className="space-y-2">
                    {topGames.map((game, idx) => (
                      <div key={game.id} className="text-xs text-gray-500 truncate">
                        {idx + 1}. {game.title}
                      </div>
                    ))}
                    {data.count > 4 && (
                      <div className="text-xs text-red-600 font-semibold">
                        +{data.count - 4} more
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
