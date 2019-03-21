/**
 * Calculate the Adventure Points for when removing the entry. This might not
 * be the actual cost. In those cases the AP difference needs to be calculated
 * for AP spent total.
 *
 * @file src/utils/activatableCostUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { fmap, fmapF } from "../../../Data/Functor";
import { countWith, find, foldl, isList, List, map, notNull, subscript, subscriptF } from "../../../Data/List";
import { any, bind, bindF, elem, elemF, ensure, fromJust, fromMaybe, isJust, isNothing, liftM2, listToMaybe, Maybe, Nothing } from "../../../Data/Maybe";
import { lookup, lookupF } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActivatableDependent, isActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Advantage } from "../../Models/Wiki/Advantage";
import { isDisadvantage } from "../../Models/Wiki/Disadvantage";
import { Skill } from "../../Models/Wiki/Skill";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable, EntryWithCategory, SkillishEntry } from "../../Models/Wiki/wikiTypeHelpers";
import { isMaybeActive } from "../activatable/isActive";
import { getSelectOptionCost } from "../activatable/selectionUtils";
import { getHeroStateItem } from "../heroStateUtils";
import { translate } from "../I18n";
import { getCategoryById } from "../IDUtils";
import { match } from "../match";
import { add, dec, multiply, negate } from "../mathUtils";
import { toRoman } from "../NumberUtils";
import { pipe } from "../pipe";
import { isNumber, isNumberM, misNumberM, misStringM } from "../typeCheckUtils";
import { getWikiEntry, isActivatableWikiEntry, isSkillishWikiEntry } from "../WikiUtils";

const isDisadvantageActive =
  (id: string) =>
    pipe (
      HeroModel.A_.disadvantages,
      lookup (id),
      isMaybeActive
    )

/**
 * Returns the value(s) how the spent AP value would change after removing the
 * respective entry.
 *
 * @param isEntryToAdd If `entry` has not been added to the list of active
 * entries yet, this must be `true`, otherwise `false`.
 */
