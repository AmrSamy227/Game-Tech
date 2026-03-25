'use client';

import { useState } from 'react';
import { Heart, Bell, EyeOff } from 'lucide-react';

export default function ActionButtons() {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isIgnored, setIsIgnored] = useState(false);

  return (
    <div className="flex flex-wrap gap-4 my-6">
      {/* ❤️ Wishlist */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className={`flex items-center gap-2 transition-colors ${
          isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-600'
        }`}
      >
        <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
      </button>

      {/* 🔔 Follow */}
      <button
        onClick={() => setIsFollowed(!isFollowed)}
        className={`flex items-center gap-2 transition-colors ${
          isFollowed ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-500'
        }`}
      >
        <Bell size={20} fill={isFollowed ? 'currentColor' : 'none'} />
        {isFollowed ? 'Following' : 'Follow'}
      </button>

      {/* 🚫 Ignore */}
      <button
        onClick={() => setIsIgnored(!isIgnored)}
        className={`flex items-center gap-2 transition-colors ${
          isIgnored ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
        }`}
      >
        <EyeOff size={20} fill={isIgnored ? 'currentColor' : 'none'} />
        {isIgnored ? 'Ignored' : 'Ignore'}
      </button>
    </div>
  );
}
