import { sumWith } from "@elyukai/utils/array/reductions"
import { on } from "@elyukai/utils/function"
import { compareNumber } from "@elyukai/utils/ordering"
import { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { Attribute, Attribute_ID } from "@optolith/database-schema/gen"
import { computed } from "mobx"
import type { Database } from "../../database.ts"
import type { Character } from "../character.ts"
import {
  CharacterRatedEntries,
  CharacterRatedEntry,
  Rated,
  type DisplayedRated,
} from "./ratedEntry.ts"

export class CharacterAttribute extends CharacterRatedEntry<"Attribute"> {
  static override readonly minValue = 8
  static readonly improvementCost: ImprovementCost = "E"

  // oxlint-disable-next-line class-methods-use-this -- Must be an instance method for other entities
  get improvementCost(): ImprovementCost {
    return CharacterAttribute.improvementCost
  }

  get minValue() {
    // TODO
    return CharacterAttribute.minValue
  }

  @computed
  get maxValue() {
    // TODO
    return this.character.experienceLevel.start?.max_attribute_value
  }
}

/**
 * A combination of a static and corresponding dynamic attribute entry, extended
 * by value bounds and full logic for if the value can be increased or
 * decreased.
 */
export type DisplayedAttribute = DisplayedRated<Attribute>

export class CharacterAttributes extends CharacterRatedEntries<"Attribute", CharacterAttribute> {
  #db: Database
  #character: Character

  constructor(db: Database, character: Character) {
    super(db, character, "Attribute", CharacterAttribute)
    this.#db = db
    this.#character = character
  }

  // oxlint-disable-next-line class-methods-use-this
  getAdditionalValuesForDisplay() {
    return {}
  }

  @computed
  get attributes() {
    return this.entries.toSorted(on(e => e.dbEntry.position, compareNumber))
  }

  @computed
  get attributesTotal() {
    return sumWith(
      this.#db.getAllInstanceContainersOfEntity("Attribute"),
      container => this.getById(container.id)?.value ?? CharacterAttribute.minValue,
    )
  }

  @computed
  get attributesTotalMaximum() {
    return this.#character.experienceLevel.start?.max_attribute_total ?? 0
  }
}

/**
 * The minimum value of an attribute.
 */
export const minimumAttributeValue = 8

/**
 * The improvement cost of an attribute.
 */
export const attributeImprovementCost = "E"

/**
 * Creates an initial dynamic attribute entry.
 */
export const createEmptyDynamicAttribute = (id: number): Rated => ({
  id,
  value: minimumAttributeValue,
  cachedAdventurePoints: {
    general: 0,
    bound: 0,
  },
  dependencies: [],
  boundAdventurePoints: [],
})

/**
 * Returns the value for a dynamic attribute entry that might not exist yet.
 */
export const getAttributeValue = (dynamicEntry: Rated | undefined): number =>
  dynamicEntry?.value ?? minimumAttributeValue

/**
 * Returns the highest attribute value of a list of attribute references.
 */
export const getHighestAttributeValue = (
  getDynamicEntryById: (id: Attribute_ID) => Rated | undefined,
  refs: Attribute_ID[],
): number =>
  Math.max(minimumAttributeValue, ...refs.map(ref => getAttributeValue(getDynamicEntryById(ref))))
