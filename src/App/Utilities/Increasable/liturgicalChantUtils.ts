import { cnst, ident, thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { all, any, consF, foldr, List, minimum, notElem, notElemF } from "../../../Data/List";
import { and, bindF, elem, ensure, fromJust, isJust, Just, Maybe, maybe, sum } from "../../../Data/Maybe";
import { gte, inc, min } from "../../../Data/Num";
import { alter, empty, filter, findWithDefault, foldl, fromArray, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Aspect, BlessedTradition } from "../../Constants/Groups";
import { SpecialAbilityId } from "../../Constants/Ids";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { AttributeDependent } from "../../Models/ActiveEntries/AttributeDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Blessing } from "../../Models/Wiki/Blessing";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getActiveSelectionsMaybe } from "../Activatable/selectionUtils";
import { mapBlessedTradIdToNumId } from "../Activatable/traditionUtils";
import { filterAndMaximumNonNegative, flattenDependencies } from "../Dependencies/flattenDependencies";
import { ifElse } from "../ifElse";
import { pipe } from "../pipe";
import { isNumber } from "../typeCheckUtils";
import { getExceptionalSkillBonus, getInitialMaximumList, putMaximumSkillRatingFromExperienceLevel } from "./skillUtils";

const WA = WikiModel.A
const LCA = LiturgicalChant.A
const LCAL = LiturgicalChant.AL
const SAA = SpecialAbility.A
const ASDA = ActivatableSkillDependent.A

/**
 * Checks if the passed liturgical chant or blessing is valid for the current
 * active blessed tradition.
 */
export const isOwnTradition =
  (blessedTradition: Record<SpecialAbility>) =>
  (entry: Record<LiturgicalChant> | Record<Blessing>): boolean => {
    const numeric_tradition_id = mapBlessedTradIdToNumId (SAA.id (blessedTradition))

    return any<BlessedTradition> (e => e === BlessedTradition.General
                                       || elem<BlessedTradition> (e) (numeric_tradition_id))
                                 (LCAL.tradition (entry))
  }

/**
 * Add a restriction to the list of maxima if there is no aspect knowledge
 * active for the passed liturgical chant.
 */
const putAspectKnowledgeRestrictionMaximum =
  (currentTradition: Record<SpecialAbility>) =>
  (aspectKnowledge: Maybe<Record<ActivatableDependent>>) =>
  (wikiEntry: Record<LiturgicalChant>) =>
    ifElse<List<number>>
      (cnst (
        // is not nameless tradition
        SAA.id (currentTradition) !== SpecialAbilityId.TraditionCultOfTheNamelessOne

        // no aspect knowledge active for the current chant
        && and (fmap (all (notElemF<string | number> (LCA.aspects (wikiEntry))))
                     (getActiveSelectionsMaybe (aspectKnowledge)))
      ))
      <List<number>>
      (consF (14))
      (ident)

/**
 * Checks if the passed liturgical chant's skill rating can be increased.
 */
export const isLiturgicalChantIncreasable =
  (currentTradition: Record<SpecialAbility>) =>
  (wikiEntry: Record<LiturgicalChant>) =>
  (stateEntry: Record<ActivatableSkillDependent>) =>
  (startEL: Record<ExperienceLevel>) =>
  (phase: number) =>
  (attributes: OrderedMap<string, Record<AttributeDependent>>) =>
  (exceptionalSkill: Maybe<Record<ActivatableDependent>>) =>
  (aspectKnowledge: Maybe<Record<ActivatableDependent>>): boolean => {
    const bonus = getExceptionalSkillBonus (LCA.id (wikiEntry)) (exceptionalSkill)

    const max = pipe (
                       getInitialMaximumList (attributes),
                       putMaximumSkillRatingFromExperienceLevel (startEL) (phase),
                       putAspectKnowledgeRestrictionMaximum (currentTradition)
                                                            (aspectKnowledge)
                                                            (wikiEntry),
                       minimum
                     )
                     (wikiEntry)

    return ASDA.value (stateEntry) < max + bonus
  }

/**
 * Counts the active liturgical chants for every aspect. A liturgical chant can
 * have multiple aspects and thus can influence multiple counters if active.
 */
export const countActiveLiturgicalChantsPerAspect =
  (wiki: OrderedMap<string, Record<LiturgicalChant>>):
  (hero: OrderedMap<string, Record<ActivatableSkillDependent>>) => OrderedMap<Aspect, number> =>
    pipe (
      filter (pipe (ASDA.value, gte (10))),
      foldl ((acc: OrderedMap<Aspect, number>) => pipe (
              ASDA.id,
              lookupF (wiki),
              maybe (acc)
                    (pipe (
                      LCA.aspects,
                      foldr<number, OrderedMap<Aspect, number>> (alter (pipe (sum, inc, Just)))
                                                                (acc)
                    ))
            ))
            (empty)
    )

/**
 * Check if the dependencies allow the passed liturgical chant to be decreased.
 */
const isLiturgicalChantDecreasableByDependencies =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (stateEntry: Record<ActivatableSkillDependent>) => {
    const flattenedDependencies =
      flattenDependencies (wiki) (state) (ASDA.dependencies (stateEntry))

    return ASDA.value (stateEntry) < 1
      ? notElem<number | boolean> (true) (flattenedDependencies)
      : ASDA.value (stateEntry) > filterAndMaximumNonNegative (flattenedDependencies)
  }

/**
 * Check if the active aspect knowledges allow the passed liturgical chant to be
 * decreased. (There must be at leased 3 liturgical chants of the
 * respective aspect active.)
 */
const isLiturgicalChantDecreasableByAspectKnowledges =
  (wiki: WikiModelRecord) =>
  (liturgicalChantsStateEntries: OrderedMap<string, Record<ActivatableSkillDependent>>) =>
  (aspectKnowledge: Maybe<Record<ActivatableDependent>>) =>
  (wikiEntry: Record<LiturgicalChant>) =>
  (stateEntry: Record<ActivatableSkillDependent>) =>
    and (
      pipe (
        getActiveSelectionsMaybe,

        // Check if liturgical chant is part of dependencies of active Aspect Knowledge
        bindF<List<string | number>, List<string | number>>
          (ensure (any (e => isNumber (e) && List.elem (e) (LCA.aspects (wikiEntry))))),

        fmap (
          pipe (
            getLowestSumForMatchingAspectKnowledges,
            thrush (countActiveLiturgicalChantsPerAspect (WA.liturgicalChants (wiki))
                                                         (liturgicalChantsStateEntries)),
            thrush (wikiEntry),
            lowest => ASDA.value (stateEntry) !== 10 || lowest > 3
          )
        )
      )
      (aspectKnowledge)
    )

/**
 * Calculates how many liturgical chants are valid as a dependency for
 * all aspect knowledges that also match the current liturgical chant, and
 * returns the lowest sum. Used to check if the liturgical chant's can be safely
 * decreased without invalidating an aspect knowledge's prerequisites.
 */
const getLowestSumForMatchingAspectKnowledges =
  (activeAspects: List<string | number>) =>
  (counter: OrderedMap<Aspect, number>) =>
    pipe (
      LCA.aspects,
      List.foldr<Aspect, number>
        (
          aspect => {
            const counted = lookupF (counter) (aspect)

            if (isJust (counted) && List.elemF (activeAspects) (aspect)) {
              return min (fromJust (counted))
            }

            return ident
          }
        )
        (4)
    )

/**
 * Checks if the passed liturgical chant's skill rating can be decreased.
 */
export const isLiturgicalChantDecreasable =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (aspectKnowledge: Maybe<Record<ActivatableDependent>>) =>
  (wikiEntry: Record<LiturgicalChant>) =>
  (stateEntry: Record<ActivatableSkillDependent>): boolean =>
    isLiturgicalChantDecreasableByDependencies (wiki) (hero) (stateEntry)
    && isLiturgicalChantDecreasableByAspectKnowledges (wiki)
                                                      (HeroModel.A.liturgicalChants (hero))
                                                      (aspectKnowledge)
                                                      (wikiEntry)
                                                      (stateEntry)

/**
 * Keys are aspects and their value is the respective tradition.
 */
const traditionsByAspect = fromArray<Aspect, BlessedTradition> ([
  [Aspect.General, BlessedTradition.General],
  [Aspect.AntiMagic, BlessedTradition.ChurchOfPraios],
  [Aspect.Order, BlessedTradition.ChurchOfPraios],
  [Aspect.Shield, BlessedTradition.ChurchOfRondra],
  [Aspect.Storm, BlessedTradition.ChurchOfRondra],
  [Aspect.Death, BlessedTradition.ChurchOfBoron],
  [Aspect.Dream, BlessedTradition.ChurchOfBoron],
  [Aspect.Magic, BlessedTradition.ChurchOfHesinde],
  [Aspect.Knowledge, BlessedTradition.ChurchOfHesinde],
  [Aspect.Commerce, BlessedTradition.ChurchOfPhex],
  [Aspect.Shadow, BlessedTradition.ChurchOfPhex],
  [Aspect.Healing, BlessedTradition.ChurchOfPeraine],
  [Aspect.Agriculture, BlessedTradition.ChurchOfPeraine],
  [Aspect.Wind, BlessedTradition.ChurchOfEfferd],
  [Aspect.Wogen, BlessedTradition.ChurchOfEfferd],
  [Aspect.Freundschaft, BlessedTradition.ChurchOfTravia],
  [Aspect.Heim, BlessedTradition.ChurchOfTravia],
  [Aspect.Jagd, BlessedTradition.ChurchOfFirun],
  [Aspect.Kaelte, BlessedTradition.ChurchOfFirun],
  [Aspect.Freiheit, BlessedTradition.ChurchOfTsa],
  [Aspect.Wandel, BlessedTradition.ChurchOfTsa],
  [Aspect.Feuer, BlessedTradition.ChurchOfIngerimm],
  [Aspect.Handwerk, BlessedTradition.ChurchOfIngerimm],
  [Aspect.Ekstase, BlessedTradition.ChurchOfRahja],
  [Aspect.Harmonie, BlessedTradition.ChurchOfRahja],
  [Aspect.Reise, BlessedTradition.ChurchOfAves],
  [Aspect.Schicksal, BlessedTradition.ChurchOfAves],
  [Aspect.Hilfsbereitschaft, BlessedTradition.ChurchOfIfirn],
  [Aspect.Natur, BlessedTradition.ChurchOfIfirn],
  [Aspect.GuterKampf, BlessedTradition.ChurchOfKor],
  [Aspect.GutesGold, BlessedTradition.ChurchOfKor],
  [Aspect.Bildung, BlessedTradition.ChurchOfNandus],
  [Aspect.Erkenntnis, BlessedTradition.ChurchOfNandus],
  [Aspect.Kraft, BlessedTradition.ChurchOfSwafnir],
  [Aspect.Tapferkeit, BlessedTradition.ChurchOfSwafnir],
  [Aspect.ReissenderStrudel, BlessedTradition.CultOfNuminoru],
  [Aspect.UnendlicheTiefe, BlessedTradition.CultOfNuminoru],
  [Aspect.Begierde, BlessedTradition.Levthankult],
  [Aspect.Rausch, BlessedTradition.Levthankult],
])

/**
 * Returns the tradition id used by chants. To get the tradition SId for the
 * actual special ability, you have to decrease the return value by 1.
 * @param aspectId The id used for chants or Aspect Knowledge.
 */
export const getTraditionOfAspect =
  (key: Aspect) => findWithDefault (BlessedTradition.General) (key) (traditionsByAspect)

/**
 * Keys are traditions and their values are their respective aspects
 */
const aspectsByTradition = fromArray<BlessedTradition, List<Aspect>> ([
  [BlessedTradition.General, List ()],
  [BlessedTradition.ChurchOfPraios, List (Aspect.AntiMagic, Aspect.Order)],
  [BlessedTradition.ChurchOfRondra, List (Aspect.Shield, Aspect.Storm)],
  [BlessedTradition.ChurchOfBoron, List (Aspect.Death, Aspect.Dream)],
  [BlessedTradition.ChurchOfHesinde, List (Aspect.Magic, Aspect.Knowledge)],
  [BlessedTradition.ChurchOfPhex, List (Aspect.Commerce, Aspect.Shadow)],
  [BlessedTradition.ChurchOfPeraine, List (Aspect.Healing, Aspect.Agriculture)],
  [BlessedTradition.ChurchOfEfferd, List (Aspect.Wind, Aspect.Wogen)],
  [BlessedTradition.ChurchOfTravia, List (Aspect.Freundschaft, Aspect.Heim)],
  [BlessedTradition.ChurchOfFirun, List (Aspect.Jagd, Aspect.Kaelte)],
  [BlessedTradition.ChurchOfTsa, List (Aspect.Freiheit, Aspect.Wandel)],
  [BlessedTradition.ChurchOfIngerimm, List (Aspect.Feuer, Aspect.Handwerk)],
  [BlessedTradition.ChurchOfRahja, List (Aspect.Ekstase, Aspect.Harmonie)],
  [BlessedTradition.CultOfTheNamelessOne, List ()],
  [BlessedTradition.ChurchOfAves, List (Aspect.Reise, Aspect.Schicksal)],
  [BlessedTradition.ChurchOfIfirn, List (Aspect.Hilfsbereitschaft, Aspect.Natur)],
  [BlessedTradition.ChurchOfKor, List (Aspect.GuterKampf, Aspect.GutesGold)],
  [BlessedTradition.ChurchOfNandus, List (Aspect.Bildung, Aspect.Erkenntnis)],
  [BlessedTradition.ChurchOfSwafnir, List (Aspect.Kraft, Aspect.Tapferkeit)],
  [BlessedTradition.CultOfNuminoru, List (Aspect.ReissenderStrudel, Aspect.UnendlicheTiefe)],
  [BlessedTradition.Levthankult, List (Aspect.Begierde, Aspect.Rausch)],
])

/**
 * Return the aspect ids used for chants and Aspect Knowledge.
 * @param traditionId The id used by chants. If you only have the SId from the
 * actual special ability, you have to increase the value by 1 before passing
 * it.
 */
export const getAspectsOfTradition = pipe (
  (key: BlessedTradition) => findWithDefault (List<Aspect> ()) (key) (aspectsByTradition),
  consF<Aspect> (Aspect.General)
)