const getEntrySpecificCost =
  (isEntryToAdd: boolean) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActivatableDependent>) =>
  // tslint:disable-next-line: cyclomatic-complexity
  (entry: Record<ActiveObjectWithId>): Maybe<number | List<number>> => {
    const current_id = ActiveObjectWithId.A_.id (entry)
    const mcurrent_sid = ActiveObjectWithId.A_.sid (entry)
    const mcurrent_level = ActiveObject.A.tier (entry)

    const mcurrent_cost = Advantage.A.cost (entry)

    const all_active = ActivatableDependent.A.active (hero_entry)

    switch (current_id) {
      // Aptitude
      case "ADV_4":
      // Exceptional Skill
      case "ADV_16":
      // Exceptional Combat Technique
      case "ADV_17":
      // Weapon Aptitude
      case "ADV_47":
      // Incompetent
      case "DISADV_48":
      // Adaption (Zauber)
      case "SA_231":
      // Lieblingszauber
      case "SA_250":
      // Forschungsgebiet
      case "SA_472":
      // Expertenwissen
      case "SA_473":
      // Wissensdurst
      case "SA_531":
      // Lieblingsliturgie
      case "SA_569": {
        type NumList = List<number>

        return pipe (
                      misStringM,
                      bindF (getWikiEntry (wiki)),
                      bindF<EntryWithCategory, SkillishEntry> (ensure (isSkillishWikiEntry)),
                      bindF (skill => pipe (
                                        bindF<number | NumList, NumList> (ensure (isList)),

                                        // Use the IC as an index for the list
                                        // of AP
                                        bindF (subscriptF (Skill.A.ic (skill) - 1))
                                      )
                                      (mcurrent_cost))
                    )
                    (mcurrent_sid)
      }

      // Personality Flaw
      case "DISADV_33": {
        if (
          // 7 = "Prejudice" => more than one entry possible
          elemF (mcurrent_sid) (7)
          // more than one entry of Prejudice does contribute to AP spent
          && countWith ((e: Record<ActiveObject>) =>
                         pipe (ActiveObject.A.sid, elem<string | number> (7)) (e)
                         // Entries with custom cost are ignored for the rule
                         && isNothing (ActiveObject.A.cost (e)))
                       (all_active) > (isEntryToAdd ? 0 : 1)
        ) {
          return Nothing
        }

        return getSelectOptionCost (wiki_entry) (mcurrent_sid)
      }

      // Principles
      case "DISADV_34":
      // Obligations
      case "DISADV_50": {
        /**
         * A folding function over a list of `ActiveObject`s returning the
         * highest level. Ignores entries with custom cost.
         */
        const compareMaxLevel =
          (previous_max: number) =>
          (active: Record<ActiveObject>) => {
            const mactive_level = ActiveObject.A.tier (active)

            if (isJust (mactive_level)) {
              const active_level = fromJust (mactive_level)

              return active_level > previous_max
                && isNothing (ActiveObject.A.cost (active))
                  ? active_level
                  : previous_max
            }

            return previous_max
          }

        /**
         * A folding function over a list of `ActiveObject`s returning the
         * second-highest level. Ignores entries with custom cost.
         */
        const compareSubMaxLevel =
          (max: number) =>
          (previous_max: number) =>
          (active: Record<ActiveObject>) => {
            const mactive_level = ActiveObject.A.tier (active)

            if (isJust (mactive_level)) {
              const active_level = fromJust (mactive_level)

              return active_level > previous_max
                && active_level < max
                && isNothing (ActiveObject.A.cost (active))
                  ? active_level
                  : previous_max
            }

            return previous_max
          }

        const current_max_level = foldl (compareMaxLevel)
                                        (0)
                                        (all_active)

        const current_second_max_level = foldl (compareSubMaxLevel (current_max_level))
                                               (0)
                                               (all_active)

        if (isNothing (mcurrent_level)) {
          return Nothing
        }

        const current_level = fromJust (mcurrent_level)

        if (
          // If the entry is not the one with the highest level, adding or
          // removing it won't affect AP spent at all
          current_max_level > current_level

          // If there is more than one entry on the same level if this entry is
          // active, it won't affect AP spent at all. Thus, if the entry is to
          // be added, there must be at least one (> 0) entry for this rule to
          // take effect.
          || countWith (pipe (ActiveObject.A.tier, elem (current_level)))
                       (all_active) > (isEntryToAdd ? 0 : 1)
        ) {
          return Nothing
        }

        // Otherwise, the level difference results in the cost.
        return fmapF (isNumberM (mcurrent_cost))
                     (multiply (current_level - current_second_max_level))
      }

      // Bad Habit
      case "DISADV_36": {
        if (
          // more than three entries cannot contribute to AP spent; entries with
          // custom cost are ignored for the rule's effect
          countWith (pipe (ActiveObject.A.cost, isNothing))
                    (all_active) > (isEntryToAdd ? 2 : 3)
        ) {
          return Nothing
        }

        return mcurrent_cost
      }

      // Skill Specialization
      case "SA_9": {
        return pipe (
                      misStringM,
                      bindF (
                        current_sid =>
                          fmapF (lookup (current_sid)
                                        (WikiModel.A_.skills (wiki)))
                                (skill =>
                                  // Multiply number of final occurences of the
                                  // same skill...
                                  (countWith ((e: Record<ActiveObject>) =>
                                              pipe (
                                                     ActiveObject.A.sid,
                                                     elem<string | number> (current_sid)
                                                   )
                                                   (e)

                                              // Entries with custom cost are ignored for the rule
                                              && isNothing (ActiveObject.A.cost (e)))
                                            (all_active) + (isEntryToAdd ? 1 : 0))

                                  // ...with the skill's IC
                                  * Skill.A.ic (skill)))

                    )
                    (mcurrent_sid)
      }

      // Language
      case "SA_29": {
        // Native Tongue (level 4) does not cost anything
        return elem (4) (mcurrent_level) ? Nothing : mcurrent_cost
      }

      // Property Knowledge
      case "SA_72":
      // Aspect Knowledge
      case "SA_87": {
        // Does not include custom cost activations in terms of calculated cost
        const amount = countWith (pipe (ActiveObject.A.cost, isNothing))
                                 (all_active)

        const index = amount + (isEntryToAdd ? 0 : -1)

        if (isNothing (mcurrent_cost)) {
          return Nothing
        }

        const current_cost = fromJust (mcurrent_cost)

        return isList (current_cost) ? subscript (current_cost) (index) : Nothing
      }

      // Tradition (Witch)
      case "SA_255": {
        // There are two disadvantages that, when active, decrease the cost of
        // this tradition by 10 AP each
        const decreaseCost = (id: string) => (cost: number) =>
          isDisadvantageActive (id) (hero) ? cost - 10 : cost

        return fmap (pipe (
                      decreaseCost ("DISADV_17"),
                      decreaseCost ("DISADV_18")
                    ))
                    (misNumberM (mcurrent_cost))
      }

      // Recherchegespür
      case "SA_533": {
        // The AP cost for this SA consist of two parts: AP based on the IC of
        // the main subject (from "SA_531"/Wissensdurst) in addition to AP based
        // on the IC of the side subject selected in this SA.

        const mhero_entry_SA_531 = lookup ("SA_531")
                                          (HeroModel.A_.specialAbilities (hero))

        if (isNothing (mhero_entry_SA_531)) {
          return Nothing
        }

        if (isNothing (mcurrent_cost) || isNothing (mcurrent_cost)) {
          return Nothing
        }

        const current_cost = fromJust (mcurrent_cost)

        if (isNumber (current_cost)) {
          return Nothing
        }

        const hero_entry_SA_531 = fromJust (mhero_entry_SA_531)

        const getCostFromHeroEntry =
          pipe (
            ActivatableDependent.A_.active,
            listToMaybe,
            bindF (ActiveObject.A_.sid),
            misStringM,
            bindF (lookupF (WikiModel.A_.skills (wiki))),
            bindF (pipe (Skill.A_.ic, dec, subscript (current_cost)))
          )

        return liftM2 (add)
                      (getCostFromHeroEntry (hero_entry))
                      (getCostFromHeroEntry (hero_entry_SA_531))

      }

      // Language Specialization
      case "SA_699": {
        if (isNothing (mcurrent_sid)) {
          return Nothing
        }

        const current_sid = fromJust (mcurrent_sid)

        return pipe (
                      HeroModel.A_.specialAbilities,
                      lookup ("SA_29"),
                      bindF (pipe (
                        ActivatableDependent.A_.active,
                        // Get the `ActiveObject` for the corresponding language
                        find (pipe (ActiveObject.A_.sid, elem (current_sid)))
                      )),
                      bindF (ActiveObject.A_.tier),
                      // If it's a native language, it costs nothing, otherwise
                      // the default SA's AP
                      bindF (level => level === 4 ? Nothing : misNumberM (mcurrent_cost))
                    )
                    (hero)
      }

      default: {
        if (any (notNull) (Advantage.A.select (wiki_entry)) && isNothing (mcurrent_cost)) {
          return getSelectOptionCost (wiki_entry) (mcurrent_sid)
        }

        return mcurrent_cost
      }
    }
  }

