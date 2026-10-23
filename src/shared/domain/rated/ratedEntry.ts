import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { EntityMap } from "@optolith/database-schema/gen"
import { action, computed, observable } from "mobx"
import type { Database } from "../../database.ts"
import { get } from "../../mobxTyped.ts"
import {
  addAdventurePointsCaches,
  AdventurePointsCache,
  emptyAdventurePointsCache,
} from "../adventurePoints/cache.ts"
import {
  BoundAdventurePointsForRated,
  cachedAdventurePoints,
  cachedAdventurePointsForActivatable,
} from "../adventurePoints/ratedEntry.ts"
import type { Character } from "../character.ts"
import { Enhancement } from "./enhancement.ts"
import { RatedDependency } from "./ratedDependency.ts"

export abstract class CharacterRatedEntry<Entity extends keyof EntityMap> {
  declare ["constructor"]: typeof CharacterRatedEntry

  static readonly minValue: number = 0

  protected readonly character: Character

  readonly id: string
  @observable accessor #value: number
  readonly dependencies: readonly RatedDependency[]
  readonly boundAdventurePoints: readonly BoundAdventurePointsForRated[]
  readonly entityName: Entity
  readonly dbEntry: EntityMap[Entity]

  constructor(
    character: Character,
    entityName: Entity,
    id: string,
    dbEntry: EntityMap[Entity],
    value: number,
    boundAdventurePoints: BoundAdventurePointsForRated[],
  ) {
    this.character = character
    this.id = id
    this.#value = value
    this.dependencies = []
    this.boundAdventurePoints = boundAdventurePoints
    this.entityName = entityName
    this.dbEntry = dbEntry
  }

  abstract get improvementCost(): ImprovementCost

  @computed
  get value(): number {
    return this.#value
  }

  @action
  setValue(value: number) {
    this.#value = Math.max(this.constructor.minValue, value)
  }

  @action
  updateValue(fn: (value: number) => number) {
    this.setValue(fn(this.#value))
  }

  @action
  increment() {
    this.updateValue(oldValue => oldValue + 1)
  }

  @action
  decrement() {
    this.updateValue(oldValue => oldValue - 1)
  }

  @action
  incrementToMax() {
    if (this.maxValue !== undefined) {
      this.setValue(this.maxValue)
    }
  }

  @action
  decrementToMin() {
    this.setValue(this.minValue)
  }

  @computed
  get adventurePoints(): AdventurePointsCache {
    return cachedAdventurePoints(
      this.#value,
      this.constructor.minValue,
      this.boundAdventurePoints,
      this.improvementCost,
    )
  }

  abstract get minValue(): number

  abstract get maxValue(): number | undefined

  @computed
  get isIncreasable() {
    return this.maxValue === undefined || this.maxValue > this.value
  }

  @computed
  get isDecreasable() {
    return this.value > this.minValue
  }

  toJSON(): DisplayedRated<EntityMap[Entity]> {
    return {
      id: this.id,
      value: this.#value,
      minValue: this.minValue,
      maxValue: this.maxValue,
      isIncreasable: this.isIncreasable,
      isDecreasable: this.isDecreasable,
      dbEntry: this.dbEntry,
    }
  }
}

export type DisplayedRated<T> = {
  id: string
  value: number
  minValue: number
  maxValue?: number
  isIncreasable: boolean
  isDecreasable: boolean
  dbEntry: T
}

type CharacterRatedEntryConstructor<
  Entity extends keyof EntityMap,
  T extends CharacterRatedEntry<Entity>,
> = {
  new (
    character: Character,
    entityName: Entity,
    id: string,
    dbEntry: EntityMap[Entity],
    value: number,
    boundAdventurePoints: BoundAdventurePointsForRated[],
  ): T
  minValue: number
}

export abstract class CharacterRatedEntries<
  Entity extends keyof EntityMap,
  T extends CharacterRatedEntry<Entity>,
  AdditionalValues extends Record<string, unknown> = {},
> {
  readonly #db: Database
  readonly #character: Character
  readonly entityName: Entity
  readonly #entryClass: CharacterRatedEntryConstructor<Entity, T>
  @observable accessor #rated: Record<string, T> = {}

  constructor(
    db: Database,
    character: Character,
    entityName: Entity,
    entryClass: CharacterRatedEntryConstructor<Entity, T>,
  ) {
    this.#db = db
    this.#character = character
    this.entityName = entityName
    this.#entryClass = entryClass
  }

  getById(id: string): T | undefined {
    return get(this.#rated, id)
  }

  getByIdSafe(id: string): T {
    return this.getById(id) ?? this.#createEmptyWithoutDBEntry(id)
  }

  getValueById(id: string): number {
    return this.getById(id)?.value ?? this.#entryClass.minValue
  }

  abstract getAdditionalValuesForDisplay(_entry: T): AdditionalValues

  @computed
  get entries() {
    return this.#db
      .getAllInstanceContainersOfEntity(this.entityName)
      .map((container): DisplayedRated<EntityMap[Entity]> & AdditionalValues => {
        const entry =
          this.getByIdSafe(container.id) ?? this.#createEmpty(container.id, container.content)

        return Object.assign({}, entry.toJSON(), this.getAdditionalValuesForDisplay(entry))
      })
  }

  @computed
  get adventurePointsTotal() {
    return Object.values(this.#rated).reduce(
      (acc, entry) => addAdventurePointsCaches(acc, entry.adventurePoints),
      emptyAdventurePointsCache,
    )
  }

  #createEmpty(id: string, dbEntry: EntityMap[Entity] | undefined): T {
    if (!dbEntry) {
      throw new Error(`Entry with id ${id} not provided.`)
    }
    return new this.#entryClass(
      this.#character,
      this.entityName,
      id,
      dbEntry,
      this.#entryClass.minValue,
      [],
    )
  }

  #createEmptyWithoutDBEntry(id: string): T {
    const dbEntry = this.#db.getInstanceOfEntityById(this.entityName, id)
    return this.#createEmpty(id, dbEntry)
  }

