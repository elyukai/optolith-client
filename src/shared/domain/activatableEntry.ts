import { Equality } from "../utils/compare.ts"

export type Activatable = {
  /**
   * The activatable identifier.
   * @integer
   */
  id: number

  /**
   * One or multiple activations of the activatable.
   */
  instances: {
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
  }[]
}

export type ActivatableOption = PredefinedActivatableOption | CustomActivatableOption

export type PredefinedActivatableOption = {
  type: "Predefined"

  /**
   * An identifier referencing a different entry.
   */
  id: {
    /**
     * The entry type or `"Generic"` if it references a select option local to the entry.
     */
    type:
      | "Generic"
      | "Blessing"
      | "Cantrip"
      | "TradeSecret"
      | "Script"
      | "AnimalShape"
      | "ArcaneBardTradition"
      | "ArcaneDancerTradition"
      | "SexPractice"
      | "Race"
      | "Culture"
      | "BlessedTradition"
      | "Element"
      | "Property"
      | "Aspect"
      | "Disease"
      | "Poison"
      | "Language"
      | "Skill"
      | "CloseCombatTechnique"
      | "RangedCombatTechnique"
      | "LiturgicalChant"
      | "Ceremony"
      | "Spell"
      | "Ritual"

    /**
     * The numeric identifier.
     */
    value: number
  }
}

export type CustomActivatableOption = {
  type: "Custom"

  /**
   * A user-entered text.
   */
  value: string
}

export type ActivatableMap = {
  [id: number]: Activatable
}

const equalOptionId: Equality<PredefinedActivatableOption["id"]> = (a, b) =>
  a.type === b.type && a.value === b.value

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
    return optionAtIndex?.type === "Predefined" && equalOptionId(optionAtIndex.id, optionId)
  }) ?? false

/**
 * Returns the number of instances of a given activatable entry that have a
 * given option active. It defaults to the first option in the options array,
 * but a different index can be specified.
 */
export const countOptions = (
  activatable: Activatable | undefined,
  optionId: PredefinedActivatableOption["id"],
  atIndex = 0,
): number =>
  activatable?.instances.filter(instance => {
    const optionAtIndex = instance.options?.[atIndex]
    return optionAtIndex?.type === "Predefined" && equalOptionId(optionAtIndex.id, optionId)
  }).length ?? 0
