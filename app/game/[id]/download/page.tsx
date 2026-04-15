import { notFound } from "next/navigation";
import { getGameById } from "@/lib/gamesData";
import DownloadOptions from "./DownloadOptions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const game = getGameById(resolvedParams.id);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c]">
      {/* Header with game background */}
      <div
        className="relative bg-gray-900 py-16 px-6 overflow-hidden"
        style={{
          backgroundImage: `url(${game.background || game.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "400px"
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/85 to-[#1c1c1c]" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Back button */}
          <Link
            href={`/game/${game.id}`}
            className="inline-flex items-center gap-2 text-red-300 hover:text-red mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Game
          </Link>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-2 text-white">
            DOWNLOAD {game.title.toUpperCase()}
          </h1>
        </div>
      </div>

      {/* Download options */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <DownloadOptions game={game} />
      </div>
    </div>
  );
}