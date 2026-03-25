import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getGameById, gamesLibrary } from '@/lib/gamesData';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return gamesLibrary.map((game) => ({
    id: game.id,
  }));
}

export default async function MoreLikeThisPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const game = getGameById(resolvedParams.id);

  if (!game) {
    notFound();
  }

  // ✅ Normalize developer(s) to an array
  const devs = Array.isArray(game.developer) ? game.developer : [game.developer];

  // ✅ Calculate genre rarity scores
  const genreCount: Record<string, number> = {};
  gamesLibrary.forEach((g) => {
    g.genre.forEach((genre) => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  // ✅ Find similar games with scoring system
  const scoredGames = gamesLibrary
    .filter((g) => g.id !== game.id)
    .map((g) => {
      let score = 0;

      // Same genres with rarity weighting (highest priority)
      const matchingGenres = g.genre.filter((genre) => game.genre.includes(genre));
      matchingGenres.forEach((genre) => {
        // Rare genres get higher scores (inverse of frequency)
        const totalGames = gamesLibrary.length;
        const genreFrequency = genreCount[genre] || 1;
        const rarityScore = Math.max(1, Math.round((totalGames / genreFrequency) * 3));
        score += rarityScore;
      });

      // Bonus for matching ALL genres (exact match)
      if (matchingGenres.length === game.genre.length && 
          matchingGenres.length === g.genre.length) {
        score += 20;
      }

      // Bonus for matching multiple genres
      if (matchingGenres.length > 1) {
        score += matchingGenres.length * 3;
      }

      // Same developer - 3 points
      const gDevs = Array.isArray(g.developer) ? g.developer : [g.developer];
      const hasSameDev = gDevs.some((d) => devs.includes(d));
      if (hasSameDev) score += 3;

      // Same platform - 1 point
      const hasSamePlatform = g.platforms.some((p) => game.platforms.includes(p));
      if (hasSamePlatform) score += 1;

      // Similar rating (within 0.5) - 1 point
      if (Math.abs(parseFloat(g.rating) - parseFloat(game.rating)) <= 0.5) {
        score += 1;
      }

      return { game: g, score, matchingGenres: matchingGenres.length };
    })
    .filter((item) => item.score > 0) // Only include games with some similarity
    .sort((a, b) => {
      // First sort by score
      if (b.score !== a.score) return b.score - a.score;
      // Then by number of matching genres as tiebreaker
      return b.matchingGenres - a.matchingGenres;
    }); // Sort by score (highest first)

  const relatedGames = scoredGames.slice(0, 20).map((item) => item.game); // Get top 20

  return (
    <div className="min-h-screen">
      {/* Header */}
     {/* Header */}
<div
  className="relative py-12 px-6 bg-black"
  style={{
    backgroundImage: `url(${game.background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Gradient overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90"></div>

  <div className="relative z-10 max-w-7xl mx-auto text-left">
    {/* Back Button */}
    <Link
      href={`/game/${game.id}`}
      className="inline-flex items-center gap-2 text-red-400 hover:text-red-500 mb-6 transition-colors"
    >
      <ArrowLeft size={20} />
      Back to {game.title}
    </Link>

    <h1 className="text-4xl md:text-5xl font-bold mb-4">Related To {game.title}</h1>
    <p className="text-gray-300 text-lg max-w-2xl">
      Discover games similar to {game.title} based on developer, genre, and gameplay
    </p>
  </div>
</div>


      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {relatedGames.length > 0 ? (
          <>
            <div className="mb-6 text-gray-400">
              Found {relatedGames.length} similar game{relatedGames.length !== 1 ? 's' : ''}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {relatedGames.map((relatedGame) => (
                <Link
                  key={relatedGame.id}
                  href={`/game/${relatedGame.id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] mb-3 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={relatedGame.banner}
                      alt={relatedGame.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-red-600 transition-colors">
                      {relatedGame.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        {relatedGame.rating}
                      </span>
                      <span>•</span>
                      <span>{relatedGame.release_year}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {relatedGame.genre.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="text-xs bg-[#333] px-2 py-0.5 rounded text-gray-300"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              No similar games found for {game.title}
            </p>
            <Link
              href="/games"
              className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Browse All Games
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}