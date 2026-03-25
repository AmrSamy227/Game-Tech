import { gamesLibrary } from "./gamesData"

export interface GameSeries {
  id: string
  name: string
  slug: string
  description: string
  games: typeof gamesLibrary
  gameIds: string[]
  image: string
  banner: string
  background: string
}

export interface GameTrilogy {
  id: string
  name: string
  slug: string
  description: string
  games: typeof gamesLibrary
  gameIds: string[]
  image: string
  banner: string
  background: string
}

// Helper: generate URL-safe slug
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

// Curated series list
const preferredSeries = [
  "Far Cry",
  "Hitman",
  "Assassin's Creed",
  "BioShock",
  "God of War",
  "Grand Theft Auto",
  "Resident Evil",
  "Metal Gear ",
  "Call of Duty",
  "Battlefield",
  "Uncharted",
  "Tomb Raider",
  "Dead Space",
  "Mass Effect",
  "Wolfenstein",
  "DOOM",
  "Batman",
  "Fallout",
  "Mafia",
  "Max Payne",
  "Spider-Man",
  "Dying Light",
  "Halo",
  "Life is Strange",
  "Dark Souls",
  "Metro",
  "The Dark Pictures"
]

// Build series map automatically
const seriesMap: Record<string, typeof gamesLibrary> = {}
preferredSeries.forEach((series) => {
  seriesMap[series] = gamesLibrary.filter((g) => g.title.includes(series))
})

// Create series array
export const gameSeries: GameSeries[] = Object.entries(seriesMap)
  .map(([name, games]) => ({
    id: generateSlug(name),
    name,
    slug: generateSlug(name),
    description: `Explore the ${name} series`,
    games: games.sort((a, b) => a.release_year - b.release_year),
    gameIds: games.map((g) => g.id),
    image: games[0]?.image || "/placeholder.svg",
    banner: games[0]?.banner || "/placeholder-banner.svg",
    background: games[0]?.banner || "/placeholder-background.svg",
  }))
  .sort((a, b) => b.games.length - a.games.length)

const trilogyDefinitions: Record<string, string[]> = {
  Borderlands: ["Borderlands", "Borderlands II", "Borderlands 3"],
  "Tomb Raider Survivor": ["Tomb Raider.", "Rise of the Tomb Raider", "Shadow of the Tomb Raider"],
  "Assassin's Creed": ["Assassin's Creed II", "Assassin's Creed: Brotherhood", "Assassin's Creed: Revelations"],
  Halo: ["Halo: Combat Evolved", "Halo 2", "Halo 3"],
  "God of War": ["God of War I", "God of War II", "God of War III"],
  "Batman: Arkham": ["Batman: Arkham Asylum", "Batman: Arkham City", "Batman: Arkham Knight"],
  "Grand Theft Auto": ["Grand Theft Auto III", "Grand Theft Auto: Vice City", "Grand Theft Auto: San Andreas"],
  "Resident Evil": ["Resident Evil 2 Remake", "Resident Evil 3 Remake", "Resident Evil 4 Remake"],
  "Mass Effect": ["Mass Effect", "Mass Effect 2", "Mass Effect 3"],
  "Dark Souls": ["Dark Souls", "Dark Souls II", "Dark Souls III"],
  "Dead Space": ["Dead Space", "Dead Space 2", "Dead Space 3"],
  Uncharted: ["Uncharted", "Uncharted 2: Among Thieves", "Uncharted 3: Drake's Deception"],
  Mafia: ["Mafia", "Mafia II", "Mafia III"],
  BioShock: ["BioShock", "BioShock 2", "BioShock Infinite"],
  "Dying Light": ["Dying Light", "Dying Light 2", "Dying Light: The Following"],
  "Crysis": ["Crysis", "Crysis 2", "Crysis 3"],
  "Max Payne": ["Max Payne", "Max Payne 2", "Max Payne 3"],
  "Call of Duty: Modern Warfare": [
    "Call of Duty 4: Modern Warfare",
    "Call of Duty: Modern Warfare 2",
    "Call of Duty: Modern Warfare 3",
  ],
  "Metro": ["Metro 2033 Redux", "Metro Last Light Redux", "Metro Exodus"],
  "The Witcher": ["The Witcher", "The Witcher 2", "The Witcher 3"],
  "Dead Rising": ["Dead Rising", "Dead Rising 2", "Dead Rising 3"],
  
}

export const gameTrilogies: GameTrilogy[] = Object.entries(trilogyDefinitions)
  .map(([name, gameNames]) => {
    // Find games matching the trilogy definition
    const trilogyGames = gameNames
      .map((gameName) => gamesLibrary.find((g) => g.title.includes(gameName)))
      .filter(Boolean) as typeof gamesLibrary

    if (trilogyGames.length < 3) return null

    return {
      id: generateSlug(name),
      name,
      slug: generateSlug(name),
      description: `Experience the complete ${name} trilogy`,
      games: trilogyGames,
      gameIds: trilogyGames.map((g) => g.id),
      image: trilogyGames[0]?.image || "/placeholder.svg",
      banner: trilogyGames[0]?.banner || "/placeholder-banner.svg",
      background: trilogyGames[0]?.banner || "/placeholder-background.svg",
    }
  })
  .filter(Boolean) as GameTrilogy[]

export default { gameSeries, gameTrilogies }
