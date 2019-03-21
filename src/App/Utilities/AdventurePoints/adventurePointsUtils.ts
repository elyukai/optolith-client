import { fmap } from "../../../Data/Functor";
import { elemF, List } from "../../../Data/List";
import { bind, ensure, Just, listToMaybe, Maybe, Nothing, or } from "../../../Data/Maybe";
import { fst, Pair, snd } from "../../../Data/Pair";
import { fromDefault, Record } from "../../../Data/Record";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { getMagicalTraditions } from "../activatable/traditionUtils";
import { add, gt, subtractBy } from "../mathUtils";
import { pipe } from "../pipe";
import { getActiveWithNoCustomCost } from "./activatableCostUtils";

const AP = AdventurePointsCategories.A

/**
 * Checks if there are enough AP available. If there are, returns `Nothing`.
 * Otherwise returns a `Just` of the missing AP.
 * @param negativeApValid If the character's AP left can be a negative value
 * (during character creation) or not.
 * @param availableAP The AP currently available.
 * @param cost The AP value you want to check.
 */
export const getMissingAP =
  (negativeApValid: boolean) => (cost: number) => (availableAP: number): Maybe<number> => {
    if (cost > 0 && !negativeApValid) {
      return cost <= availableAP ? Nothing : Just (cost - availableAP)
    }

    return Nothing
  }

/**
 * Returns the maximum AP value you can spend on magical/blessed
 * advantages/disadvantages.
 * @param state The list of dependent instances.
 * @param index The index in the AP array. `0` equals General, `1` equals
 * Magical and `2` equals Blessed.
 */
export const getDisAdvantagesSubtypeMax =
  (isMagical: boolean) => (state: HeroModelRecord): number => {
    if (isMagical) {
      const mtradition = listToMaybe (getMagicalTraditions (HeroModel.A.specialAbilities (state)))

      const semiTraditionIds = List ("SA_677", "SA_678", "SA_679", "SA_680")

      const misSemiTradition =
        fmap (pipe (ActivatableDependent.A.id, elemF (semiTraditionIds)))
             (mtradition)

      if (or (misSemiTradition)) {
        return 25
      }
    }

    return 50
  }

export interface MissingAPForDisAdvantage {
  totalMissing: Maybe<number>
  mainMissing: Maybe<number>
  subMissing: Maybe<number>
}

export const MissingAPForDisAdvantage =
  fromDefault<MissingAPForDisAdvantage> ({
    totalMissing: Nothing,
    mainMissing: Nothing,
    subMissing: Nothing,
  })

const getDisAdvantageSubtypeAPSpent =
  (isBlessedOrMagical: Pair<boolean, boolean>) =>
  (isDisadvantage: boolean) =>
  (ap: Record<AdventurePointsCategories>): Maybe<number> => {
    if (isDisadvantage) {
      if (snd (isBlessedOrMagical)) {
        return Just (AP.spentOnMagicalDisadvantages (ap))
      }

      if (fst (isBlessedOrMagical)) {
        return Just (AP.spentOnBlessedDisadvantages (ap))
      }
    }

    if (snd (isBlessedOrMagical)) {
      return Just (AP.spentOnMagicalAdvantages (ap))
    }

    if (fst (isBlessedOrMagical)) {
      return Just (AP.spentOnBlessedAdvantages (ap))
    }

    return Nothing
  }

/**
 * Checks if there are enough AP available and if the restrictions for
 * advantages/disadvantages will be met.
 * @param cost The AP value you want to check.
 * @param ap The current AP state.
 * @param state The list of dependent instances.
 * @param isMagicalOrBlessed If the the advantage/disadvantage is magical or
 * blessed.
 * @param isDisadvantage If the entry is a disadvantage.
 * @param isInCharacterCreation If the character's AP left can be a negative
 * value (during character creation) or not.
 */
