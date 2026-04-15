'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { supabase } from '../lib/supabase'; 
import { Camera, Save, Clock, Trophy, Gamepad2, Star, CheckCircle, XIcon, Heart, Edit3, Lock, Plus, Trash2, X, ArrowLeft } from 'lucide-react';
import { Game, gamesLibrary as games } from '@/lib/gamesData'; 
import GameDetail from '../GameDetail/page';


// --- Data Resolution Logic ---
const resolvePath = (src: string) => {
    if (!src) return "";
    if (src.startsWith("http")) return src; 
    return `/assets/${src.replace(/^\/assets\//, "")}`; 
};

const getGameMediaById = (gameId: string): { title: string; coverImage: string; banner: string } | null => {
    const gameData = games.find(g => g.id === gameId);
    if (!gameData) return null;
    return {
        title: gameData.title,
        coverImage: resolvePath(gameData.banner), 
        banner: resolvePath(gameData.background || gameData.banner), 
    };
};

const getFullGameById = (gameId: string): Game | null => {
    return games.find(g => g.id === gameId) || null;
};

// --- Interfaces ---
interface Profile {
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    background_url: string | null;
}

interface GameStatus {
    id: string;
    game_id: string;
    status: string;
    rating: number | null;
    hours_played: number | null;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
}

interface GameWithStatus extends GameStatus {
    title: string;
    coverImage: string; 
    banner: string;     
}

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

