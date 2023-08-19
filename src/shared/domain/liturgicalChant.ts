import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { SkillTradition } from "optolith-database-schema/types/_Blessed"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { filterNonNullable } from "../utils/array.ts"
import { assertExhaustive } from "../utils/typeSafety.ts"
import { Activatable, countOptions } from "./activatableEntry.ts"
import { getSingleHighestAttribute } from "./attribute.ts"
import {
  ActivatableRated,
  ActivatableRatedValue,
  RatedDependency,
  RatedMap,
  flattenMinimumRestrictions,
} from "./ratedEntry.ts"
import { getSkillCheckValues, getSkillCheckWithId } from "./skillCheck.ts"

export const getLiturgicalChantValue = (
  dynamic: ActivatableRated | undefined,
): number | undefined => dynamic?.value

// import { ident } from "../../../Data/Function"
// import { fmap } from "../../../Data/Functor"
// import { all, any, concatMap, consF, fnull, intercalate, List, maximum, minimum, notElemF, notNull } from "../../../Data/List"
// import { count } from "../../../Data/List/Unique"
// import { bindF, catMaybes, elem, ensure, guard, isNothing, Just, mapMaybe, Maybe, maybe, Nothing, thenF } from "../../../Data/Maybe"
// import { add, gte, lt } from "../../../Data/Num"
// import { elems, find, findWithDefault, fromArray, lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap"
// import { Record } from "../../../Data/Record"
// import { fst, Pair, snd } from "../../../Data/Tuple"
// import { Aspect, BlessedTradition } from "../../Constants/Groups"
// import { SpecialAbilityId } from "../../Constants/Ids"
// import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
// import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
// import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent"
// import { ChantsSortOptions } from "../../Models/Config"
// import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
// import { NumIdName } from "../../Models/NumIdName"
// import { BlessingCombined } from "../../Models/View/BlessingCombined"
// import { LiturgicalChantWithRequirements, LiturgicalChantWithRequirementsA_ } from "../../Models/View/LiturgicalChantWithRequirements"
// import { BlessedTradition as BlessedTraditionR } from "../../Models/Wiki/BlessedTradition"
// import { Blessing } from "../../Models/Wiki/Blessing"
// import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel"
// import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
// import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
// import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
// import { getActiveSelectionsMaybe } from "../Activatable/selectionUtils"
// import { mapBlessedTradIdToNumId } from "../Activatable/traditionUtils"
// import { flattenDependencies } from "../Dependencies/flattenDependencies"
// import { toNewMaybe } from "../Maybe"
// import { pipe, pipe_ } from "../pipe"
// import { sortStrings } from "../sortBy"
// import { isNumber } from "../typeCheckUtils"
// import { getExceptionalSkillBonus, getMaxSRByCheckAttrs, getMaxSRFromEL } from "./skillUtils"

// const SDA = StaticData.A
// const HA = HeroModel.A
// const LCA = LiturgicalChant.A
// const LCAL = LiturgicalChant.AL
// const SAA = SpecialAbility.A
// const ASDA = ActivatableSkillDependent.A
// const LCWRA_ = LiturgicalChantWithRequirementsA_
// const BTA = BlessedTraditionR.A

// type ASD = ActivatableSkillDependent

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

// type LiturgicalChantsAbove10ByAspect = OrderedMap<Aspect, number>

// /**
//  * Returns the lowest SR and it's occurences for every aspect. The values of
//  * the map are pairs where the first is the lowest SR and the second is the
//  * amount of liturgical chants at that exact SR.
//  */
// export const chantsAbove10ByAspect : (wiki_chants : StaticData["liturgicalChants"])
//                                    => (hero_chants : HeroModel["liturgicalChants"])
//                                    => LiturgicalChantsAbove10ByAspect
//                                    = wiki_chants =>
//                                        pipe (
//                                          elems,
//                                          concatMap (pipe (
//                                            ensure (ASDA.active),
//                                            Maybe.find (pipe (
//                                              ASDA.value,
//                                              gte (10)
//                                            )),
//                                            bindF (pipe (
//                                              ASDA.id,
//                                              lookupF (wiki_chants)
//                                            )),
//                                            maybe (List<Aspect> ())
//                                                  (LCA.aspects)
//                                          )),
//                                          count
//                                        )

