export type RawHero = RawHeroBase & { [key: string]: any }

export interface RawHeroBase {
  /**
   * A date in milliseconds with the \"H_\" prefix.
   */
  readonly id: string

  /**
   * The name of the hero.
   */
  readonly name: string

  /**
   * The client version the hero was created with.
   */
  readonly dateCreated: string

  /**
   * The date of creation.
   */
  readonly dateModified: string

  /**
   * The date of last modification.
   */
  readonly clientVersion: string
}
