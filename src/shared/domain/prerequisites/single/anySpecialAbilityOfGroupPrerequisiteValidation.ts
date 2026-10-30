import type {
  ActivatableIdentifier,
  AnySpecialAbilityOfGroupPrerequisite,
} from "@optolith/database-schema/gen"

/**
 * Checks a single activatable prerequisite if it’s matched.
 */
export const checkAnySpecialAbilityOfGroupPrerequisite = (
  caps: {
    isAnyActivatableActive: <E extends ActivatableIdentifier["kind"]>(entity: E) => boolean
  },
  p: AnySpecialAbilityOfGroupPrerequisite,
): boolean => caps.isAnyActivatableActive(p.group.kind)
