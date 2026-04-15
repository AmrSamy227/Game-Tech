'use client';

import DownloadButton from "@/components/DownloadButton"
import ShareButton from "@/components/ShareButton"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getGameById, gamesLibrary } from "@/lib/gamesData"
import { gameSeries } from "@/lib/seriesData"
import MediaGallery from "./MediaGallery"
import ActionButtons from "./ActionButtons"
import { useState, useEffect } from "react" // Added missing import for hooks

// Simple shuffle function (Fisher-Yates) - KEPT FOR CLIENT-SIDE USE
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array] // copy to avoid mutating original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function GameDetailPage({ params }: { params: { id: string } }) {
  const game = getGameById(params.id)
  const [logoError, setLogoError] = useState(false);
  const [shuffledGames, setShuffledGames] = useState<any[]>([]);

  if (!game) {
    notFound()
  }

  // Normalize devs to array
  const devs = Array.isArray(game.developer) ? game.developer : [game.developer]

  // Detect Series membership
  const currentSeries = gameSeries.find((series) => series.gameIds.includes(game.id))
  const seriesGameIds = currentSeries ? new Set(currentSeries.gameIds) : new Set()

  // Count genre frequencies
  const genreCount: Record<string, number> = {}
  gamesLibrary.forEach((g) => {
    g.genre.forEach((genre) => {
      genreCount[genre] = (genreCount[genre] || 0) + 1
    })
  })

  /* ----------------------------------------------------
  HELPER FUNCTION FOR MOBILE CAROUSEL SCROLLING
---------------------------------------------------- */
// This function must be placed inside the GameDetailPage component or defined outside if the component is client-side.
const scrollCarousel = (sectionId: string, direction: 'left' | 'right') => {
    // Select the correct scrolling container based on the sectionId
    const container = document.getElementById(sectionId);
    if (container) {
        // Scroll by the width of one item (w-40 or 160px) plus the gap (gap-3 or 12px)
        const scrollAmount = 160 + 12; 
        const offset = direction === 'left' ? -scrollAmount : scrollAmount;
        container.scrollBy({ left: offset, behavior: 'smooth' });
    }
};

  ////////////////////////////////////////////////////////////////////////////
  // 1) GAMES FROM SERIES (if exists)
  ////////////////////////////////////////////////////////////////////////////
  const seriesGames = currentSeries
    ? currentSeries.gameIds
        .map((id) => getGameById(id))
        .filter((g): g is NonNullable<typeof g> => g !== undefined && g.id !== game.id)
        .slice(0, 6)
    : []

  ////////////////////////////////////////////////////////////////////////////
  // 2) MORE FROM DEVELOPER — RANDOMIZED (Client-side shuffle)
  ////////////////////////////////////////////////////////////////////////////

  const developerGamesRaw = gamesLibrary
    .filter((g) => {
      if (g.id === game.id) return false
      const gDevs = Array.isArray(g.developer) ? g.developer : [g.developer]
      return gDevs.some((d) => devs.includes(d))
    })

  // Use shuffled games from state, or initial non-shuffled list (Slices up to 6 games)
  const initialDeveloperGames = developerGamesRaw.slice(0, 6)
  const developerGamesSection = shuffledGames.length > 0 ? shuffledGames : initialDeveloperGames

  // Shuffle on client side only
  useEffect(() => {
    // Only set shuffled games if we have results and no series is present
    if (!currentSeries && developerGamesRaw.length > 0) {
      // Shuffle the entire raw list, then slice the first 6
      const shuffled = shuffleArray(developerGamesRaw).slice(0, 6)
      setShuffledGames(shuffled)
    }
  }, [game.id, currentSeries])

  // UPDATED LOGIC: Only show dev section if NOT in a series AND we have at least one game
  const showDeveloperSection = !currentSeries && developerGamesSection.length > 0

  ////////////////////////////////////////////////////////////////////////////
  // 3) RELATED GAMES (developer + genre-based) - MUST BE DETERMINISTIC
  ////////////////////////////////////////////////////////////////////////////

  let developerGamesForRelated = gamesLibrary
    .filter((g) => {
      if (g.id === game.id) return false
      if (seriesGameIds.has(g.id)) return false
      const gDevs = Array.isArray(g.developer) ? g.developer : [g.developer]
      return gDevs.some((d) => devs.includes(d))
    })

  // FIX: Removed shuffleArray. Using slice for deterministic rendering (first 3 found).
  developerGamesForRelated = developerGamesForRelated.slice(0, 3)

  const genreGamesNeeded = 6 - developerGamesForRelated.length

  let genreGames = gamesLibrary
    .filter((g) => {
      if (g.id === game.id) return false
      if (seriesGameIds.has(g.id)) return false
      const gDevs = Array.isArray(g.developer) ? g.developer : [g.developer]
      const isSameDev = gDevs.some((d) => devs.includes(d))
      if (isSameDev) return false
      return g.genre.some((genre) => game.genre.includes(genre))
    })
    .map((g) => {
      let score = 0
      const matchingGenres = g.genre.filter((genre) => game.genre.includes(genre))
      matchingGenres.forEach((genre) => {
        const freq = genreCount[genre] || 1
        const rarityBoost = Math.max(1, Math.round((gamesLibrary.length / freq) * 5))
        score += rarityBoost
      })
      if (matchingGenres.length === game.genre.length && matchingGenres.length === g.genre.length) {
        score += 30
      }
      if (matchingGenres.length > 1) score += matchingGenres.length * 5
      return { game: g, score, matchingGenres: matchingGenres.length }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.matchingGenres - a.matchingGenres
    })
    .map((x) => x.game)

  // FIX: Removed shuffleArray. Using slice for deterministic rendering (top scored games).
  genreGames = genreGames.slice(0, genreGamesNeeded)

  const relatedGames = [...developerGamesForRelated, ...genreGames]


  ////////////////////////////////////////////////////////////////////////////
  // Developer Hero Image & Logo
  ////////////////////////////////////////////////////////////////////////////

  const domainMap: Record<string, string> = {
    Ubisoft: "ubisoft.com",
    "Electronic Arts": "ea.com",
    "Rockstar Games": "rockstargames.com",
    "CD Projekt RED": "cdprojektred.com",
    Nintendo: "nintendo.com",
    Sony: "playstation.com",
    Microsoft: "xbox.com",
    Activision: "activision.com",
    "Blizzard Entertainment": "blizzard.com",
    Bethesda: "bethesda.net",
    "Square Enix": "square-enix-games.com",
    Capcom: "capcom.com",
    FromSoftware: "fromsoftware.jp",
    Valve: "valvesoftware.com",
    "IO Interactive": "ioi.dk",
    "Obsidian Entertainment": "obsidian.net",
    "Hazelight Studios": "hazelight.se",
    "Kojima Productions": "kojimaproductions.jp",
    "Santa Monica Studio": "sms.playstation.com",
    "Remedy Entertainment": "remedygames.com",
    "DONTNOD Entertainment": "dont-nod.com",
    "Rocksteady Studios": "rocksteadyltd.com",
    Techland: "techland.net",
    "Guerrilla Games": "guerrilla-games.com",
    "Arkane Studios": "arkane-studios.com",
    "Epic Games": "epicgames.com",
  }

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
  }

  const firstDev = devs[0] || ""
  const domain = domainMap[firstDev] || `${firstDev.toLowerCase().replace(/\s+/g, "")}.com`
  const developerLogo = `https://logo.clearbit.com/${domain}`
  
  // Get developer hero background
  const latestDevGame = gamesLibrary
    .filter((g) => {
      const gDevs = Array.isArray(g.developer) ? g.developer : [g.developer]
      return gDevs.some((d) => devs.includes(d))
    })
    .sort((a, b) => b.release_year - a.release_year)[0]
  
  const developerHeroBackground = developerHeroImages[firstDev] || 
                                  latestDevGame?.background || 
                                  latestDevGame?.banner || 
                                  latestDevGame?.image || ''


                                  // Safe: Extract last game background from series
