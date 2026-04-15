'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Heart, Bell, EyeOff, Clock, CheckCircle, StarIcon } from "lucide-react"
import { Plus, Trash2, X, ArrowLeft, Lock, Globe } from 'lucide-react';
import { gamesLibrary } from '../lib/gamesData';
import MediaGallery from "@/app/game/[id]/MediaGallery"

// --- Data Resolution Logic ---
const resolvePath = (src: string) => {
    if (!src) return "";
    if (src.startsWith("http")) return src; 
    return `/assets/${src.replace(/^\/assets\//, "")}`; 
};

const getGameMediaById = (gameId: string): { title: string; coverImage: string; banner: string } | null => {
    const gameData = gamesLibrary.find(g => g.id === gameId);
    if (!gameData) return null;
    return {
        title: gameData.title,
        coverImage: resolvePath(gameData.banner), 
        banner: resolvePath(gameData.background || gameData.banner), 
    };
};

// --- Interfaces ---
interface List {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

interface ListWithGames extends List {
    gameCount: number;
    games: string[];
}

export default function Lists() {
    const { user } = useAuth();
    const [lists, setLists] = useState<ListWithGames[]>([]);
    const [selectedList, setSelectedList] = useState<ListWithGames | null>(null);
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNewListForm, setShowNewListForm] = useState(false);
    const [newListData, setNewListData] = useState({ name: '', description: '' });

    useEffect(() => {
        if (user) loadLists();
    }, [user]);

    const loadLists = async () => {
        if (!user) return;
        setLoading(true);

        const { data: listsData, error } = await supabase
            .from('custom_lists')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        if (listsData) {
            const listsWithGames = await Promise.all(
                listsData.map(async (list) => {
                    const { data: gamesData } = await supabase
                        .from('list_games')
                        .select('game_id')
                        .eq('list_id', list.id);

                    return {
                        ...list,
                        gameCount: gamesData?.length || 0,
                        games: gamesData?.map(g => g.game_id) || [],
                    };
                })
            );
            setLists(listsWithGames);
        }

        setLoading(false);
    };

    const createNewList = async () => {
        if (!user || !newListData.name.trim()) return;
        const { error } = await supabase
            .from('custom_lists')
            .insert({
                user_id: user.id,
                name: newListData.name,
                description: newListData.description || null,
            });

        if (!error) {
            await loadLists();
            setNewListData({ name: '', description: '' });
            setShowNewListForm(false);
        }
    };

    const deleteList = async (listId: string) => {
        if (!confirm('Are you sure you want to delete this list?')) return;
        const { error } = await supabase.from('custom_lists').delete().eq('id', listId);
        if (!error) {
            await loadLists();
            if (selectedList?.id === listId) setSelectedList(null);
        }
    };

    const removeGameFromList = async (listId: string, gameId: string) => {
        const { error } = await supabase
            .from('list_games')
            .delete()
            .eq('list_id', listId)
            .eq('game_id', gameId);

        if (!error) {
            await loadLists();
            if (selectedList) {
                setSelectedList({
                    ...selectedList,
                    games: selectedList.games.filter(g => g !== gameId),
                    gameCount: selectedList.gameCount - 1,
                });
            }
        }
    };

    const game = selectedGame ? gamesLibrary.find(g => g.id === selectedGame) : null;

