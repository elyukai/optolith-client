import type {
  ActivatableIdentifier,
  AdventurePointsValue,
  EntityMap,
} from "@optolith/database-schema/gen"
import { computed, get, observable } from "mobx"
import type { Database } from "../../database.ts"
import { isNotNullish } from "../../utils/nullable.ts"
import { BoundAdventurePointsForActivatable } from "../adventurePoints/activatableEntry.ts"
import {
  addAdventurePointsCaches,
  AdventurePointsCache,
  emptyAdventurePointsCache,
} from "../adventurePoints/cache.ts"
import type { Character } from "../character.ts"
import { equalsIdentifier, splitIdentifierObject } from "../identifier.ts"
import type {
  ActivatableNameComponents,
  DisplayedActiveActivatableCost,
} from "./activatableActive.ts"
import { ActivatableDependency } from "./activatableDependency.ts"
import type { DisplayedInactiveActivatableOption } from "./activatableInactive.ts"

/**
 * An activated activatable identifier.
 */
export type TinyActivatable = {
  id: number
  active: true
}

/**
 * A simple map of activated activatable identifiers.
 */
export type TinyActivatableMap = {
  [id: number]: TinyActivatable
}

/**
 * Returns if a given tiny activatable entry is active.
 */
export const isTinyActivatableActive = (activatable: TinyActivatable | undefined): boolean =>
  activatable?.active ?? false

/**
 * An activatable entry.
 */
export type Activatable = Readonly<{
  /**
   * The activatable identifier.
   * @integer
   */
  id: number

  /**
   * One or multiple activations of the activatable.
   */
  instances: ActivatableInstance[]

  /**
   * The accumulated used adventure points value of all instances.
   */
  cachedAdventurePoints: AdventurePointsCache

  /**
   * The activatable's dependencies.
   */
  dependencies: ActivatableDependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t affect the costs of
   * buying the activatable entry. They may specify for which configuration of
   * an entry they count, just like a prerequisite.
   */
  boundAdventurePoints: BoundAdventurePointsForActivatable[]
}>

export class CharacterActivatable<Entity extends ActivatableIdentifier["kind"]> {
  readonly #character: Character

  /**
   * The activatable identifier.
   */
  readonly id: string

  readonly dbEntry: EntityMap[Entity]

  /**
   * One or multiple activations of the activatable.
   */
  @observable accessor instances: ActivatableInstance[]

  /**
   * The accumulated used adventure points value of all instances.
   */
  @computed
  get adventurePoints(): AdventurePointsCache {
    // TODO
    return emptyAdventurePointsCache
  }

  /**
   * The activatable's dependencies.
   */
  @observable accessor dependencies: ActivatableDependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t affect the costs of
   * buying the activatable entry. They may specify for which configuration of
   * an entry they count, just like a prerequisite.
   */
  @observable accessor boundAdventurePoints: BoundAdventurePointsForActivatable[]

  constructor(
    character: Character,
    id: string,
    dbEntry: EntityMap[Entity],
    instances: ActivatableInstance[],
    dependencies: ActivatableDependency[],
    boundAdventurePoints: BoundAdventurePointsForActivatable[],
  ) {
    this.#character = character
    this.id = id
    this.dbEntry = dbEntry
    this.instances = instances
    this.dependencies = dependencies
    this.boundAdventurePoints = boundAdventurePoints
  }

  static createEmpty<Entity extends ActivatableIdentifier["kind"]>(
    id: string,
    dbEntry: EntityMap[Entity] | undefined,
    character: Character,
  ): CharacterActivatable<Entity> {
    if (!dbEntry) {
      throw new Error(`Attribute with id ${id} not provided.`)
    }
    return new CharacterActivatable(character, id, dbEntry, [], [], [])
  }

  /**
   * Get the level of the first instance of a given activatable entry, if it is
   * active. Defaults to `0`.
   */
  @computed
  get firstLevel(): number {
    return this.instances?.[0]?.level ?? 0
  }

  /**
   * Returns the number of instances of a given activatable entry.
   */
  @computed
  get activationsCount(): number {
    return this.instances.length
  }

  /**
   * Returns if a present activatable entry is active. Defaults to `false`.
   */
  @computed
  get isActive(): boolean {
    return this.activationsCount > 0
  }

