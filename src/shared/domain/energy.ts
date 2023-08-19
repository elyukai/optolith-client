/**
 * The instance of an energy entry where points can be purchased but also
 * (permanently) spent.
 */
export type Energy = {
  /**
   * The number of points purchased.
   */
  readonly purchased: number

  /**
   * The number of points permanently lost.
   */
  readonly permanentlyLost: number
}

/**
 * The instance of an energy entry where points can be purchased but also
 * (permanently) spent and bought back.
 */
export type EnergyWithBuyBack = {
  /**
   * The number of points purchased.
   */
  readonly purchased: number

  /**
   * The number of points permanently lost.
   */
  readonly permanentlyLost: number

  /**
   * The number of permanently lost points that have been bought back.
   */
  readonly permanentlyLostBoughtBack: number
}
