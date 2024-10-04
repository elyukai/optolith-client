import { Aspect } from "optolith-database-schema/types/Aspect"
import { Blessing } from "optolith-database-schema/types/Blessing"
import { Ceremony } from "optolith-database-schema/types/Ceremony"
import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { LiturgicalChant } from "optolith-database-schema/types/LiturgicalChant"
import { SkillTradition } from "optolith-database-schema/types/_Blessed"
import { LiturgyIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { ImprovementCost } from "optolith-database-schema/types/_ImprovementCost"
import { AspectReference } from "optolith-database-schema/types/_SimpleReferences"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { BlessedTradition } from "optolith-database-schema/types/specialAbility/BlessedTradition"
import { count, countByMany } from "../../utils/array.ts"
import { Compare, compareAt, compareNullish, numAsc, reduceCompare } from "../../utils/compare.ts"
import { isNotNullish } from "../../utils/nullable.ts"
import { Translate, TranslateMap } from "../../utils/translate.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { Activatable, countOptions } from "../activatable/activatableEntry.ts"
import {
  compareImprovementCost,
  createImprovementCost,
  fromRaw,
} from "../adventurePoints/improvementCost.ts"
import { All, GetById } from "../getTypes.ts"
import { AspectIdentifier, createIdentifierObject } from "../identifier.ts"
import { createLibraryEntryCreator, LibraryEntryContent } from "../libraryEntry.ts"
import { getTextForBlessingDuration } from "../libraryEntry/activatableSkill/duration.ts"
import { getTextForEffect } from "../libraryEntry/activatableSkill/effect.ts"
import { Entity } from "../libraryEntry/activatableSkill/entity.ts"
import { getTextForBlessingRange } from "../libraryEntry/activatableSkill/range.ts"
import { getTextForTargetCategory } from "../libraryEntry/activatableSkill/targetCategory.ts"
import { ResponsiveTextSize } from "../libraryEntry/responsiveText.ts"
import { LiturgiesSortOrder } from "../sortOrders.ts"
import {
  getTextForFastOneTimePerformanceParameters,
  getTextForFastSustainedPerformanceParameters,
  getTextForSlowOneTimePerformanceParameters,
  getTextForSlowSustainedPerformanceParameters,
} from "./activatableSkill.ts"
import { DisplayedActiveLiturgy } from "./liturgicalChantActive.ts"
import { DisplayedInactiveLiturgy } from "./liturgicalChantInactive.ts"
import {
  ActivatableRatedMap,
  ActivatableRatedValue,
  ActivatableRatedWithEnhancements,
  ActivatableRatedWithEnhancementsMap,
  ActiveActivatableRatedWithEnhancements,
  isRatedActive,
  isRatedWithEnhancementsActive,
} from "./ratedEntry.ts"
import { getTextForCheck } from "./skillCheck.ts"

/**
 * Returns the value for a dynamic liturgical chant entry that might not exist
 * yet.
 */
export const getLiturgicalChantValue = (
  dynamic: ActivatableRatedWithEnhancements | undefined,
): number | undefined => dynamic?.value

/**
 * Creates an initial dynamic liturgical chant entry.
 */
export const createEmptyDynamicLiturgicalChant = (
  id: number,
): ActivatableRatedWithEnhancements => ({
  id,
  value: undefined,
  cachedAdventurePoints: {
    general: 0,
    bound: 0,
  },
  dependencies: [],
  boundAdventurePoints: [],
  enhancements: [],
})

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
 * Checks if the passed liturgical chant features the passed aspect.
 */
export const hasAspectById = (id: number, traditions: SkillTradition[]): boolean =>
  traditions.some(tradition => {
    switch (tradition.tag) {
      case "GeneralAspect":
        return tradition.general_aspect.id.aspect === id
      case "Tradition":
        return tradition.tradition.aspects?.some(aspect => aspect.id.aspect === id) ?? false
      default:
        return assertExhaustive(tradition)
    }
  })

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
 * A capability type for getting any dynamic liturgical chants that belong to a
 * certain aspect.
 */
export type GetDynamicLiturgicalChantsByAspectCapability = (
  id: number,
) => ActivatableRatedWithEnhancements[]

/**
 * A capability type for getting any active dynamic liturgical chants that
 * belong to a certain aspect.
 */
export type GetActiveDynamicLiturgicalChantsByAspectCapability = (
  id: number,
) => ActiveActivatableRatedWithEnhancements[]

/**
 * Returns a list of active dynamic liturgical chant entries for a given aspect.
 */
export const getActiveDynamicLiturgicalChantsByAspect = (
  getTraditionsOfLiturgicalChant: (id: number) => SkillTradition[],
  dynamicLiturgicalChants: ActivatableRatedWithEnhancementsMap,
  aspectId: number,
): ActiveActivatableRatedWithEnhancements[] =>
  Object.values(dynamicLiturgicalChants)
    .filter(isRatedWithEnhancementsActive)
    .filter(dynamicLiturgicalChant => {
      getTraditionsOfLiturgicalChant(dynamicLiturgicalChant.id).some(tradition => {
        switch (tradition.tag) {
          case "GeneralAspect":
            return tradition.general_aspect.id.aspect === aspectId
          case "Tradition":
            return (
              tradition.tradition.aspects?.some(aspect => aspect.id.aspect === aspectId) ?? false
            )
          default:
            return assertExhaustive(tradition)
        }
      })
    })

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

  const exceptionalSkillBonus = countOptions(
    exceptionalSkill,
    createIdentifierObject(type, staticLiturgicalChant.id),
  )

  return {
    id: singleHighestAttributeId,
    value: dynamicLiturgicalChant.value - 2 - exceptionalSkillBonus,
  }
}