  /**
   * Returns if a given option is active in any instance of a given activatable.
   * It defaults to the first option in the options array, but a different index
   * can be specified.
   */
  isOptionActive(optionId: PredefinedActivatableOption["id"], atIndex = 0): boolean {
    return (
      this.instances.some(instance => {
        const optionAtIndex = instance.options?.[atIndex]
        return optionAtIndex?.type === "Predefined" && equalsIdentifier(optionAtIndex.id, optionId)
      }) ?? false
    )
  }

  /**
   * Returns the number of instances of a given activatable entry that have a
   * given option active. It defaults to the first option in the options array,
   * but a different index can be specified.
   */
  countOptions(
    optionId: SelectOptionIdentifier,
    options: { atIndex?: number; ignoreWithCustomAdventurePointsValue?: boolean } = {},
  ): number {
    const { atIndex = 0, ignoreWithCustomAdventurePointsValue = false } = options
    return this.instances.filter(instance => {
      const optionAtIndex = instance.options?.[atIndex]
      return (
        optionAtIndex?.type === "Predefined" &&
        equalsIdentifier(optionAtIndex.id, optionId) &&
        (!ignoreWithCustomAdventurePointsValue || !hasCustomAdventurePointsValue(instance))
      )
    }).length
  }

  /**
   * Returns the option value of the first instance of a given activatable entry.
   * It defaults to the first option in the options array, but a different index
   * can be specified.
   */
  getFirstOption(atIndex = 0): ActivatableOption | undefined {
    return this.instances[0]?.options?.[atIndex]
  }

  /**
   * Returns the option value of the first instance of a given activatable entry
   * if it corresponds to a given predefined type. It defaults to the first option
   * in the options array, but a different index can be specified.
   */
  getFirstOptionOfType(tag: SelectOptionIdentifier["tag"], atIndex = 0): number | undefined {
    const firstOption = this.getFirstOption(atIndex)
    if (firstOption?.type === "Predefined" && firstOption.id.tag === tag) {
      return splitIdentifierObject(firstOption.id)[1]
    }
    return undefined
  }

  /**
   * Returns option values of instances of a given activatable entry. It defaults
   * to the first option in the options array, but a different index can be
   * specified.
   */
  getOptions(atIndex = 0): ActivatableOption[] {
    return this.instances.map(instance => instance.options?.[atIndex]).filter(isNotNullish)
  }

  toJSON() {
    return {
      id: this.id,
      instances: this.instances,
      dependencies: this.dependencies,
      boundAdventurePoints: this.boundAdventurePoints,
    }
  }
}

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedActiveActivatable<
  Entity extends ActivatableIdentifier["kind"] = ActivatableIdentifier["kind"],
> = {
  [E in Entity]: {
    type: E
    id: string
    dbEntry: EntityMap[E]
    charEntry: ReturnType<CharacterActivatable<E>["toJSON"]>
    instanceIndex: number
    isRemovable: boolean
    minLevel?: number
    maxLevel?: number
    cost: DisplayedActiveActivatableCost
    name: ActivatableNameComponents
  }
}[Entity]

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedInactiveActivatable<
  Entity extends ActivatableIdentifier["kind"] = ActivatableIdentifier["kind"],
> = {
  [E in Entity]: {
    type: E
    id: string
    dbEntry: EntityMap[E]
    charEntry: ReturnType<CharacterActivatable<E>["toJSON"]> | undefined
    isAvailable: boolean
    options: DisplayedInactiveActivatableOption[]
    level?: {
      maximum: number
      placement: "before" | "after"
    }
    /**
     * A modified version or the adventure points value of the entry.
     */
    apValue?: AdventurePointsValue
  }
}[Entity]

export class CharacterActivatables<Entity extends ActivatableIdentifier["kind"]> {
  readonly #db: Database
  readonly #character: Character
  readonly #entity: Entity
  @observable accessor #activatables: Record<string, CharacterActivatable<Entity>> = {}

  constructor(db: Database, character: Character, entity: Entity) {
    this.#db = db
    this.#character = character
    this.#entity = entity
  }

