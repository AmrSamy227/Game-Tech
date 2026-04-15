import GameCard from '@/components/GameCard';
import { gamesLibrary } from '@/lib/gamesData';

export function generateStaticParams() {
  return [
    { slug: 'action' },
    { slug: 'adventure' },
    { slug: 'rpg' },
    { slug: 'shooter' },
    { slug: 'strategy' },
    { slug: 'sports' },
    { slug: 'horror' },
  ];
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = params.slug;
  
  // Filter games by category - check if the genre array includes the category
  const games = gamesLibrary.filter(game => 
    game.genre.some(g => g.toLowerCase() === category.toLowerCase())
  );

  const categoryTitles: { [key: string]: string } = {
    action: 'Action Games',
    adventure: 'Adventure Games',
    rpg: 'RPG Games',
    shooter: 'Shooter Games',
    strategy: 'Strategy Games',
    sports: 'Sports Games',
    horror: 'Horror Games'
  };

  const title = categoryTitles[category] || 'Games';

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-white slide-in capitalize">
          {title}
          <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          Browse our collection of {category} games - {games.length} games found
        </p>

        {games.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-4 text-white">No games found in this category</h3>
            <p className="text-gray-400">Try browsing other categories or check our full catalog</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {games.map((game) => (
              <div key={game.id} className="fade-in">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}