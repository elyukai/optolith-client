import type {
  TinyActivatableIdentifier,
  TinyActivatablePrerequisite,
} from "@optolith/database-schema/gen"

/**
 * Checks a single tiny activatable prerequisite if it’s matched.
 */
export const checkTinyActivatablePrerequisite = (
  caps: {
    isTinyActivatableActive: (id: TinyActivatableIdentifier) => boolean
  },
  p: TinyActivatablePrerequisite,
): boolean => caps.isTinyActivatableActive(p.id)
