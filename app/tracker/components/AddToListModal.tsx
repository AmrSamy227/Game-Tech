'use client';

import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface List {
  id: string;
  name: string;
  description: string | null;
}

interface AddToListModalProps {
  gameId: string;
  gameTitle: string;
  onClose: () => void;
}

export default function AddToListModal({ gameId, gameTitle, onClose }: AddToListModalProps) {
  const { user } = useAuth();
  const [lists, setLists] = useState<List[]>([]);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('custom_lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) console.error('Error loading lists:', error);
    else setLists(data || []);
  };

  const createList = async () => {
    if (!user || !newListName.trim()) return;

    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('custom_lists')
      .insert({
        user_id: user.id,
        name: newListName.trim(),
        description: newListDescription.trim() || null,
      })
      .select()
      .single();

    if (error) setError('Failed to create list');
    else {
      setLists([data, ...lists]);
      setNewListName('');
      setNewListDescription('');
      setShowCreateNew(false);
    }

    setLoading(false);
  };

  const addToList = async (listId: string) => {
    if (!user) return;

    setLoading(true);
    setError('');

    const { error } = await supabase
      .from('list_games')
      .insert({ list_id: listId, game_id: gameId });

    if (error) {
      setError(error.code === '23505' ? 'Game already in this list' : 'Failed to add game to list');
      console.error(error);
    } else onClose();

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full p-6 relative border border-gray-800 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Add to List</h2>
        <p className="text-gray-400 text-sm mb-6">{gameTitle}</p>

        {error && (
          <div className="bg-red-900/20 border border-red-600 text-red-400 px-3 py-2 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {!showCreateNew ? (
          <>
            <button
              onClick={() => setShowCreateNew(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <Plus size={20} /> Create New List
            </button>

            <div className="space-y-2">
              {lists.length === 0 ? (
                <p className="text-gray-400 text-center py-8 text-sm">
                  No lists yet. Create your first list!
                </p>
              ) : (
                lists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => addToList(list.id)}
                    disabled={loading}
                    className="w-full bg-[#2a2a2a] hover:bg-[#333] text-white p-4 rounded-lg transition-colors text-left disabled:opacity-50"
                  >
                    <h3 className="font-semibold">{list.name}</h3>
                    {list.description && <p className="text-sm text-gray-400 mt-1">{list.description}</p>}
                  </button>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">List Name</label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="My Favorite Games"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                placeholder="Games that I love..."
                rows={3}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateNew(false);
                  setNewListName('');
                  setNewListDescription('');
                }}
                className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-white font-bold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createList}
                disabled={loading || !newListName.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