    // Main Lists View
    if (!selectedList) {
        return (
            <div className="min-h-screen bg-[#14181c] py-12 px-4">
                <div className="max-w-[1400px] mx-auto">
                    <h1 className="text-5xl font-bold mb-4 text-white">
                        My Lists
                        <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
                    </h1>

                    <div className="flex gap-4 mb-8">
                        <button 
                            onClick={() => setShowNewListForm(!showNewListForm)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            {showNewListForm ? <X size={18} /> : <Heart size={18} />}
                            {showNewListForm ? 'Cancel' : 'Create List'}
                        </button>
                    </div>

                    {showNewListForm && (
                        <div className="bg-[#2c3440] p-6 rounded-xl mb-8 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Create New List</h3>
                            <input
                                type="text"
                                value={newListData.name}
                                onChange={(e) => setNewListData({ ...newListData, name: e.target.value })}
                                placeholder="List name"
                                className="w-full px-4 py-3 bg-[#1c2029] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-red-600 mb-4"
                            />
                            <textarea
                                value={newListData.description}
                                onChange={(e) => setNewListData({ ...newListData, description: e.target.value })}
                                placeholder="Description (optional)"
                                className="w-full px-4 py-3 bg-[#1c2029] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-red-600 mb-4 min-h-[100px]"
                            />
                            <button
                                onClick={createNewList}
                                disabled={!newListData.name.trim()}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create List
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-400 mt-4">Loading lists...</p>
                        </div>
                    ) : lists.length === 0 ? (
                        <div className="bg-[#2c3440] rounded-xl p-12 text-center border border-gray-700">
                            <Heart className="mx-auto mb-4 text-gray-600" size={64} />
                            <h3 className="text-2xl font-bold text-white mb-2">No lists yet</h3>
                            <p className="text-gray-400">Create your first list to organize your games</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lists.map(list => {
                                const listGameImages = list.games.slice(0, 5).map(gameId => getGameMediaById(gameId));
                                
                                return (
                                    <div
                                        key={list.id}
                                        className="bg-[#2a2d3a] rounded-lg overflow-hidden hover:bg-[#32353f] transition-all group cursor-pointer relative"
                                    >
                                        <div 
                                            className="relative h-48 bg-gradient-to-r from-[#1a1d29] to-[#2a2d3a] overflow-hidden"
                                            onClick={() => setSelectedList(list)}
                                        >
                                            <div className="absolute inset-0 flex">
                                                {listGameImages.map((media, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="flex-1 h-full bg-[#1a1d29] relative overflow-hidden"
                                                        style={{
                                                            clipPath: idx === 0 
                                                                ? 'polygon(0 0, 85% 0, 70% 100%, 0 100%)' 
                                                                : idx === listGameImages.length - 1
                                                                ? 'polygon(30% 0, 100% 0, 100% 100%, 15% 100%)'
                                                                : 'polygon(30% 0, 85% 0, 70% 100%, 15% 100%)',
                                                            marginLeft: idx > 0 ? '-15%' : '0'
                                                        }}
                                                    >
                                                        {media && (
                                                            <img 
                                                                src={media.coverImage} 
                                                                alt="" 
                                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                                {[...Array(Math.max(0, 5 - list.games.length))].map((_, idx) => (
                                                    <div 
                                                        key={`empty-${idx}`} 
                                                        className="flex-1 h-full bg-[#1a1d29]"
                                                        style={{
                                                            clipPath: (listGameImages.length + idx) === 0 
                                                                ? 'polygon(0 0, 85% 0, 70% 100%, 0 100%)' 
                                                                : (listGameImages.length + idx) === 4
                                                                ? 'polygon(30% 0, 100% 0, 100% 100%, 15% 100%)'
                                                                : 'polygon(30% 0, 85% 0, 70% 100%, 15% 100%)',
                                                            marginLeft: (listGameImages.length + idx) > 0 ? '-15%' : '0'
                                                        }}
                                                    ></div>
                                                ))}
                                            </div>
                                            
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    deleteList(list.id);
                                                }}
                                                className="absolute top-3 right-3 text-white/70 hover:text-red-500 transition-colors p-2 bg-black/40 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 z-10"
                                                title="Delete list"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        
                                        <div 
                                            className="p-4"
                                            onClick={() => setSelectedList(list)}
                                        >
                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                                                {list.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <span>by {user?.email?.split('@')[0] || 'user'}</span>
                                                <span className="text-gray-600">|</span>
                                                <span>{list.gameCount} {list.gameCount === 1 ? 'Game' : 'Games'}</span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {game && selectedGame && (
                    <GameDetailModal game={game} onClose={() => setSelectedGame(null)} />
                )}
            </div>
        );
    }

    // Selected List View
    const listGames = gamesLibrary.filter(g => selectedList.games.includes(g.id));

    return (
        <div className="min-h-screen bg-[#14181c] py-12 px-4">
            <div className="max-w-[1400px] mx-auto">
                <button
                    onClick={() => setSelectedList(null)}
                    className="text-red-400 hover:text-red-500 mb-6 flex items-center gap-2 font-semibold transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Lists
                </button>

                <h1 className="text-5xl font-bold mb-4 text-white">
                    {selectedList.name}
                    <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
                </h1>
                {selectedList.description && (
                    <p className="text-gray-400 mb-4 text-lg">{selectedList.description}</p>
                )}
                <p className="text-gray-500 mb-8">{selectedList.gameCount} {selectedList.gameCount === 1 ? 'game' : 'games'}</p>

                {listGames.length === 0 ? (
                    <div className="bg-[#2c3440] rounded-xl p-12 text-center border border-gray-700">
                        <p className="text-gray-400 text-lg">No games in this list yet</p>
                        <p className="text-gray-500 text-sm mt-2">Add games from the game detail page</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {listGames.map(game => {
                            const media = getGameMediaById(game.id);
                            return (
                                <div key={game.id} className="relative group">
                                    <div 
                                        className="aspect-[3/4] bg-[#2c3440] rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all cursor-pointer"
                                        onClick={() => setSelectedGame(game.id)}
                                    >
                                        {media && (
                                            <img 
                                                src={media.coverImage} 
                                                alt={game.title} 
                                                className="w-full h-full object-cover" 
                                            />
                                        )}
                                    </div>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            removeGameFromList(selectedList.id, game.id);
                                        }}
                                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        title="Remove from list"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <h3 className="text-white text-sm mt-2 font-semibold truncate">{game.title}</h3>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {game && selectedGame && (
                <GameDetailModal game={game} onClose={() => setSelectedGame(null)} />
            )}
        </div>
    );
}

// Game Detail Modal Component
function GameDetailModal({ game, onClose }: { game: any; onClose: () => void }) {
    const { user } = useAuth();
    const [currentStatus, setCurrentStatus] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadGameStatus();
        }
    }, [user, game.id]);

    const loadGameStatus = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('game_statuses')
            .select('status, is_favorite')
            .eq('user_id', user.id)
            .eq('game_id', game.id)
            .maybeSingle();

        setCurrentStatus(data?.status || null);
        setIsFavorite(data?.is_favorite || false);
    };

    const updateStatus = async (status: string) => {
        if (!user) return;
        setLoading(true);

        if (currentStatus === status) {
            const { error } = await supabase
                .from('game_statuses')
                .delete()
                .eq('user_id', user.id)
                .eq('game_id', game.id);

            if (!error) {
                setCurrentStatus(null);
                setIsFavorite(false);
            }
        } else {
            const { error } = await supabase
                .from('game_statuses')
                .upsert({
                    user_id: user.id,
                    game_id: game.id,
                    status,
                    is_favorite: isFavorite,
                    updated_at: new Date().toISOString(),
                });

            if (!error) setCurrentStatus(status);
        }
        setLoading(false);
    };

    const toggleFavorite = async () => {
        if (!user) return;
        setLoading(true);
        const newFavoriteState = !isFavorite;

        if (currentStatus) {
            const { error } = await supabase
                .from('game_statuses')
                .update({
                    is_favorite: newFavoriteState,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id)
                .eq('game_id', game.id);

            if (!error) setIsFavorite(newFavoriteState);
        } else {
            const { error } = await supabase
                .from('game_statuses')
                .insert({
                    user_id: user.id,
                    game_id: game.id,
                    status: 'wishlist',
                    is_favorite: newFavoriteState,
                    updated_at: new Date().toISOString(),
                });

            if (!error) {
                setIsFavorite(newFavoriteState);
                setCurrentStatus('wishlist');
            }
        }
        setLoading(false);
    };

    const statusButtons = [
        { id: 'playing', label: 'Playing', color: 'bg-yellow-600 hover:bg-yellow-700' },
        { id: 'played', label: 'Played', color: 'bg-green-600 hover:bg-green-700' },
        { id: 'dropped', label: 'Dropped', color: 'bg-red-600 hover:bg-red-700' },
        { id: 'wishlist', label: 'Wishlist', color: 'bg-blue-600 hover:bg-blue-700' },
    ];

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
                <div className="max-w-6xl w-full bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="bg-gradient-to-r from-black/80 to-black/80 bg-cover bg-center py-12 px-6"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${game.background || game.banner})`,
                        }}
                    >
                        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start">
                            <img
                                src={game.banner}
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
                                        <Heart 
                                            size={24} 
                                            className={isFavorite ? "text-red-500" : "text-gray-400"}
                                        />
                                    </button>
                                </div>
                                <p className="text-red-400 mb-6">{game.developer}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {game.platforms?.map((platform: string) => (
                                        <span key={platform} className="bg-[#333] px-3 py-1 rounded text-sm text-white">{platform}</span>
                                    ))}
                                </div>

                                <div className="text-gray-400 text-sm space-y-2 mb-6">
                                    <p className="flex items-center gap-2">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-bold text-white">{game.rating}</span> Rating
                                    </p>
                                    <p><strong className="text-white">Size:</strong> {game.size}</p>
                                    <p><strong className="text-white">Release Year:</strong> {game.release_year}</p>
                                    <p><strong className="text-white">Genres:</strong> {game.genre?.join(', ')}</p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {statusButtons.map(btn => (
                                        <button
                                            key={btn.id}
                                            onClick={() => updateStatus(btn.id)}
                                            disabled={loading}
                                            className={`px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 ${
                                                currentStatus === btn.id ? `${btn.color} text-white` : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
                                            }`}
                                        >
                                            {btn.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                                    

                   <div className="p-6 md:p-8">
  {/* Buttons Group (Favorites, Follow, Ignore) */}
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

  {/* 🖼️ Media Gallery */}
  {/* Note: I've moved the content of the inner div up to keep it within the original structure. */}
  {/* The original code had an extra max-w-7xl mx-auto px-6 py-8 which I've kept separate for the gallery content. */}
  <div className="max-w-7xl mx-auto px-6 py-8">
    <h2 className="text-3xl font-bold mb-6">{game.title}</h2>
    {/* Assuming MediaGallery and its required 'game' prop are defined */}
    <MediaGallery game={game} />
  </div>
</div>
                </div>
            </div>
        </div>
    );
}