  getById(id: string): CharacterActivatable<Entity> | undefined {
    return get(this.#activatables, id)
  }

  getByIdSafe(id: string, dbEntry?: EntityMap[Entity]): CharacterActivatable<Entity> {
    return this.getById(id) ?? this.#createEmpty(id, dbEntry)
  }

  getInstancesById(id: string): ActivatableInstance[] {
    return this.getById(id)?.instances ?? []
  }

  #createEmpty(
    id: string,
    dbEntry: EntityMap[Entity] | undefined = this.#db.getInstanceOfEntityById(this.#entity, id),
  ): CharacterActivatable<Entity> {
    return CharacterActivatable.createEmpty(id, dbEntry, this.#character)
  }

  @computed
  get adventurePointsTotal() {
    return Object.values(this.#activatables).reduce(
      (acc, entry) => addAdventurePointsCaches(acc, entry.adventurePoints),
      emptyAdventurePointsCache,
    )
  }

  #ensureEntryExists(id: string): CharacterActivatable<Entity> {
    if (!this.#activatables[id]) {
      this.#activatables[id] = this.#createEmpty(id)
    }
    return this.#activatables[id]
  }

  @computed
  get active(): DisplayedActiveActivatable<Entity>[] {
    return Object.values(this.#activatables).flatMap(entry =>
      entry.instances.map((instance, instanceIndex): DisplayedActiveActivatable<Entity> => ({
        type: this.#entity,
        id: entry.id,
        dbEntry: entry.dbEntry,
        charEntry: entry.toJSON(),
        instanceIndex,
        isRemovable: true, // TODO
        minLevel: undefined, // TODO
        maxLevel: undefined, // TODO
        cost: {
          kind: "fix", // TODO
          fix: 0, // TODO
        },
        name: {
          full: "", // TODO
          fullWithoutLevel: "", // TODO
          base: "", // TODO
          options: [], // TODO
        },
      })),
    )
  }

