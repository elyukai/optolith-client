import { Draft } from "@reduxjs/toolkit"
import {
  PlainPrerequisites,
  PrerequisiteForLevel,
  PrerequisiteGroup,
  PrerequisitesDisjunction,
  PrerequisitesElement,
  PrerequisitesForLevels,
} from "optolith-database-schema/types/_Prerequisite"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { Character } from "../character.ts"
import { RegistrationFunction, RegistrationMethod } from "./registrationHelpers.ts"

const registerOrUnregisterPrerequisiteGroup = <T, SourceId>(
  method: RegistrationMethod,
  character: Draft<Character>,
  group: PrerequisiteGroup<T>,
  sourceId: SourceId,
  index: number,
  registerOrUnregister: RegistrationFunction<T, SourceId>,
): void =>
  group.list.forEach(p => registerOrUnregister(method, character, p, sourceId, index, false))

const registerOrUnregisterPrerequisiteDisjunction = <T, SourceId>(
  method: RegistrationMethod,
  character: Draft<Character>,
  disjunction: PrerequisitesDisjunction<T>,
  sourceId: SourceId,
  index: number,
  registerOrUnregister: RegistrationFunction<T, SourceId>,
): void =>
  disjunction.list.forEach(p => registerOrUnregister(method, character, p, sourceId, index, true))

const registerOrUnregisterPrerequisiteElement = <T, SourceId>(
  method: RegistrationMethod,
  character: Draft<Character>,
  element: PrerequisitesElement<T>,
  sourceId: SourceId,
  index: number,
  registerOrUnregister: RegistrationFunction<T, SourceId>,
): void => {
  switch (element.tag) {
    case "Single":
      return registerOrUnregister(method, character, element.single, sourceId, index, false)
    case "Group":
      return registerOrUnregisterPrerequisiteGroup(
        method,
        character,
        element.group,
        sourceId,
        index,
        registerOrUnregister,
      )
    case "Disjunction":
      return registerOrUnregisterPrerequisiteDisjunction(
        method,
        character,
        element.disjunction,
        sourceId,
        index,
        registerOrUnregister,
      )
    default:
      return assertExhaustive(element)
  }
}

/**
 * Checks a plain list of prerequisites if they’re matched.
 */
export const registerOrUnregisterPlainPrerequisites = <T, SourceId>(
  method: RegistrationMethod,
  character: Draft<Character>,
  prerequisites: PlainPrerequisites<T>,
  sourceId: SourceId,
  registerOrUnregister: RegistrationFunction<T, SourceId>,
): void =>
  prerequisites.forEach((p, index) =>
    registerOrUnregisterPrerequisiteElement(
      method,
      character,
      p,
      sourceId,
      index,
      registerOrUnregister,
    ),
  )

const registerOrUnregisterPrerequisiteForLevel = <T, SourceId>(
  method: RegistrationMethod,
  character: Draft<Character>,
  prerequisiteForLevel: PrerequisiteForLevel<T>,
  level: number,
  sourceId: SourceId,
  index: number,
  registerOrUnregister: RegistrationFunction<T, SourceId>,
): void => {
  if (prerequisiteForLevel.level <= level) {
    registerOrUnregisterPrerequisiteElement(
      method,
      character,
      prerequisiteForLevel.prerequisite,
      sourceId,
      index,
      registerOrUnregister,
    )
  }
}

/**
 * Checks a list of level-specific prerequisites if they’re matched up to a
 * given level.
 */
export const registerOrUnregisterPrerequisitesForLevels = <T, SourceId>(
  method: RegistrationMethod,
  character: Draft<Character>,
  prerequisitesForLevels: PrerequisitesForLevels<T>,
  level: number,
  sourceId: SourceId,
  registerOrUnregister: RegistrationFunction<T, SourceId>,
): void =>
  prerequisitesForLevels.forEach((p, index) =>
    registerOrUnregisterPrerequisiteForLevel(
      method,
      character,
      p,
      level,
      sourceId,
      index,
      registerOrUnregister,
    ),
  )
