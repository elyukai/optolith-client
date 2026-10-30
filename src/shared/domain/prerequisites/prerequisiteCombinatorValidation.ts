import { someCount } from "@elyukai/utils/array/reductions"
import type {
  PlainPrerequisites,
  PrerequisiteForLevel,
  PrerequisiteGroup,
  PrerequisitesDisjunction,
  PrerequisitesElement,
  PrerequisitesForLevels,
} from "@optolith/database-schema/gen"
import { assertExhaustive } from "@elyukai/utils/typeSafety"

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
  switch (element.kind) {
    case "Single":
      return validate(element.Single)
    case "Group":
      return checkPrerequisiteGroup(element.Group, validate)
    case "Disjunction":
      return checkPrerequisiteDisjunction(element.Disjunction, validate)
    default:
      return assertExhaustive(element)
  }
}

/**
 * Checks a single prerequisite element if it’s a disjunction with multiple
 * matched parts, i.e. more than one sub-prerequisite is matched.
 */
export const checkIfMultipleDisjunctionPartsAreValid = <T>(
  element: PrerequisitesElement<T> | PrerequisiteForLevel<T>,
  validate: (prerequisite: T) => boolean,
): boolean => {
  if ("level" in element) {
    return checkIfMultipleDisjunctionPartsAreValid(element.prerequisite, validate)
  }

  switch (element.kind) {
    case "Single":
    case "Group":
      return false
    case "Disjunction":
      return someCount(element.Disjunction.list, validate, 2)
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
