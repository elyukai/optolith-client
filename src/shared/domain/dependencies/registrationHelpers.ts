import { deepEqual } from "@elyukai/utils/equality"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Character } from "../character.ts"

/**
 * Whether to add or remove a prerequisite as a dependency.
 */
export type RegistrationMethod = "Add" | "Remove"

/**
 * Whether to add or remove a prerequisite as a dependency.
 */
export const RegistrationMethod = Object.freeze({
  Add: "Add",
  Remove: "Remove",
})

/**
 * Adds or removes a dependency from a dependency array. Removing a dependency
 * is done by a deep comparison of the dependency objects.
 */
export const addOrRemoveDependency = <D>(
  method: RegistrationMethod,
  dependencies: D[],
  dep: D,
): void => {
  switch (method) {
    case RegistrationMethod.Add: {
      dependencies.push(dep)
      break
    }

    case RegistrationMethod.Remove: {
      const index = dependencies.findIndex(d => deepEqual(d, dep)) ?? -1
      if (index > -1) {
        dependencies.splice(index, 1)
      }
      break
    }

    default:
      return assertExhaustive(method)
  }
}

/**
 * Adds or removes a dependency from a character slice. When adding a
 * dependency and no entry exists for the given identifier, a new entry is
 * created using the given `createDefault` function. Removing a dependency is
 * done by a deep comparison of the dependency objects.
 */
export const addOrRemoveDependencyInSlice = <
  K extends string | number | symbol,
  D,
  T extends { dependencies: D[] },
>(
  method: RegistrationMethod,
  slice: Record<K, T>,
  id: K,
  createDefault: (id: K) => T,
  dep: D,
): void => {
  const entry = (slice[id] ??= createDefault(id))
  addOrRemoveDependency(method, entry.dependencies, dep)
}

/**
 * A function that registers or unregisters a prerequisite as a dependency on
 * the character's draft.
 */
export type RegistrationFunction<T, SourceId> = (
  p: T,
  method: RegistrationMethod,
  character: Character,
  sourceId: SourceId,
  index: number,
  isPartOfDisjunction: boolean,
) => void

/**
 * Additional data some registration functions need.
 */
export type RegistrationFunctionCapabilities = {
  ancestorBloodAdvantageIds: number[]
  closeCombatTechniqueIds: number[]
  rangedCombatTechniqueIds: number[]
  blessedTraditionChurchIds: number[]
  blessedTraditionShamanisticIds: number[]
  magicalTraditionIds: number[]
  magicalTraditionIdsThatCanLearnRituals: number[]
  magicalTraditionIdsThatCanBindFamiliars: number[]
  getSpellIdsByPropertyId: (id: number) => number[]
  getRitualIdsByPropertyId: (id: number) => number[]
  getLiturgicalChantIdsByAspectId: (id: number) => number[]
  getCeremonyIdsByAspectId: (id: number) => number[]
}