const flattenAspectIds = (traditions: SkillTradition[]): number[] =>
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

export const getLiturgicalChantMinimumFromAspectKnowledgePrerequistes = (
  liturgicalChantsAbove10ByAspect: Record<number, number>,
  activeAspectKnowledges: number[],
  aspectIds: number[],
  value: number | undefined,
): number | undefined =>
  aspectIds.some(
    aspectId =>
      activeAspectKnowledges.includes(aspectId) &&
      (liturgicalChantsAbove10ByAspect[aspectId] ?? 0) <= 3,
  ) &&
  value !== undefined &&
  value >= 10
    ? 10
    : undefined

export const getLiturgicalChantMinimum = (
  liturgicalChantsAbove10ByAspect: Record<number, number>,
  activeAspectKnowledges: number[],
  staticLiturgicalChant: { traditions: SkillTradition[] },
  dynamicLiturgicalChant: ActivatableRated,
  filterApplyingDependencies: (dependencies: RatedDependency[]) => RatedDependency[],
): number | undefined => {
  const minimumValues: number[] = filterNonNullable([
    ...flattenMinimumRestrictions(filterApplyingDependencies(dynamicLiturgicalChant.dependencies)),
    getLiturgicalChantMinimumFromAspectKnowledgePrerequistes(
      liturgicalChantsAbove10ByAspect,
      activeAspectKnowledges,
      flattenAspectIds(staticLiturgicalChant.traditions),
      dynamicLiturgicalChant.value,
    ),
  ])

  return minimumValues.length > 0 ? Math.max(...minimumValues) : undefined
}

export const getLiturgicalChantMaximumFromAspectKnowledge = (
  activeAspectKnowledges: number[],
  aspectIds: number[],
): number | undefined =>
  aspectIds.some(aspectId => activeAspectKnowledges.includes(aspectId)) ? undefined : 14

export const getLiturgicalChantMaximum = (
  attributes: RatedMap,
  activeAspectKnowledges: number[],
  staticLiturgicalChant: { id: number; check: SkillCheck; traditions: SkillTradition[] },
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel | undefined,
  exceptionalSkill: Activatable | undefined,
  type: "LiturgicalChant" | "Ceremony",
): number => {
  const maximumValues = filterNonNullable([
    Math.max(...getSkillCheckValues(attributes, staticLiturgicalChant.check)) + 2,
    isInCharacterCreation && startExperienceLevel !== undefined
      ? startExperienceLevel.max_skill_rating
      : undefined,
    getLiturgicalChantMaximumFromAspectKnowledge(
      activeAspectKnowledges,
      flattenAspectIds(staticLiturgicalChant.traditions),
    ),
  ])

  const exceptionalSkillBonus = countOptions(exceptionalSkill, {
    type,
    value: staticLiturgicalChant.id,
  })

  return Math.min(...maximumValues) + exceptionalSkillBonus
}

export const getHighestRequiredAttributeForLiturgicalChant = (
  attributes: RatedMap,
  staticLiturgicalChant: { id: number; check: SkillCheck },
  dynamicLiturgicalChant: { value: ActivatableRatedValue },
  exceptionalSkill: Activatable | undefined,
  type: "LiturgicalChant" | "Ceremony",
): { id: number; value: number } | undefined => {
  const singleHighestAttribute = getSingleHighestAttribute(
    getSkillCheckWithId(attributes, staticLiturgicalChant.check),
  )

  if (singleHighestAttribute === undefined || dynamicLiturgicalChant.value === undefined) {
    return undefined
  }

  const exceptionalSkillBonus = countOptions(exceptionalSkill, {
    type,
    value: staticLiturgicalChant.id,
  })

  return {
    id: singleHighestAttribute.id,
    value: dynamicLiturgicalChant.value - 2 - exceptionalSkillBonus,
  }
}

