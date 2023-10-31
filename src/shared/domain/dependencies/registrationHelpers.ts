import { Draft } from "@reduxjs/toolkit"
import { deepEqual } from "../../utils/compare.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { Character } from "../character.ts"

/**
 * Whether to add or remove a prerequisite as a dependency.
 */
export enum RegistrationMethod {
  Add,
  Remove,
}

/**
 * Adds or removes a dependency from a character slice. When adding a
 * dependency and no entry exists for the given id, a new entry is created
 * using the given `createDefault` function. Removing a dependency is done by
 * a deep comparison of the dependency objects.
 */
export const addOrRemoveDependency = <
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
  switch (method) {
    case RegistrationMethod.Add: {
      const entry = (slice[id] ??= createDefault(id))
      entry.dependencies.push(dep)
      break
    }

    case RegistrationMethod.Remove: {
      const entry = slice[id]
      const index = entry?.dependencies.findIndex(d => deepEqual(d, dep)) ?? -1
      if (index > -1) {
        entry?.dependencies.splice(index, 1)
      }
      break
    }

    default:
      return assertExhaustive(method)
  }
}

/**
 * A function that registers or unregisters a prerequisite as a dependency on
 * the character's draft.
 */
export type RegistrationFunction<T, SourceId> = (
  method: RegistrationMethod,
  character: Draft<Character>,
  p: T,
  sourceId: SourceId,
  index: number,
  isPartOfDisjunction: boolean,
) => void
