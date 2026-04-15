// Genre images and metadata for the categories dropdown
// Each genre can have a custom background image that will display on the top categories cards

export const genreImages: Record<string, { image: string; gradient?: string }> = {
  Action: {
    image: "https://tiermaker.com/images/templates/playstation-all-star-battle-royale-2-roster-592397/5923971663972293.jpg",
    gradient: "from-red-600 to-red-800",
  },
  Adventure: {
    image: "https://tse2.mm.bing.net/th/id/OIP.airS1TmC60Lbo4-SkFYRFgHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    gradient: "from-orange-600 to-orange-800",
  },
  "Open World": {
    image: "https://static1.dualshockersimages.com/wordpress/wp-content/uploads/2023/04/img_9711-1-2.jpg",
    gradient: "from-amber-600 to-amber-800",
  },
  "FPS": {
    image: "https://cdn.wallpapersafari.com/76/63/LXlAPV.jpg",
    gradient: "from-cyan-600 to-cyan-800",
  },
  RPG: {
    image: "/rpg-fantasy-character-adventure.jpg",
    gradient: "from-purple-600 to-purple-800",
  },
  Shooter: {
    image: "https://i0.wp.com/www.techjunkie.com/wp-content/uploads/2022/10/The-Best-FPS-Games-For-PlayStation-4.png?resize=660%2C430&ssl=1",
    gradient: "from-green-600 to-green-800",
  },
  Horror: {
    image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/03/best-horror-co-op-games-resident-evil-repo-phasmophobia.jpg?w=1600&h=900&fit=crop",
    gradient: "from-slate-800 to-slate-900",
  },
  Puzzle: {
    image: "/puzzle-game-logical-challenge-brain-teaser.jpg",
    gradient: "from-yellow-600 to-yellow-800",
  },
  Strategy: {
    image: "/strategy-game-tactical-turn-based.jpg",
    gradient: "from-green-600 to-green-800",
  },
  Simulation: {
    image: "/simulation-realistic-game-world.jpg",
    gradient: "from-blue-600 to-blue-800",
  },
}

export function getGenreImage(genre: string) {
  return genreImages[genre] || { image: "", gradient: "from-gray-600 to-gray-800" }
}
