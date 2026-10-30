import type { Race_ID, RacePrerequisite } from "@optolith/database-schema/gen"

/**
 * Checks a single race prerequisite if it’s matched.
 */
export const checkRacePrerequisite = (
  caps: { raceId: Race_ID | undefined },
  p: RacePrerequisite,
): boolean => {
  if (caps.raceId === undefined) {
    return !p.active
  } else {
    return (caps.raceId === p.id) === p.active
  }
}
