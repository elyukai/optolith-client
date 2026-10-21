import { sumWith } from "@elyukai/utils/array/reductions"
import { on } from "@elyukai/utils/function"
import { compareNumber } from "@elyukai/utils/ordering"
import { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { Attribute, Attribute_ID } from "@optolith/database-schema/gen"
import { action, computed, observable } from "mobx"
import type { Database } from "../../database.ts"
import { get } from "../../mobxTyped.ts"
import { addAdventurePointsCaches, emptyAdventurePointsCache } from "../adventurePoints/cache.ts"
import type { BoundAdventurePointsForRated } from "../adventurePoints/ratedEntry.ts"
import type { Character } from "../character.ts"
import { CharacterRatedEntry, Rated, type DisplayedRated } from "./ratedEntry.ts"

export class CharacterAttribute extends CharacterRatedEntry {
  static override readonly minValue = 8
  static readonly improvementCost: ImprovementCost = "E"

  readonly #character: Character
  readonly dbEntry: Attribute

  constructor(
    id: string,
    dbEntry: Attribute,
    character: Character,
    value: number,
    boundAdventurePoints: BoundAdventurePointsForRated[],
  ) {
    super(() => CharacterAttribute.improvementCost, id, value, boundAdventurePoints)
    this.#character = character
    this.dbEntry = dbEntry
  }

  static createEmpty(
    id: string,
    dbEntry: Attribute | undefined,
    character: Character,
  ): CharacterAttribute {
    if (!dbEntry) {
      throw new Error(`Attribute with id ${id} not provided.`)
    }
    return new CharacterAttribute(id, dbEntry, character, CharacterAttribute.minValue, [])
  }

  @computed
  get minValue() {
    // TODO
    return CharacterAttribute.minValue
  }

  @computed
  get maxValue() {
    // TODO
    return this.#character.experienceLevel.start?.max_attribute_value
  }
}

/**
 * A combination of a static and corresponding dynamic attribute entry, extended
 * by value bounds and full logic for if the value can be increased or
 * decreased.
 */
export type DisplayedAttribute = DisplayedRated & Attribute

export class CharacterAttributes {
  #db: Database
  #character: Character
  @observable accessor #attributes: Record<string, CharacterAttribute> = {}

  constructor(db: Database, character: Character) {
    this.#db = db
    this.#character = character
  }

  getById(id: Attribute_ID): CharacterAttribute | undefined {
    return get(this.#attributes, id)
  }

  getByIdSafe(id: Attribute_ID): CharacterAttribute {
    return this.getById(id) ?? this.#createEmpty(id)
  }

  getValueById(id: Attribute_ID): number {
    return this.getById(id)?.value ?? CharacterAttribute.minValue
  }

  @computed
  get attributes() {
    return this.#db
      .getAllInstanceContainersOfEntity("Attribute")
      .map((container): DisplayedAttribute => ({
        ...(
          this.getByIdSafe(container.id) ??
          CharacterAttribute.createEmpty(container.id, container.content, this.#character)
        ).toJSON(),
        ...container.content,
      }))
      .toSorted(on(e => e.position, compareNumber))
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

  @computed
  get adventurePointsTotal() {
    return Object.values(this.#attributes).reduce(
      (acc, entry) => addAdventurePointsCaches(acc, entry.adventurePoints),
      emptyAdventurePointsCache,
    )
  }

  #createEmpty(id: Attribute_ID): CharacterAttribute {
    const dbEntry = this.#db.getInstanceOfEntityById("Attribute", id)
    return CharacterAttribute.createEmpty(id, dbEntry, this.#character)
  }

  #ensureEntryExists(id: Attribute_ID): CharacterAttribute {
    if (!this.#attributes[id]) {
      this.#attributes[id] = this.#createEmpty(id)
    }
    return this.#attributes[id]
  }

  @action
  increment(id: Attribute_ID) {
    this.#ensureEntryExists(id).increment()
  }

  @action
  decrement(id: Attribute_ID) {
    this.#ensureEntryExists(id).decrement()
  }

  @action
  incrementToMax(id: Attribute_ID) {
    this.#ensureEntryExists(id).incrementToMax()
  }

  @action
  decrementToMin(id: Attribute_ID) {
    this.#ensureEntryExists(id).decrementToMin()
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
