'use client';

import GameCard from '@/components/GameCard';
import { gamesLibrary } from '@/lib/gamesData';
import { useState } from 'react';

export default function DeveloperPage({ params }: { params: { slug: string } }) {
  const games = gamesLibrary.filter((game) => {
    const devs = Array.isArray(game.developer) ? game.developer : [game.developer];
    return devs.some((dev) => dev.toLowerCase().replace(/\s+/g, '-') === params.slug);
  });

  // Sort games by release year to get the latest game
  const sortedGames = [...games].sort((a, b) => b.release_year - a.release_year);
  const latestGame = sortedGames[0];

  // Get display name from the first matching game's developer list
  const matchedGame = games[0];
  let developerName = '';
  if (matchedGame) {
    const devs = Array.isArray(matchedGame.developer)
      ? matchedGame.developer
      : [matchedGame.developer];
    const found = devs.find(
      (dev) => dev.toLowerCase().replace(/\s+/g, '-') === params.slug
    );
    developerName = found || devs.join(', ');
  } else {
    developerName = params.slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const avgRating =
    games.length > 0
      ? (games.reduce((sum, g) => sum + g.rating, 0) / games.length).toFixed(1)
      : '0.0';

  // Get developer logo from Clearbit - add size parameter to get transparent PNG
  const domainMap: Record<string, string> = {
    "Ubisoft": "ubisoft.com",
    "Electronic Arts": "ea.com",
    "Rockstar Games": "rockstargames.com",
    "CD Projekt RED": "cdprojektred.com",
    "Nintendo": "nintendo.com",
    "Sony": "playstation.com",
    "Microsoft": "xbox.com",
    "Activision": "activision.com",
    "Blizzard Entertainment": "blizzard.com",
    "Bethesda": "bethesda.net",
    "Square Enix": "square-enix-games.com",
    "Capcom": "capcom.com",
    "FromSoftware": "fromsoftware.jp",
    "Valve": "valvesoftware.com",
    "IO Interactive":"ioi.dk",
    "Obsidian Entertainment":"obsidian.net",
    "Hazelight Studios":"hazelight.se",
    "Kojima Productions":"kojimaproductions.jp",
    "Santa Monica Studio":"sms.playstation.com",
    "Remedy Entertainment":"remedygames.com",
    "DONTNOD Entertainment":"dont-nod.com",
    "Rocksteady Studios":"rocksteadyltd.com",
    "Techland":"techland.net",
    "Guerrilla Games":"guerrilla-games.com",
    "Arkane Studios":"arkane-studios.com",
    "Epic Games": "epicgames.com",
  };
  
  const domain = domainMap[developerName] || `${developerName.toLowerCase().replace(/\s+/g, '')}.com`;
  const developerLogo = `https://logo.clearbit.com/${domain}`;

  // Manual mapping for top 20 popular developers' Steam hero images
  const developerHeroImages: Record<string, string> = {
    "Ubisoft": "https://cdna.artstation.com/p/assets/images/images/062/521/638/large/pierre-santamaria-header-sharp-basic-copy.jpg?1683317302",
    "Electronic Arts": "https://hitmarker.net/imager/company/banner/348508/1750443461_112b836d0d.webp",
    "Rockstar Games": "https://i.pinimg.com/736x/f3/e8/ef/f3e8ef17572f1bd099dfccb2fdd9c9b5.jpg",
    "CD Projekt RED": "https://tryhardguides.com/wp-content/uploads/2022/10/cd-projekt-announces-new-long-term-projects-in-the-works.jpg",
    "Crystal Dynamics": "https://clan.fastly.steamstatic.com/images/44339928/ddcd51064b0361c4952f475e73ab77e62298c8fe.png",
    "Quantic Dream":"https://clan.fastly.steamstatic.com/images/37700027/df452cd72626e4abc7fa73f6d641a5ce65cd2d19.jpg",
    "Activision": "https://support.activision.com/content/dam/atvi/support/article-assets/hero-banners/other/Gen_Hero_2025.jpg",
    "Blizzard Entertainment": "https://clan.fastly.steamstatic.com/images/45010423/92e90faeb8216067dc429b20a1a4fd7dd3e496ca.png",
    "Bethesda Game Studios": "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/04/Bethesda-games1.jpg",
    "Telltale Games":"https://th.bing.com/th/id/R.d7cd35b5cd0e645de2b688641f8856cb?rik=OmvfYvTyCpw7yA&pid=ImgRaw&r=0",
    "Valve": "https://clan.fastly.steamstatic.com/images/4/ffe58f7113508629fe6deb530f48a57e0d03f021.jpg",
    "Square Enix": "https://clan.fastly.steamstatic.com/images/1012195/52ab50f3f89e6188291c848fe7d4a45c86415d0a.jpg",
    "Arkane Studios":"https://static1.srcdn.com/wordpress/wp-content/uploads/2020/08/Arkane-20th-Anniversary-Collection-Key-Art.jpg",
    "Capcom": "https://cdn.thefpsreview.com/wp-content/uploads/2024/08/capcom-games-2023-banner.jpg",
    "FromSoftware": "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/08/13-hardest-fromsoftware-games-ranked.jpg",
    "Infinity Ward":"https://media.glassdoor.com/banner/bh/259027/infinity-ward-banner-1425933924606.jpg",
    "Epic Games": "https://clan.cloudflare.steamstatic.com/images/10608634/f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7.jpg",
    "Crytek":"https://cdn.uc.assets.prezly.com/93f057ae-8e05-47e1-a12d-c3fa48c82672/-/format/auto/",
    "Behaviour Interactive":"https://deadbydaylight.com/static/a5cdc5db3804f817df112184c81f5ead/93f85/dbd-gallery-background.jpg",
    "Bungie": "https://wallpapercrafter.com/desktop2/843651-087-104-1920x1080-px-Blue-Team-Fred-Halo-Halo.jpg",
    "Wales Interactive":"https://clan.fastly.steamstatic.com/images/32970109/2e6d78c1adc3cae10ba5a55765844e7a81871dd2.gif",
    "Remedy Entertainment":"https://assets1.ignimgs.com/2020/11/04/remedyexplainer-controlalanwake-oneup-1604519654913.jpg?width=1200",
    "2K Games": "https://clan.fastly.steamstatic.com/images/2428135/78cfeb07277827b91a807b67fe4029c3219ed358.jpg",
    "Naughty Dog":"https://images.everyeye.it/img-notizie/uncharted-vs-the-last-of-us-serie-naughty-dog-piace-piU-v5-642624.jpg",
    "Supermassive Games":"https://www.lacremedugaming.fr/wp-content/uploads/creme-gaming/2022/07/supermassive-games-1.jpg",
    "SEGA": "https://retrogaming.me/wp-content/uploads/2023/12/Sega-New-Era.jpg",
    "Rocksteady Studios": "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/02/all-rocksteady-games-ranked.jpg",
    "DONTNOD Entertainment":"https://clan.fastly.steamstatic.com/images/33977966/2125f6853e18c464eb67a9e42545d1dd4feace69.jpg",
    "Bandai Namco Studios": "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/02/bandai-namco-games.jpg",
    "Konami": "https://clan.fastly.steamstatic.com/images/39026134/5d2decbc566c9d88a215be031296f73b17e3c230.png",
    "WB Games": "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/02/wb-games-games.jpg",
    "Paradox Interactive": "https://clan.cloudflare.steamstatic.com/images/10568929/a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3.jpg",
    "Sony Interactive": "https://clan.cloudflare.steamstatic.com/images/34310706/b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5.jpg",
  };

  // Get background image - use developer hero if available, otherwise fall back to latest game
  const backgroundImage = developerHeroImages[developerName] || 
                         latestGame?.background || 
                         latestGame?.banner || 
                         latestGame?.image || '';

  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen bg-[#1c1c1c]">
      {/* Hero Section */}
      {latestGame && (
        <div className="relative h-[300px] md:h-[450px] w-full overflow-hidden">
          {/* Background Image with Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${backgroundImage})`,
            }}
          >
            {/* Gradient overlays for both mobile and desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex items-end md:items-center">
            {/* Mobile Layout */}
            <div className="md:hidden w-full pb-6">
              <div className="flex flex-col items-center text-center px-4">
                {/* Developer Logo */}
               <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {!logoError ? (
                    <img 
                      src={developerLogo} 
                      alt={developerName}
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-800">{developerName.charAt(0)}</span>
                  )}
                </div>

                {/* Info Container - No background, just text */}
                <div className="w-full">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {developerName}
                  </h1>
                  <div className="flex items-center justify-center gap-3 text-white">
                    <span className="text-base">
                      {games.length} Game{games.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="text-base font-semibold">{avgRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block max-w-[1400px] w-full mx-auto px-4">
              <div className="flex items-center gap-6">
                {/* Developer Logo */}
                 <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {!logoError ? (
                    <img 
                      src={developerLogo} 
                      alt={developerName}
                      className="w-full h-full object-contain mix-blend-multiply"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <span className="text-4xl font-bold text-gray-800">{developerName.charAt(0)}</span>
                  )}
                </div>

                {/* Developer Info */}
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
                    {developerName}
                  </h1>
                  <div className="flex items-center gap-6 text-white/80">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎮</span>
                      <span className="text-xl font-semibold">
                        {games.length} {games.length === 1 ? "Game" : "Games"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-2xl">★</span>
                      <span className="text-xl font-semibold">{avgRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Original Content */}
      <div className="py-12 px-4">
        <div className="max-w-[1400px] mx-auto">
          {/* No Games */}
          {games.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold mb-4 text-white">No games found</h3>
              <p className="text-gray-400">
                Try browsing other developers or check our full catalog
              </p>
            </div>
          ) : (
            /* Responsive Grid */
            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-3
                xl:grid-cols-4
                2xl:grid-cols-5
                gap-4
                sm:gap-4
                md:gap-6
                lg:gap-8
              "
            >
              {games.map((game) => (
                <div
                  key={game.id}
                  className="
                    fade-in
                    transform
                    hover:scale-105
                    transition-transform
                    duration-200
                    lg:scale-105
                  "
                >
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}