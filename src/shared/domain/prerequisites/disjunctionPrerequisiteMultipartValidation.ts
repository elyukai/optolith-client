import type {
  ActivatableIdentifier,
  AdvantageDisadvantagePrerequisiteGroup,
  PlainPrerequisites,
  PrerequisitesForLevels,
  SkillWithEnhancementsIdentifier,
} from "@optolith/database-schema/gen"
import { fromUniformCase } from "tsondb/schema/gen"
import type { GetInstanceById } from "../../database.ts"
import { prepareAdvantageDisadvantagePrerequisite } from "./fullPrerequisiteValidationForType.ts"
import { checkIfMultipleDisjunctionPartsAreValid } from "./prerequisiteCombinatorValidation.ts"
import { validatePrerequisite, type CapabilitiesForType } from "./single/index.ts"

const checkPlainPrerequisite = <P>(
  entry: { prerequisites?: PlainPrerequisites<P> | PrerequisitesForLevels<P> } | undefined,
  index: number,
  validate: (prerequisite: P) => boolean,
): boolean => {
  const prerequisite = entry?.prerequisites?.[index]

  if (prerequisite === undefined) {
    return true
  }

  return checkIfMultipleDisjunctionPartsAreValid(prerequisite, validate)
}

/**
 * Checks if other parts of a disjunction are valid, so that a dependency from
 * that disjunction can be ignored.
 */
export const checkMultipleDisjunctionPartsAreValid = (
  getInstanceById: GetInstanceById<
    (ActivatableIdentifier | SkillWithEnhancementsIdentifier)["kind"]
  >,
  caps: CapabilitiesForType<{ kind: AdvantageDisadvantagePrerequisiteGroup["kind"] }>,
  source: ActivatableIdentifier | SkillWithEnhancementsIdentifier,
  index: number,
): boolean => {
  switch (source.kind) {
    case "Advantage":
    case "Disadvantage":
      return checkPlainPrerequisite(getInstanceById(source), index, p =>
        validatePrerequisite(
          prepareAdvantageDisadvantagePrerequisite(p, source.kind, fromUniformCase(source)),
          caps,
        ),
      )
    default:
      return checkPlainPrerequisite(getInstanceById(source), index, p =>
        validatePrerequisite(p, caps),
      )
  }
}
