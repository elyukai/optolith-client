import {
  PlainPrerequisites,
  PrerequisiteForLevel,
  PrerequisiteGroup,
  PrerequisitesDisjunction,
  PrerequisitesElement,
  PrerequisitesForLevels,
} from "optolith-database-schema/types/_Prerequisite"
import { someCount } from "../../utils/array.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"

const checkPrerequisiteGroup = <T>(
  group: PrerequisiteGroup<T>,
  validate: (prerequisite: T) => boolean,
): boolean => group.list.every(validate)

const checkPrerequisiteDisjunction = <T>(
  disjunction: PrerequisitesDisjunction<T>,
  validate: (prerequisite: T) => boolean,
): boolean => disjunction.list.some(validate)

const checkPrerequisiteElement = <T>(
  element: PrerequisitesElement<T>,
  validate: (prerequisite: T) => boolean,
): boolean => {
  switch (element.tag) {
    case "Single":
      return validate(element.single)
    case "Group":
      return checkPrerequisiteGroup(element.group, validate)
    case "Disjunction":
      return checkPrerequisiteDisjunction(element.disjunction, validate)
    default:
      return assertExhaustive(element)
  }
}

/**
 * Checks a single prerequisite element if it’s a disjunction with multiple
 * matched parts, i.e. more than one sub-prerequisite is matched.
 */
export const checkIfMultipleDisjunctionPartsAreValid = <T>(
  element: PrerequisitesElement<T>,
  validate: (prerequisite: T) => boolean,
): boolean => {
  switch (element.tag) {
    case "Single":
    case "Group":
      return false
    case "Disjunction":
      return someCount(element.disjunction.list, validate, 2)
    default:
      return assertExhaustive(element)
  }
}

/**
 * Checks a plain list of prerequisites if they’re matched.
 */
export const checkPlainPrerequisites = <T>(
  prerequisites: PlainPrerequisites<T>,
  validate: (prerequisite: T) => boolean,
): boolean => prerequisites.every(p => checkPrerequisiteElement(p, validate))

const checkPrerequisiteForLevel = <T>(
  prerequisiteForLevel: PrerequisiteForLevel<T>,
  level: number,
  validate: (prerequisite: T) => boolean,
): boolean =>
  prerequisiteForLevel.level > level ||
  checkPrerequisiteElement(prerequisiteForLevel.prerequisite, validate)

/**
 * Checks a list of level-specific prerequisites if they’re matched up to a
 * given level.
 */
export const checkPrerequisitesForLevels = <T>(
  prerequisitesForLevels: PrerequisitesForLevels<T>,
  level: number,
  validate: (prerequisite: T) => boolean,
): boolean => prerequisitesForLevels.every(p => checkPrerequisiteForLevel(p, level, validate))
