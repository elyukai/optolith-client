import { count } from "@elyukai/utils/array/reductions"
import { nullableToArray } from "@elyukai/utils/nullable"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import {
  improvementCostToLinearNumber,
  type ImprovementCost,
} from "@optolith/adventure-points/improvement-cost"
import type * as Gen from "@optolith/database-schema/gen"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { action, computed, observable } from "mobx"
import { Case } from "tsondb/schema/gen"
import type { Global } from "../../global.ts"
import type { LocaleMap } from "../../utils/locale.ts"
import {
  addAdventurePointsCaches,
  AdventurePointsCache,
  emptyAdventurePointsCache,
} from "../adventurePoints/cache.ts"
import {
  cachedAdventurePoints,
  cachedAdventurePointsForActivatable,
  type BoundAdventurePointsForRated,
} from "../adventurePoints/ratedEntry.ts"
import type { Character } from "../character.ts"
import {
  addOrRemoveDependency,
  type RegistrationMethod,
} from "../dependencies/registrationHelpers.ts"
import { checkMultipleDisjunctionPartsAreValid } from "../prerequisites/disjunctionPrerequisiteMultipartValidation.ts"
import { countMatchingRatedMinimumNumberEntries } from "../prerequisites/single/ratedMinimumNumberPrerequisiteValidation.ts"
import { sumMatchingRatedSumEntries } from "../prerequisites/single/ratedSumPrerequisiteValidation.ts"
import type { EnhancementDependency } from "./enhancement.ts"
import type { RatedDependency } from "./ratedDependency.ts"

export abstract class CharacterAnyRatedEntry<
  Entity extends keyof Gen.EntityMap,
  Activatable extends boolean = false,
