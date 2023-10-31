import { RacePrerequisite } from "optolith-database-schema/types/prerequisites/single/RacePrerequisite"

/**
 * Checks a single race prerequisite if it’s matched.
 */
export const checkRacePrerequisite = (
  caps: { getCurrentRaceIdentifier: () => number | undefined },
  p: RacePrerequisite,
): boolean => {
  const id = caps.getCurrentRaceIdentifier()

  if (id === undefined) {
    return !p.active
  } else {
    return id === p.id.race
  }
}
