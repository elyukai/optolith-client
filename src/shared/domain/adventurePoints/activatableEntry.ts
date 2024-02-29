import { ActivatableOption } from "../activatable/activatableEntry.ts"

/**
 * Bound adventure points are granted by the GM and can only be spent on the
 * entry. They don’t affect the costs of  buying the activatable entry. They may
 * specify for which configuration of  an entry they count, just like a
 * prerequisite.
 */
export type BoundAdventurePointsForActivatable = {
  /**
   * The granted adventure points.
   */
  adventurePoints: number

  /**
   * The level for which the adventure points have been granted.
   */
  level?: number

  /**
   * The set of options for which the adventure points have been granted.
   */
  options?: ActivatableOption[]
}

/**
 * The accumulated used adventure points value of all value increases. It is
 * split by used bound and used general adventure points.
 */
export type RatedAdventurePointsCache = {
  /**
   * The used general adventure points.
   */
  general: number

  /**
   * The used bound adventure points.
   */
  bound: number
}
