import { Culture } from "optolith-database-schema/types/Culture"
import { ProfessionPackage } from "optolith-database-schema/types/Profession"
import { Race, RaceVariant } from "optolith-database-schema/types/Race"
import { isNotNullish } from "../../../utils/nullable.ts"
import { assertExhaustive } from "../../../utils/typeSafety.ts"

/**
 * Checks a single activatable prerequisite if it’s matched.
 */
export const checkCommonSuggestedByRCPPrerequisite = (
  caps: {
    getRace: () => Race | undefined
    getRaceVariant: () => RaceVariant | undefined
    getCulture: () => Culture | undefined
    getProfessionPackage: () => ProfessionPackage | undefined
  },
  sourceKind: "Advantage" | "Disadvantage",
  sourceId: number,
): boolean => {
  const race = caps.getRace()
  const raceVariant = caps.getRaceVariant()
  const culture = caps.getCulture()
  const profession = caps.getProfessionPackage()

  return [
    race?.automatic_advantages,
    race?.strongly_recommended_advantages,
    race?.strongly_recommended_disadvantages,
    raceVariant?.common_advantages,
    raceVariant?.common_disadvantages,
    culture?.common_advantages,
    culture?.common_disadvantages,
    profession?.suggested_advantages,
    profession?.suggested_disadvantages,
  ]
    .filter(isNotNullish)
    .flat()
    .some(
      (() => {
        switch (sourceKind) {
          case "Advantage":
            return ref => {
              switch (ref.id.tag) {
                case "Advantage":
                  return ref.id.advantage === sourceId
                case "Disadvantage":
                  return false
                default:
                  return assertExhaustive(ref.id)
              }
            }
          case "Disadvantage":
            return ref => {
              switch (ref.id.tag) {
                case "Advantage":
                  return false
                case "Disadvantage":
                  return ref.id.disadvantage === sourceId
                default:
                  return assertExhaustive(ref.id)
              }
            }
          default:
            return assertExhaustive(sourceKind)
        }
      })(),
    )
}
