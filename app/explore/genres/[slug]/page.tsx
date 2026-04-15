import { gamesLibrary } from '@/lib/gamesData';
import GenrePageClient from './GenrePageClient';

export function generateStaticParams() {
  const genres = Array.from(
    new Set(gamesLibrary.flatMap((game) => game.genre))
  );

  return genres.map((genre) => ({
    slug: genre.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default function GenrePage({ params }: { params: { slug: string } }) {
  const genreName = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const allGamesInGenre = gamesLibrary.filter((game) =>
    game.genre.some((g) => g.toLowerCase().replace(/\s+/g, "-") === params.slug)
  );

  return <GenrePageClient genreName={genreName} allGamesInGenre={allGamesInGenre} />;
}