/**
 * Counts all active liturgical chants and ceremonies.
 */
export const countActiveLiturgicalChants = (
  dynamicLiturgicalChants: All.Dynamic.LiturgicalChants,
  dynamicCeremonies: All.Dynamic.Ceremonies,
) =>
  count(dynamicLiturgicalChants, isRatedWithEnhancementsActive) +
  count(dynamicCeremonies, isRatedWithEnhancementsActive)

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
  dynamicEntries: ActivatableRatedWithEnhancements[],
  getStaticEntry: (id: number) => T | undefined,
  activeBlessedTradition: BlessedTradition,
): { [traditionId: number]: number } =>
  countByMany(
    dynamicEntries
      .map(dynamicEntry => getStaticEntry(dynamicEntry.id))
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
    })()?.name ?? ""

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

const getTextForTraditions = (
  deps: {
    translate: Translate
    translateMap: TranslateMap
    localeCompare: Compare<string>
    getBlessedTraditionById: GetById.Static.BlessedTradition
    getAspectById: GetById.Static.Aspect
  },
  values: SkillTradition[],
): LibraryEntryContent => {
  const getAspectName = (ref: AspectReference) =>
    deps.translateMap(deps.getAspectById(ref.id.aspect)?.translations)?.name

  const text = values
    .map(trad => {
      switch (trad.tag) {
        case "GeneralAspect":
          return getAspectName(trad.general_aspect)
        case "Tradition": {
          const traditionTranslation = deps.translateMap(
            deps.getBlessedTraditionById(trad.tradition.tradition.id.blessed_tradition)
              ?.translations,
          )
          const name = traditionTranslation?.name_compressed ?? traditionTranslation?.name

          if (name === undefined) {
            return undefined
          }

          const aspects =
            trad.tradition.aspects
              ?.map(getAspectName)
              .filter(isNotNullish)
              .sort(deps.localeCompare) ?? []

          if (aspects.length === 0) {
            return name
          }

          return `${name} (${aspects.join(" and ")})`
        }
        default:
          return assertExhaustive(trad)
      }
    })
    .filter(isNotNullish)
    .join(", ")

  return {
    label: deps.translate("Traditions"),
    value: text,
  }
}

/**
 * Get a JSON representation of the rules text for a blessing.
 */
export const getBlessingLibraryEntry = createLibraryEntryCreator<
  Blessing,
  {
    getTargetCategoryById: GetById.Static.TargetCategory
  }
>((entry, { getTargetCategoryById }) => ({ translate, translateMap }) => {
  const translation = translateMap(entry.translations)

  if (translation === undefined) {
    return undefined
  }

  const range = getTextForBlessingRange({ translate }, entry.parameters.range, {
    responsiveText: ResponsiveTextSize.Full,
  })

  const duration = getTextForBlessingDuration(
    { translate, translateMap },
    entry.parameters.duration,
    {
      responsiveText: ResponsiveTextSize.Full,
    },
  )

  return {
    title: translation.name,
    className: "blessing",
    content: [
      {
        label: translate("Effect"),
        value: translation.effect,
      },
      {
        label: translate("Range"),
        value: range !== translation.range ? `***${range}*** (${translation.range})` : range,
      },
      {
        label: translate("Duration"),
        value:
          duration !== translation.duration
            ? `***${duration}*** (${translation.duration})`
            : duration,
      },
      getTextForTargetCategory({ translate, translateMap, getTargetCategoryById }, entry.target),
    ],
    src: entry.src,
  }
})

/**
 * Get a JSON representation of the rules text for a liturgical chant.
 */
export const getLiturgicalChantLibraryEntry = createLibraryEntryCreator<
  LiturgicalChant,
  {
    getAttributeById: GetById.Static.Attribute
    getDerivedCharacteristicById: GetById.Static.DerivedCharacteristic
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    getTargetCategoryById: GetById.Static.TargetCategory
    getBlessedTraditionById: GetById.Static.BlessedTradition
    getAspectById: GetById.Static.Aspect
  }
