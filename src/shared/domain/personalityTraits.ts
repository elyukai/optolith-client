import type { ActivatableIdentifier, PersonalityTrait_ID } from "@optolith/database-schema/gen"
import { observable } from "mobx"
import type { Case } from "./databaseEnum.ts"

export type PersonalityTraitDependency = {
  /**
   * The identifier of the dependency source.
   */
  sourceId: ActivatableIdentifier | Case<"PersonalityTrait", PersonalityTrait_ID>

  /**
   * The identifier of the personality trait that is depended on.
   */
  id: PersonalityTrait_ID

  /**
   * Indicates whether the target personality trait must be active or inactive for the dependency to be satisfied.
   */
  active: boolean

  /**
   * The top-level index of the prerequisite. If the prerequisite is part of a
   * group or disjunction, this is the index of the group or disjunction.
   */
  index: number

  /**
   * Is the source prerequisite part of a prerequisite disjunction?
   */
  isPartOfDisjunction: boolean
}

export class CharacterPersonalityTraits {
  @observable accessor activeByLevel: Map<number, PersonalityTrait_ID> = new Map()
  @observable accessor dependencies: PersonalityTraitDependency[] = []

  isActive(id: PersonalityTrait_ID): boolean {
    return this.activeByLevel.values().some(traitId => traitId === id)
  }

  // TODO: Handle dependencies
}
