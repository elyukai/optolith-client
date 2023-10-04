import { Aspect } from "optolith-database-schema/types/Aspect"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { SkillTradition } from "optolith-database-schema/types/_Blessed"
import { LiturgyIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { ImprovementCost } from "optolith-database-schema/types/_ImprovementCost"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { BlessedTradition } from "optolith-database-schema/types/specialAbility/BlessedTradition"
import { LiturgiesSortOrder } from "../../main_window/slices/settingsSlice.ts"
import { count, countByMany } from "../utils/array.ts"
import { Compare, compareAt, compareNullish, numAsc, reduceCompare } from "../utils/compare.ts"
import { isNotNullish } from "../utils/nullable.ts"
import { TranslateMap } from "../utils/translate.ts"
import { assertExhaustive } from "../utils/typeSafety.ts"
import { Activatable, countOptions } from "./activatableEntry.ts"
import { compareImprovementCost, fromRaw } from "./adventurePoints/improvementCost.ts"
import { AspectIdentifier } from "./identifier.ts"
import { DisplayedActiveLiturgy } from "./liturgicalChantActive.ts"
import { DisplayedInactiveLiturgy } from "./liturgicalChantInactive.ts"
import {
  ActivatableRated,
  ActivatableRatedMap,
  ActivatableRatedValue,
  ActivatableRatedWithEnhancementsMap,
  isRatedActive,
  isRatedWithEnhancementsActive,
} from "./ratedEntry.ts"

/**
 * Returns the value for a dynamic liturgical chant entry that might not exist
 * yet.
 */
export const getLiturgicalChantValue = (
  dynamic: ActivatableRated | undefined,
): number | undefined => dynamic?.value

// /**
//  * Checks if the passed liturgical chant or blessing is valid for the current
//  * active blessed tradition.
//  */
// export const isOwnTradition =
//   (blessedTradition : Record<SpecialAbility>) =>
//   (entry : Record<LiturgicalChant> | Record<Blessing>) : boolean => {
//     const numeric_tradition_id = mapBlessedTradIdToNumId (SAA.id (blessedTradition))

//     return any<BlessedTradition> (e => e === BlessedTradition.General
//                                        || elem<BlessedTradition> (e) (numeric_tradition_id))
//                                  (LCAL.tradition (entry))
//   }

/**
 * Extracts the list of aspect identifiers from a list of tradition objects.
 */
export const flattenAspectIds = (traditions: SkillTradition[]): number[] =>
  traditions
    .flatMap(tradition => {
      switch (tradition.tag) {
        case "GeneralAspect":
          return [tradition.general_aspect]
        case "Tradition":
          return tradition.tradition.aspects ?? []
        default:
          return assertExhaustive(tradition)
      }
    })
    .map(aspect => aspect.id.aspect)

/**
 * Returns the translation of all aspects relevant to the current active blessed
 * tradition. If the tradition has no aspects, the name of the tradition is used
 * instead.
 */
export const getAspectsForTranslation = (
  traditions: SkillTradition[],
  activeBlessedTradition: BlessedTradition,
  getAspectById: (id: number) => Aspect | undefined,
  translateMap: TranslateMap,
): string[] =>
  traditions
    .flatMap(tradition => {
      switch (tradition.tag) {
        case "GeneralAspect": {
          const isShamanisticGeneral =
            tradition.general_aspect.id.aspect === AspectIdentifier.AllgemeinSchamanenritus

          if (isShamanisticGeneral === activeBlessedTradition.is_shamanistic) {
            return translateMap(getAspectById(tradition.general_aspect.id.aspect)?.translations)
              ?.name
          } else {
            return []
          }
        }
        case "Tradition": {
          if (tradition.tradition.tradition.id.blessed_tradition === activeBlessedTradition.id) {
            if (activeBlessedTradition.aspects === undefined) {
              return translateMap(activeBlessedTradition.translations)?.name
            } else {
              return (
                tradition.tradition.aspects?.map(
                  aspectRef => translateMap(getAspectById(aspectRef.id.aspect)?.translations)?.name,
                ) ?? []
              )
            }
          }

          return []
        }
        default:
          return assertExhaustive(tradition)
      }
    })
    .filter(isNotNullish)

/**
 * Counts the number of liturgical chants that are active and have a value
 * greater than 10 for each aspect.
 */
export const getLiturgicalChantsAbove10ByAspect = (
  getTraditions: (id: LiturgyIdentifier) => SkillTradition[],
  dynamicLiturgicalChants: ActivatableRatedMap,
  dynamicCeremonies: ActivatableRatedMap,
): Record<number, number> => {
  const prepareEntity = (
    ratedMap: ActivatableRatedMap,
    numberToId: (id: number) => LiturgyIdentifier,
  ) =>
    Object.values(ratedMap)
      .filter(isRatedActive)
      .flatMap(dynamicEntry =>
        flattenAspectIds(getTraditions(numberToId(dynamicEntry.id))).map(
          aspectId => [aspectId, dynamicEntry.value] as const,
        ),
      )

  return [
    ...prepareEntity(dynamicLiturgicalChants, id => ({
      tag: "LiturgicalChant",
      liturgical_chant: id,
    })),
    ...prepareEntity(dynamicCeremonies, id => ({ tag: "Ceremony", ceremony: id })),
  ].reduce<Record<number, number>>(
    (acc, [aspectId, value]) =>
      value >= 10 ? { ...acc, [aspectId]: (acc[aspectId] ?? 0) + 1 } : acc,
    {},
  )
}

/**
 * Returns the highest required attribute and its value for a liturgical chant,
 * if any.
 */
export const getHighestRequiredAttributeForLiturgicalChant = (
  getSingleHighestCheckAttributeId: (check: SkillCheck) => number | undefined,
  staticLiturgicalChant: { id: number; check: SkillCheck },
  dynamicLiturgicalChant: { value: ActivatableRatedValue },
  exceptionalSkill: Activatable | undefined,
  type: "LiturgicalChant" | "Ceremony",
): { id: number; value: number } | undefined => {
  const singleHighestAttributeId = getSingleHighestCheckAttributeId(staticLiturgicalChant.check)

  if (singleHighestAttributeId === undefined || dynamicLiturgicalChant.value === undefined) {
    return undefined
  }

  const exceptionalSkillBonus = countOptions(exceptionalSkill, {
    type,
    value: staticLiturgicalChant.id,
  })

  return {
    id: singleHighestAttributeId,
    value: dynamicLiturgicalChant.value - 2 - exceptionalSkillBonus,
  }
}

/**
 * Counts all active liturgical chants and ceremonies.
 */
export const countActiveLiturgicalChants = (
  dynamicLiturgicalChants: ActivatableRatedWithEnhancementsMap,
  dynamicCeremonies: ActivatableRatedWithEnhancementsMap,
) =>
  count(Object.values(dynamicLiturgicalChants), isRatedWithEnhancementsActive) +
  count(Object.values(dynamicCeremonies), isRatedWithEnhancementsActive)

/**
 * Checks if the maximum number of liturgical chants has been reached.
 */
export const isMaximumOfLiturgicalChantsReached = (
  activeCount: number,
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel,
) =>
  isInCharacterCreation
    ? activeCount >= startExperienceLevel.max_number_of_spells_liturgical_chants
    : false

/**
 * Checks if the liturgical chant belongs to a blessed tradition.
 */
export const belongsToBlessedTradition = (
  traditions: SkillTradition[],
  activeTradition: BlessedTradition,
): boolean =>
  traditions.some(tradition => {
    switch (tradition.tag) {
      case "GeneralAspect":
        return (
          tradition.general_aspect.id.aspect ===
          (activeTradition.is_shamanistic
            ? AspectIdentifier.AllgemeinSchamanenritus
            : AspectIdentifier.General)
        )
      case "Tradition":
        return tradition.tradition.tradition.id.blessed_tradition === activeTradition.id
      default:
        return assertExhaustive(tradition)
    }
  })

/**
 * Counts the number of active liturgical chants that belong to a blessed
 * tradition that is not the active one, by tradition.
 */
export const countActiveByUnfamiliarTradition = <T extends { traditions: SkillTradition[] }>(
  dynamicEntries: ActivatableRatedWithEnhancementsMap,
  staticEntries: { [id: number]: T },
  activeBlessedTradition: BlessedTradition,
): { [traditionId: number]: number } =>
  countByMany(
    Object.values(dynamicEntries)
      .map(dynamicEntry => staticEntries[dynamicEntry.id])
      .filter(
        (staticEntry): staticEntry is NonNullable<typeof staticEntry> =>
          isNotNullish(staticEntry) &&
          !belongsToBlessedTradition(staticEntry.traditions, activeBlessedTradition),
      ),
    staticLiturgicalChant =>
      staticLiturgicalChant.traditions.flatMap(tradition =>
        tradition.tag === "Tradition" ? tradition.tradition.tradition.id.blessed_tradition : [],
      ),
  )

/**
 * Checks if any of the passed traditions matches the predicate. General
 * aspects are ignored.
 */
export const anyBlessedTradition = (
  traditions: SkillTradition[],
  predicate: (traditionId: number) => boolean,
): boolean =>
  traditions.some(
    tradition =>
      tradition.tag === "Tradition" &&
      predicate(tradition.tradition.tradition.id.blessed_tradition),
  )

const getNameOfDisplayedLiturgy =
  (translateMap: TranslateMap) =>
  (liturgy: DisplayedInactiveLiturgy | DisplayedActiveLiturgy): string =>
    (() => {
      switch (liturgy.kind) {
        case "blessing":
          return translateMap(liturgy.static.translations)
        case "liturgicalChant":
          return translateMap(liturgy.static.translations)
        case "ceremony":
          return translateMap(liturgy.static.translations)
        default:
          return assertExhaustive(liturgy)
      }
    })?.name ?? ""

const getImprovementCostDisplayedLiturgy = (
  liturgy: DisplayedInactiveLiturgy | DisplayedActiveLiturgy,
): ImprovementCost | undefined => {
  switch (liturgy.kind) {
    case "blessing":
      return undefined
    case "liturgicalChant":
    case "ceremony":
      return liturgy.static.improvement_cost
    default:
      return assertExhaustive(liturgy)
  }
}

const getGroupNumberDisplayedLiturgy = (
  liturgy: DisplayedInactiveLiturgy | DisplayedActiveLiturgy,
): number => {
  switch (liturgy.kind) {
    case "blessing":
      return 1
    case "liturgicalChant":
      return 2
    case "ceremony":
      return 3
    default:
      return assertExhaustive(liturgy)
  }
}

/**
 * Filters and sorts the displayed liturgies.
 */
export const filterAndSortDisplayed = <T extends DisplayedActiveLiturgy | DisplayedInactiveLiturgy>(
  visibileLiturgies: T[],
  filterText: string,
  sortOrder: LiturgiesSortOrder,
  translateMap: TranslateMap,
  localeCompare: Compare<string>,
) => {
  const getName = getNameOfDisplayedLiturgy(translateMap)
  return (
    filterText === ""
      ? visibileLiturgies
      : visibileLiturgies.filter(c => getName(c).toLowerCase().includes(filterText.toLowerCase()))
  ).sort(
    (() => {
      switch (sortOrder) {
        case LiturgiesSortOrder.Name:
          return compareAt(getName, localeCompare)
        case LiturgiesSortOrder.Group:
          return reduceCompare(
            compareAt(getGroupNumberDisplayedLiturgy, numAsc),
            compareAt(getName, localeCompare),
          )
        case LiturgiesSortOrder.ImprovementCost:
          return reduceCompare(
            compareAt(
              c => fromRaw(getImprovementCostDisplayedLiturgy(c)),
              compareNullish(compareImprovementCost),
            ),
            compareAt(getName, localeCompare),
          )
        default:
          return assertExhaustive(sortOrder)
      }
    })(),
  )
}

// export type LiturgicalChantBlessingCombined = Record<LiturgicalChantWithRequirements>
//                                             | Record<BlessingCombined>

// const wikiEntryCombined =
//   (x : LiturgicalChantBlessingCombined) : Record<LiturgicalChant> | Record<Blessing> =>
//     LiturgicalChantWithRequirements.is (x)
//       ? LiturgicalChantWithRequirements.A.wikiEntry (x)
//       : BlessingCombined.A.wikiEntry (x)

// /**
//  * Combined `LiturgicalChantWithRequirements` and `BlessingCombined` accessors.
//  */
// export const LCBCA = {
//   active: (x : LiturgicalChantBlessingCombined) : boolean =>
//     LiturgicalChantWithRequirements.is (x)
//       ? pipe_ (
//           x,
//           LiturgicalChantWithRequirements.A.stateEntry,
//           ActivatableSkillDependent.A.active
//         )
//       : BlessingCombined.A.active (x),
//   gr: (x : LiturgicalChantBlessingCombined) : Maybe<number> =>
//     LiturgicalChantWithRequirements.is (x)
//       ? pipe_ (
//           x,
//           LiturgicalChantWithRequirements.A.wikiEntry,
//           LiturgicalChant.A.gr,
//           Just
//         )
//       : Nothing,
//   aspects: (x : LiturgicalChantBlessingCombined) : List<number> =>
//     LiturgicalChantWithRequirements.is (x)
//       ? pipe_ (
//           x,
//           LiturgicalChantWithRequirements.A.wikiEntry,
//           LiturgicalChant.A.aspects
//         )
//       : List (1),
//   tradition: (x : LiturgicalChantBlessingCombined) : List<number> =>
//     LiturgicalChantWithRequirements.is (x)
//       ? pipe_ (
//           x,
//           LiturgicalChantWithRequirements.A.wikiEntry,
//           LiturgicalChant.A.tradition
//         )
//       : List (1),
//   id: pipe (wikiEntryCombined, Blessing.AL.id),
//   name: pipe (wikiEntryCombined, Blessing.AL.name),
// }

// const isAspectOfTraditionFromPair = (fromPair : <A> (x : Pair<A, A>) => A) =>
//                                     (trad : Record<BlessedTraditionR>) =>
//                                     (aspect : number) : boolean =>
//                                       pipe_ (
//                                         trad,
//                                         BTA.aspects,
//                                         maybe (false)
//                                               (aspects => fromPair (aspects) === aspect)
//                                       )

// const isAspectOfTradition = (trad : Record<BlessedTraditionR>) =>
//                             (aspect : number) : boolean =>
//                               isAspectOfTraditionFromPair (fst) (trad) (aspect)
//                               || isAspectOfTraditionFromPair (snd) (trad) (aspect)

// /**
//  * Returns the Aspects string for list display.
//  */
// export const getAspectsStr =
//   (staticData : StaticDataRecord) =>
//   (curr : LiturgicalChantBlessingCombined) =>
//   (mtradition_id : Maybe<BlessedTradition>) : string =>
//     pipe_ (
//       mtradition_id,
//       bindF (tradition_id => pipe_ (
//                                staticData,
//                                SDA.blessedTraditions,
//                                find (trad => BTA.numId (trad) === tradition_id)
//                              )),
//       toNewMaybe
//     )
//       .maybe ("", tradition =>
//         pipe_ (
//           curr,
//           LCBCA.aspects,
//           mapMaybe (pipe (
//                      ensure (isAspectOfTradition (tradition)),
//                      bindF (lookupF (SDA.aspects (staticData))),
//                      fmap (NumIdName.A.name)
//                    )),
//           List.elem (14) (LCBCA.tradition (curr))
//             ? consF (BTA.name (tradition))
//             : ident,
//           xs => fnull (xs)
//                 ? mapMaybe (pipe (
//                             lookupF (SDA.aspects (staticData)),
//                             fmap (NumIdName.A.name)
//                           ))
//                           (LCBCA.aspects (curr))
//                 : xs,
//           sortStrings (staticData),
//           intercalate (", ")
//         ))

// /**
//  * Returns the final Group/Aspects string for list display.
//  */
// export const getLCAddText =
//   (staticData : StaticDataRecord) =>
//   (sortOrder : ChantsSortOptions) =>
//   (aspects_str : string) =>
//   (curr : Record<LiturgicalChantWithRequirements>) =>
//     pipe_ (
//       guard (sortOrder === "group"),
//       thenF (lookup (LCWRA_.gr (curr))
//                     (SDA.liturgicalChantGroups (staticData))),
//       maybe (aspects_str)
//             (pipe (NumIdName.A.name, gr_str => `${aspects_str} / ${gr_str}`))
//     )
