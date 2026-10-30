import type {
  ActivatableIdentifier,
  PactCategory_ID,
  PactDomain_ID,
  PactType_ID,
} from "@optolith/database-schema/gen"
import { computed, observable } from "mobx"
import type { Global } from "../global.ts"
import type { Character } from "./character.ts"

/**
 * A active pact between a character and a creature.
 */
export class CharacterPact {
  readonly global: Global
  readonly character: Character

  /**
   * The pact category identifier.
   */
  @observable accessor categoryId: PactCategory_ID

  @computed
  get category() {
    return this.global.db.getInstanceOfEntityById("PactCategory", this.categoryId)
  }

  /**
   * The pact type identifier, which depends on the selected pact category.
   */
  @observable accessor typeId: PactType_ID

  @computed
  get type() {
    return this.global.db.getInstanceOfEntityById("PactType", this.typeId)
  }

  /**
   * The pact domain identifier or a custom domain name. The pact domain
   * describes the type of creatures the pact has been made with. For example,
   * for a demon pact this is the archdemon.
   */
  @observable accessor domainId: PactDomain_ID

  @computed
  get domain() {
    return this.global.db.getInstanceOfEntityById("PactDomain", this.domainId)
  }

  /**
   * The level of the pact.
   */
  @observable accessor level: number

  /**
   * The name of the creature the pact has been made with.
   */
  @observable accessor name: string

  @observable accessor dependencies: PactDependency[] = []

  constructor(
    global: Global,
    character: Character,
    categoryId: PactCategory_ID,
    typeId: PactType_ID,
    domainId: PactDomain_ID,
    level: number,
    name: string = "",
  ) {
    this.global = global
    this.character = character
    this.categoryId = categoryId
    this.typeId = typeId
    this.domainId = domainId
    this.level = level
    this.name = name
  }
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

/**
 * A dependency on a pact.
 */
export type PactDependency = {
  sourceId: ActivatableIdentifier
  index: number
  isPartOfDisjunction: boolean

  /**
   * The required pact category.
   */
  category: PactCategory_ID

  /**
   * The required domain(s).
   */
  domain?: PactDomain_ID[]

  /**
   * The required pact level.
   */
  level?: number
}
