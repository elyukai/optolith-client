/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ident } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { all, any, concatMap, consF, fnull, intercalate, List, maximum, minimum, notElemF, notNull } from "../../../Data/List"
import { count } from "../../../Data/List/Unique"
import { bindF, catMaybes, elem, ensure, guard, isNothing, Just, mapMaybe, Maybe, maybe, Nothing, thenF } from "../../../Data/Maybe"
import { add, gte, lt } from "../../../Data/Num"
import { elems, find, findWithDefault, fromArray, lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
import { Aspect, BlessedTradition } from "../../Constants/Groups"
import { SpecialAbilityId } from "../../Constants/Ids"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent"
import { ChantsSortOptions } from "../../Models/Config"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { NumIdName } from "../../Models/NumIdName"
import { BlessingCombined } from "../../Models/View/BlessingCombined"
import { LiturgicalChantWithRequirements, LiturgicalChantWithRequirementsA_ } from "../../Models/View/LiturgicalChantWithRequirements"
import { BlessedTradition as BlessedTraditionR } from "../../Models/Wiki/BlessedTradition"
import { Blessing } from "../../Models/Wiki/Blessing"
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { getActiveSelectionsMaybe } from "../Activatable/selectionUtils"
import { mapBlessedTradIdToNumId } from "../Activatable/traditionUtils"
import { flattenDependencies } from "../Dependencies/flattenDependencies"
import { toNewMaybe } from "../Maybe"
import { pipe, pipe_ } from "../pipe"
import { sortStrings } from "../sortBy"
import { isNumber } from "../typeCheckUtils"
import { getExceptionalSkillBonus, getMaxSRByCheckAttrs, getMaxSRFromEL } from "./skillUtils"


const SDA = StaticData.A
const HA = HeroModel.A
const LCA = LiturgicalChant.A
const LCAL = LiturgicalChant.AL
const SAA = SpecialAbility.A
const ASDA = ActivatableSkillDependent.A
const LCWRA_ = LiturgicalChantWithRequirementsA_
const BTA = BlessedTraditionR.A

type ASD = ActivatableSkillDependent


/**
 * Checks if the passed liturgical chant or blessing is valid for the current
 * active blessed tradition.
 */
export const isOwnTradition =
  (blessedTradition : Record<SpecialAbility>) =>
  (entry : Record<LiturgicalChant> | Record<Blessing>) : boolean => {
    const numeric_tradition_id = mapBlessedTradIdToNumId (SAA.id (blessedTradition))

    return any<BlessedTradition> (e => e === BlessedTradition.General
                                       || elem<BlessedTradition> (e) (numeric_tradition_id))
                                 (LCAL.tradition (entry))
  }


/**
 * Returns the SR maximum if there is no aspect knowledge active for the passed
 * liturgical chant.
 */
const getMaxSRFromAspectKnowledge = (current_tradition : Record<SpecialAbility>) =>
                                    (aspect_knowledge : Maybe<Record<ActivatableDependent>>) =>
                                    (wiki_entry : Record<LiturgicalChant>) : Maybe<number> =>
                                      // is not nameless tradition
                                      SAA.id (current_tradition)
                                        === SpecialAbilityId.TraditionCultOfTheNamelessOne
                                      ? Nothing
                                      // no aspect knowledge active for the current chant
                                      : pipe_ (
                                        aspect_knowledge,
                                        getActiveSelectionsMaybe,
                                        maybe (true)
                                              (all (notElemF<string | number> (
                                                     LCA.aspects (wiki_entry)
                                                   ))),
                                        hasRestriction => hasRestriction ? Just (14) : Nothing
                                      )


/**
 * Returns the maximum skill rating for the passed liturgical chant.
 */
export const getSpellMax = (current_tradition : Record<SpecialAbility>) =>
                           (startEL : Record<ExperienceLevel>) =>
                           (phase : number) =>
                           (attributes : OrderedMap<string, Record<AttributeDependent>>) =>
                           (exceptional_skill : Maybe<Record<ActivatableDependent>>) =>
                           (aspect_knowledge : Maybe<Record<ActivatableDependent>>) =>
                           (wiki_entry : Record<LiturgicalChant>) : number =>
                             pipe_ (
                               List (
                                 Just (getMaxSRByCheckAttrs (attributes) (wiki_entry)),
                                 getMaxSRFromEL (startEL) (phase),
                                 getMaxSRFromAspectKnowledge (current_tradition)
                                                             (aspect_knowledge)
                                                             (wiki_entry)
                               ),
                               catMaybes,
                               minimum,
                               add (getExceptionalSkillBonus (exceptional_skill)
                                                             (LCA.id (wiki_entry)))
                             )


/**
 * Checks if the passed liturgical chant's skill rating can be increased.
 */
export const isLCIncreasable = (currentTradition : Record<SpecialAbility>) =>
                               (startEL : Record<ExperienceLevel>) =>
                               (phase : number) =>
                               (attributes : HeroModel["attributes"]) =>
                               (exceptionalSkill : Maybe<Record<ActivatableDependent>>) =>
                               (propertyKnowledge : Maybe<Record<ActivatableDependent>>) =>
                               (wiki_entry : Record<LiturgicalChant>) =>
                               (hero_entry : Record<ActivatableSkillDependent>) : boolean =>
                                 ASDA.value (hero_entry)
                                   < getSpellMax (currentTradition)
                                                 (startEL)
                                                 (phase)
                                                 (attributes)
                                                 (exceptionalSkill)
                                                 (propertyKnowledge)
                                                 (wiki_entry)


type LiturgicalChantsAbove10ByAspect = OrderedMap<Aspect, number>


/**
 * Returns the lowest SR and it's occurences for every aspect. The values of
 * the map are pairs where the first is the lowest SR and the second is the
 * amount of liturgical chants at that exact SR.
 */
export const chantsAbove10ByAspect : (wiki_chants : StaticData["liturgicalChants"])
                                   => (hero_chants : HeroModel["liturgicalChants"])
                                   => LiturgicalChantsAbove10ByAspect
                                   = wiki_chants =>
                                       pipe (
                                         elems,
                                         concatMap (pipe (
                                           ensure (ASDA.active),
                                           Maybe.find (pipe (
                                             ASDA.value,
                                             gte (10)
                                           )),
                                           bindF (pipe (
                                             ASDA.id,
                                             lookupF (wiki_chants)
                                           )),
                                           maybe (List<Aspect> ())
                                                 (LCA.aspects)
                                         )),
                                         count
                                       )


/**
 * Check if the active aspect knowledges allow the passed liturgical chant to be
 * decreased. (There must be at leased 3 liturgical chants of the respective
 * aspect active.)
 */
const getMinSRFromAspectKnowledge = (aspect_counter : LiturgicalChantsAbove10ByAspect) =>
                                    (active_aspect_knowledges : Maybe<List<string | number>>) =>
                                    (wiki_entry : Record<LiturgicalChant>) =>
                                    (hero_entry : Record<ASD>) : Maybe<number> =>
                                      pipe_ (
                                        active_aspect_knowledges,

                                        // Is chant part of dependencies of any active Aspect
                                        // Knowledge?
                                        maybe (false)
                                              (any (e => isNumber (e)
                                                         && List.elem (e)
                                                                      (LCA.aspects (wiki_entry))))
                                      )

                                      // If yes, check if chant is above 10 and if there are not
                                      // enough chants above 10 to allow a decrease below 10
                                      ? pipe_ (
                                          wiki_entry,
                                          LCA.aspects,
                                          mapMaybe (lookupF (aspect_counter)),
                                          ensure (notNull),
                                          bindF (pipe (
                                            minimum,
                                            counter => ASDA.value (hero_entry) >= 10
                                                       && counter <= 3
                                                       ? Just (10)
                                                       : Nothing
                                          ))
                                        )
                                      : Nothing


/**
 * Check if the dependencies allow the passed liturgical chant to be decreased.
 */
const getMinSRByDeps = (static_data : StaticDataRecord) =>
                       (hero : HeroModelRecord) =>
                       (hero_entry : Record<ActivatableSkillDependent>) : Maybe<number> =>
                         pipe_ (
                           hero_entry,
                           ASDA.dependencies,
                           flattenDependencies (static_data) (hero),
                           mapMaybe (x => typeof x === "boolean"
                                          ? x ? Just (0) : Nothing
                                          : Just (x)),
                           ensure (notNull),
                           fmap (maximum)
                         )


/**
 * Returns the minimum skill rating for the passed skill.
 */
export const getLCMin = (static_data : StaticDataRecord) =>
                        (hero : HeroModelRecord) =>
                        (aspect_knowledge : Maybe<Record<ActivatableDependent>>) => {
                          const aspect_counter =
                            chantsAbove10ByAspect (SDA.liturgicalChants (static_data))
                                                  (HA.liturgicalChants (hero))

                          const active_aspect_knowledges =
                            getActiveSelectionsMaybe (aspect_knowledge)

                          return (wiki_entry : Record<LiturgicalChant>) =>
                                 (hero_entry : Record<ASD>) : Maybe<number> =>
                                   pipe_ (
                                     List (
                                       getMinSRByDeps (static_data) (hero) (hero_entry),
                                       getMinSRFromAspectKnowledge (aspect_counter)
                                                                   (active_aspect_knowledges)
                                                                   (wiki_entry)
                                                                   (hero_entry)
                                     ),
                                     catMaybes,
                                     ensure (notNull),
                                     fmap (maximum)
                                   )
                        }


/**
 * Checks if the passed spell's skill rating can be decreased.
 */
export const isLCDecreasable = (static_data : StaticDataRecord) =>
                               (hero : HeroModelRecord) =>
                               (aspect_knowledge : Maybe<Record<ActivatableDependent>>) => {
                                 const getMin = getLCMin (static_data)
                                                         (hero)
                                                         (aspect_knowledge)

                                 return (wiki_entry : Record<LiturgicalChant>) =>
                                        (hero_entry : Record<ASD>) : boolean =>
                                          pipe_ (
                                            getMin (wiki_entry) (hero_entry),
                                            min => ASDA.value (hero_entry) < 1
                                                   ? isNothing (min)
                                                   : maybe (true)
                                                           (lt (ASDA.value (hero_entry)))
                                                           (min)
                                          )
                               }


/**
 * Keys are aspects and their value is the respective tradition.
 */
const traditionsByAspect = fromArray<Aspect, BlessedTradition> ([
  [ Aspect.General, BlessedTradition.General ],
  [ Aspect.AntiMagic, BlessedTradition.ChurchOfPraios ],
  [ Aspect.Order, BlessedTradition.ChurchOfPraios ],
  [ Aspect.Shield, BlessedTradition.ChurchOfRondra ],
  [ Aspect.Storm, BlessedTradition.ChurchOfRondra ],
  [ Aspect.Death, BlessedTradition.ChurchOfBoron ],
  [ Aspect.Dream, BlessedTradition.ChurchOfBoron ],
  [ Aspect.Magic, BlessedTradition.ChurchOfHesinde ],
  [ Aspect.Knowledge, BlessedTradition.ChurchOfHesinde ],
  [ Aspect.Commerce, BlessedTradition.ChurchOfPhex ],
  [ Aspect.Shadow, BlessedTradition.ChurchOfPhex ],
  [ Aspect.Healing, BlessedTradition.ChurchOfPeraine ],
  [ Aspect.Agriculture, BlessedTradition.ChurchOfPeraine ],
  [ Aspect.Wind, BlessedTradition.ChurchOfEfferd ],
  [ Aspect.Wogen, BlessedTradition.ChurchOfEfferd ],
  [ Aspect.Freundschaft, BlessedTradition.ChurchOfTravia ],
  [ Aspect.Heim, BlessedTradition.ChurchOfTravia ],
  [ Aspect.Jagd, BlessedTradition.ChurchOfFirun ],
  [ Aspect.Kaelte, BlessedTradition.ChurchOfFirun ],
  [ Aspect.Freiheit, BlessedTradition.ChurchOfTsa ],
  [ Aspect.Wandel, BlessedTradition.ChurchOfTsa ],
  [ Aspect.Feuer, BlessedTradition.ChurchOfIngerimm ],
  [ Aspect.Handwerk, BlessedTradition.ChurchOfIngerimm ],
  [ Aspect.Ekstase, BlessedTradition.ChurchOfRahja ],
  [ Aspect.Harmonie, BlessedTradition.ChurchOfRahja ],
  [ Aspect.Reise, BlessedTradition.ChurchOfAves ],
  [ Aspect.Schicksal, BlessedTradition.ChurchOfAves ],
  [ Aspect.Hilfsbereitschaft, BlessedTradition.ChurchOfIfirn ],
  [ Aspect.Natur, BlessedTradition.ChurchOfIfirn ],
  [ Aspect.GuterKampf, BlessedTradition.ChurchOfKor ],
  [ Aspect.GutesGold, BlessedTradition.ChurchOfKor ],
  [ Aspect.Bildung, BlessedTradition.ChurchOfNandus ],
  [ Aspect.Erkenntnis, BlessedTradition.ChurchOfNandus ],
  [ Aspect.Kraft, BlessedTradition.ChurchOfSwafnir ],
  [ Aspect.Tapferkeit, BlessedTradition.ChurchOfSwafnir ],
  [ Aspect.ReissenderStrudel, BlessedTradition.CultOfNuminoru ],
  [ Aspect.UnendlicheTiefe, BlessedTradition.CultOfNuminoru ],
  [ Aspect.Begierde, BlessedTradition.Levthankult ],
  [ Aspect.Rausch, BlessedTradition.Levthankult ],
])

/**
 * Returns the tradition id used by chants. To get the tradition SId for the
 * actual special ability, you have to decrease the return value by 1.
 * @param aspectId The id used for chants or Aspect Knowledge.
 */
export const getTraditionOfAspect =
  (key : Aspect) => findWithDefault (BlessedTradition.General) (key) (traditionsByAspect)

/**
 * Keys are traditions and their values are their respective aspects
 */
const aspectsByTradition = fromArray<BlessedTradition, List<Aspect>> ([
  [ BlessedTradition.General, List () ],
  [ BlessedTradition.ChurchOfPraios, List (Aspect.AntiMagic, Aspect.Order) ],
  [ BlessedTradition.ChurchOfRondra, List (Aspect.Shield, Aspect.Storm) ],
  [ BlessedTradition.ChurchOfBoron, List (Aspect.Death, Aspect.Dream) ],
  [ BlessedTradition.ChurchOfHesinde, List (Aspect.Magic, Aspect.Knowledge) ],
  [ BlessedTradition.ChurchOfPhex, List (Aspect.Commerce, Aspect.Shadow) ],
  [ BlessedTradition.ChurchOfPeraine, List (Aspect.Healing, Aspect.Agriculture) ],
  [ BlessedTradition.ChurchOfEfferd, List (Aspect.Wind, Aspect.Wogen) ],
  [ BlessedTradition.ChurchOfTravia, List (Aspect.Freundschaft, Aspect.Heim) ],
  [ BlessedTradition.ChurchOfFirun, List (Aspect.Jagd, Aspect.Kaelte) ],
  [ BlessedTradition.ChurchOfTsa, List (Aspect.Freiheit, Aspect.Wandel) ],
  [ BlessedTradition.ChurchOfIngerimm, List (Aspect.Feuer, Aspect.Handwerk) ],
  [ BlessedTradition.ChurchOfRahja, List (Aspect.Ekstase, Aspect.Harmonie) ],
  [ BlessedTradition.CultOfTheNamelessOne, List () ],
  [ BlessedTradition.ChurchOfAves, List (Aspect.Reise, Aspect.Schicksal) ],
  [ BlessedTradition.ChurchOfIfirn, List (Aspect.Hilfsbereitschaft, Aspect.Natur) ],
  [ BlessedTradition.ChurchOfKor, List (Aspect.GuterKampf, Aspect.GutesGold) ],
  [ BlessedTradition.ChurchOfNandus, List (Aspect.Bildung, Aspect.Erkenntnis) ],
  [ BlessedTradition.ChurchOfSwafnir, List (Aspect.Kraft, Aspect.Tapferkeit) ],
  [ BlessedTradition.CultOfNuminoru, List (Aspect.ReissenderStrudel, Aspect.UnendlicheTiefe) ],
  [ BlessedTradition.Levthankult, List (Aspect.Begierde, Aspect.Rausch) ],
])

/**
 * Return the aspect ids used for chants and Aspect Knowledge.
 * @param traditionId The id used by chants. If you only have the SId from the
 * actual special ability, you have to increase the value by 1 before passing
 * it.
 */
export const getAspectsOfTradition = pipe (
  (key : BlessedTradition) => findWithDefault (List<Aspect> ()) (key) (aspectsByTradition),
  consF<Aspect> (Aspect.General)
)

export type LiturgicalChantBlessingCombined = Record<LiturgicalChantWithRequirements>
                                            | Record<BlessingCombined>

const wikiEntryCombined =
  (x : LiturgicalChantBlessingCombined) : Record<LiturgicalChant> | Record<Blessing> =>
    LiturgicalChantWithRequirements.is (x)
      ? LiturgicalChantWithRequirements.A.wikiEntry (x)
      : BlessingCombined.A.wikiEntry (x)

/**
 * Combined `LiturgicalChantWithRequirements` and `BlessingCombined` accessors.
 */
export const LCBCA = {
  active: (x : LiturgicalChantBlessingCombined) : boolean =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.stateEntry,
          ActivatableSkillDependent.A.active
        )
      : BlessingCombined.A.active (x),
  gr: (x : LiturgicalChantBlessingCombined) : Maybe<number> =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.wikiEntry,
          LiturgicalChant.A.gr,
          Just
        )
      : Nothing,
  aspects: (x : LiturgicalChantBlessingCombined) : List<number> =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.wikiEntry,
          LiturgicalChant.A.aspects
        )
      : List (1),
  tradition: (x : LiturgicalChantBlessingCombined) : List<number> =>
    LiturgicalChantWithRequirements.is (x)
      ? pipe_ (
          x,
          LiturgicalChantWithRequirements.A.wikiEntry,
          LiturgicalChant.A.tradition
        )
      : List (1),
  id: pipe (wikiEntryCombined, Blessing.AL.id),
  name: pipe (wikiEntryCombined, Blessing.AL.name),
}