export const isLiturgicalChantDecreasable = (
  dynamic: ActivatableRated,
  min: number | undefined,
  canRemove: boolean,
) =>
  (min === undefined || (dynamic.value !== undefined && dynamic.value > Math.max(min, 0))) &&
  canRemove

export const isLiturgicalChantIncreasable = (dynamic: ActivatableRated, max: number) =>
  dynamic.value === undefined || dynamic.value < max

// /**
//  * Keys are aspects and their value is the respective tradition.
//  */
// const traditionsByAspect = fromArray<Aspect, BlessedTradition> ([
//   [ Aspect.General, BlessedTradition.General ],
//   [ Aspect.AntiMagic, BlessedTradition.ChurchOfPraios ],
//   [ Aspect.Order, BlessedTradition.ChurchOfPraios ],
//   [ Aspect.Shield, BlessedTradition.ChurchOfRondra ],
//   [ Aspect.Storm, BlessedTradition.ChurchOfRondra ],
//   [ Aspect.Death, BlessedTradition.ChurchOfBoron ],
//   [ Aspect.Dream, BlessedTradition.ChurchOfBoron ],
//   [ Aspect.Magic, BlessedTradition.ChurchOfHesinde ],
//   [ Aspect.Knowledge, BlessedTradition.ChurchOfHesinde ],
//   [ Aspect.Commerce, BlessedTradition.ChurchOfPhex ],
//   [ Aspect.Shadow, BlessedTradition.ChurchOfPhex ],
//   [ Aspect.Healing, BlessedTradition.ChurchOfPeraine ],
//   [ Aspect.Agriculture, BlessedTradition.ChurchOfPeraine ],
//   [ Aspect.Wind, BlessedTradition.ChurchOfEfferd ],
//   [ Aspect.Wogen, BlessedTradition.ChurchOfEfferd ],
//   [ Aspect.Freundschaft, BlessedTradition.ChurchOfTravia ],
//   [ Aspect.Heim, BlessedTradition.ChurchOfTravia ],
//   [ Aspect.Jagd, BlessedTradition.ChurchOfFirun ],
//   [ Aspect.Kaelte, BlessedTradition.ChurchOfFirun ],
//   [ Aspect.Freiheit, BlessedTradition.ChurchOfTsa ],
//   [ Aspect.Wandel, BlessedTradition.ChurchOfTsa ],
//   [ Aspect.Feuer, BlessedTradition.ChurchOfIngerimm ],
//   [ Aspect.Handwerk, BlessedTradition.ChurchOfIngerimm ],
//   [ Aspect.Ekstase, BlessedTradition.ChurchOfRahja ],
//   [ Aspect.Harmonie, BlessedTradition.ChurchOfRahja ],
//   [ Aspect.Reise, BlessedTradition.ChurchOfAves ],
//   [ Aspect.Schicksal, BlessedTradition.ChurchOfAves ],
//   [ Aspect.Hilfsbereitschaft, BlessedTradition.ChurchOfIfirn ],
//   [ Aspect.Natur, BlessedTradition.ChurchOfIfirn ],
//   [ Aspect.GuterKampf, BlessedTradition.ChurchOfKor ],
//   [ Aspect.GutesGold, BlessedTradition.ChurchOfKor ],
//   [ Aspect.Bildung, BlessedTradition.ChurchOfNandus ],
//   [ Aspect.Erkenntnis, BlessedTradition.ChurchOfNandus ],
//   [ Aspect.Kraft, BlessedTradition.ChurchOfSwafnir ],
//   [ Aspect.Tapferkeit, BlessedTradition.ChurchOfSwafnir ],
//   [ Aspect.ReissenderStrudel, BlessedTradition.CultOfNuminoru ],
//   [ Aspect.UnendlicheTiefe, BlessedTradition.CultOfNuminoru ],
//   [ Aspect.Begierde, BlessedTradition.Levthankult ],
//   [ Aspect.Rausch, BlessedTradition.Levthankult ],
// ])

