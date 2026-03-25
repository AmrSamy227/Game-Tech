"use client";

import { useState } from 'react';
import { Gamepad2, Send } from 'lucide-react';

export default function RequestGames() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gameTitle: '',
    platform: '',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/request-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message); // "Game already exists" or error msg
      return;
    }

    alert("Request sent successfully! Thank you.");
    setFormData({ name: '', email: '', gameTitle: '', platform: '', reason: '' });
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-red-600 p-4 rounded-full mb-4">
            <Gamepad2 size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-white slide-in">
            Request a Game
            <span className="block w-20 h-1 bg-red-600 mt-4 mx-auto rounded"></span>
          </h1>
          <p className="text-gray-400 text-lg">
            Can't find a game you're looking for? Let us know and we'll add it to our library!
          </p>
        </div>

        <div className="bg-[#2a2a2a] p-8 rounded-xl shadow-lg fade-in">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-white mb-2 font-semibold">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:border-red-600 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2 font-semibold">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:border-red-600 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2 font-semibold">Game Title</label>
              <input
                type="text"
                value={formData.gameTitle}
                onChange={(e) => setFormData({ ...formData, gameTitle: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:border-red-600 focus:outline-none transition-colors"
                placeholder="e.g. The Legend of Zelda: Tears of the Kingdom"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2 font-semibold">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:border-red-600 focus:outline-none transition-colors"
                required
              >
                <option value="">Select a platform</option>
                <option value="PC">PC</option>
                <option value="PlayStation 5">PlayStation 5</option>
                <option value="Xbox Series X">Xbox Series X</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Mobile">Mobile</option>
                <option value="Multi-platform">Multi-platform</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2 font-semibold">Why do you want this game?</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:border-red-600 focus:outline-none transition-colors resize-none"
                placeholder="Tell us why this game would be a great addition to our library..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-1"
            >
              <Send size={20} />
              Submit Request
            </button>
          </form>
        </div>

        <div className="mt-8 bg-[#2a2a2a] p-6 rounded-xl border-l-4 border-red-600">
          <h3 className="text-white font-bold text-lg mb-2">Request Guidelines</h3>
          <ul className="text-gray-400 space-y-2">
            <li>• Please check if the game already exists in our library before requesting</li>
            <li>• Provide accurate game title and platform information</li>
            <li>• We review all requests and prioritize based on community interest</li>
            <li>• You'll receive an email notification once the game is added</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