const getTotalCost =
  (isEntryToAdd: boolean) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActivatableDependent>): number | List<number> => {
    const custom_cost = ActiveObjectWithId.A_.cost (entry)

    if (isJust (custom_cost)) {
      return fromJust (custom_cost)
    }

    const current_cost =
      fromMaybe<number | List<number>> (0)
                                       (getEntrySpecificCost (isEntryToAdd)
                                                             (wiki)
                                                             (hero)
                                                             (wiki_entry)
                                                             (hero_entry)
                                                             (entry))

    if (isDisadvantage (wiki_entry)) {
      return isList (current_cost) ? map (negate) (current_cost) : -current_cost
    }

    return current_cost
  }

/**
 * Returns the AP you get when removing the ActiveObject.
 *
 * @param isEntryToAdd If `entry` has not been added to the list of active
 * entries yet, this must be `true`, otherwise `false`.
 */
export const getCost =
  (isEntryToAdd: boolean) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>): Maybe<number | List<number>> => {
    const current_id = ActiveObjectWithId.A_.id (entry)

    return liftM2 (getTotalCost (isEntryToAdd)
                                (wiki)
                                (hero)
                                (entry))
                  (bind (getWikiEntry (wiki) (current_id))
                        (ensure (isActivatableWikiEntry)))
                  (bind (getHeroStateItem (hero) (current_id))
                        (ensure (isActivatableDependent)))
  }