export const getMissingAPForDisAdvantage =
  (isInCharacterCreation: boolean) =>
  (isBlessedOrMagical: Pair<boolean, boolean>) =>
  (isDisadvantage: boolean) =>
  (hero: HeroModelRecord) =>
  (ap: Record<AdventurePointsCategories>) =>
  (cost: number): Record<MissingAPForDisAdvantage> => {
    const currentAPSpent = isDisadvantage
      ? AP.spentOnDisadvantages (ap)
      : AP.spentOnAdvantages (ap)

    const subCurrentAPSpent = getDisAdvantageSubtypeAPSpent (isBlessedOrMagical)
                                                            (isDisadvantage)
                                                            (ap)

    const smallMax = getDisAdvantagesSubtypeMax (snd (isBlessedOrMagical)) (hero)

    // a disadvantage has negative cost, but the sum to check is always positive
    // (to be able to use one function for both advantages and disadvantages)
    const normalizedCost = isDisadvantage ? cost * -1 : cost

    // checks if there are enough AP below the max for the subtype
    // (magical/blessed)
    const subMissing =
      !isInCharacterCreation
        ? Nothing
        : bind (subCurrentAPSpent)
               (pipe (
                 add (normalizedCost),
                 subtractBy (smallMax),
                 ensure (gt (0)) // (current + spent) - max > 0 => invalid
               ))

    // Checks if there are enough AP below the max for advantages/disadvantages
    const mainMissing =
      !isInCharacterCreation
        ? Nothing
        // (current + spent) - max > 0 => invalid
        : ensure (gt (0)) (currentAPSpent + normalizedCost - 80)

    // Checks if there are enough AP available in total
    const totalMissing = getMissingAP (isInCharacterCreation)
                                      (cost)
                                      (AP.available (ap))

    return MissingAPForDisAdvantage ({ totalMissing, mainMissing, subMissing })
  }

const getPrinciplesObligationsDiff = (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  wiki: Record<WikiAll>,
  sourceId: string
): number => {
  if (entries.any (e => e.get ("id") === sourceId)) {
    return Maybe.fromMaybe (0) (
      state.lookup (sourceId)
        .bind (
          entry => {
            const active = entry.get ("active")

            const maxCurrentTier = active.foldl<number> (
              a => b => {
                const tier = b.lookup ("tier")

                return Maybe.isJust (tier)
                  && Maybe.fromJust (tier) > a
                  && Maybe.isNothing (b.lookup ("cost"))
                    ? Maybe.fromJust (tier)
                    : a
              }
            ) (0)

            // Next lower tier
            const subMaxCurrentTier = active.foldl<number> (
              a => b => {
                const tier = b.lookup ("tier")

                return Maybe.isJust (tier)
                  && Maybe.fromJust (tier) > a
                  && Maybe.fromJust (tier) < maxCurrentTier
                  && Maybe.isNothing (b.lookup ("cost"))
                    ? Maybe.fromJust (tier)
                    : a
              }
            ) (0)

            const justMaxCurrentTier = Maybe.pure (maxCurrentTier)

            const amountMaxTiers = active.foldl<number> (
              a => b => b.lookup ("tier").equals (justMaxCurrentTier) ? a + 1 : a
            ) (0)

            const baseCost = wiki.get ("disadvantages")
              .lookup (sourceId)
              .fmap (e => e.get ("cost") as number)

            const amountDiff = amountMaxTiers > 1
              ? baseCost.fmap (base => maxCurrentTier * -base)
              : Maybe.pure (0)

            const levelDiff = baseCost.fmap (base => subMaxCurrentTier * -base)

            return amountDiff.bind (
              amount => levelDiff.fmap (level => amount + level)
            )
          }
        )
    )
  }
  else {
    return 0
  }
}

const getPropertyOrAspectKnowledgeDiff = (entry: Record<Data.ActiveViewObject>) => {
  const active = entry.get ("stateEntry").get ("active")
  const cost = entry.get ("wikiEntry").get ("cost")

  if (cost instanceof List) {
    const actualAPSum = cost.ifoldl<number> (
      a => i => b => i + 1 < active.length () ? a + b : a
    ) (0)

    // Sum of displayed AP values for entries (not actual sum)
    const displayedAPSumForAll = (
      Maybe.fromMaybe (0) (List.last_ (cost)) * (active.length () - 1)
    )

    return actualAPSum - displayedAPSumForAll
  }

  return 0
}

const getPersonalityFlawsDiff = (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  wiki: Record<WikiAll>
): number => {
  if (entries.any (e => e.get ("id") === "DISADV_33")) {
    return Maybe.fromMaybe (0) (
      state.lookup ("DISADV_33")
        .fmap (
          entry => {
            const active = entry.get ("active")

            const numberOfEntriesWithMultiplePossible =
              active.filter (
                e => e.lookup ("sid").equals (Maybe.pure (7))
                  && Maybe.isNothing (e.lookup ("cost"))
              )
                .length ()

            if (numberOfEntriesWithMultiplePossible > 1) {
              return Maybe.fromMaybe (0) (
                wiki.get ("disadvantages").lookup ("DISADV_33")
                  .bind (wikiEntry => wikiEntry.lookup ("select"))
                  .bind (select => select.find (e => e.get ("id") === 7))
                  .bind (selection => selection.lookup ("cost"))
                  .fmap (R.negate)
              )
            }

            return 0
          }
        )
    )
  }
  else {
    return 0
  }
}