  @computed
  get inactive(): DisplayedInactiveActivatable<Entity>[] {
    return this.#db
      .getAllInstanceContainersOfEntity(this.#entity)
      .map((container): DisplayedInactiveActivatable<Entity> => ({
        type: this.#entity,
        id: container.id,
        dbEntry: container.content,
        charEntry: this.getById(container.id)?.toJSON(),
        isAvailable: true, // TODO
        options: [], // TODO
        apValue: undefined, // TODO
        level: undefined, // TODO
      }))
  }
}

/**
 * A single activation of an activatable entry.
 */
export type ActivatableInstance = {
  /**
   * One or multiple options for the activatable. The meaning depends on the activatable.
   */
  options?: ActivatableOption[]

  /**
   * The instance level (if the activatable has levels).
   */
  level?: number

  /**
   * If provided, a custom adventure points value has been set for this instance.
   */
  customAdventurePointsValue?: number

  /**
   * A list of used bound adventure points for this instance.
   */
  usedBoundAdventurePoints?: BoundAdventurePointsForActivatable[]
}

/**
 * An option for an activatable entry.
 */
export type ActivatableOption = PredefinedActivatableOption | CustomActivatableOption

/**
 * A predefined option for an activatable entry.
 */
export type PredefinedActivatableOption = {
  type: "Predefined"

  /**
   * An identifier referencing a different entry.
   */
  id: SelectOptionIdentifier
}

/**
 * A predicate for a predefined option on an activatable entry.
 */
export const isPredefinedActivatableOption = (
  option: ActivatableOption,
): option is PredefinedActivatableOption => option.type === "Predefined"

/**
 * A custom option for an activatable entry, handled as user-entered text.
 */
export type CustomActivatableOption = {
  type: "Custom"

  /**
   * A user-entered text.
   */
  value: string
}

/**
 * A predicate for a custom option on an activatable entry.
 */
export const isCustomActivatableOption = (
  option: ActivatableOption,
): option is CustomActivatableOption => option.type === "Custom"

/**
 * Returns whether a select option matches a given activatable option.
 */
export const matchesOptionId = (id: SelectOptionIdentifier, option: ActivatableOption) =>
  isPredefinedActivatableOption(option) && equalsIdentifier(option.id, id)

/**
 * A map of activatable entries.
 */
export type ActivatableMap = {
  [id: number]: Activatable
}

/**
 * Creates an initial dynamic activatable entry.
 */
export const createEmptyDynamicActivatable = (id: number): Activatable => ({
  id,
  instances: [],
  cachedAdventurePoints: emptyAdventurePointsCache,
  dependencies: [],
  boundAdventurePoints: [],
})

/**
 * Creates a dynamic activatable entry.
 */
export const createDynamicActivatable = (
  id: number,
  instances: ActivatableInstance[],
  cachedAdventurePoints: AdventurePointsCache | number,
  options: {
    dependencies?: ActivatableDependency[]
    boundAdventurePoints?: BoundAdventurePointsForActivatable[]
  } = {},
): Activatable => ({
  id,
  instances,
  cachedAdventurePoints:
    typeof cachedAdventurePoints === "number"
      ? { general: cachedAdventurePoints, bound: 0 }
      : cachedAdventurePoints,
  dependencies: options.dependencies ?? [],
  boundAdventurePoints: options.boundAdventurePoints ?? [],
})

/**
 * Get the level of the first instance of a given activatable entry, if it is
 * active. Defaults to `0`.
 */
export const firstLevel = (activatable: Activatable | undefined) =>
  activatable?.instances?.[0]?.level ?? 0

/**
 * Returns if a present activatable entry is active. Defaults to `false`.
 */
export const isActive = (activatable: Activatable | undefined): activatable is Activatable =>
  (activatable?.instances.length ?? 0) > 0

/**
 * Return whether the instance has a custom adventure points value.
 */
export const hasCustomAdventurePointsValue = (instance: ActivatableInstance): boolean =>
  instance.customAdventurePointsValue !== undefined

/**
 * Returns if a given option is active in any instance of a given activatable.
 * It defaults to the first option in the options array, but a different index
 * can be specified.
 */
export const isOptionActive = (
  activatable: Activatable | undefined,
  optionId: PredefinedActivatableOption["id"],
  atIndex = 0,
): boolean =>
  activatable?.instances.some(instance => {
    const optionAtIndex = instance.options?.[atIndex]
    return optionAtIndex?.type === "Predefined" && equalsIdentifier(optionAtIndex.id, optionId)
  }) ?? false

/**
 * Returns the number of instances of a given activatable entry.
 */
export const countActivations = (activatable: Activatable | undefined): number =>
  activatable?.instances.length ?? 0

/**
 * Returns the number of instances of a given activatable entry that have a
 * given option active. It defaults to the first option in the options array,
 * but a different index can be specified.
 */
export const countOptions = (
  activatable: Activatable | undefined | ActivatableInstance[],
  optionId: SelectOptionIdentifier,
  options: { atIndex?: number; ignoreWithCustomAdventurePointsValue?: boolean } = {},
): number => {
  const { atIndex = 0, ignoreWithCustomAdventurePointsValue = false } = options
  return (Array.isArray(activatable) ? activatable : (activatable?.instances ?? [])).filter(
    instance => {
      const optionAtIndex = instance.options?.[atIndex]
      return (
        optionAtIndex?.type === "Predefined" &&
        equalsIdentifier(optionAtIndex.id, optionId) &&
        (!ignoreWithCustomAdventurePointsValue || !hasCustomAdventurePointsValue(instance))
      )
    },
  ).length
}

/**
 * Returns the option value of the first instance of a given activatable entry.
 * It defaults to the first option in the options array, but a different index
 * can be specified.
 */
export const getFirstOption = (
  activatable: Activatable | undefined | ActivatableInstance[],
  atIndex = 0,
): ActivatableOption | undefined =>
  (Array.isArray(activatable) ? activatable : (activatable?.instances ?? []))[0]?.options?.[atIndex]

/**
 * Returns the option value of the first instance of a given activatable entry
 * if it corresponds to a given predefined type. It defaults to the first option
 * in the options array, but a different index can be specified.
 */
export const getFirstOptionOfType = (
  activatable: Activatable | undefined | ActivatableInstance[],
  tag: SelectOptionIdentifier["tag"],
  atIndex = 0,
): number | undefined => {
  const firstOption = getFirstOption(activatable, atIndex)
  if (firstOption?.type === "Predefined" && firstOption.id.tag === tag) {
    return splitIdentifierObject(firstOption.id)[1]
  }
  return undefined
}

/**
 * Returns option values of instances of a given activatable entry. It defaults
 * to the first option in the options array, but a different index can be
 * specified.
 */
export const getOptions = (
  activatable: Activatable | undefined | ActivatableInstance[],
  atIndex = 0,
): ActivatableOption[] =>
  (Array.isArray(activatable) ? activatable : (activatable?.instances ?? []))
    .map(instance => instance.options?.[atIndex])
    .filter(isNotNullish)
