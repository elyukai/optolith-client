import { observable } from "mobx"
import type { Database } from "../database.ts"
import type { Character } from "./character.ts"

export class CharacterRules {
  readonly #db: Database
  readonly #character: Character

  /**
   * Whether the character makes use of all publications except for publications with adult content, which have to be specified explicitly using `include_publications`.
   */
  @observable accessor includeAllPublications: boolean

  /**
   * Explicitly used publications. If `include_all_publications` is set to `true`, only affects publications that are not covered by `include_all_publications`.
   */
  @observable accessor includePublications: number[]

  //   /**
  //    * Dependencies on certain publications.
  //    */
  // @observable accessor   publicationDependencies: PublicationDependency[]

  //   /**
  //    * A map of focus rules that may be active for the character.
  //    */
  // @observable accessor   focusRules: {
  //     [id: number]: FocusRuleInstance
  //   }

  //   /**
  //    * A map of optional rules that maybe be active for the character.
  //    */
  //  @observable accessor  optionalRules: {
  //     [id: number]: OptionalRuleInstance
  //   }

  constructor(
    db: Database,
    character: Character,
    includeAllPublications: boolean,
    includePublications: number[],
  ) {
    this.#db = db
    this.#character = character
    this.includeAllPublications = includeAllPublications
    this.includePublications = includePublications
  }
}