  #ensureEntryExists(id: string): T {
    if (!this.#rated[id]) {
      this.#rated[id] = this.#createEmptyWithoutDBEntry(id)
    }
    return this.#rated[id]
  }

  @action
  increment(id: string) {
    this.#ensureEntryExists(id).increment()
  }

  @action
  decrement(id: string) {
    this.#ensureEntryExists(id).decrement()
  }

  @action
  incrementToMax(id: string) {
    this.#ensureEntryExists(id).incrementToMax()
  }

  @action
  decrementToMin(id: string) {
    this.#ensureEntryExists(id).decrementToMin()
  }
}

/**
 * The current value.
 */
export type RatedValue = number

/**
 * The instance of an entry that is specified by a rating/value.
 */
export type Rated = {
  /**
   * The rated entry's identifier.
   */
  readonly id: string

  /**
   * The current value.
   */
  readonly value: RatedValue

  /**
   * The accumulated used adventure points value of all value increases.
   */
  readonly cachedAdventurePoints: AdventurePointsCache

  /**
   * The list of dependencies.
   */
  readonly dependencies: RatedDependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t affect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  readonly boundAdventurePoints: BoundAdventurePointsForRated[]
}

/**
 * Instances of entries that are specified by a rating/value, keyed by
 * identifier.
 */
export type RatedMap = {
  [id: number]: Rated
}

/**
 * Keyed helper functions for rated entries.
 */
export type RatedHelpers = {
  /**
   * Creates a new entry with an initial value if active. The initial
   * adventure points cache is calculated from the initial value.
   */
  create: (
    id: number,
    value?: RatedValue,
    options?: Partial<{
      dependencies: RatedDependency[]
      boundAdventurePoints: BoundAdventurePointsForRated[]
    }>,
  ) => Rated

  /**
   * Update the value with an updater function. This also recalculates the
   * adventure points cache.
   */
  updateValue: (updater: (oldValue: RatedValue) => RatedValue, entry: Rated) => Rated

  /**
   * Takes an entry that may not exist (because its instance has not been used
   * yet) and returns its value.
   */
  getValue: (entry: Rated | undefined) => RatedValue
}

/**
 * Create some helper functions for rated entries.
 */
export const createRatedHelpers = (config: {
  minValue: number
  getImprovementCost: (id: number) => ImprovementCost
}): RatedHelpers => {
  const { minValue, getImprovementCost } = config

  const updateCachedAdventurePoints = (entry: Rated): Rated => ({
    ...entry,
    cachedAdventurePoints: cachedAdventurePoints(
      entry.value,
      minValue,
      entry.boundAdventurePoints,
      getImprovementCost(entry.id),
    ),
  })

  const create: RatedHelpers["create"] = (
    id,
    value = minValue,
    { dependencies = [], boundAdventurePoints = [] } = {},
  ) =>
    updateCachedAdventurePoints({
      id,
      value: Math.max(minValue, value),
      cachedAdventurePoints: emptyAdventurePointsCache,
      dependencies,
      boundAdventurePoints,
    })

  const updateValue: RatedHelpers["updateValue"] = (updater, entry) =>
    updateCachedAdventurePoints({
      ...entry,
      value: Math.max(minValue, updater(entry.value)),
    })

  const getValue: RatedHelpers["getValue"] = entry => entry?.value ?? minValue

  return {
    create,
    updateValue,
    getValue,
  }
}

/**
 * The current value, if activated.
 */
export type ActivatableRatedValue = number | undefined

/**
 * The instance of an activatable entry that is specified by a rating/value.
 */
export type ActivatableRated = {
  /**
   * The rated entry's identifier.
   */
  readonly id: number

  /**
   * The current value, if activated.
   */
  readonly value: ActivatableRatedValue

  /**
   * The accumulated used adventure points value of all value increases.
   */
  readonly cachedAdventurePoints: AdventurePointsCache

  /**
   * The list of dependencies.
   */
  readonly dependencies: RatedDependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t effect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  readonly boundAdventurePoints: BoundAdventurePointsForRated[]
}

