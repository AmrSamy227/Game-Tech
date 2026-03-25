import { gamesLibrary } from "./gamesData"

export function searchByQuery(query: string) {
  const lowerQuery = query.toLowerCase().trim()

  // Find games that match the query
  const matchingGames = gamesLibrary.filter((game) => {
    const developers = Array.isArray(game.developer) ? game.developer : [game.developer]

    return (
      game.title.toLowerCase().includes(lowerQuery) || developers.some((dev) => dev.toLowerCase().includes(lowerQuery))
    )
  })

  // Count games by title
  const gamesByTitle: Record<string, typeof matchingGames> = {}
  matchingGames.forEach((game) => {
    if (!gamesByTitle[game.title]) {
      gamesByTitle[game.title] = []
    }
    gamesByTitle[game.title].push(game)
  })

  // Find matching developers
  const developers = new Set<string>()
  matchingGames.forEach((game) => {
    const devs = Array.isArray(game.developer) ? game.developer : [game.developer]
    devs.forEach((dev) => {
      if (dev.toLowerCase().includes(lowerQuery)) {
        developers.add(dev)
      }
    })
  })

  return {
    matchingGames,
    gamesByTitle,
    developers: Array.from(developers),
  }
}
