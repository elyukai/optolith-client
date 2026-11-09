import { isNotNullish, mapNullable } from "@elyukai/utils/nullable"
import type {
  ActivatableIdentifier,
  ActivatablePrerequisite,
  PreconditionGroup,
  RequirableSelectOptionIdentifier,
} from "@optolith/database-schema/gen"
import type { Case } from "tsondb/schema/gen"
import type {
  CharacterActivatable,
  CharacterActivatableInstance,
} from "../../activatable/activatable.ts"
import { equalsCase } from "../../databaseEnum.ts"

/**
 * Checks a single activatable prerequisite if it’s matched.
 */
export const checkActivatablePrerequisite = (
  caps: {
    getActivatableById: <E extends ActivatableIdentifier["kind"]>(
      id: Case<E, string>,
    ) => CharacterActivatable<E> | undefined
    checkPrecondition: (pre: PreconditionGroup) => boolean
  },
  p: ActivatablePrerequisite,
): boolean => {
  const dynamicEntry = caps.getActivatableById(p.id)

  if (p.when !== undefined && !p.when.every(caps.checkPrecondition)) {
    // ignore if precondition is not met
    return true
  }

  const isActive = dynamicEntry?.isActive ?? false

  if ((p.level === undefined && p.options === undefined) || !isActive) {
    // Shortcut for when there are not any additional requirements, which means the prerequisite is
    // satisfied if the entry is active, and not satisfied if it is not active
    //
    // Also shortcut for when there are additional requirements for an active entry, but the entry
    // is not active, in which case it cannot be satisfied
    return isActive === p.active
  }

  const checkLevel =
    (pLevel: number) =>
    (i: CharacterActivatableInstance): boolean =>
      i.level !== undefined && i.level >= pLevel

  const checkOptions =
    (pOptions: RequirableSelectOptionIdentifier[]) =>
    (i: CharacterActivatableInstance): boolean =>
      pOptions.every((option, index) => {
        const instanceOption = i.options?.[index]
        return instanceOption?.type === "Predefined" && equalsCase(instanceOption.id, option)
      })

  // all checks must satisfy, if applicable depending on the prerequisite
  const checks: ((i: CharacterActivatableInstance) => boolean)[] = [
    mapNullable(p.level, checkLevel),
    mapNullable(p.options, checkOptions),
  ].filter(isNotNullish)

  // for at least one instance, all applicable checks must be satified if it
  // should be active, or it must not be satisfied for all instances if it
  // should not be active
  return (dynamicEntry?.instances.some(i => checks.every(f => f(i))) ?? false) === p.active
}