/**
 * The active instance of an activatable entry that is specified by a
 * rating/value.
 */
export type ActiveActivatableRated = Omit<ActivatableRated, "value"> & {
  /**
   * The current value.
   */
  value: number
}

/**
 * Checks whether the entry is active.
 */
export const isRatedActive = (entry: ActivatableRated): entry is ActiveActivatableRated =>
  entry.value !== undefined

/**
 * Checks whether the entry that may not exist is active.
 */
export const isOptionalRatedActive = (
  entry: ActivatableRated | undefined,
): entry is ActiveActivatableRated => entry?.value !== undefined

/**
 * Instances of activatable entries that are specified by a rating/value, keyed
 * by identifier.
 */
export type ActivatableRatedMap = {
  [id: number]: ActivatableRated
}

/**
 * Keyed helper functions for activatable rated entries.
 */
export type ActivatableRatedHelpers = {
  /**
   * Creates a new entry with an initial value if active. The initial
   * adventure points cache is calculated from the initial value.
   */
  create: (
    id: number,
    value?: ActivatableRatedValue,
    options?: Partial<{
      dependencies: RatedDependency[]
      boundAdventurePoints: BoundAdventurePointsForRated[]
    }>,
  ) => ActivatableRated

  /**
   * Update the value with an updater function. This also recalculates the
   * adventure points cache.
   */
  updateValue: (
    updater: (oldValue: ActivatableRatedValue) => ActivatableRatedValue,
    entry: ActivatableRated,
  ) => ActivatableRated

  /**
   * Takes an entry that may not exist (because its instance has not been used
   * yet) and returns its value.
   */
  getValue: (entry: ActivatableRated | undefined) => ActivatableRatedValue
}

/**
 * Create some helper functions for rated entries.
 */
export const createActivatableRatedHelpers = (config: {
  getImprovementCost: (id: number) => ImprovementCost
}): ActivatableRatedHelpers => {
  const { getImprovementCost } = config
  const minValue = 0

  const updateCachedAdventurePoints = (entry: ActivatableRated): ActivatableRated => ({
    ...entry,
    cachedAdventurePoints: cachedAdventurePointsForActivatable(
      entry.value,
      entry.boundAdventurePoints,
      getImprovementCost(entry.id),
    ),
  })

  const create: ActivatableRatedHelpers["create"] = (
    id,
    value,
    { dependencies = [], boundAdventurePoints = [] } = {},
  ) =>
    updateCachedAdventurePoints({
      id,
      value: value === undefined ? undefined : Math.max(minValue, value),
      cachedAdventurePoints: emptyAdventurePointsCache,
      dependencies,
      boundAdventurePoints,
    })

  const updateValue: ActivatableRatedHelpers["updateValue"] = (updater, entry) => {
    const newValue = updater(entry.value)

    return updateCachedAdventurePoints({
      ...entry,
      value: newValue === undefined ? undefined : Math.max(minValue, newValue),
    })
  }

  const getValue: ActivatableRatedHelpers["getValue"] = entry => entry?.value

  return {
    create,
    updateValue,
    getValue,
  }
}

/**
 * The instance of an activatable entry with enhancements that is specified by a
 * rating/value.
 */
export type ActivatableRatedWithEnhancements = {
  /**
   * The rated entry's identifier.
   */
  readonly id: number

  /**
   * The current value, if activated.
   */
  readonly value: ActivatableRatedValue

  /**
   * The accumulated used adventure points value of all value increases and
   * enhancements.
   */
  readonly cachedAdventurePoints: AdventurePointsCache

  /**
   * The list of dependencies.
   */
  readonly dependencies: RatedDependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t effect the costs of the
   * rating at the time of granting, so the rating at which they have been
   * granted is stored as well.
   */
  readonly boundAdventurePoints: BoundAdventurePointsForRated[]

  /**
   * The currently active enhancements for that entry.
   */
  readonly enhancements: {
    [id: number]: Enhancement
  }
}

/**
 * The active instance of an activatable entry with enhancements that is
 * specified by a rating/value.
 */
export type ActiveActivatableRatedWithEnhancements = Omit<
  ActivatableRatedWithEnhancements,
  "value"
> & {
  /**
   * The current value.
   */
  value: number
}

/**
 * Checks whether the entry is active.
 */
export const isRatedWithEnhancementsActive = (
  entry: ActivatableRatedWithEnhancements,
): entry is ActiveActivatableRatedWithEnhancements => entry.value !== undefined

/**
 * Checks whether the entry that may not exist is active.
 */
export const isOptionalRatedWithEnhancementsActive = (
  entry: ActivatableRatedWithEnhancements | undefined,
): entry is ActiveActivatableRatedWithEnhancements => entry?.value !== undefined

/**
 * Instances of activatable entries with enhancements that are specified by a
 * rating/value, keyed by identifier.
 */
export type ActivatableRatedWithEnhancementsMap = {
  [id: number]: ActivatableRatedWithEnhancements
}
