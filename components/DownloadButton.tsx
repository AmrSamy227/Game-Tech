"use client";
import React from "react";
import { Download } from "lucide-react";
import Link from "next/link";
import { gamesLibrary } from "@/lib/gamesData";

type Game = typeof gamesLibrary[number];

export default function DownloadButton({ game }: { game: Game }) {
  return (
    <Link
      href={`/game/${game.id}/download`}
      className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all"
    >
      <Download size={20} /> Download
    </Link>
  );
}