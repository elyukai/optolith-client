import { bool_ } from "../../../Data/Bool";
import { equals } from "../../../Data/Eq";
import { ident } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { any, countWith, countWithByKeyMaybe, elemF, find, flength, foldl, foldr, isList, lastS, List, take } from "../../../Data/List";
import { all, altF, bind, bindF, elem, ensure, fromJust, fromMaybe, isJust, isNothing, Just, listToMaybe, Maybe, Nothing, or, sum } from "../../../Data/Maybe";
import { add, gt, inc, lt, multiply, negate, subtractBy } from "../../../Data/Num";
import { alter, empty, findWithDefault, lookup, OrderedMap } from "../../../Data/OrderedMap";
import { fromDefault, Record } from "../../../Data/Record";
import { showP } from "../../../Data/Show";
import { fst, Pair, snd } from "../../../Data/Tuple";
import { DisadvantageId, SpecialAbilityId } from "../../Constants/Ids";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActiveActivatable, ActiveActivatableAL_, ActiveActivatableA_ } from "../../Models/View/ActiveActivatable";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { Skill } from "../../Models/Wiki/Skill";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getMagicalTraditionsHeroEntries } from "../Activatable/traditionUtils";
import { pipe, pipe_ } from "../pipe";
import { misNumberM, misStringM } from "../typeCheckUtils";
import { compareMaxLevel, compareSubMaxLevel, getActiveWithNoCustomCost } from "./activatableCostUtils";

const AP = AdventurePointsCategories.AL

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

const semiTraditionIds =
  List<string> (
    SpecialAbilityId.TraditionZauberbarden,
    SpecialAbilityId.TraditionZaubertaenzer,
    SpecialAbilityId.TraditionIntuitiveZauberer,
    SpecialAbilityId.TraditionMeistertalentierte,
    SpecialAbilityId.TraditionZauberalchimisten,
    SpecialAbilityId.TraditionAnimisten,
  )

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
      const mtradition =
        listToMaybe (getMagicalTraditionsHeroEntries (HeroModel.AL.specialAbilities (state)))

      const misSemiTradition =
        fmap (pipe (ActivatableDependent.AL.id, elemF (semiTraditionIds)))
             (mtradition)

      if (or (misSemiTradition)) {
        return 25
      }
    }

    return 50
  }

export interface MissingAPForDisAdvantage {
  "@@name": "MissingAPForDisAdvantage"
  totalMissing: Maybe<number>
  mainMissing: Maybe<number>
  subMissing: Maybe<number>
}