// Assuming currentSeries is the series object
let finalSeriesBackground: string | null = null;

if (currentSeries) {
  // currentSeries.games or currentSeries.gameIds = full series list of game IDs
  const lastGameId = currentSeries.games
    ? currentSeries.games[currentSeries.games.length - 1] // last in full series
    : currentSeries.gameIds[currentSeries.gameIds.length - 1];

  const lastGame = gamesLibrary.find((g) => g.id === lastGameId);

  if (lastGame) {
    finalSeriesBackground = lastGame.background || lastGame.image;
  }
}

// At the top of your component
const finalBackground =
  seriesGames.length > 0
    ? seriesGames[seriesGames.length - 1].background
    : developerHeroBackground;




  ////////////////////////////////////////////////////////////////////////////
  // PAGE RENDER
  ////////////////////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen">

      {/* ----------------------------------------------------
           GAME HEADER
      ---------------------------------------------------- */}
      <div
        className="relative bg-gray-900 py-12 px-6 overflow-hidden"
        style={{
          backgroundImage: `url(${game.background || game.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(28,28,28,0.95))",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8 flex flex-wrap gap-2 text-sm">
            <Link href="/games" className="text-red-400 hover:text-red-500">
              All Games
            </Link>
            <span className="text-gray-500">›</span>
            <Link
              href={`/category/${game.genre[0].toLowerCase()}`}
              className="text-red-400 hover:text-red-500"
            >
              {game.genre[0]}
            </Link>
            <span className="text-gray-500">›</span>
            <span className="text-gray-400">{game.title}</span>
          </nav>

          {/* Header Layout */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Banner */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:block">
              <Image
                src={game.banner}
                alt={game.title}
                width={300}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>

            {/* Game Info */}
            <div className="flex-1 w-full md:w-auto">
              <h1 className="text-4xl font-bold mb-2 text-white text-center md:text-left">
                {game.title}
              </h1>

              <p className="text-gray-300 mb-6 text-center md:text-left">
                {devs.map((dev, i) => (
                  <span key={dev}>
                    <Link
                      href={`/explore/developers/${dev
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-red-400 hover:text-red-500"
                    >
                      {dev}
                    </Link>
                    {i < devs.length - 1 && ", "}
                  </span>
                ))}
              </p>

              {/* Platforms */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                {game.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="bg-black/40 px-3 py-1 rounded text-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start">
                <DownloadButton game={game} />
                <ShareButton
                  gameTitle={game.title}
                  gameUrl={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/game/${
                    game.id
                  }`}
                />
              </div>

              {/* Info */}
              <div className="text-gray-300 text-sm space-y-2 text-center md:text-left">
                <p>
                  <span className="text-yellow-500">★</span>{" "}
                  <span className="font-bold">{game.rating}</span> Rating
                </p>
                <p>
                  <strong>Size:</strong> {game.size}
                </p>
                <p>
                  <strong>Release Date:</strong>{" "}
                  {game.release_date
                    ? new Date(game.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : game.release_year}
                </p>
                <p>
                  <strong>Genres:</strong>{" "}
                  {game.genre.map((g, index) => (
                    <span key={g}>
                      <Link
                        href={`/explore/genres/${g
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="text-red-400 hover:text-red-500"
                      >
                        {g}
                      </Link>
                      {index < game.genre.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1c1c1c] to-transparent pointer-events-none" />
      </div>

      {/* ----------------------------------------------------
           MEDIA GALLERY
      ---------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-6 py-8 bg-[#1c1c1c]">
        <h2 className="text-3xl font-bold mb-6">{game.title}</h2>

        <MediaGallery game={game} />

        <ActionButtons />

        {/* ABOUT GAME */}
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6 relative inline-block pb-2">
            About The Game
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-red-600"></span>
          </h2>

          <p className="text-lg leading-relaxed mb-4">
            {game.long_description}
          </p>
        </section>

        {/* SYSTEM REQUIREMENTS */}
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6 relative inline-block pb-2">
            System Requirements
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-red-600"></span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Minimum */}
            <div>
              <h3 className="text-xl text-red-600 mb-4">Minimum Requirements</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">OS:</strong>{" "}
                  {game.requirements.minimum.os}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Processor:</strong>{" "}
                  {game.requirements.minimum.processor}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Memory:</strong>{" "}
                  {game.requirements.minimum.memory}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Graphics:</strong>{" "}
                  {game.requirements.minimum.graphics}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Storage:</strong>{" "}
                  {game.requirements.minimum.storage}
                </li>
              </ul>
            </div>

            {/* Recommended */}
            <div>
              <h3 className="text-xl text-red-600 mb-4">
                Recommended Requirements
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">OS:</strong>{" "}
                  {game.requirements.recommended.os}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Processor:</strong>{" "}
                  {game.requirements.recommended.processor}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Memory:</strong>{" "}
                  {game.requirements.recommended.memory}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Graphics:</strong>{" "}
                  {game.requirements.recommended.graphics}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Storage:</strong>{" "}
                  {game.requirements.recommended.storage}
                </li>
              </ul>
            </div>
          </div>
        </section>

 {/* ----------------------------------------------------
      MORE FROM SERIES / DEVELOPER — Steam Style Container
---------------------------------------------------- */}
{(seriesGames.length > 0 || showDeveloperSection) && (
  <section className="my-12">

    {/* PREPARE last game background (Keeping this block if you rely on it for defining the variable) */}
    {/* You must ensure finalSeriesBackground is defined in the component scope before this block runs. */}
    {/*
    {(() => {
      finalSeriesBackground =
        seriesGames.length > 0
          ? seriesGames[seriesGames.length - 1].background
          : null;
    })()}
    */}

    {/* Desktop View */}
    <div className="hidden md:block relative rounded-lg overflow-hidden">
      
      {/* Background */}
      <div
  className="absolute inset-0"
  style={{
    backgroundImage: `url(${finalBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.25,
  }}
/>



      <div className="p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {currentSeries?.logo ? (
              <Image
                src={currentSeries.logo}
                alt={currentSeries.name}
                width={40}
                height={40}
                className="rounded"
              />
            ) : (
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center overflow-hidden">
                {!logoError ? (
                  <img
                    src={developerLogo}
                    alt={devs[0]}
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-800">
                    {devs[0]?.charAt(0) || ''}
                  </span>
                )}
              </div>
            )}

            <h2 className="text-3xl font-bold text-white">
              {currentSeries
                ? `More from ${currentSeries.name}`
                : `More from ${devs[0]}`}
            </h2>
          </div>

          <Link
            href={
              currentSeries
                ? `/explore/series/${currentSeries.slug}`
                : `/explore/developers/${devs[0]
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            }
            className="text-red-400 hover:text-red-500 font-semibold"
          >
            See All
          </Link>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(seriesGames.length > 0 ? seriesGames : developerGamesSection).map(
            (g) => (
              <Link key={g.id} href={`/game/${g.id}`} className="group">
                <div className="relative aspect-video mb-2 rounded overflow-hidden bg-gray-800">
                  <Image
                    src={g.image}
                    alt={g.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <h3 className="text-sm font-medium truncate group-hover:text-red-600 transition-colors text-white">
                  {g.title}
                </h3>
              </Link>
            )
          )}
        </div>
      </div>
    </div>

    {/* Mobile Carousel - BACKGROUND ADDED */}
    <div className="md:hidden relative">
      {/* 🛑 FULL WIDTH CONTAINER: This wrapper spans the width and holds the background 🛑 */}
      <div 
        className="relative rounded-lg overflow-hidden mx-auto max-w-7xl"
        // Ensure a base dark color is present, e.g., bg-gray-900, if the background image doesn't load.
        style={{ backgroundColor: '#1e1e1e' }} 
      >
        {/* Background Layer (replicated from desktop) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${finalSeriesBackground || developerHeroBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.25, // Reduced opacity for visibility
          }}
        />

        <div className="relative z-10 py-4"> {/* Added padding to the content wrapper */}
            {/* Header with horizontal padding (px-4) applied only to content */}
            <div className="flex justify-between items-center mb-4 px-4">
                <div className="flex items-center gap-3">
                    {currentSeries?.logo ? (
                        <Image
                            src={currentSeries.logo}
                            alt={currentSeries.name}
                            width={32}
                            height={32}
                            className="rounded"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center overflow-hidden">
                            {!logoError ? (
                                <img
                                    src={developerLogo}
                                    alt={devs[0]}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    onError={() => setLogoError(true)}
                                />
                            ) : (
                                <span className="text-sm font-bold text-gray-800">
                                    {devs[0]?.charAt(0) || ''}
                                </span>
                            )}
                        </div>
                    )}
                    <h2 className="text-xl font-bold">
                        {currentSeries
                            ? `More from ${currentSeries.name}`
                            : `More from ${devs[0]}`}
                    </h2>
                </div>

                <Link
                    href={
                        currentSeries
                            ? `/explore/series/${currentSeries.slug}`
                            : `/explore/developers/${devs[0]
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`
                    }
                    className="text-red-400 hover:text-red-500 text-sm font-semibold"
                >
                    See All
                </Link>
            </div>

            {/* Carousel Container (relative for button positioning) */}
            <div className="relative">
                <div 
                    id="developer-series-carousel" // ID for scrolling
                    className="overflow-x-auto scrollbar-hide flex gap-3 pb-2 snap-x snap-mandatory px-4" // Padding added here
                >
                    {(seriesGames.length > 0 ? seriesGames : developerGamesSection).map(
                        (g) => (
                            <Link key={g.id} href={`/game/${g.id}`} className="group flex-shrink-0 w-40 snap-start">
                                <div className="relative aspect-video mb-2 rounded overflow-hidden bg-gray-800">
                                    <Image
                                        src={g.image}
                                        alt={g.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform"
                                    />
                                </div>
                                <h3 className="text-sm font-medium truncate group-hover:text-red-600 transition-colors">
                                    {g.title}
                                </h3>
                            </Link>
                        )
                    )}
                </div>

                {/* Carousel Arrows */}
                <button
                    onClick={() => scrollCarousel("developer-series-carousel", 'left')}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20"
                >
                    &#10094;
                </button>
                <button
                    onClick={() => scrollCarousel("developer-series-carousel", 'right')}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20"
                >
                    &#10095;
                </button>
            </div>
        </div>
      </div>
    </div>
  </section>
)}

{/* ----------------------------------------------------
      MORE LIKE THIS — Steam Style Container with Gradient and Glassmorphism
---------------------------------------------------- */}
{relatedGames.length > 0 && (
  <section className="my-12">
    
    {/* Desktop View - FIXED WITH GRADIENT AND GLASS EFFECT */}
    <div className="hidden md:block relative rounded-lg overflow-hidden">
      
      {/* 1. Gradient Background (Red to Black @ 30% opacity) */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      ></div>

      {/* 2. Glass Effect Overlay (White/10 + Blur) */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg pointer-events-none"></div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">MORE LIKE THIS</h2>
          <Link
            href={`/game/${game.id}/more-like-this`}
            className="text-red-400 hover:text-red-500 font-semibold"
          >
            See All
          </Link>
        </div>

        {/* Desktop Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedGames.map((g) => (
            <Link key={g.id} href={`/game/${g.id}`} className="group">
              <div className="relative aspect-video mb-2 rounded overflow-hidden bg-gray-800">
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-sm font-medium truncate group-hover:text-red-600 transition-colors text-white">
                {g.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>

    {/* Mobile Carousel - FIXED WITH GRADIENT AND GLASS EFFECT */}
    <div className="md:hidden relative">
        <div className="relative rounded-lg overflow-hidden mx-auto max-w-7xl">
            
            {/* 1. Gradient Background (Red to Black @ 30% opacity) */}
            <div 
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, rgba(220, 38, 38, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%)',
                }}
            ></div>

            {/* 2. Glass Effect Overlay (White/10 + Blur) */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg pointer-events-none"></div>


            <div className="relative z-10 py-6">
                {/* Header with padding applied to content */}
                <div className="flex justify-between items-center mb-4 px-4">
                    <h2 className="text-xl font-bold text-white">MORE LIKE THIS</h2>
                    <Link
                        href={`/game/${game.id}/more-like-this`}
                        className="text-red-400 hover:text-red-500 text-sm font-semibold"
                    >
                        See All
                    </Link>
                </div>

                {/* Mobile Carousel Container */}
                <div className="relative">
                    <div 
                        id="related-games-carousel" // ID for scrolling
                        className="overflow-x-auto scrollbar-hide flex gap-3 pb-2 snap-x snap-mandatory px-4" 
                    >
                        {relatedGames.map((g) => (
                            <Link key={g.id} href={`/game/${g.id}`} className="group flex-shrink-0 w-40 snap-start">
                                <div className="relative aspect-video mb-2 rounded overflow-hidden bg-gray-800">
                                    <Image
                                        src={g.image}
                                        alt={g.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform"
                                    />
                                </div>
                                <h3 className="text-sm font-medium truncate group-hover:text-red-600 transition-colors text-white">
                                    {g.title}
                                </h3>
                            </Link>
                        ))}
                    </div>

                    {/* Carousel Arrows - FIXED TO EDGE (left-0/right-0) */}
                    <button
                        onClick={() => scrollCarousel("related-games-carousel", 'left')}
                        className="absolute top-1/2 left-0 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20"
                    >
                        &#10094;
                    </button>
                    <button
                        onClick={() => scrollCarousel("related-games-carousel", 'right')}
                        className="absolute top-1/2 right-0 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-20"
                    >
                        &#10095;
                    </button>
                </div>
            </div>
        </div>
    </div>
  </section>
)}

      </div>
    </div>
  )
}