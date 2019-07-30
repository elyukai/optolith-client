import { cnst, ident, thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { all, any, consF, foldr, List, minimum, notElem, notElemF } from "../../../Data/List";
import { and, bindF, elem, ensure, fromJust, isJust, Just, Maybe, maybe, sum } from "../../../Data/Maybe";
import { gte, inc, min } from "../../../Data/Num";
import { alter, empty, filter, findWithDefault, foldl, fromArray, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
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
import { filterAndMaximumNonNegative, flattenDependencies } from "../Dependencies/flattenDependencies";
import { getNumericBlessedTraditionIdByInstanceId } from "../IDUtils";
import { ifElse } from "../ifElse";
import { pipe } from "../pipe";
import { isNumber } from "../typeCheckUtils";
import { getExceptionalSkillBonus, getInitialMaximumList, putMaximumSkillRatingFromExperienceLevel } from "./skillUtils";

const { liturgicalChants } = WikiModel.AL
const { id, tradition, aspects } = LiturgicalChant.AL
const { value, dependencies } = ActivatableSkillDependent.AL

/**
 * Checks if the passed liturgical chant or blessing is valid for the current
 * active blessed tradition.
 */
export const isOwnTradition =
  (blessedTradition: Record<SpecialAbility>) =>
  (entry: Record<LiturgicalChant> | Record<Blessing>): boolean => {
    const numeric_tradition_id =
      fmap (inc) (getNumericBlessedTraditionIdByInstanceId (id (blessedTradition)))

    return any<number> (e => e === 1 || elem (e) (numeric_tradition_id)) (tradition (entry))
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
        id (currentTradition) !== "SA_693"

        // no aspect knowledge active for the current chant
        && and (fmap (all (notElemF<string | number> (aspects (wikiEntry))))
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
    const bonus = getExceptionalSkillBonus (id (wikiEntry)) (exceptionalSkill)

    const max = pipe (
                       getInitialMaximumList (attributes),
                       putMaximumSkillRatingFromExperienceLevel (startEL) (phase),
                       putAspectKnowledgeRestrictionMaximum (currentTradition)
                                                            (aspectKnowledge)
                                                            (wikiEntry),
                       minimum
                     )
                     (wikiEntry)

    return value (stateEntry) < max + bonus
  }

/**
 * Counts the active liturgical chants for every aspect. A liturgical chant can
 * have multiple aspects and thus can influence multiple counters if active.
 */
export const countActiveLiturgicalChantsPerAspect =
  (wiki: OrderedMap<string, Record<LiturgicalChant>>):
  (hero: OrderedMap<string, Record<ActivatableSkillDependent>>) => OrderedMap<number, number> =>
    pipe (
      filter<Record<ActivatableSkillDependent>> (pipe (value, gte (10))),
      foldl<Record<ActivatableSkillDependent>, OrderedMap<number, number>>
        (acc => pipe (
          id,
          lookupF (wiki),
          maybe
            (acc)
            (pipe (
              aspects,
              foldr<number, OrderedMap<number, number>> (alter (pipe (sum, inc, Just)))
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
      flattenDependencies (wiki) (state) (dependencies (stateEntry))

    return value (stateEntry) < 1
      ? notElem<number | boolean> (true) (flattenedDependencies)
      : value (stateEntry) > filterAndMaximumNonNegative (flattenedDependencies)
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
          (ensure (any (e => isNumber (e) && List.elem (e) (aspects (wikiEntry))))),

        fmap (
          pipe (
            getLowestSumForMatchingAspectKnowledges,
            thrush (countActiveLiturgicalChantsPerAspect (liturgicalChants (wiki))
                                                         (liturgicalChantsStateEntries)),
            thrush (wikiEntry),
            lowest => value (stateEntry) !== 10 || lowest > 3
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
  (counter: OrderedMap<number, number>) =>
    pipe (
      aspects,
      List.foldr<number, number>
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
const traditionsByAspect = fromArray ([
  [1, 1],
  [2, 2],
  [3, 2],
  [4, 3],
  [5, 3],
  [6, 4],
  [7, 4],
  [8, 5],
  [9, 5],
  [10, 6],
  [11, 6],
  [12, 7],
  [13, 7],
  [14, 8],
  [15, 8],
  [16, 9],
  [17, 9],
  [18, 10],
  [19, 10],
  [20, 11],
  [21, 11],
  [22, 12],
  [23, 12],
  [24, 13],
  [25, 13],
  [26, 15],
  [27, 15],
  [28, 16],
  [29, 16],
  [30, 17],
  [31, 17],
  [32, 18],
  [33, 18],
  [34, 19],
  [35, 19],
  [36, 20],
  [37, 20],
  [38, 21],
  [39, 21],
])

/**
 * Returns the tradition id used by chants. To get the tradition SId for the
 * actual special ability, you have to decrease the return value by 1.
 * @param aspectId The id used for chants or Aspect Knowledge.
 */
export const getTraditionOfAspect =
  (key: number) => findWithDefault (1) (key) (traditionsByAspect)

/**
 * Keys are traditions and their values are their respective aspects
 */
const aspectsByTradition = fromArray<number, List<number>> ([
  [1, List.empty],
  [2, List (2, 3)],
  [3, List (4, 5)],
  [4, List (6, 7)],
  [5, List (8, 9)],
  [6, List (10, 11)],
  [7, List (12, 13)],
  [8, List (14, 15)],
  [9, List (16, 17)],
  [10, List (18, 19)],
  [11, List (20, 21)],
  [12, List (22, 23)],
  [13, List (24, 25)],
  [14, List.empty],
  [15, List (26, 27)],
  [16, List (28, 29)],
  [17, List (30, 31)],
  [18, List (32, 33)],
  [19, List (34, 35)],
  [20, List (36, 37)],
  [21, List (38, 39)],
])

/**
 * Return the aspect ids used for chants and Aspect Knowledge.
 * @param traditionId The id used by chants. If you only have the SId from the
 * actual special ability, you have to increase the value by 1 before passing
 * it.
 */
export const getAspectsOfTradition = pipe (
  (key: number) => findWithDefault<List<number>> (List.empty) (key) (aspectsByTradition),
  consF (1)
)
