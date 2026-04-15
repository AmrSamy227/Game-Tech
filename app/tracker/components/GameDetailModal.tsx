"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import type { Game } from "../lib/gamesData"
import { Heart, Bell, EyeOff, Plus, Clock, CheckCircle, StarIcon, X } from "lucide-react"
import AddToListModal from "./AddToListModal"
import AuthModal from "./AuthModal"
import { supabase } from "../lib/supabase"
import MediaGallery from "../../game/[id]/MediaGallery"

interface GameDetailModalProps {
  game: Game
  onClose: () => void
}

export function GameDetailModal({ game, onClose }: GameDetailModalProps) {
  const { user } = useAuth()
  const [currentStatus, setCurrentStatus] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadGameStatus()
      saveGameMedia()
    }
  }, [user, game.id])

  const saveGameMedia = async () => {
    // Save or update game media in database for profile access
    const { error } = await supabase.from("game_media").upsert(
      {
        game_id: game.id,
        title: game.title,
        cover_image: game.coverImage,
        banner_image: game.banner,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "game_id",
      },
    )

    if (error) {
      console.error("Error saving game media:", error)
    }
  }

  const loadGameStatus = async () => {
    if (!user) return
    const { data } = await supabase
      .from("game_statuses")
      .select("status, is_favorite")
      .eq("user_id", user.id)
      .eq("game_id", game.id)
      .maybeSingle()

    setCurrentStatus(data?.status || null)
    setIsFavorite(data?.is_favorite || false)
  }

  const updateStatus = async (status: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)

    if (currentStatus === status) {
      const { error } = await supabase.from("game_statuses").delete().eq("user_id", user.id).eq("game_id", game.id)

      if (!error) {
        setCurrentStatus(null)
        setIsFavorite(false)
      }
    } else {
      const { error } = await supabase.from("game_statuses").upsert({
        user_id: user.id,
        game_id: game.id,
        status,
        is_favorite: isFavorite,
        updated_at: new Date().toISOString(),
      })

      if (!error) setCurrentStatus(status)
    }

    setLoading(false)
  }

  const toggleFavorite = async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)
    const newFavoriteState = !isFavorite

    if (currentStatus) {
      // Update existing entry
      const { error } = await supabase
        .from("game_statuses")
        .update({
          is_favorite: newFavoriteState,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("game_id", game.id)

      if (!error) setIsFavorite(newFavoriteState)
    } else {
      // Create new entry with favorite status and wishlist
      const { error } = await supabase.from("game_statuses").insert({
        user_id: user.id,
        game_id: game.id,
        status: "wishlist",
        is_favorite: newFavoriteState,
        updated_at: new Date().toISOString(),
      })

      if (!error) {
        setIsFavorite(newFavoriteState)
        setCurrentStatus("wishlist")
      }
    }

    setLoading(false)
  }

  const handleAddToList = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setShowListModal(true)
  }

  const statusButtons = [
    { id: "playing", label: "Playing", icon: <Clock size={18} />, color: "bg-yellow-600 hover:bg-yellow-700" },
    { id: "played", label: "Played", icon: <CheckCircle size={18} />, color: "bg-green-600 hover:bg-green-700" },
    { id: "wishlist", label: "Wishlist", icon: <StarIcon size={18} />, color: "bg-blue-600 hover:bg-blue-700" },
    { id: "dropped", label: "Dropped", icon: <X size={18} />, color: "bg-red-600 hover:bg-red-700" },
  ]

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-6xl w-full bg-[#1c1c1c] rounded-2xl overflow-hidden border border-gray-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div
            className="bg-cover bg-center relative py-12 px-6"
            style={{
              backgroundImage: `url(${game.background || game.banner})`,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(28,28,28,0.95))",
              }}
            />

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1c1c1c] to-transparent pointer-events-none" />

            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start relative z-10">
              <img
                src={game.banner || "/placeholder.svg"}
                alt={game.title}
                className="w-64 rounded-lg shadow-2xl flex-shrink-0"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">{game.title}</h1>
                  <button
                    onClick={toggleFavorite}
                    disabled={loading}
                    className="ml-4 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all disabled:opacity-50"
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart size={24} className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"} />
                  </button>
                </div>
                <p className="text-red-400 mb-6">{game.developer}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {game.platforms?.map((platform) => (
                    <span key={platform} className="bg-[#333] px-3 py-1 rounded text-sm text-white">
                      {platform}
                    </span>
                  ))}
                </div>

                <div className="text-gray-400 text-sm space-y-2 mb-6">
                  <p className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-bold text-white">{game.rating}</span> Rating
                  </p>
                  <p>
                    <strong className="text-white">Size:</strong> {game.size}
                  </p>
                  <p>
                    <strong className="text-white">Release Year:</strong> {game.release_year}
                  </p>
                  <p>
                    <strong className="text-white">Genres:</strong> {game.genre?.join(", ")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  {statusButtons.map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => updateStatus(btn.id)}
                      disabled={loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 ${
                        currentStatus === btn.id
                          ? `${btn.color} text-white`
                          : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                      }`}
                    >
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAddToList}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg font-bold transition-colors"
                >
                  <Plus size={18} /> Add to List
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={toggleFavorite}
                disabled={loading}
                className={`flex items-center gap-2 transition-colors ${
                  isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-600"
                }`}
              >
                <Heart size={20} className={isFavorite ? "fill-red-500" : ""} />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors">
                <Bell size={20} /> Follow
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors">
                <EyeOff size={20} /> Ignore
              </button>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-white relative inline-block pb-2">
                About The Game
                <span className="absolute bottom-0 left-0 w-20 h-1 bg-red-600"></span>
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">{game.long_description}</p>
            </section>

            {game.screenshots && game.screenshots.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-6 text-white relative inline-block pb-2">
                  Media Gallery
                  <span className="absolute bottom-0 left-0 w-20 h-1 bg-red-600"></span>
                </h2>
                <MediaGallery game={game} />
              </section>
            )}
          </div>
        </div>
      </div>

      {showListModal && (
        <AddToListModal gameId={game.id} gameTitle={game.title} onClose={() => setShowListModal(false)} />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
