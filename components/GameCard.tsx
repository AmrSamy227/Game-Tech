"use client";

import Link from "next/link";
import Image from "next/image";
import { Game } from "@/lib/gamesData";
import { Gamepad2, Star } from "lucide-react";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={`/game/${game.id}`}
      className="group relative block rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_35px_rgba(255,0,80,0.25)]"
    >
      {/* Image Layer */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={game.image}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-all duration-500"></div>

        {/* Light Sweep */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
        </div>

        {/* Gaming Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-black/50 p-3 rounded-full backdrop-blur-md border border-white/10">
            <Gamepad2 className="text-red-500 size-7 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="relative z-10 p-4 flex flex-col gap-1 bg-[#111]/60 backdrop-blur-lg">
        <h3 className="text-white font-semibold text-base truncate group-hover:text-red-400 transition-colors duration-300">
          {game.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <p>{game.size}</p>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={13} fill="currentColor" />
            <span>{game.rating || "4.8"}</span>
          </div>
        </div>
      </div>

      {/* Badge */}
      {game.badge && (
        <span className="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-semibold px-2 py-1 rounded-md uppercase tracking-wide shadow-lg">
          {game.badge}
        </span>
      )}

      {/* Neon Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500/70 group-hover:bg-red-400 transition-colors duration-500"></div>

      {/* Light Sweep Keyframes */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-shine {
          animation: shine 2.5s linear infinite;
        }
      `}</style>
    </Link>
  );
}
