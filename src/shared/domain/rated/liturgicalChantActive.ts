import { Blessing } from "optolith-database-schema/types/Blessing"
import { Ceremony } from "optolith-database-schema/types/Ceremony"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { LiturgicalChant } from "optolith-database-schema/types/LiturgicalChant"
import { isNotNullish } from "../../utils/nullable.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { Activatable } from "../activatable/activatableEntry.ts"
import { FilterApplyingRatedDependencies } from "../dependencies/filterApplyingDependencies.ts"
import { getHighestAttributeValue } from "./attribute.ts"
import {
  getLiturgicalChantMaximum,
  getLiturgicalChantMinimum,
  isLiturgicalChantDecreasable,
  isLiturgicalChantIncreasable,
} from "./liturgicalChantActiveBounds.ts"
import {
  ActivatableRatedWithEnhancementsMap,
  ActiveActivatableRatedWithEnhancements,
  Rated,
  isRatedWithEnhancementsActive,
} from "./ratedEntry.ts"

/**
 * A static active blessing for combination with other types.
 */
export type DisplayedActiveBlessing = {
  kind: "blessing"
  static: Blessing
}

/**
 * A combination of a static and corresponding dynamic active liturgical chant
 * entry, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 */
export type DisplayedActiveLiturgicalChant = {
  kind: "liturgicalChant"
  static: LiturgicalChant
  dynamic: ActiveActivatableRatedWithEnhancements
  minimum: number | undefined
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
}

/**
 * A combination of a static and corresponding dynamic active ceremony entry,
 * extended by value bounds, and full logic for if the value can be increased or
 * decreased.
 */
export type DisplayedActiveCeremony = {
  kind: "ceremony"
  static: Ceremony
  dynamic: ActiveActivatableRatedWithEnhancements
  minimum: number | undefined
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
}

/**
 * A union of all displayed active liturgy kinds.
 */
export type DisplayedActiveLiturgy =
  | DisplayedActiveBlessing
  | DisplayedActiveLiturgicalChant
  | DisplayedActiveCeremony

/**
 * Returns all active liturgical chants with their corresponding dynamic
 * entries, extended by value bounds, and full logic for if the value can be
 * increased or decreased.
 * @param kind The value for the `kind` property.
 * @param staticLiturgicalChants A map of static liturgical chants or
 * ceremonies.
 * @param dynamicLiturgicalChants A map of dynamic liturgical chants or
 * ceremonies.
 * @param isInCharacterCreation Whether the character is in character creation.
 * @param startExperienceLevel The start experience level.
 * @param canRemove Whether liturgical chants or ceremonies can be removed.
 * @param exceptionalSkill The dynamic *Exceptional Skill* entry.
 * @param getAttributeById A function that returns a dynamic attribute entry by
 * identifier.
 * @param filterApplyingDependencies A function that filters a list of
 * dependencies by if they apply to the entry.
 * @param liturgicalChantsAbove10ByAspect A map from aspect identifiers to the
 * number of liturgical chants or ceremonies above 10 that have that aspect.
 * @param activeAspectKnowledges A list of aspects that have an active aspect
 * knowledge.
 */
export const getActiveLiturgicalChantsOrCeremonies = <
  K extends "liturgicalChant" | "ceremony",
  T extends LiturgicalChant | Ceremony,
>(
  kind: K,
  staticLiturgicalChants: Record<number, T>,
  dynamicLiturgicalChants: ActivatableRatedWithEnhancementsMap,
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel,
  canRemove: boolean,
  exceptionalSkill: Activatable | undefined,
  getAttributeById: (id: number) => Rated | undefined,
  filterApplyingDependencies: FilterApplyingRatedDependencies,
  liturgicalChantsAbove10ByAspect: Record<number, number>,
  activeAspectKnowledges: number[],
): {
  kind: K
  static: T
  dynamic: ActiveActivatableRatedWithEnhancements
  minimum: number | undefined
  maximum: number
  isIncreasable: boolean
  isDecreasable: boolean
}[] =>
  Object.values(dynamicLiturgicalChants)
    .filter(isRatedWithEnhancementsActive)
    .map(dynamicLiturgicalChant => {
      const staticLiturgicalChant = staticLiturgicalChants[dynamicLiturgicalChant.id]

      if (staticLiturgicalChant === undefined) {
        return undefined
      }

      const minimum = getLiturgicalChantMinimum(
        liturgicalChantsAbove10ByAspect,
        activeAspectKnowledges,
        staticLiturgicalChant,
        dynamicLiturgicalChant,
        filterApplyingDependencies,
      )

      const maximum = getLiturgicalChantMaximum(
        refs => getHighestAttributeValue(getAttributeById, refs),
        activeAspectKnowledges,
        staticLiturgicalChant,
        isInCharacterCreation,
        startExperienceLevel,
        exceptionalSkill,
        (() => {
          switch (kind) {
            case "liturgicalChant":
              return "LiturgicalChant"
            case "ceremony":
              return "Ceremony"
            default:
              return assertExhaustive(kind)
          }
        })(),
      )

      return {
        kind,
        static: staticLiturgicalChant,
        dynamic: dynamicLiturgicalChant,
        minimum,
        maximum,
        isDecreasable: isLiturgicalChantDecreasable(dynamicLiturgicalChant, minimum, canRemove),
        isIncreasable: isLiturgicalChantIncreasable(dynamicLiturgicalChant, maximum),
      }
    })
    .filter(isNotNullish)