export const MissingAPForDisAdvantage =
  fromDefault ("MissingAPForDisAdvantage")
              <MissingAPForDisAdvantage> ({
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
    const currentAPSpent =
      isDisadvantage
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

    console.log (`isBlessedOrMagical = ${showP (isBlessedOrMagical)}`)
    console.log (`subCurrentAPSpent = ${showP (subCurrentAPSpent)}`)
    console.log (`smallMax = ${showP (smallMax)}`)
    console.log (`subMissing = ${showP (subMissing)}`)
    console.log (`mainMissing = ${showP (mainMissing)}`)
    console.log (`totalMissing = ${showP (totalMissing)}`)

    return MissingAPForDisAdvantage ({ totalMissing, mainMissing, subMissing })
  }

const getPrinciplesObligationsDiff =
  (id: string) =>
  (wiki: WikiModelRecord) =>
  (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  (entries: List<Record<ActiveActivatable>>): number => {
    if (any (pipe (ActiveActivatableAL_.id, equals (id))) (entries)) {
      return pipe_ (
        hero_slice,
        lookup (id),
        bindF (entry => {
          const current_active = ActivatableDependent.A.active (entry)

          const current_max_level = foldl (compareMaxLevel)
                                          (0)
                                          (current_active)

          const current_second_max_level = foldl (compareSubMaxLevel (current_max_level))
                                                 (0)
                                                 (current_active)

          const at_max_level =
            countWith (pipe (ActiveObject.A.tier, elem (current_max_level)))
                      (current_active)

          const mbase_cost =
            pipe_ (
              wiki,
              WikiModel.A.disadvantages,
              lookup (id),
              bindF (Disadvantage.A.cost),
              misNumberM
            )

          return at_max_level > 1
            ? fmapF (mbase_cost) (base => current_max_level * -base)
            : fmapF (mbase_cost) (base => current_second_max_level * -base)
        }),
        sum
      )
    }

    return 0
  }

const getPropertyOrAspectKnowledgeDiff =
  (id: string) =>
    pipe (
      find (pipe (ActiveActivatableA_.id, equals (id))),
      fmap (entry => {
        const current_active_length =
          pipe_ (entry, ActiveActivatable.AL.heroEntry, ActivatableDependent.A.active, flength)

        const mcost = pipe_ (entry, ActiveActivatable.AL.wikiEntry, Disadvantage.AL.cost)

        if (isJust (mcost)) {
          const cost = fromJust (mcost)

          if (isList (cost)) {
            const actualAPSum = pipe_ (cost, take (current_active_length), List.sum)

            // Sum of displayed AP values for entries (not actual sum)
            const displayedAPSumForAll = sum (lastS (cost)) * (current_active_length - 1)

            return actualAPSum - displayedAPSumForAll
          }
        }

        return 0
      }),
      sum
    )

const getPersonalityFlawsDiff =
  (wiki: WikiModelRecord) =>
  (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  (entries: List<Record<ActiveActivatable>>): number =>
    any (pipe (ActiveActivatableAL_.id, equals<string> (DisadvantageId.PersonalityFlaw)))
        (entries)
      ? sum (pipe_ (
        hero_slice,
        lookup<string> (DisadvantageId.PersonalityFlaw),
        fmap (pipe (
          // get current active
          ActivatableDependent.A.active,

          // number of entries with multiple entries of the same sid possible
          countWith ((e: Record<ActiveObject>) => elem<string | number> (7) (ActiveObject.A.sid (e))
                                                  && isNothing (ActiveObject.A.cost (e))),

          gt (1),
          bool_ (() => 0)
                (() => pipe_ (
                  wiki,
                  WikiModel.A.disadvantages,
                  lookup<string> (DisadvantageId.PersonalityFlaw),
                  bindF (Disadvantage.A.select),
                  bindF (find (pipe (SelectOption.A.id, equals<string | number> (7)))),
                  bindF (SelectOption.A.cost),
                  fmap (negate),
                  sum
                ))
        ))
      ))
      : 0

const getBadHabitsDiff =
  (wiki: WikiModelRecord) =>
  (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  (entries: List<Record<ActiveActivatable>>): number =>
    any (pipe (ActiveActivatableAL_.id, equals<string> (DisadvantageId.BadHabit))) (entries)
      ? sum (pipe_ (
        hero_slice,
        lookup<string> (DisadvantageId.PersonalityFlaw),
        fmap (pipe (
          // get current active
          ActivatableDependent.A.active,
          getActiveWithNoCustomCost,
          flength,
          gt (3),
          bool_ (() => 0)
                (() => pipe_ (
                  wiki,
                  WikiModel.A.disadvantages,
                  lookup<string> (DisadvantageId.BadHabit),
                  bindF (Disadvantage.A.cost),
                  misNumberM,
                  fmap (multiply (-3)),
                  sum
                ))
        ))
      ))
      : 0

const getSkillSpecializationsDiff =
  (wiki: WikiModelRecord) =>
  (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  (entries: List<Record<ActiveActivatable>>): number => {
    if (any (pipe (ActiveActivatableAL_.id, equals<string> (SpecialAbilityId.SkillSpecialization)))
            (entries)) {
      return sum (pipe_ (
        hero_slice,
        lookup<string> (SpecialAbilityId.SkillSpecialization),
        fmap (entry => {
          const current_active = ActivatableDependent.A.active (entry)

          // Count how many specializations are for the same skill
          const sameSkill =
            countWithByKeyMaybe (pipe (ActiveObject.A.sid, misStringM))
                                (current_active)

          // Return the accumulated value, otherwise 0.
          const getFlatSkillDone = findWithDefault (0)

          // Calculates the diff for a single skill specialization
          const getSingleDiff =
            (accMap: OrderedMap<string, number>) =>
            (sid: string) =>
            (counter: number) =>
            (skill: Record<Skill>) =>
              Skill.A.ic (skill) * (getFlatSkillDone (sid) (accMap) + 1 - counter)

          type TrackingPair = Pair<number, OrderedMap<string, number>>

          // Iterates through the counter and sums up all cost differences for
          // each specialization.
          //
          // It keeps track of how many specializations have been already
          // taken into account.
          const skillDone =
            foldr (pipe (
                    ActiveObject.A.sid,
                    misStringM,
                    bindF (current_sid =>
                            fmapF (lookup (current_sid) (sameSkill))
                                  (count => (p: TrackingPair) => {
                                    const m = snd (p)

                                    // Check if the value in the map is either
                                    // Nothing or a Just of a lower number than
                                    // the complete counter
                                    // => which means there are still actions to
                                    // be done
                                    if (all (lt (count)) (lookup (current_sid) (m))) {
                                      const mskill =
                                        pipe_ (wiki, WikiModel.A.skills, lookup (current_sid))

                                      return Pair (
                                        fst (p) + sum (fmap (getSingleDiff (m)
                                                                           (current_sid)
                                                                           (count))
                                                            (mskill)),
                                        alter (pipe (altF (Just (0)), fmap (inc)))
                                              (current_sid)
                                              (m)
                                      )
                                    }

                                    return p
                                  })),
                    fromMaybe (ident)
                  ))
                  (Pair (0, empty))
                  (current_active)

          return fst (skillDone)
        })
      ))
    }

    return 0
  }

const getPropertyKnowledgeDiff =
  getPropertyOrAspectKnowledgeDiff (SpecialAbilityId.PropertyKnowledge)

const getAspectKnowledgeDiff =
  getPropertyOrAspectKnowledgeDiff (SpecialAbilityId.AspectKnowledge)

export const getAdventurePointsSpentDifference =
  (wiki: WikiModelRecord) =>
  (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  (entries: List<Record<ActiveActivatable>>): number => {
    const adventurePointsSpentDifferences = List (
      getPrinciplesObligationsDiff (DisadvantageId.Principles) (wiki) (hero_slice) (entries),
      getPrinciplesObligationsDiff (DisadvantageId.Obligations) (wiki) (hero_slice) (entries),
      getPersonalityFlawsDiff (wiki) (hero_slice) (entries),
      getBadHabitsDiff (wiki) (hero_slice) (entries),
      getSkillSpecializationsDiff (wiki) (hero_slice) (entries),
      getPropertyKnowledgeDiff (entries),
      getAspectKnowledgeDiff (entries)
    )

    return List.sum (adventurePointsSpentDifferences)
  }
