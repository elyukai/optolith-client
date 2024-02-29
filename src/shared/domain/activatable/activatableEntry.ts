import { SelectOptionIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { isNotNullish } from "../../utils/nullable.ts"
import { BoundAdventurePointsForActivatable } from "../adventurePoints/activatableEntry.ts"
import { AdventurePointsCache, emptyAdventurePointsCache } from "../adventurePoints/cache.ts"
import { equalsIdentifier, splitIdentifierObject } from "../identifier.ts"
import { ActivatableDependency } from "./activatableDependency.ts"

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

/**
 * A single activation of an activatable entry.
 */
export type ActivatableInstance = {
  /**
   * One or multiple options for the activatable. The meaning depends on the activatable.
   * @minItems 1
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
  return (Array.isArray(activatable) ? activatable : activatable?.instances ?? []).filter(
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
  (Array.isArray(activatable) ? activatable : activatable?.instances ?? [])[0]?.options?.[atIndex]

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
  (Array.isArray(activatable) ? activatable : activatable?.instances ?? [])
    .map(instance => instance.options?.[atIndex])
    .filter(isNotNullish)