const isAspectOfTraditionFromPair = (fromPair : <A> (x : Pair<A, A>) => A) =>
                                    (trad : Record<BlessedTraditionR>) =>
                                    (aspect : number) : boolean =>
                                      pipe_ (
                                        trad,
                                        BTA.aspects,
                                        maybe (false)
                                              (aspects => fromPair (aspects) === aspect)
                                      )


const isAspectOfTradition = (trad : Record<BlessedTraditionR>) =>
                            (aspect : number) : boolean =>
                              isAspectOfTraditionFromPair (fst) (trad) (aspect)
                              || isAspectOfTraditionFromPair (snd) (trad) (aspect)


/**
 * Returns the Aspects string for list display.
 */
export const getAspectsStr =
  (staticData : StaticDataRecord) =>
  (curr : LiturgicalChantBlessingCombined) =>
  (mtradition_id : Maybe<BlessedTradition>) : string =>
    pipe_ (
      mtradition_id,
      bindF (tradition_id => pipe_ (
                               staticData,
                               SDA.blessedTraditions,
                               find (trad => BTA.numId (trad) === tradition_id)
                             )),
      toNewMaybe
    )
      .maybe ("", tradition =>
        pipe_ (
          curr,
          LCBCA.aspects,
          mapMaybe (pipe (
                     ensure (isAspectOfTradition (tradition)),
                     bindF (lookupF (SDA.aspects (staticData))),
                     fmap (NumIdName.A.name)
                   )),
          List.elem (14) (LCBCA.tradition (curr))
            ? consF (BTA.name (tradition))
            : ident,
          xs => fnull (xs)
                ? mapMaybe (pipe (
                            lookupF (SDA.aspects (staticData)),
                            fmap (NumIdName.A.name)
                          ))
                          (LCBCA.aspects (curr))
                : xs,
          sortStrings (staticData),
          intercalate (", ")
        ))

/**
 * Returns the final Group/Aspects string for list display.
 */
export const getLCAddText =
  (staticData : StaticDataRecord) =>
  (sortOrder : ChantsSortOptions) =>
  (aspects_str : string) =>
  (curr : Record<LiturgicalChantWithRequirements>) =>
    pipe_ (
      guard (sortOrder === "group"),
      thenF (lookup (LCWRA_.gr (curr))
                    (SDA.liturgicalChantGroups (staticData))),
      maybe (aspects_str)
            (pipe (NumIdName.A.name, gr_str => `${aspects_str} / ${gr_str}`))
    )
