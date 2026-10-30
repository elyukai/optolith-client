import { isNotNullish } from "@elyukai/utils/nullable"
import type { Culture, ProfessionVersion, RaceVariant } from "@optolith/database-schema/gen"
import { assertExhaustive } from "@elyukai/utils/typeSafety"

const getListsBySourceKind = (
  raceVariant: RaceVariant | undefined,
  culture: Culture | undefined,
  professionVersion: ProfessionVersion | undefined,
  sourceKind: "Advantage" | "Disadvantage",
) => {
  switch (sourceKind) {
    case "Advantage":
      return {
        automatic: [
          raceVariant?.automatic_advantages,
          raceVariant?.strongly_recommended_advantages,
        ],
        common: [
          raceVariant?.common_advantages,
          culture?.common_advantages,
          professionVersion?.suggested_advantages,
        ],
      }
    case "Disadvantage":
      return {
        automatic: [
          raceVariant?.automatic_disadvantages,
          raceVariant?.strongly_recommended_disadvantages,
        ],
        common: [
          raceVariant?.common_disadvantages,
          culture?.common_disadvantages,
          professionVersion?.suggested_disadvantages,
        ],
      }
    default:
      return assertExhaustive(sourceKind)
  }
}

/**
 * Checks a single activatable prerequisite if it’s matched.
 */
export const checkCommonSuggestedByRCPPrerequisite = (
  caps: {
    raceVariant: RaceVariant | undefined
    culture: Culture | undefined
    professionVersion: ProfessionVersion | undefined
  },
  source: {
    kind: "Advantage" | "Disadvantage"
    id: string
  },
): boolean => {
  const { automatic, common } = getListsBySourceKind(
    caps.raceVariant,
    caps.culture,
    caps.professionVersion,
    source.kind,
  )

  return (
    automatic
      .filter(isNotNullish)
      .flat()
      .some(ref => ref.id === source.id) ||
    common
      .filter(isNotNullish)
      .flat()
      .some(ref => {
        switch (ref.kind) {
          case "Single":
            return ref.Single.id === source.id
          case "Group":
            return ref.Group.list.some(subRef => subRef.id === source.id)
          default:
            return assertExhaustive(ref)
        }
      })
  )
}