const adjustCurrentCost =
  (obj: Record<Data.ActivatableNameCostEvalTier>):
    Record<Data.ActivatableNameAdjustedCostEvalTier> =>
    obj.merge (Record.of ({
      finalCost: match<number | List<number>, number> (obj.get ("finalCost"))
        .on ((e): e is List<number> => e instanceof List, currentCost => {
          const tier = obj.lookupWithDefault<"tier"> (1) ("tier")

          return currentCost.ifoldl<number> (
            sum => index => current =>
              index <= (tier - 1) ? sum + current : sum) (0)
        })
        .on (
          () => Maybe.isJust (obj.lookup ("tier"))
            && obj.get ("id") !== "DISADV_34"
            && obj.get ("id") !== "DISADV_50",
          currentCost => Maybe.fromMaybe (0) (
            obj.lookup ("tier").fmap (tier => currentCost * tier)
          )
        )
        .otherwise (() => obj.get ("finalCost") as number),
    }))

const getLevel = (level: number) => ` ${toRoman (level)}`

const getSpecialAbilityLevel =
  (level: number) => level > 1 ? ` I-${toRoman (level)}` : getLevel (level)

const getAdjustedLevelName =
  (locale: Maybe<Record<Data.UIMessages>>) =>
  (obj: Record<Data.ActivatableNameCost>) =>
  (level: number) => {
    if (obj.get ("id") === "SA_29" && level === 4) {
      return ` ${translate (locale, "mothertongue.short")}`
    }
    else if (
      obj .get ("finalCost") instanceof List
      || getCategoryById (obj.get ("id")).equals (Maybe.pure (Categories.SPECIAL_ABILITIES))
    ) {
      return getSpecialAbilityLevel (level)
    }
    else {
      return getLevel (level)
    }
  }

const hasLevelName =
  (locale: Maybe<Record<Data.UIMessages>>) =>
  (obj: Record<Data.ActivatableNameCost>) =>
  (mlevel: Maybe<number>): Maybe<string> => {
    if (Maybe.isJust (mlevel) && List.of ("DISADV_34", "DISADV_50") .notElem (obj.get ("id"))) {
      const tier = Maybe.fromJust (mlevel)

      return Maybe.pure (getAdjustedLevelName (locale, obj, tier))
    }
    else {
      return Maybe.empty ()
    }
  }

const adjustTierName =
  (locale: Maybe<Record<Data.UIMessages>>) =>
  (addTierToCombinedTier?: boolean) =>
  (obj: Record<Data.ActivatableNameCost>): Record<Data.ActivatableNameCostEvalTier> => {
    const mlevel = obj.lookup ("tier")

    return Maybe.fromMaybe<Record<Data.ActivatableNameCostEvalTier>> (obj) (
      hasLevelName (locale, obj, mlevel)
        .bind (Maybe.ensure (() => !addTierToCombinedTier))
        .fmap (tierName => obj .merge (Record.of<{ name: string tierName?: string }> ({
          name: obj.get ("name") + tierName,
          tierName,
        })))
    )
  }

/**
 * Calculates level name and level-based cost and (optionally) updates `name`.
 * @param locale
 * @param addTierToCombinedTier If true, does not add `tierName` to `name`.
 */
export const convertPerTierCostToFinalCost =
  (locale: Maybe<Record<Data.UIMessages>>) =>
  (addTierToCombinedTier?: boolean):
    ((obj: Record<Data.ActivatableNameCost>) => Record<Data.ActivatableNameAdjustedCostEvalTier>) =>
    pipe (
      adjustTierName (locale, addTierToCombinedTier),
      adjustCurrentCost
    )

interface SplittedActiveObjectsByCustomCost {
  defaultCostList: Record<Data.ActiveObject>[]
  customCostList: Record<Data.ActiveObject>[]
}

const getSplittedActiveObjectsByCustomCost =
  (entries: List<Record<Data.ActiveObject>>) =>
    entries.foldl<SplittedActiveObjectsByCustomCost> (
      res => obj => {
        if (Maybe.isJust (obj.lookup ("cost"))) {
          return {
            ...res,
            customCostList: [
              ...res.customCostList,
              obj,
            ],
          }
        }

        return {
          ...res,
          defaultCostList: [
            ...res.defaultCostList,
            obj,
          ],
        }
      }
    ) ({ defaultCostList: [], customCostList: [] })

export const getActiveWithNoCustomCost =
  (entries: List<Record<Data.ActiveObject>>) =>
    List.of (
      ...getSplittedActiveObjectsByCustomCost (entries).defaultCostList
    )
