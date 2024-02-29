/**
 * The accumulated used adventure points value for an entry. It is
 * split by used bound and used general adventure points.
 */
export type AdventurePointsCache = {
  /**
   * The used general adventure points.
   */
  general: number

  /**
   * The used bound adventure points.
   */
  bound: number
}

/**
 * An empty adventure points cache.
 */
export const emptyAdventurePointsCache: AdventurePointsCache = {
  general: 0,
  bound: 0,
}

/**
 * Returns the total number of adventure points from the cache.
 */
export const getTotalAdventurePointsFromCache = (cache: AdventurePointsCache): number =>
  cache.general + cache.bound

/**
 * Adds two adventure points caches.
 */
export const addAdventurePointsCaches = (
  a: AdventurePointsCache,
  b: AdventurePointsCache,
): AdventurePointsCache => ({
  general: a.general + b.general,
  bound: a.bound + b.bound,
})
