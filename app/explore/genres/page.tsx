import Link from 'next/link';
import Image from 'next/image';
import { gamesLibrary } from '@/lib/gamesData';
// Assuming you have access to this helper function in your environment
import { getGenreImage } from '@/lib/genreImages'; 

// --- HELPER FUNCTIONS & CONSTANTS ---

// 1. Function to capitalize the first letter of each word (for display)
const formatGenreName = (genre) => {
  return genre.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// 2. Helper to simulate fetching game media by ID, adapted to use gamesLibrary
const getGameMediaByBanner = (gameId) => {
    // Find the game in the library
    const game = gamesLibrary.find(g => g.id === gameId);
    // Return the banner image if found, or a placeholder object
    return game ? { coverImage: game.banner } : { coverImage: 'https://via.placeholder.com/150/1c2029?text=No+Banner' };
};

// Color mapping (Copied from CategoriesDropdown and augmented with more colors)
const COLOR_MAP = {
    "from-red-600 to-red-800": { from: "rgb(220, 38, 38)", to: "rgb(127, 29, 29)" },
    "from-orange-600 to-orange-800": { from: "rgb(234, 88, 12)", to: "rgb(124, 45, 18)" },
    "from-amber-600 to-amber-800": { from: "rgb(217, 119, 6)", to: "rgb(120, 53, 15)" },
    "from-cyan-600 to-cyan-800": { from: "rgb(34, 211, 238)", to: "rgb(30, 144, 180)" },
    "from-purple-600 to-purple-800": { from: "rgb(147, 51, 234)", to: "rgb(88, 28, 135)" },
    "from-pink-600 to-pink-800": { from: "rgb(236, 72, 153)", to: "rgb(157, 23, 77)" },
    "from-green-600 to-green-800": { from: "rgb(22, 163, 74)", to: "rgb(20, 83, 45)" },
    "from-blue-600 to-blue-800": { from: "rgb(37, 99, 235)", to: "rgb(30, 58, 138)" },
    "from-indigo-600 to-indigo-800": { from: "rgb(79, 70, 229)", to: "rgb(49, 46, 129)" },
    "from-yellow-600 to-yellow-800": { from: "rgb(202, 138, 4)", to: "rgb(113, 63, 18)" },
};

// Get the keys for easy cycling
const GENRE_GRADIENT_KEYS = Object.keys(COLOR_MAP);

// Threshold for what constitutes a "long" genre name (e.g., Shooter Games is 13 chars)
const LONG_NAME_THRESHOLD = 10;

// --- MAIN COMPONENT ---

export default function GenresPage() {
    // 1. Data Aggregation: Calculate genre statistics and collect game IDs/banners
    const genreStats = gamesLibrary.reduce((acc, game) => {
        game.genre.forEach(g => {
            if (!acc[g]) {
                acc[g] = { count: 0, gameIds: [] };
            }
            acc[g].count++;
            acc[g].gameIds.push(game.id); // Collect game IDs here
        });
        return acc;
    }, {} as Record<string, { count: number; gameIds: string[] }>);

    const sortedGenres = Object.entries(genreStats).sort((a, b) => b[1].count - a[1].count);

    return (
        <div className="min-h-screen bg-[#14181c] py-12 px-4">
            <div className="max-w-[1400px] mx-auto">
                <h1 className="text-5xl font-bold mb-4 text-white">
                    All Genres
                    <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
                </h1>
                <p className="text-gray-400 mb-8 text-lg">
                    Browse games by genre - {sortedGenres.length} genres available
                </p>

                {/* Grid for Genre Cards: Enforced grid-cols-2 for mobile/small screens */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {sortedGenres.map(([genre, data], idx) => {
                        const slug = genre.toLowerCase().replace(/\s+/g, '-');
                        const upperGenre = genre.toUpperCase();
                        
                        // Determine if the name is long
                        const isLongName = upperGenre.length > LONG_NAME_THRESHOLD;
                        
                        // --- Color Cycling Logic ---
                        const gradientKey = GENRE_GRADIENT_KEYS[idx % GENRE_GRADIENT_KEYS.length];
                        const colors = COLOR_MAP[gradientKey];
                        
                        // --- Image Collage Logic ---
                        const listGameIds = data.gameIds.slice(0, 5);
                        const listGameImages = listGameIds.map(gameId => getGameMediaByBanner(gameId));
                        
                        // Tailwind classes for the label based on length
                        const labelBaseClass = "text-black font-bold text-center px-4 py-2 bg-white/95 rounded shadow-xl transition-all duration-[800ms] ease-out";
                        const labelFontSizeClass = isLongName ? "text-xs md:text-sm" : "text-lg md:text-xl";
                        const labelHoverClass = isLongName ? "group-hover/card:text-[10px]" : "group-hover/card:text-sm";
                        
                        return (
                            <Link key={genre} href={`/explore/genres/${slug}`} passHref>
                                {/* Genre Card Container with New Styling */}
                                <div
                                    className="relative overflow-hidden rounded-lg group/card h-28 flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02]"
                                    // Use the dynamically selected color for the shadow
                                    style={{ boxShadow: `0 10px 15px -3px ${colors.from}40, 0 4px 6px -2px ${colors.from}10` }}
                                >
                                    
                                    {/* --- 1. IMAGE COLLAGE AREA --- */}
                                    <div 
                                        className="absolute inset-0 bg-gradient-to-r from-[#1a1d29] to-[#2a2d3a] overflow-hidden"
                                    >
                                        <div className="absolute inset-0 flex">
                                            {/* Map through the available banners (up to 5) */}
                                            {listGameImages.map((media, imageIdx) => (
                                                <div 
                                                    key={imageIdx} 
                                                    className="flex-1 h-full bg-[#1a1d29] relative overflow-hidden"
                                                    style={{
                                                        // Complex CSS Clip-Path for the Slanted Look
                                                        clipPath: imageIdx === 0 
                                                            ? 'polygon(0 0, 85% 0, 70% 100%, 0 100%)' 
                                                            : imageIdx === listGameImages.length - 1
                                                            ? 'polygon(30% 0, 100% 0, 100% 100%, 15% 100%)'
                                                            : 'polygon(30% 0, 85% 0, 70% 100%, 15% 100%)',
                                                        marginLeft: imageIdx > 0 ? '-15%' : '0' // Overlap
                                                    }}
                                                >
                                                    {media.coverImage && (
                                                        <Image 
                                                            src={media.coverImage} 
                                                            alt={formatGenreName(genre)}
                                                            layout="fill"
                                                            objectFit="cover"
                                                            className="opacity-80 group-hover/card:opacity-100 transition-all duration-300" 
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            {/* Fill remaining slots with dark background if less than 5 images */}
                                            {[...Array(Math.max(0, 5 - listGameImages.length))].map((_, emptyIdx) => {
                                                const currentIdx = listGameImages.length + emptyIdx;
                                                return (
                                                    <div 
                                                        key={`empty-${emptyIdx}`} 
                                                        className="flex-1 h-full bg-[#1a1d29]"
                                                        style={{
                                                            clipPath: currentIdx === 0 
                                                                ? 'polygon(0 0, 85% 0, 70% 100%, 0 100%)' 
                                                                : currentIdx === 4
                                                                ? 'polygon(30% 0, 100% 0, 100% 100%, 15% 100%)'
                                                                : 'polygon(30% 0, 85% 0, 70% 100%, 15% 100%)',
                                                            marginLeft: currentIdx > 0 ? '-15%' : '0'
                                                        }}
                                                    ></div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* --- 2. GRADIENT OVERLAY (Dynamically Colored) --- */}
                                    <div
                                        className="absolute inset-0 opacity-100 group-hover/card:opacity-0 transition-opacity duration-[800ms] ease-out"
                                        style={{
                                            // Apply the colored overlay over the image collage using dynamic colors
                                            backgroundImage: `linear-gradient(135deg, transparent 10%, ${colors.from} 80%, ${colors.to} 100%)`,
                                        }}
                                    ></div>
                                    
                                    {/* --- 3. LABEL & METADATA --- */}

                                    {/* Centered Genre Label with Hover Animation and Conditional Sizing */}
                                    <div className="relative z-10 flex items-center justify-center transition-all duration-[800ms] ease-out group-hover/card:translate-y-8">
                                        <span 
                                            // Combine base, conditional size, and conditional hover classes
                                            className={`${labelBaseClass} ${labelFontSizeClass} ${labelHoverClass}`}
                                        >
                                            {upperGenre}
                                        </span>
                                    </div>

                                    {/* Hover Metadata (Game Count) */}
                                    <div className="absolute inset-0 z-20 flex items-end justify-center p-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-xs font-semibold bg-black/70 px-2 py-1 rounded">
                                            {data.count} {data.count === 1 ? 'Game' : 'Games'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}