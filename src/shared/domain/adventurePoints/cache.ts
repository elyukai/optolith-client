/**
 * The accumulated used adventure points value for an entry. It is
 * split by used bound and used general adventure points.
 */
export class AdventurePointsCache {
  /**
   * The used general adventure points.
   */
  readonly general: number

  /**
   * The used bound adventure points.
   */
  readonly bound: number

  constructor(general: number, bound: number) {
    this.general = general
    this.bound = bound
  }

  static empty: AdventurePointsCache = new AdventurePointsCache(0, 0)

  toJSON(): { general: number; bound: number } {
    return {
      general: this.general,
      bound: this.bound,
    }
  }

  add(other: AdventurePointsCache): AdventurePointsCache {
    return new AdventurePointsCache(this.general + other.general, this.bound + other.bound)
  }

  getTotal(): number {
    return this.general + this.bound
  }
}

/**
 * An empty adventure points cache.
 */
export const emptyAdventurePointsCache: AdventurePointsCache = AdventurePointsCache.empty

/**
 * Returns the total number of adventure points from the cache.
 */
export const getTotalAdventurePointsFromCache = (cache: AdventurePointsCache): number =>
  cache.getTotal()

/**
 * Adds two adventure points caches.
 */
export const addAdventurePointsCaches = (
  a: AdventurePointsCache,
  b: AdventurePointsCache,
): AdventurePointsCache => a.add(b)
