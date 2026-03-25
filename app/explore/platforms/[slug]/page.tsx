import { gamesLibrary } from '@/lib/gamesData';
import PlatformGamesGrid from './PlatformGamesGridClient'; // client component

export function generateStaticParams() {
  const platforms = Array.from(
    new Set(gamesLibrary.flatMap(game => game.platforms))
  );

  return platforms.map(platform => ({
    slug: platform.toLowerCase().replace(/\s+/g, '-')
  }));
}

export default function PlatformPage({ params }: { params: { slug: string } }) {
  const platformName = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const games = gamesLibrary.filter(game =>
    game.platforms.some(p => p.toLowerCase().replace(/\s+/g, '-') === params.slug)
  );

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-white slide-in">
          {platformName} Games
          <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          {games.length} {games.length === 1 ? 'game' : 'games'} available on {platformName}
        </p>

        {games.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-4 text-white">No games found</h3>
            <p className="text-gray-400">Try browsing other platforms or check our full catalog</p>
          </div>
        ) : (
          <PlatformGamesGrid games={games} /> // ✅ Client-side logic here
        )}
      </div>
    </div>
  );
}
