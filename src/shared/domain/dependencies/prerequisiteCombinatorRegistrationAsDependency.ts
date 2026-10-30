import { type RangeBounds, isInRange } from "@elyukai/utils/range"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type {
  PlainPrerequisites,
  PrerequisiteForLevel,
  PrerequisitesElement,
  PrerequisitesForLevels,
} from "@optolith/database-schema/gen"
import type { Character } from "../character.ts"
import { type RegistrationFunction, RegistrationMethod } from "./registrationHelpers.ts"

const registerOrUnregisterPrerequisiteElement = <T, SourceId>(
  registerOrUnregister: RegistrationFunction<T, SourceId>,
  element: PrerequisitesElement<T>,
  method: RegistrationMethod,
  character: Character,
  sourceId: SourceId,
  index: number,
): void => {
  switch (element.kind) {
    case "Single":
      return registerOrUnregister(element.Single, method, character, sourceId, index, false)
    case "Group":
      return element.Group.list.forEach(p =>
        registerOrUnregister(p, method, character, sourceId, index, false),
      )
    case "Disjunction":
      return element.Disjunction.list.forEach(p =>
        registerOrUnregister(p, method, character, sourceId, index, true),
      )
    default:
      return assertExhaustive(element)
  }
}

/**
 * Checks a plain list of prerequisites if they’re matched.
 */
export const registerOrUnregisterPlainPrerequisites = <T, SourceId>(
  registerOrUnregister: RegistrationFunction<T, SourceId>,
  prerequisites: PlainPrerequisites<T>,
  method: RegistrationMethod,
  character: Character,
  sourceId: SourceId,
): void =>
  prerequisites.forEach((p, index) =>
    registerOrUnregisterPrerequisiteElement(
      registerOrUnregister,
      p,
      method,
      character,
      sourceId,
      index,
    ),
  )

const registerOrUnregisterPrerequisiteForLevel = <T, SourceId>(
  registerOrUnregister: RegistrationFunction<T, SourceId>,
  prerequisiteForLevel: PrerequisiteForLevel<T>,
  method: RegistrationMethod,
  character: Character,
  levelRange: RangeBounds,
  sourceId: SourceId,
  index: number,
): void => {
  if (isInRange(levelRange, prerequisiteForLevel.level)) {
    registerOrUnregisterPrerequisiteElement(
      registerOrUnregister,
      prerequisiteForLevel.prerequisite,
      method,
      character,
      sourceId,
      index,
    )
  }
}

/**
 * Checks a list of level-specific prerequisites if they’re matched up to a
 * given level.
 */
export const registerOrUnregisterPrerequisitesForLevels = <T, SourceId>(
  registerOrUnregister: RegistrationFunction<T, SourceId>,
  prerequisitesForLevels: PrerequisitesForLevels<T>,
  method: RegistrationMethod,
  character: Character,
  levelRange: RangeBounds,
  sourceId: SourceId,
): void =>
  prerequisitesForLevels.forEach((p, index) =>
    registerOrUnregisterPrerequisiteForLevel(
      registerOrUnregister,
      p,
      method,
      character,
      levelRange,
      sourceId,
      index,
    ),
  )
