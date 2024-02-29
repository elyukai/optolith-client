import { Draft } from "@reduxjs/toolkit"
import {
  PlainPrerequisites,
  PrerequisiteForLevel,
  PrerequisiteGroup,
  PrerequisitesDisjunction,
  PrerequisitesElement,
  PrerequisitesForLevels,
} from "optolith-database-schema/types/_Prerequisite"
import { RangeBounds, isInRange } from "../../utils/range.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { Character } from "../character.ts"
import { RegistrationFunction, RegistrationMethod } from "./registrationHelpers.ts"

const registerOrUnregisterPrerequisiteGroup = <T, SourceId, C>(
  method: RegistrationMethod,
  character: Draft<Character>,
  group: PrerequisiteGroup<T>,
  sourceId: SourceId,
  index: number,
  registerOrUnregister: RegistrationFunction<T, SourceId, C>,
  ...rest: C extends undefined ? [] : [capabilities: C]
): void =>
  group.list.forEach(p =>
    registerOrUnregister(method, character, p, sourceId, index, false, ...rest),
  )

const registerOrUnregisterPrerequisiteDisjunction = <T, SourceId, C>(
  method: RegistrationMethod,
  character: Draft<Character>,
  disjunction: PrerequisitesDisjunction<T>,
  sourceId: SourceId,
  index: number,
  registerOrUnregister: RegistrationFunction<T, SourceId, C>,
  ...rest: C extends undefined ? [] : [capabilities: C]
): void =>
  disjunction.list.forEach(p =>
    registerOrUnregister(method, character, p, sourceId, index, true, ...rest),
  )

const registerOrUnregisterPrerequisiteElement = <T, SourceId, C>(
  method: RegistrationMethod,
  character: Draft<Character>,
  element: PrerequisitesElement<T>,
  sourceId: SourceId,
  index: number,
  registerOrUnregister: RegistrationFunction<T, SourceId, C>,
  ...rest: C extends undefined ? [] : [capabilities: C]
): void => {
  switch (element.tag) {
    case "Single":
      return registerOrUnregister(
        method,
        character,
        element.single,
        sourceId,
        index,
        false,
        ...rest,
      )
    case "Group":
      return registerOrUnregisterPrerequisiteGroup(
        method,
        character,
        element.group,
        sourceId,
        index,
        registerOrUnregister,
        ...rest,
      )
    case "Disjunction":
      return registerOrUnregisterPrerequisiteDisjunction(
        method,
        character,
        element.disjunction,
        sourceId,
        index,
        registerOrUnregister,
        ...rest,
      )
    default:
      return assertExhaustive(element)
  }
}

/**
 * Checks a plain list of prerequisites if they’re matched.
 */
export const registerOrUnregisterPlainPrerequisites = <T, SourceId, C = undefined>(
  method: RegistrationMethod,
  character: Draft<Character>,
  prerequisites: PlainPrerequisites<T>,
  sourceId: SourceId,
  registerOrUnregister: RegistrationFunction<T, SourceId, C>,
  ...rest: C extends undefined ? [] : [capabilities: C]
): void =>
  prerequisites.forEach((p, index) =>
    registerOrUnregisterPrerequisiteElement(
      method,
      character,
      p,
      sourceId,
      index,
      registerOrUnregister,
      ...rest,
    ),
  )

const registerOrUnregisterPrerequisiteForLevel = <T, SourceId, C>(
  method: RegistrationMethod,
  character: Draft<Character>,
  prerequisiteForLevel: PrerequisiteForLevel<T>,
  levelRange: RangeBounds,
  sourceId: SourceId,
  index: number,
  registerOrUnregister: RegistrationFunction<T, SourceId, C>,
  ...rest: C extends undefined ? [] : [capabilities: C]
): void => {
  if (isInRange(levelRange, prerequisiteForLevel.level)) {
    registerOrUnregisterPrerequisiteElement(
      method,
      character,
      prerequisiteForLevel.prerequisite,
      sourceId,
      index,
      registerOrUnregister,
      ...rest,
    )
  }
}

/**
 * Checks a list of level-specific prerequisites if they’re matched up to a
 * given level.
 */
export const registerOrUnregisterPrerequisitesForLevels = <T, SourceId, C = undefined>(
  method: RegistrationMethod,
  character: Draft<Character>,
  prerequisitesForLevels: PrerequisitesForLevels<T>,
  levelRange: RangeBounds,
  sourceId: SourceId,
  registerOrUnregister: RegistrationFunction<T, SourceId, C>,
  ...rest: C extends undefined ? [] : [capabilities: C]
): void =>
  prerequisitesForLevels.forEach((p, index) =>
    registerOrUnregisterPrerequisiteForLevel(
      method,
      character,
      p,
      levelRange,
      sourceId,
      index,
      registerOrUnregister,
      ...rest,
    ),
  )