>(
  (
      entry,
      {
        getAttributeById,
        getDerivedCharacteristicById,
        getSkillModificationLevelById,
        getTargetCategoryById,
        getBlessedTraditionById,
        getAspectById,
      },
    ) =>
    ({ translate, translateMap, localeCompare }) => {
      const translation = translateMap(entry.translations)

      if (translation === undefined) {
        return undefined
      }

      const { castingTime, cost, range, duration } = (() => {
        switch (entry.parameters.tag) {
          case "OneTime":
            return getTextForFastOneTimePerformanceParameters(
              {
                getSkillModificationLevelById,
                translate,
                translateMap,
              },
              entry.parameters.one_time,
              {
                entity: Entity.LiturgicalChant,
                responsiveText: ResponsiveTextSize.Full,
              },
            )

          case "Sustained":
            return getTextForFastSustainedPerformanceParameters(
              {
                getSkillModificationLevelById,
                translate,
                translateMap,
              },
              entry.parameters.sustained,
              {
                entity: Entity.LiturgicalChant,
                responsiveText: ResponsiveTextSize.Full,
              },
            )

          default:
            return assertExhaustive(entry.parameters)
        }
      })()

      return {
        title: translation.name,
        className: "liturgical-chant",
        content: [
          getTextForCheck({ translate, translateMap, getAttributeById }, entry.check, {
            value: entry.check_penalty,
            responsiveText: ResponsiveTextSize.Full,
            getDerivedCharacteristicById,
          }),
          ...getTextForEffect(translation.effect, translate),
          {
            label: translate("Liturgical Time"),
            value:
              castingTime !== translation.casting_time.full
                ? `***${castingTime}*** (${translation.casting_time.full})`
                : castingTime,
          },
          {
            label: translate("KP Cost"),
            value:
              cost !== translation.cost.full ? `***${cost}*** (${translation.cost.full})` : cost,
          },
          {
            label: translate("Range"),
            value:
              range !== translation.range.full
                ? `***${range}*** (${translation.range.full})`
                : range,
          },
          {
            label: translate("Duration"),
            value:
              duration !== translation.duration.full
                ? `***${duration}*** (${translation.duration.full})`
                : duration,
          },
          getTextForTargetCategory(
            { translate, translateMap, getTargetCategoryById },
            entry.target,
          ),
          getTextForTraditions(
            { translate, translateMap, localeCompare, getBlessedTraditionById, getAspectById },
            entry.traditions,
          ),
          createImprovementCost(translate, entry.improvement_cost),
        ],
        src: entry.src,
      }
    },
)

/**
 * Get a JSON representation of the rules text for a ceremony.
 */
export const getCeremonyLibraryEntry = createLibraryEntryCreator<
  Ceremony,
  {
    getAttributeById: GetById.Static.Attribute
    getDerivedCharacteristicById: GetById.Static.DerivedCharacteristic
    getSkillModificationLevelById: GetById.Static.SkillModificationLevel
    getTargetCategoryById: GetById.Static.TargetCategory
    getBlessedTraditionById: GetById.Static.BlessedTradition
    getAspectById: GetById.Static.Aspect
  }
>(
  (
      entry,
      {
        getAttributeById,
        getDerivedCharacteristicById,
        getSkillModificationLevelById,
        getTargetCategoryById,
        getBlessedTraditionById,
        getAspectById,
      },
    ) =>
    ({ translate, translateMap, localeCompare }) => {
      const translation = translateMap(entry.translations)

      if (translation === undefined) {
        return undefined
      }

      const { castingTime, cost, range, duration } = (() => {
        switch (entry.parameters.tag) {
          case "OneTime":
            return getTextForSlowOneTimePerformanceParameters(
              {
                getSkillModificationLevelById,
                translate,
                translateMap,
              },
              entry.parameters.one_time,
              {
                entity: Entity.Ceremony,
                responsiveText: ResponsiveTextSize.Full,
              },
            )

          case "Sustained":
            return getTextForSlowSustainedPerformanceParameters(
              {
                getSkillModificationLevelById,
                translate,
                translateMap,
              },
              entry.parameters.sustained,
              {
                entity: Entity.Ceremony,
                responsiveText: ResponsiveTextSize.Full,
              },
            )

          default:
            return assertExhaustive(entry.parameters)
        }
      })()

      return {
        title: translation.name,
        className: "ceremony",
        content: [
          getTextForCheck({ translate, translateMap, getAttributeById }, entry.check, {
            value: entry.check_penalty,
            responsiveText: ResponsiveTextSize.Full,
            getDerivedCharacteristicById,
          }),
          ...getTextForEffect(translation.effect, translate),
          {
            label: translate("Ceremonial Time"),
            value:
              castingTime !== translation.casting_time.full
                ? `***${castingTime}*** (${translation.casting_time.full})`
                : castingTime,
          },
          {
            label: translate("KP Cost"),
            value:
              cost !== translation.cost.full ? `***${cost}*** (${translation.cost.full})` : cost,
          },
          {
            label: translate("Range"),
            value:
              range !== translation.range.full
                ? `***${range}*** (${translation.range.full})`
                : range,
          },
          {
            label: translate("Duration"),
            value:
              duration !== translation.duration.full
                ? `***${duration}*** (${translation.duration.full})`
                : duration,
          },
          getTextForTargetCategory(
            { translate, translateMap, getTargetCategoryById },
            entry.target,
          ),
          getTextForTraditions(
            { translate, translateMap, localeCompare, getBlessedTraditionById, getAspectById },
            entry.traditions,
          ),
          createImprovementCost(translate, entry.improvement_cost),
        ],
        src: entry.src,
      }
    },
)