// --- Navigation Constants ---
const NAVIGATION_ITEMS = [
    { name: 'Profile', href: '#profile' },
    { name: 'Games', href: '#games' },
    { name: 'Journal', href: '#journal' },
    { name: 'Activity', href: '#activity' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Lists', href: '#lists' },
    { name: 'Friends', href: '#friends' },
    { name: 'Likes', href: '#likes' },
];

export default function Profile() {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [gameStatuses, setGameStatuses] = useState<GameStatus[]>([]);
    const [gamesWithMedia, setGamesWithMedia] = useState<GameWithStatus[]>([]);
    const [lists, setLists] = useState<ListWithGames[]>([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [formData, setFormData] = useState({
        display_name: '',
        bio: '',
        avatar_url: '',
        background_url: '',
    });
    const [activeTab, setActiveTab] = useState('Profile');
    const [gameStatusFilter, setGameStatusFilter] = useState('played');
    const [showNewListForm, setShowNewListForm] = useState(false);
    const [newListData, setNewListData] = useState({ name: '', description: '' });
    const [selectedList, setSelectedList] = useState<ListWithGames | null>(null);

    useEffect(() => {
        if (user) {
            loadProfile();
            loadGameStatuses();
            loadLists();
        }
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (data) {
            setProfile(data);
            setFormData({
                display_name: data.display_name || '',
                bio: data.bio || '',
                avatar_url: data.avatar_url || '',
                background_url: data.background_url || '',
            });
        } else {
            // Profile doesn't exist, create one with default username
            const defaultUsername = user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`;
            const { data: newProfile, error } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    username: defaultUsername,
                    display_name: defaultUsername,
                })
                .select()
                .single();

            if (newProfile) {
                setProfile(newProfile);
                setFormData({
                    display_name: newProfile.display_name || '',
                    bio: newProfile.bio || '',
                    avatar_url: newProfile.avatar_url || '',
                    background_url: newProfile.background_url || '',
                });
            } else {
                console.error('[v0] Failed to create profile:', error);
            }
        }
        setLoading(false);
    };

    const loadGameStatuses = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('game_statuses')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        if (data) {
            setGameStatuses(data);
            await enrichGamesWithMedia(data);
        }
    };

    const loadLists = async () => {
        if (!user) return;
        const { data: listsData } = await supabase
            .from('custom_lists')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

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
    };

    const enrichGamesWithMedia = async (statuses: GameStatus[]) => {
        const enrichedGames: GameWithStatus[] = [];
        for (const status of statuses) {
            const mediaData = getGameMediaById(status.game_id);
            enrichedGames.push({
                ...status,
                title: mediaData?.title || `Unknown Game (${status.game_id})`,
                coverImage: mediaData?.coverImage || 'https://via.placeholder.com/180x240/2c3440/FFFFFF?text=No+Cover', 
                banner: mediaData?.banner || 'https://via.placeholder.com/1200x300/1c2029/FFFFFF?text=No+Banner',
            });
        }
        setGamesWithMedia(enrichedGames);
    };

    const saveProfile = async () => {
        if (!user) return;
        setSaving(true);
        const { error } = await supabase
            .from('profiles')
            .update({
                display_name: formData.display_name || null,
                bio: formData.bio || null,
                avatar_url: formData.avatar_url || null,
                background_url: formData.background_url || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (!error) {
            await loadProfile();
            setEditing(false);
        }
        setSaving(false);
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
        }
    };

    const handleGameClick = (gameId: string) => {
        const game = getFullGameById(gameId);
        if (game) {
            setSelectedGame(game);
        }
    };

    const getFavoriteGames = () => {
        return gamesWithMedia.filter(g => g.is_favorite).slice(0, 6);
    };

    const getFilteredGames = () => {
        return gamesWithMedia.filter(g => g.status === gameStatusFilter);
    };

    const getTotalStats = () => {
        const totalGames = gameStatuses.length;
        const currentYear = new Date().getFullYear();
        const playedInCurrentYear = gameStatuses.filter(g => {
            const year = new Date(g.updated_at).getFullYear();
            return year === currentYear && g.status === 'played';
        }).length;
        const backlogged = gameStatuses.filter(g => g.status === 'wishlist').length; 
        
        return { 
            totalGames, 
            playedInCurrentYear, 
            backlogged, 
            totalHours: gameStatuses.reduce((sum, g) => sum + (g.hours_played || 0), 0)
        };
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const ratedGames = gameStatuses.filter(g => g.rating);
        ratedGames.forEach(g => {
            if (g.rating) distribution[g.rating as keyof typeof distribution]++;
        });
        const total = ratedGames.length || 1;
        return {
            5: (distribution[5] / total) * 100,
            4: (distribution[4] / total) * 100,
            3: (distribution[3] / total) * 100,
            2: (distribution[2] / total) * 100,
            1: (distribution[1] / total) * 100,
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
                <p className="text-gray-400">Profile not found</p>
            </div>
        );
    }

    const stats = getTotalStats();
    const favoriteGames = getFavoriteGames();
    const ratingDist = getRatingDistribution();
    const filteredGames = getFilteredGames();
    
    const renderContent = () => {
        switch (activeTab) {
            case 'Profile':
                return (
                    <div className="space-y-8 pb-12">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">Favorite Games</h2>
                            {favoriteGames.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                                    {favoriteGames.map((game) => (
                                        <div 
                                            key={game.id} 
                                            className="w-full flex-shrink-0 cursor-pointer"
                                            onClick={() => handleGameClick(game.game_id)}
                                        >
                                            <div className="aspect-[3/4] bg-[#2c3440] rounded-md overflow-hidden hover:ring-2 hover:ring-red-600 transition-all">
                                                <img 
                                                    src={game.coverImage} 
                                                    alt={game.title} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No favorite games selected.</p>
                            )}
                        </section>

                        <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='md:col-span-2'>
                                <h2 className='text-sm uppercase text-gray-500 font-semibold mb-2'>Bio</h2>
                                {editing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                        className="w-full px-4 py-3 bg-[#2c3440] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-red-600 min-h-[120px]"
                                    />
                                ) : (
                                    <p className="text-gray-300 max-w-2xl text-base">{profile.bio || 'Nothing here!'}</p>
                                )}
                            </div>
                            <div className='md:col-span-1'>
                                <h2 className='text-sm uppercase text-gray-500 font-semibold mb-2'>Personal Ratings</h2>
                                <div className='space-y-1.5'>
                                    {[5, 4, 3, 2, 1].map(rating => (
                                        <div key={rating} className='flex items-center text-sm text-gray-400'>
                                            <Star size={14} className='mr-1 text-red-600 fill-red-600'/> {rating} stars
                                            <div className='flex-1 h-2 bg-[#2c3440] rounded-full ml-4'>
                                                <div 
                                                    className='h-full bg-red-600 rounded-full' 
                                                    style={{ width: `${ratingDist[rating as keyof typeof ratingDist]}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                );

            case 'Games':
                return (
                    <div className="pt-4 sm:pt-8">
                        <div className='flex gap-10 sm:gap-4 mb-4 text-gray-400 text-xs sm:text-sm font-semibold border-b border-gray-700/50 overflow-x-auto'>
                            {['played', 'playing', 'dropped', 'wishlist'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setGameStatusFilter(status)}
                                    className={`pb-3 capitalize whitespace-nowrap ${
                                        gameStatusFilter === status 
                                            ? 'border-b-2 border-red-600 text-white' 
                                            : 'hover:text-white cursor-pointer'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <p className="text-gray-500 mb-4 text-sm">{filteredGames.length} Games</p>
                        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-3">
                            {filteredGames.map((game) => (
                                <div 
                                    key={game.id} 
                                    className="w-full flex-shrink-0 cursor-pointer"
                                    onClick={() => handleGameClick(game.game_id)}
                                >
                                    <div className="aspect-[3/4] bg-[#2c3440] rounded-md overflow-hidden hover:ring-2 hover:ring-red-600 transition-all">
                                        <img 
                                            src={game.coverImage} 
                                            alt={game.title} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filteredGames.length === 0 && (
                            <p className="text-gray-500 text-center py-12 text-sm">No games in this category</p>
                        )}
                    </div>
                );

           case 'Lists':
                // If a list is selected, show the list detail view
                if (selectedList) {
                    const listGames = games.filter(g => selectedList.games.includes(g.id));
                    
                    return (
                        <div className="pt-4 sm:pt-8">
                            <button
                                onClick={() => setSelectedList(null)}
                                className="text-red-400 hover:text-red-500 mb-6 flex items-center gap-2 font-semibold transition-colors"
                            >
                                <ArrowLeft size={20} /> Back to Lists
                            </button>

                            <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-white">
                                {selectedList.name}
                                <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
                            </h1>
                            {selectedList.description && (
                                <p className="text-gray-400 mb-4 text-base sm:text-lg">{selectedList.description}</p>
                            )}
                            <p className="text-gray-500 mb-8">{selectedList.gameCount} {selectedList.gameCount === 1 ? 'game' : 'games'}</p>

                            {listGames.length === 0 ? (
                                <div className="bg-[#2c3440] rounded-xl p-12 text-center border border-gray-700">
                                    <p className="text-gray-400 text-lg">No games in this list yet</p>
                                    <p className="text-gray-500 text-sm mt-2">Add games from the game detail page</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {listGames.map(game => {
                                        const media = getGameMediaById(game.id);
                                        return (
                                            <div key={game.id} className="relative group">
                                                <div 
                                                    className="aspect-[3/4] bg-[#2c3440] rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all cursor-pointer"
                                                    onClick={() => handleGameClick(game.id)}
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
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        const { error } = await supabase
                                                            .from('list_games')
                                                            .delete()
                                                            .eq('list_id', selectedList.id)
                                                            .eq('game_id', game.id);

                                                        if (!error) {
                                                            // Update the selected list state
                                                            setSelectedList({
                                                                ...selectedList,
                                                                games: selectedList.games.filter(g => g !== game.id),
                                                                gameCount: selectedList.gameCount - 1,
                                                            });
                                                            // Reload all lists
                                                            loadLists();
                                                        }
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    title="Remove from list"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <h3 className="text-white text-sm mt-2 font-semibold truncate">{game.title}</h3>
                                                <p className="text-gray-500 text-xs">{game.release_year}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }
                
                // Otherwise show the lists overview
                return (
                    <div className="pt-4 sm:pt-8">
                        <div className="flex gap-4 mb-8">
                            <button 
                                onClick={() => setShowNewListForm(!showNewListForm)}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm rounded-lg font-semibold transition-colors flex items-center gap-2"
                            >
                                {showNewListForm ? <X size={18} /> : <Plus size={18} />}
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

                        {lists.length === 0 && !showNewListForm ? (
                            <div className="bg-[#2c3440] rounded-xl p-12 text-center border border-gray-700">
                                <Plus className="mx-auto mb-4 text-gray-600" size={64} />
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
                                                    <span>by {profile.username}</span>
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
                );

            case 'Journal':
                return (
                    <div className='pt-8 text-gray-500 text-center py-12'>
                        <Gamepad2 size={40} className="mx-auto mb-4 opacity-50 sm:w-12 sm:h-12" />
                        <p className="text-sm">Journal feature coming soon!</p>
                    </div>
                );

            case 'Activity':
                return (
                    <div className='pt-4 sm:pt-8'>
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Recent Activity</h2>
                        <div className="space-y-3 sm:space-y-4">
                            {gamesWithMedia.slice(0, 10).map((game) => (
                                <div 
                                    key={game.id} 
                                    className="bg-[#1c2029] p-3 sm:p-4 rounded-lg border border-gray-800 flex items-center gap-3 sm:gap-4 hover:border-red-600 transition-colors cursor-pointer"
                                    onClick={() => handleGameClick(game.game_id)}
                                >
                                    <div className="w-12 h-16 sm:w-16 sm:h-20 bg-[#2c3440] rounded overflow-hidden flex-shrink-0">
                                        <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-sm sm:text-base truncate">{game.title}</h3>
                                        <p className="text-gray-400 text-xs sm:text-sm capitalize">{game.status}</p>
                                        <p className="text-gray-500 text-xs">{new Date(game.updated_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {gamesWithMedia.length === 0 && (
                            <p className="text-gray-500 text-center py-12 text-sm">No activity yet</p>
                        )}
                    </div>
                );

            case 'Reviews':
                return (
                    <div className='pt-8 text-gray-500 text-center py-12'>
                        <Star size={40} className="mx-auto mb-4 opacity-50 sm:w-12 sm:h-12" />
                        <p className="text-sm">Reviews feature coming soon!</p>
                    </div>
                );

            case 'Friends':
                return (
                    <div className='pt-8 text-gray-500 text-center py-12'>
                        <Heart size={40} className="mx-auto mb-4 opacity-50 sm:w-12 sm:h-12" />
                        <p className="text-sm">Friends feature coming soon!</p>
                    </div>
                );

            case 'Likes':
                return (
                    <div className='pt-8 text-gray-500 text-center py-12'>
                        <Heart size={40} className="mx-auto mb-4 opacity-50 sm:w-12 sm:h-12" />
                        <p className="text-sm">Likes feature coming soon!</p>
                    </div>
                );

            default:
                return <div className='pt-8 text-gray-500 text-sm'>Content for {activeTab} tab goes here.</div>;
        }
    };

    return (
        <>
            <div className="min-h-screen bg-[#14181c] text-white">
               <div
    className="h-80 sm:h-70 md:h-80 bg-cover bg-center relative"
    style={{
        backgroundImage: profile.background_url
            ? `url(${profile.background_url})`
            : 'linear-gradient(135deg, #1a1d29 0%, #2a2d3a 100%)',
    }}
>
    {/* 1. TOP-DOWN FADE (Darkens the image from the top) */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>

    {/* 2. BOTTOM FADE (Smooth transition to main content area) */}
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#14181c] to-transparent pointer-events-none"></div>

    {editing && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
            <input
                type="text"
                value={formData.background_url}
                onChange={(e) => setFormData({ ...formData, background_url: e.target.value })}
                placeholder="Background image URL"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black/50 backdrop-blur-md text-white rounded-lg border border-gray-700 focus:outline-none focus:border-red-600 text-xs sm:text-sm w-48 sm:w-auto"
            />
        </div>
    )}
</div>
                <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 md:-mt-[140px] mb-6 sm:mb-8">
                        <div className="relative flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-[#2c3440] overflow-hidden border-4 border-[#14181c] shadow-xl">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold text-gray-500">
                                        {profile.username[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            {editing && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full">
                                    <input
                                        type="text"
                                        value={formData.avatar_url}
                                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                        placeholder="Avatar URL"
                                        className="w-full px-2 py-1 bg-black/80 text-white text-xs rounded border border-gray-700 focus:outline-none focus:border-red-600"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 text-center sm:text-left sm:pt-12 md:pt-20">
                            <div className="flex flex-col sm:flex-row items-center sm:items-center sm:justify-between gap-3 sm:gap-0">
                                <div className='min-w-0'>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={formData.display_name}
                                            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                            placeholder="Display name"
                                            className="text-xl sm:text-2xl md:text-3xl font-bold bg-[#2c3440] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-red-600 mb-2 w-full"
                                        />
                                    ) : (
                                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
                                            {profile.display_name || profile.username}
                                        </h1>
                                    )}
                                    <div className="text-gray-400 text-xs sm:text-sm mt-1 flex items-center justify-center sm:justify-start">
                                        <span className='mr-1'>@{profile.username}</span>
                                    </div>
                                </div>
                                
                                <div className='flex-shrink-0'>
                                    {!editing ? (
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="bg-[#155000ae] hover:bg-[#00ae31] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 border border-gray-700/50"
                                            >
                                                <Edit3 size={16} className="sm:w-[18px] sm:h-[18px]" /> Edit Profile
                                            </button>
                                            <button
                                                onClick={signOut}
                                                className="bg-[#1c2029] hover:bg-[#2c3440] text-gray-400 hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors border border-gray-800"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={saveProfile}
                                                disabled={saving}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                            >
                                                <Save size={16} className="sm:w-[18px] sm:h-[18px]" /> {saving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditing(false);
                                                    setFormData({
                                                        display_name: profile.display_name || '',
                                                        bio: profile.bio || '',
                                                        avatar_url: profile.avatar_url || '',
                                                        background_url: profile.background_url || '',
                                                    });
                                                }}
                                                className="bg-[#2c3440] hover:bg-[#3c4450] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 border border-gray-700/50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-700/50 mb-6 sm:mb-8 overflow-x-auto">
                        <nav className="flex space-x-4 sm:space-x-6 min-w-max px-1">
                            {NAVIGATION_ITEMS.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => setActiveTab(item.name)}
                                    className={`pb-3 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                                        activeTab === item.name 
                                            ? 'text-white border-b-2 border-red-600' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div className="lg:col-span-1 space-y-6 sm:space-y-8">
                            <div className="bg-transparent grid grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-6">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">{stats.totalGames}</div>
                                    <div className="text-xs sm:text-sm text-gray-400 mt-1">Total games</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">{stats.playedInCurrentYear}</div>
                                    <div className="text-xs sm:text-sm text-gray-400 mt-1">Played in {new Date().getFullYear()}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">{stats.backlogged}</div>
                                    <div className="text-xs sm:text-sm text-gray-400 mt-1">Games Backloggd</div>
                                </div>
                            </div>

                            <section className="hidden lg:block">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-sm uppercase text-gray-500 font-semibold">Badges</h2>
                                    <span className='text-sm text-red-600 hover:text-red-500 cursor-pointer'>View all</span>
                                </div>
                                <div className='flex gap-3'>
                                    <div className='w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg border-2 border-purple-800 shadow-lg cursor-pointer'>
                                        {stats.totalGames}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="lg:col-span-3">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>

            {selectedGame && (
                <GameDetail game={selectedGame} onClose={() => setSelectedGame(null)} />
            )}
        </>
    );
}
