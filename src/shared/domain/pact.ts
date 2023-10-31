/**
 * A active pact between a character and a creature.
 */
export type Pact = {
  /**
   * The pact category identifier.
   */
  category: number

  /**
   * The pact type identifier, which depends on the selected pact category.
   */
  type: number

  /**
   * The pact domain identifier or a custom domain name. The pact domain
   * describes the type of creatures the pact has been made with. For example,
   * for a demon pact this is the archdemon.
   */
  domain: PactDomain

  /**
   * The level of the pact.
   */
  level: number

  /**
   * The name of the creature the pact has been made with.
   */
  name: string
}

/**
 * The pact domain identifier or a custom domain name. The pact domain describes
 * the type of creatures the pact has been made with. For example, for a demon
 * pact this is the archdemon.
 */
export type PactDomain =
  | {
      kind: "Predefined"
      id: number
    }
  | {
      kind: "Custom"
      name: string
    }
