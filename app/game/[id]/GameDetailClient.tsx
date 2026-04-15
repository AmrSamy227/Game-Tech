"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, setGameStatus, getGameStatus, addGameToList } from "../../tracker/utils/localStorageUtils";
import DownloadButton from "@/components/DownloadButton";
import Image from "next/image";
import { Play } from "lucide-react";

export default function GameDetailClient({ game }: { game: any }) {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<string>("backlog");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    setUser(currentUser);
    const savedStatus = getGameStatus(game.id, currentUser);
    setStatus(savedStatus || "backlog");
  }, [game.id]);

  const handleStatusClick = (newStatus: string) => {
    if (!user) return;
    setStatus(newStatus);
    setGameStatus(game.id, newStatus, user.username);
  };

  const handleAddToList = () => {
    const listName = prompt("Enter list name:");
    if (!listName || !user) return;
    addGameToList(listName, game.id, user.username);
    alert(`Added ${game.title} to list ${listName}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col md:flex-row gap-8 p-6">
        <div className="flex-shrink-0">
          <Image src={game.banner} alt={game.title} width={300} height={400} className="rounded-lg" />
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-2">{game.title}</h1>

          {/* Status buttons */}
          <div className="flex gap-4 my-4">
            {["playing","completed","dropped","wishlist"].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusClick(s)}
                className={`px-6 py-3 rounded-lg font-bold transition ${
                  status === s ? "bg-red-600 text-white shadow-lg" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}

            <button
              onClick={handleAddToList}
              className="px-6 py-3 rounded-lg font-bold bg-purple-600 hover:bg-purple-500"
            >
              + Add to List
            </button>
          </div>

          {/* Download / Play buttons */}
          <div className="flex gap-4 my-4">
            <DownloadButton game={game} />
            <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2">
              <Play size={20} /> Play with GAME PASS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