> {
  declare ["constructor"]: typeof CharacterAnyRatedEntry

  static readonly minValue: number = 0

  readonly global: Global
  protected readonly character: Character

  readonly id: string
  @observable accessor #value: number | (Activatable extends true ? undefined : never)
  @observable accessor dependencies: RatedDependency[]
  @observable accessor boundAdventurePoints: BoundAdventurePointsForRated[]
  readonly entityName: Entity
  readonly isActivatable: Activatable
  readonly dbEntry: Gen.EntityMap[Entity]

  constructor(
    isActivatable: Activatable,
    global: Global,
    character: Character,
    entityName: Entity,
    id: string,
    dbEntry: Gen.EntityMap[Entity],
    value: number | (Activatable extends true ? undefined : never),
    boundAdventurePoints: BoundAdventurePointsForRated[],
  ) {
    this.global = global
    this.character = character
    this.id = id
    this.#value = value
    this.dependencies = []
    this.boundAdventurePoints = boundAdventurePoints
    this.entityName = entityName
    this.isActivatable = isActivatable
    this.dbEntry = dbEntry
  }

  abstract get improvementCost(): ImprovementCost

  @computed
  get value(): number | (Activatable extends true ? undefined : never) {
    return this.#value
  }

  @action
  setValue(value: number | (Activatable extends true ? undefined : never)) {
    if (typeof value === "number") {
      this.#value = Math.max(this.constructor.minValue, value)
    } else {
      this.#value = value
    }
  }

  @action
  updateValue(fn: (value: number) => number) {
    if (typeof this.#value === "number") {
      this.setValue(fn(this.#value))
    }
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

  abstract get adventurePoints(): AdventurePointsCache

  abstract get minValue(): number | (Activatable extends true ? undefined : never)

  abstract get maxValue(): number | undefined

  @computed
  get isIncreasable() {
    return (
      typeof this.value === "number" && (this.maxValue === undefined || this.maxValue > this.value)
    )
  }

  @computed
  get isDecreasable() {
    return (
      this.character.canRemove &&
      typeof this.value === "number" &&
      this.character.isInCharacterCreation &&
      this.value > (this.minValue ?? 0)
    )
  }

  abstract toJSON(): { id: string }

  getAssociatedAttributeValues(attributeIds: Gen.Attribute_ID[]) {
    return attributeIds.map(attributeId => {
      const attribute = this.character.attributes.getByIdSafe(attributeId)
      return {
        id: attributeId,
        value: attribute.value,
        dbEntry: attribute.dbEntry,
      }
    })
  }

  getMaxValue(attributeIds: Gen.Attribute_ID[], bonusMaximumValue: number = 0) {
    return (
      Math.min(
        this.character.attributes.getHighestAttributeValueOfList(attributeIds) + 2,
        ...nullableToArray(
          this.character.isInCharacterCreation
            ? this.character.experienceLevel.start?.max_skill_rating
            : undefined,
        ),
        ...this.flatMaximumRestrictions,
      ) + bonusMaximumValue
    )
  }

  getHighestRequiredAssociatedAttribute(
    attributeIds: Gen.Attribute_ID[],
    bonusMaximumValue: number = 0,
  ): { id: Gen.Attribute_ID; value: number } | undefined {
    if (this.value === undefined) {
      return undefined
    }

    const singleHighestAttributeId =
      this.character.attributes.getSingleHighestAttributeOfList(attributeIds)?.id

    if (singleHighestAttributeId === undefined) {
      return undefined
    }

    return {
      id: singleHighestAttributeId,
      value: this.value - 2 - bonusMaximumValue,
    }
  }

  abstract get derivedDependencies(): RatedDependency[]

  /**
   * Flattens the list of dependencies to usable
   * values. That means, optional dependencies (objects) will be evaluated and
   * will be included in the resulting list, depending on whether it has to follow
   * the optional dependency or not. The result is a plain `List` of all
   * non-optional dependencies.
   */
  @computed
  get applyingDependencies(): RatedDependency[] {
    return (
      this.derivedDependencies.length === 0
        ? this.dependencies
        : this.dependencies.concat(this.derivedDependencies)
    ).filter(dep => {
      if (dep.isPartOfDisjunction) {
        return checkMultipleDisjunctionPartsAreValid(
          this.global.db.getInstanceOfEntityById.bind(this.global.db),
          this.character.prerequisiteCapabilities,
          dep.source,
          dep.index,
        )
      }

      switch (dep.value.tag) {
        case "Fixed":
          return true
        case "MinimumNumberAtMinimumValue":
          return (
            countMatchingRatedMinimumNumberEntries(
              this.character.prerequisiteCapabilities,
              dep.value.minimumValue,
              dep.value.target,
            ) <= dep.value.minimumCount
          )
        case "Sum":
          return (
            sumMatchingRatedSumEntries(
              this.character.prerequisiteCapabilities,
              dep.value.targetIds,
            ) <= dep.value.sum
          )
        default:
          return assertExhaustive(dep.value)
      }
    })
  }

  @computed
  get flatMinimumRestrictions(): number[] {
    return this.applyingDependencies.flatMap(dep => {
      switch (dep.value.tag) {
        case "Fixed":
          return dep.value.value.tag === "Minimum" ? [dep.value.value.minimum] : []
        case "MinimumNumberAtMinimumValue":
          return [dep.value.minimumValue]
        case "Sum":
          return nullableToArray(this.value)
        default:
          return assertExhaustive(dep.value)
      }
    })
  }

  @computed
  get flatMaximumRestrictions(): number[] {
    return this.applyingDependencies.flatMap(dep => {
      switch (dep.value.tag) {
        case "Fixed":
          return dep.value.value.tag === "Maximum" ? [dep.value.value.maximum] : []
        case "MinimumNumberAtMinimumValue":
        case "Sum":
          return []
        default:
          return assertExhaustive(dep.value)
      }
    })
  }
}

export abstract class CharacterRatedEntry<
  Entity extends keyof Gen.EntityMap,
> extends CharacterAnyRatedEntry<Entity, false> {
  constructor(
    global: Global,
    character: Character,
    entityName: Entity,
    id: string,
    dbEntry: Gen.EntityMap[Entity],
    value: number,
    boundAdventurePoints: BoundAdventurePointsForRated[],
  ) {
    super(false, global, character, entityName, id, dbEntry, value, boundAdventurePoints)
  }

  @computed
  get adventurePoints(): AdventurePointsCache {
    return cachedAdventurePoints(
      this.value,
      this.constructor.minValue,
      this.boundAdventurePoints,
      this.improvementCost,
    )
  }

  toJSON(): DisplayedRated {
    return {
      id: this.id,
      value: this.value,
      minValue: this.minValue,
      maxValue: this.maxValue,
      isIncreasable: this.isIncreasable,
      isDecreasable: this.isDecreasable,
    }
  }
}

export abstract class CharacterActivatableRatedEntry<
  Entity extends keyof Gen.EntityMap,
> extends CharacterAnyRatedEntry<Entity, true> {
  constructor(
    global: Global,
    character: Character,
    entityName: Entity,
    id: string,
    dbEntry: Gen.EntityMap[Entity],
    value: number | undefined,
    boundAdventurePoints: BoundAdventurePointsForRated[],
  ) {
    super(true, global, character, entityName, id, dbEntry, value, boundAdventurePoints)
  }

  @computed
  get adventurePoints(): AdventurePointsCache {
    return cachedAdventurePointsForActivatable(
      this.value,
      this.boundAdventurePoints,
      this.improvementCost,
    )
  }

  @computed
  get active(): boolean {
    return this.value !== undefined
  }

  isActive(): this is CharacterAnyRatedEntry<Entity, true> & { value: number; minValue: number } {
    return this.active
  }

  @action
  activate() {
    if (this.value === undefined) {
      this.setValue(0)
    }
  }

  @action
  deactivate() {
    if (this.value !== undefined) {
      this.setValue(undefined)
    }
  }

  abstract get isAvailable(): boolean

  toJSON(): DisplayedActivatableRated {
    return this.isActive()
      ? {
          id: this.id,
          active: true,
          value: this.value,
          minValue: this.minValue,
          maxValue: this.maxValue,
          isIncreasable: this.isIncreasable,
          isDecreasable: this.isDecreasable,
        }
      : {
          id: this.id,
          active: false,
          isAvailable: this.isAvailable,
        }
  }
}

export class Enhancement<Entity extends Gen.SkillWithEnhancementsIdentifier["kind"]> {
  readonly parent: CharacterActivatableRatedWithEnhancements<Entity>
  readonly id: string
  readonly dbEntry: Gen.Enhancement
  readonly adventurePoints: AdventurePointsCache
  @observable accessor dependencies: EnhancementDependency[] = []

  constructor(
    parent: CharacterActivatableRatedWithEnhancements<Entity>,
    id: string,
    dbEntry: Gen.Enhancement,
    dependencies: EnhancementDependency[] = [],
  ) {
    this.parent = parent
    this.id = id
    this.dbEntry = dbEntry
    this.dependencies = dependencies
    this.adventurePoints = new AdventurePointsCache(
      Enhancement.#calculateAdventurePointsForEnhancement(parent, dbEntry),
      0,
    )
  }

  static #calculateAdventurePointsForEnhancement(
    parent: CharacterActivatableRatedWithEnhancements<any>,
    dbEntry: Gen.Enhancement,
  ): number {
    switch (dbEntry.adventurePoints.kind) {
      case "Constant":
        return dbEntry.adventurePoints.Constant
      case "DerivedFromImprovementCost":
        return (
          improvementCostToLinearNumber(parent.improvementCost) *
          dbEntry.adventurePoints.DerivedFromImprovementCost.multiplier
        )
      default:
        return assertExhaustive(dbEntry.adventurePoints)
    }
  }
}

export abstract class CharacterActivatableRatedWithEnhancements<
  Entity extends Gen.SkillWithEnhancementsIdentifier["kind"],
> extends CharacterActivatableRatedEntry<Entity> {
  @observable accessor activeEnhancements: Map<string, Enhancement<Entity>> = new Map()

  @computed
  override get adventurePoints(): AdventurePointsCache {
    return this.activeEnhancements
      .values()
      .reduce((acc, e) => acc.add(e.adventurePoints), super.adventurePoints)
  }

  override toJSON(): DisplayedActivatableRatedWithEnhancements {
    const base = super.toJSON()
    if (base.active) {
      return {
        ...base,
        enhancements: this.global.db
          .getAllChildInstanceContainersForParent(
            "Enhancement",
            Case(this.entityName satisfies Gen.SkillWithEnhancementsIdentifier["kind"], this.id),
          )
          .filter(rated =>
            isEntryFromIncludedPublication(
              rated.content,
              this.global.db.getInstanceOfEntityById.bind(this.global.db),
              this.global.locale.translateMap,
              this.character.rules.publicationOptions,
            ),
          )
          .map(e => ({
            id: e.id,
            dbEntry: e.content,
            active: this.activeEnhancements.get(e.id) !== undefined,
          })),
      }
    } else {
      return base
    }
  }
}

export type DisplayedAnyRated<Activatable extends boolean> = {
  id: string
  value: number | (Activatable extends true ? undefined : never)
  minValue: number | (Activatable extends true ? undefined : never)
  maxValue?: number
  isIncreasable: boolean
  isDecreasable: boolean
}

export type DisplayedRated = DisplayedAnyRated<false>

export type DisplayedActiveActivatableRated = DisplayedAnyRated<false> & { active: true }

export type DisplayedInactiveActivatableRated = {
  id: string
  active: false
  isAvailable: boolean
}

export type DisplayedActivatableRated =
  | DisplayedActiveActivatableRated
  | DisplayedInactiveActivatableRated

export type DisplayedEnhancement = {
  id: string
  dbEntry: Gen.Enhancement
  active: boolean
}

export type DisplayedActiveActivatableRatedWithEnhancements = DisplayedActiveActivatableRated & {
  enhancements: DisplayedEnhancement[]
}

export type DisplayedInactiveActivatableRatedWithEnhancements = DisplayedInactiveActivatableRated

export type DisplayedActivatableRatedWithEnhancements =
  | DisplayedActiveActivatableRatedWithEnhancements
  | DisplayedInactiveActivatableRatedWithEnhancements

type CharacterRatedEntryConstructor<
  Entity extends keyof Gen.EntityMap,
  Activatable extends boolean,
  T extends CharacterAnyRatedEntry<Entity, Activatable>,
> = {
  new (
    global: Global,
    character: Character,
    entityName: Entity,
    id: string,
    dbEntry: Gen.EntityMap[Entity],
    value: number | (Activatable extends true ? undefined : never),
    boundAdventurePoints: BoundAdventurePointsForRated[],
  ): T
  minValue: number
}

export abstract class CharacterAnyRatedEntries<
  Entity extends {
    [K in keyof Gen.EntityMap]: Gen.EntityMap[K] extends {
      src?: Gen.PublicationRefs
      translations: LocaleMap<{ name: string }>
    }
      ? K
      : never
  }[keyof Gen.EntityMap],
  Activatable extends boolean,
  T extends CharacterAnyRatedEntry<Entity, Activatable>,
> {
  readonly global: Global
  protected readonly character: Character
  readonly entityName: Entity
  readonly #entryClass: CharacterRatedEntryConstructor<Entity, Activatable, T>
  readonly #isActivatable: Activatable
  @observable protected accessor rated: Map<string, T> = new Map()

  constructor(
    isActivatable: Activatable,
    global: Global,
    character: Character,
    entityName: Entity,
    entryClass: CharacterRatedEntryConstructor<Entity, Activatable, T>,
  ) {
    this.global = global
    this.character = character
    this.entityName = entityName
    this.#entryClass = entryClass
    this.#isActivatable = isActivatable
  }

  getById(id: string): T | undefined {
    return this.rated.get(id)
  }

  getByIdSafe(id: string): T {
    return this.getById(id) ?? this.#createEmptyWithoutDBEntry(id)
  }

  getValueById(id: string): number | (Activatable extends true ? undefined : never) {
    return (
      this.getById(id)?.value ??
      ((this.#isActivatable ? undefined : this.#entryClass.minValue) as T["value"])
    )
  }

  @computed
  get adventurePointsTotal() {
    return this.rated
      .values()
      .reduce(
        (acc, entry) => addAdventurePointsCaches(acc, entry.adventurePoints),
        emptyAdventurePointsCache,
      )
  }

  @action
  protected createEmpty(id: string, dbEntry: Gen.EntityMap[Entity] | undefined): T {
    if (!dbEntry) {
      throw new Error(`Entry with id ${id} not provided.`)
    }
    return new this.#entryClass(
      this.global,
      this.character,
      this.entityName,
      id,
      dbEntry,
      (this.#isActivatable ? undefined : this.#entryClass.minValue) as T["value"],
      [],
    )
  }

  #createEmptyWithoutDBEntry(id: string): T {
    const dbEntry = this.global.db.getInstanceOfEntityById(this.entityName, id)
    return this.createEmpty(id, dbEntry)
  }

  protected ensureEntryExists(id: string): T {
    return this.rated.getOrInsertComputed(id, () => this.#createEmptyWithoutDBEntry(id))
  }

  @action
  increment(id: string) {
    this.ensureEntryExists(id).increment()
  }

  @action
  decrement(id: string) {
    this.ensureEntryExists(id).decrement()
  }

  @action
  incrementToMax(id: string) {
    this.ensureEntryExists(id).incrementToMax()
  }

  @action
  decrementToMin(id: string) {
    this.ensureEntryExists(id).decrementToMin()
  }

  @computed
  get values(): T[] {
    return this.rated.values().toArray()
  }

  addOrRemoveDependency(id: string, method: RegistrationMethod, dependency: RatedDependency) {
    const entry = this.ensureEntryExists(id)
    addOrRemoveDependency(method, entry.dependencies, dependency)
  }
}

export abstract class CharacterRatedEntries<
  Entity extends {
    [K in keyof Gen.EntityMap]: Gen.EntityMap[K] extends {
      src?: Gen.PublicationRefs
      translations: LocaleMap<{ name: string }>
    }
      ? K
      : never
  }[keyof Gen.EntityMap],
  T extends CharacterRatedEntry<Entity>,
> extends CharacterAnyRatedEntries<Entity, false, T> {
  constructor(
    global: Global,
    character: Character,
    entityName: Entity,
    entryClass: CharacterRatedEntryConstructor<Entity, false, T>,
  ) {
    super(false, global, character, entityName, entryClass)
  }

  @computed
  get entries() {
    return this.global.db
      .getAllInstanceContainersOfEntity(this.entityName)
      .filter(rated =>
        isEntryFromIncludedPublication(
          rated.content as { src?: Gen.PublicationRefs },
          this.global.db.getInstanceOfEntityById.bind(this.global.db),
          this.global.locale.translateMap,
          this.character.rules.publicationOptions,
        ),
      )
      .map(
        (container): ReturnType<T["toJSON"]> =>
          this.getByIdSafe(container.id).toJSON() as ReturnType<T["toJSON"]>,
      )
  }
}

export abstract class CharacterActivatableRatedEntries<
  Entity extends {
    [K in keyof Gen.EntityMap]: Gen.EntityMap[K] extends {
      src?: Gen.PublicationRefs
      translations: LocaleMap<{ name: string }>
    }
      ? K
      : never
  }[keyof Gen.EntityMap],
  T extends CharacterActivatableRatedEntry<Entity>,
> extends CharacterAnyRatedEntries<Entity, true, T> {
  constructor(
    global: Global,
    character: Character,
    entityName: Entity,
    entryClass: CharacterRatedEntryConstructor<Entity, true, T>,
  ) {
    super(true, global, character, entityName, entryClass)
  }

  isActive(id: string): boolean {
    return this.getById(id)?.isActive() ?? false
  }

  @action
  activate(id: string) {
    this.ensureEntryExists(id).activate()
  }

  @action
  deactivate(id: string) {
    this.ensureEntryExists(id).deactivate()
  }

  @computed
  get inactiveForDisplay(): Extract<ReturnType<T["toJSON"]>, { active: false }>[] {
    return this.global.db
      .getAllInstanceContainersOfEntity(this.entityName)
      .filter(
        rated =>
          isEntryFromIncludedPublication(
            rated.content as { src?: Gen.PublicationRefs },
            this.global.db.getInstanceOfEntityById.bind(this.global.db),
            this.global.locale.translateMap,
            this.character.rules.publicationOptions,
          ) && this.getById(rated.id)?.value === undefined,
      )
      .map(
        (container): Extract<ReturnType<T["toJSON"]>, { active: false }> =>
          this.getByIdSafe(container.id).toJSON() as Extract<
            ReturnType<T["toJSON"]>,
            { active: false }
          >,
      )
  }

  @computed
  get activeCount(): number {
    return count(this.rated.values().toArray(), entry => entry.isActive())
  }

  @computed
  get active(): T[] {
    return this.rated
      .values()
      .filter(entry => entry.isActive())
      .toArray()
  }

  @computed
  get activeForDisplay(): Extract<ReturnType<T["toJSON"]>, { active: true }>[] {
    return this.rated
      .values()
      .filter(
        rated =>
          rated.isActive() &&
          isEntryFromIncludedPublication(
            rated.dbEntry as { src?: Gen.PublicationRefs },
            this.global.db.getInstanceOfEntityById.bind(this.global.db),
            this.global.locale.translateMap,
            this.character.rules.publicationOptions,
          ),
      )
      .map(
        (entry): Extract<ReturnType<T["toJSON"]>, { active: true }> =>
          entry.toJSON() as Extract<ReturnType<T["toJSON"]>, { active: true }>,
      )
      .toArray()
  }
}

export abstract class CharacterActivatableRatedEntriesWithEnhancements<
  Entity extends Gen.SkillWithEnhancementsIdentifier["kind"],
  T extends CharacterActivatableRatedWithEnhancements<Entity>,
> extends CharacterActivatableRatedEntries<Entity, T> {
  addOrRemoveEnhancementDependency(
    parentId: string,
    enhancmenetId: string,
    method: RegistrationMethod,
    dependency: EnhancementDependency,
  ) {
    const entry = this.ensureEntryExists(parentId)
    const enhancement = entry.activeEnhancements.get(enhancmenetId)
    if (enhancement) {
      addOrRemoveDependency(method, enhancement.dependencies, dependency)
    }
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