// /**
//  * Returns the tradition id used by chants. To get the tradition SId for the
//  * actual special ability, you have to decrease the return value by 1.
//  * @param aspectId The id used for chants or Aspect Knowledge.
//  */
// export const getTraditionOfAspect =
//   (key : Aspect) => findWithDefault (BlessedTradition.General) (key) (traditionsByAspect)

// /**
//  * Keys are traditions and their values are their respective aspects
//  */
// const aspectsByTradition = fromArray<BlessedTradition, List<Aspect>> ([
//   [ BlessedTradition.General, List () ],
//   [ BlessedTradition.ChurchOfPraios, List (Aspect.AntiMagic, Aspect.Order) ],
//   [ BlessedTradition.ChurchOfRondra, List (Aspect.Shield, Aspect.Storm) ],
//   [ BlessedTradition.ChurchOfBoron, List (Aspect.Death, Aspect.Dream) ],
//   [ BlessedTradition.ChurchOfHesinde, List (Aspect.Magic, Aspect.Knowledge) ],
//   [ BlessedTradition.ChurchOfPhex, List (Aspect.Commerce, Aspect.Shadow) ],
//   [ BlessedTradition.ChurchOfPeraine, List (Aspect.Healing, Aspect.Agriculture) ],
//   [ BlessedTradition.ChurchOfEfferd, List (Aspect.Wind, Aspect.Wogen) ],
//   [ BlessedTradition.ChurchOfTravia, List (Aspect.Freundschaft, Aspect.Heim) ],
//   [ BlessedTradition.ChurchOfFirun, List (Aspect.Jagd, Aspect.Kaelte) ],
//   [ BlessedTradition.ChurchOfTsa, List (Aspect.Freiheit, Aspect.Wandel) ],
//   [ BlessedTradition.ChurchOfIngerimm, List (Aspect.Feuer, Aspect.Handwerk) ],
//   [ BlessedTradition.ChurchOfRahja, List (Aspect.Ekstase, Aspect.Harmonie) ],
//   [ BlessedTradition.CultOfTheNamelessOne, List () ],
//   [ BlessedTradition.ChurchOfAves, List (Aspect.Reise, Aspect.Schicksal) ],
//   [ BlessedTradition.ChurchOfIfirn, List (Aspect.Hilfsbereitschaft, Aspect.Natur) ],
//   [ BlessedTradition.ChurchOfKor, List (Aspect.GuterKampf, Aspect.GutesGold) ],
//   [ BlessedTradition.ChurchOfNandus, List (Aspect.Bildung, Aspect.Erkenntnis) ],
//   [ BlessedTradition.ChurchOfSwafnir, List (Aspect.Kraft, Aspect.Tapferkeit) ],
//   [ BlessedTradition.CultOfNuminoru, List (Aspect.ReissenderStrudel, Aspect.UnendlicheTiefe) ],
//   [ BlessedTradition.Levthankult, List (Aspect.Begierde, Aspect.Rausch) ],
// ])

// /**
//  * Return the aspect ids used for chants and Aspect Knowledge.
//  * @param traditionId The id used by chants. If you only have the SId from the
//  * actual special ability, you have to increase the value by 1 before passing
//  * it.
//  */
// export const getAspectsOfTradition = pipe (
//   (key : BlessedTradition) => findWithDefault (List<Aspect> ()) (key) (aspectsByTradition),
//   consF<Aspect> (Aspect.General)
// )

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
