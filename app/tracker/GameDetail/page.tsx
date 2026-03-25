"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@contexts/AuthContext"
import type { Game } from "@lib/gamesData"
import { Heart, Bell, EyeOff, Plus, Clock, CheckCircle, StarIcon, X } from "lucide-react"
import AddToListModal from "@components/AddToListModal"
import AuthModal from "@components/AuthModal"
import { supabase } from "@lib/supabase"
import MediaGallery from "@components/MediaGallery"
import { gamesLibrary } from "@lib/gamesData"

interface GameDetailPageProps {
  params: { id: string } // dynamic route: /tracker/GameDetail/[id]
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  const { user } = useAuth()
  const [game, setGame] = useState<Game | null>(null)
  const [currentStatus, setCurrentStatus] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const gameId = params.id

  useEffect(() => {
    const selectedGame = gamesLibrary.find((g) => g.id === gameId)
    if (selectedGame) setGame(selectedGame)
  }, [gameId])

  useEffect(() => {
    if (user && game) {
      loadGameStatus()
      saveGameMedia()
    }
  }, [user, game])

  const saveGameMedia = async () => {
    if (!game) return
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

    if (error) console.error("Error saving game media:", error)
  }

  const loadGameStatus = async () => {
    if (!user || !game) return
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
    if (!user || !game) {
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
    if (!user || !game) {
      setShowAuthModal(true)
      return
    }
    setLoading(true)
    const newFavoriteState = !isFavorite

    if (currentStatus) {
      const { error } = await supabase
        .from("game_statuses")
        .update({ is_favorite: newFavoriteState, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("game_id", game.id)
      if (!error) setIsFavorite(newFavoriteState)
    } else {
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

  if (!game) return <div className="text-white p-8">Loading...</div>

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-6xl w-full bg-[#1c1c1c] rounded-2xl overflow-hidden border border-gray-800 relative">
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* ...rest of your JSX remains unchanged... */}
          {/* Copy the entire inner div structure from your original component */}
          <div className="p-6 md:p-8">
            <h1 className="text-4xl font-bold text-white mb-4">{game.title}</h1>
            <p className="text-gray-300">{game.long_description}</p>
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
