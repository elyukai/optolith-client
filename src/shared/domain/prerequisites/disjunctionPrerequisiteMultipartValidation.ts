import type {
  ActivatableIdentifier,
  AdvantageDisadvantagePrerequisiteGroup,
  GeneralPrerequisiteGroup,
  PlainPrerequisites,
  PrerequisitesForLevels,
  PublicationPrerequisiteGroup,
  SkillWithEnhancementsIdentifier,
} from "@optolith/database-schema/gen"
import { fromUniformCase } from "tsondb/schema/gen"
import type { GetInstanceById } from "../../database.ts"
import type { Case } from "../databaseEnum.ts"
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
    (ActivatableIdentifier | SkillWithEnhancementsIdentifier)["kind"] | "Publication"
  >,
  caps: CapabilitiesForType<{
    kind: AdvantageDisadvantagePrerequisiteGroup["kind"] | "Publication"
  }>,
  source: ActivatableIdentifier | SkillWithEnhancementsIdentifier | Case<"Publication", string>,
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
      return checkPlainPrerequisite<GeneralPrerequisiteGroup | PublicationPrerequisiteGroup>(
        getInstanceById(source),
        index,
        p => validatePrerequisite(p, caps),
      )
  }
}