const getBadHabitsDiff = (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  wiki: Record<WikiAll>
): number => {
  const id = "DISADV_36"

  if (entries.any (e => e.get ("id") === id)) {
    return Maybe.fromMaybe (0) (
      state.lookup (id)
        .fmap (
          entry => {
            const active = entry.get ("active")

            if (getActiveWithNoCustomCost (active).length () > 3) {
              return R.pipe (
                getWikiEntryFromSlice (wiki) ("disadvantages"),
                Maybe.fmap (Record.get<Disadvantage, "cost"> ("cost")),
                Maybe.bind_ (Maybe.ensure (isNumber)),
                Maybe.fmap (R.multiply (-3)),
                Maybe.fromMaybe (0)
              ) (id)
            }

            return 0
          }
        )
    )
  }
  else {
    return 0
  }
}

const getSkillSpecializationsDiff = (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  wiki: Record<WikiAll>
): number => {
  if (entries.any (e => e.get ("id") === "SA_9")) {
    return Maybe.fromMaybe (0) (
      state.lookup ("SA_9")
        .fmap (
          entry => {
            const active = entry.get ("active")

            // Count how many specializations are for the same skill
            const sameSkill = active.foldl<OrderedMap<string, number>> (
              acc => current => {
                const altered = current.lookup ("sid")
                  .bind (Maybe.ensure (isString))
                  .fmap (acc.alter (sum => sum.fmap (R.inc).alt (Maybe.pure (1))))

                return Maybe.isJust (altered) ? Maybe.fromJust (altered) : acc
              }
            ) (OrderedMap.empty ())

            // Return the accumulated value, otherwise 0.
            const getFlatSkillDone =
              (accMap: OrderedMap<string, number>, sid: string) =>
                Maybe.fromMaybe (0) (accMap.lookup (sid))

            // Calculates the diff for a single skill specialization
            const getSingleDiff = (
              skill: Record<Skill>,
              accMap: OrderedMap<string, number>,
              sid: string,
              counter: number
            ) =>
              skill.get ("ic") * (getFlatSkillDone (accMap, sid) + 1 - counter)

            /*
             * Iterates through the counter and sums up all cost differences for
             * each specialization.
             *
             * It keeps track of how many specializations have been already
             * taken into account.
             */
            const skillDone =
              active.foldl<Tuple<number, OrderedMap<string, number>>> (
                acc => current => {
                  const altered = current.lookup ("sid")
                    .bind (Maybe.ensure (isString))
                    .bind (
                      sid => sameSkill.lookup (sid)
                        .fmap (counter => {
                          const accMap = Tuple.snd (acc)
                          if (
                            !accMap.member (sid)
                            || accMap.lookup (sid).lt (Maybe.pure (counter))
                          ) {
                            const maybeSkill = wiki.get ("skills").lookup (sid)

                            return Tuple.of<number, OrderedMap<string, number>> (
                              Maybe.fromMaybe (Tuple.fst (acc)) (
                                maybeSkill.fmap (skill =>
                                  Tuple.fst (acc)
                                  + getSingleDiff (skill, accMap, sid, counter)
                                )
                              )
                            ) (
                              accMap.alter (sum => sum.fmap (R.inc).alt (Maybe.pure (1))) (sid)
                            )
                          }

                          return acc
                        })
                    )

                  return Maybe.isJust (altered) ? Maybe.fromJust (altered) : acc
                }
              ) (Tuple.of<number, OrderedMap<string, number>> (0) (OrderedMap.empty ()))

            return Tuple.fst (skillDone)
          }
        )
    )
  }
  else {
    return 0
  }
}

const getPropertyKnowledgeDiff = R.pipe (
  List.find<Record<Data.ActiveViewObject>> (e => e.get ("id") === "SA_72"),
  Maybe.fmap (getPropertyOrAspectKnowledgeDiff),
  Maybe.fromMaybe (0)
)

const getAspectKnowledgeDiff = R.pipe (
  List.find<Record<Data.ActiveViewObject>> (e => e.get ("id") === "SA_87"),
  Maybe.fmap (getPropertyOrAspectKnowledgeDiff),
  Maybe.fromMaybe (0)
)

export function getAdventurePointsSpentDifference (
  entries: List<Record<Data.ActiveViewObject>>,
  state: OrderedMap<string, Record<Data.ActivatableDependent>>,
  wiki: Record<WikiAll>
): number {
  const adventurePointsSpentDifferences = List.of (
    getPrinciplesObligationsDiff (entries, state, wiki, "DISADV_34"),
    getPrinciplesObligationsDiff (entries, state, wiki, "DISADV_50"),
    getPersonalityFlawsDiff (entries, state, wiki),
    getBadHabitsDiff (entries, state, wiki),
    getSkillSpecializationsDiff (entries, state, wiki),
    getPropertyKnowledgeDiff (entries),
    getAspectKnowledgeDiff (entries)
  )

  return List.sum (adventurePointsSpentDifferences)
}
