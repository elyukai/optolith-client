/**
 * Calculate the Adventure Points for when removing the entry. This might not
 * be the actual cost. In those cases the AP difference needs to be calculated
 * for AP spent total.
 *
 * @file src/Utilities/activatableCostUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { cnst, flip, ident } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { over, set } from "../../../Data/Lens";
import { appendStr, countWith, filter, find, foldl, ifoldr, isList, List, map, notElem, notNull, subscript, subscriptF } from "../../../Data/List";
import { any, bind, bindF, elem, elemF, ensure, fromJust, fromMaybe, isJust, isNothing, Just, liftM2, listToMaybe, Maybe, maybe, Nothing } from "../../../Data/Maybe";
import { lookup, lookupF } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { ActivatableDependent, isActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActivatableNameCost, ActivatableNameCostL, ActivatableNameCostSafeCost } from "../../Models/View/ActivatableNameCost";
import { Advantage } from "../../Models/Wiki/Advantage";
import { isDisadvantage } from "../../Models/Wiki/Disadvantage";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Skill } from "../../Models/Wiki/Skill";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable, EntryWithCategory, SkillishEntry } from "../../Models/Wiki/wikiTypeHelpers";
import { isMaybeActive } from "../Activatable/isActive";
import { getSelectOptionCost } from "../Activatable/selectionUtils";
import { getHeroStateItem } from "../heroStateUtils";
import { translate } from "../I18n";
import { getCategoryById } from "../IDUtils";
import { add, dec, multiply, negate } from "../mathUtils";
import { toRoman } from "../NumberUtils";
import { pipe, pipe_ } from "../pipe";
import { isNumber, isNumberM, misNumberM, misStringM } from "../typeCheckUtils";
import { getWikiEntry, isActivatableWikiEntry, isSkillishWikiEntry } from "../WikiUtils";

const isDisadvantageActive =
  (id: string) =>
    pipe (
      HeroModel.A.disadvantages,
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
    const current_id = ActiveObjectWithId.A.id (entry)
    const mcurrent_sid = ActiveObjectWithId.A.sid (entry)
    const mcurrent_level = ActiveObject.AL.tier (entry)

    const mcurrent_cost = Advantage.AL.cost (entry)

    const all_active = ActivatableDependent.AL.active (hero_entry)

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
                                        bindF (subscriptF (Skill.AL.ic (skill) - 1))
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
                         pipe (ActiveObject.AL.sid, elem<string | number> (7)) (e)
                         // Entries with custom cost are ignored for the rule
                         && isNothing (ActiveObject.AL.cost (e)))
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
          || countWith (pipe (ActiveObject.AL.tier, elem (current_level)))
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
          countWith (pipe (ActiveObject.AL.cost, isNothing))
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
                                        (WikiModel.A.skills (wiki)))
                                (skill =>
                                  // Multiply number of final occurences of the
                                  // same skill...
                                  (countWith ((e: Record<ActiveObject>) =>
                                              pipe (
                                                     ActiveObject.AL.sid,
                                                     elem<string | number> (current_sid)
                                                   )
                                                   (e)

                                              // Entries with custom cost are ignored for the rule
                                              && isNothing (ActiveObject.AL.cost (e)))
                                            (all_active) + (isEntryToAdd ? 1 : 0))

                                  // ...with the skill's IC
                                  * Skill.AL.ic (skill)))

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
        const amount = countWith (pipe (ActiveObject.AL.cost, isNothing))
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
                                          (HeroModel.A.specialAbilities (hero))

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
            ActivatableDependent.A.active,
            listToMaybe,
            bindF (ActiveObject.A.sid),
            misStringM,
            bindF (lookupF (WikiModel.A.skills (wiki))),
            bindF (pipe (Skill.A.ic, dec, subscript (current_cost)))
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
                      HeroModel.A.specialAbilities,
                      lookup ("SA_29"),
                      bindF (pipe (
                        ActivatableDependent.A.active,
                        // Get the `ActiveObject` for the corresponding language
                        find (pipe (ActiveObject.A.sid, elem (current_sid)))
                      )),
                      bindF (ActiveObject.A.tier),
                      // If it's a native language, it costs nothing, otherwise
                      // the default SA's AP
                      bindF (level => level === 4 ? Nothing : misNumberM (mcurrent_cost))
                    )
                    (hero)
      }

      default: {
        if (any (notNull) (Advantage.AL.select (wiki_entry)) && isNothing (mcurrent_cost)) {
          return getSelectOptionCost (wiki_entry) (mcurrent_sid)
        }

        return mcurrent_cost
      }
    }
  }

/**
 * A function for folding over a list of `ActiveObject`s to get the highest
 * level. Ignores entries with custom cost.
 *
 * `foldl compareMaxLevel 0 all_entries`
 */
export const compareMaxLevel =
  (previous_max: number) =>
  (active: Record<ActiveObject>) => {
    const mactive_level = ActiveObject.AL.tier (active)

    if (isJust (mactive_level)) {
      const active_level = fromJust (mactive_level)

      return active_level > previous_max
        && isNothing (ActiveObject.AL.cost (active))
          ? active_level
          : previous_max
    }

    return previous_max
  }

/**
 * A function for folding over a list of `ActiveObject`s to get the
 * second-highest level. Ignores entries with custom cost.
 *
 * `foldl (compareSubMaxLevel max_level) 0 all_entries`
 */
export const compareSubMaxLevel =
  (max: number) =>
  (previous_max: number) =>
  (active: Record<ActiveObject>) => {
    const mactive_level = ActiveObject.AL.tier (active)

    if (isJust (mactive_level)) {
      const active_level = fromJust (mactive_level)

      return active_level > previous_max
        && active_level < max
        && isNothing (ActiveObject.AL.cost (active))
          ? active_level
          : previous_max
    }

    return previous_max
  }

const getTotalCost =
  (isEntryToAdd: boolean) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActivatableDependent>): number | List<number> => {
    const custom_cost = ActiveObjectWithId.A.cost (entry)

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
    const current_id = ActiveObjectWithId.A.id (entry)

    return liftM2 (getTotalCost (isEntryToAdd)
                                (wiki)
                                (hero)
                                (entry))
                  (bind (getWikiEntry (wiki) (current_id))
                        (ensure (isActivatableWikiEntry)))
                  (bind (getHeroStateItem (hero) (current_id))
                        (ensure (isActivatableDependent)))
  }

/**
 * Uses the results from `getCost` saved in `ActivatableNameCost` to calculate
 * the final cost value (and no list).
 */
const putCurrentCost =
  (entry: Record<ActivatableNameCost>): Record<ActivatableNameCostSafeCost> =>
    over (ActivatableNameCostL.finalCost)
         ((current_cost): number => {
           const current_id = ActivatableNameCost.A.id (entry)
           const mcurrent_level = ActivatableNameCost.A.tier (entry)

           // If the AP cost is still a List, it must be a list that represents
           // the cost for each level separate, thus all relevant values must
           // be summed up.
           if (isList (current_cost)) {
             const current_level = fromMaybe (1) (mcurrent_level)

             return ifoldr (i => i <= (current_level - 1) ? add : cnst (ident as ident<number>))
                           (0)
                           (current_cost)
           }

           // Usually, a single AP value represents the value has to be
           // multiplied by the level to result in the final cost. There are two
           // disadvantages where this is not valid.
           if (
             isJust (mcurrent_level)
             && current_id !== "DISADV_34"
             && current_id !== "DISADV_50"
           ) {
             return maybe (0) (multiply (current_cost)) (mcurrent_level)
           }

           return current_cost
         })
         (entry) as Record<ActivatableNameCostSafeCost>

/**
 * Gets the level string that has to be appended to the name.
 */
const getLevel = (level: number) => ` ${toRoman (level)}`

/**
 * Gets the level string that has to be appended to the name. For special
 * abilities, where levels are bought separately, this means it has to display a
 * range when multiple levels have been bought.
 */
const getSpecialAbilityLevel =
  (level: number) => level > 1 ? ` I-${toRoman (level)}` : getLevel (level)

/**
 * Id-based check if the entry is a special ability.
 */
const isSpecialAbilityById =
  pipe (getCategoryById, elem<Categories> (Categories.SPECIAL_ABILITIES))

/**
 * Gets the level string that hast to be appended to the name. This string is
 * aware of differences between dis/advantages and special abilties as well as
 * it handles the Native Tongue level for languages.
 */
const getFinalLevelName =
  (l10n: L10nRecord) =>
  (entry: Record<ActivatableNameCost>) =>
  /**
   * @param current_level This is the same value from param `entry`, but this is
   * ensured to be a number.
   */
  (current_level: number) => {
    const current_id = ActivatableNameCost.A.id (entry)
    const current_cost = ActivatableNameCost.A.finalCost (entry)

    if (current_id === "SA_29" && current_level === 4) {
      return ` ${translate (l10n) ("nativetongue.short")}`
    }

    if (isList (current_cost) || isSpecialAbilityById (current_id)) {
      return getSpecialAbilityLevel (current_level)
    }

    return getLevel (current_level)
  }

/**
 * Returns a `Just` of the level string, if no level string available, returns
 * `Nothing`.
 */
const getLevelNameIfValid =
  (l10n: L10nRecord) =>
  (entry: Record<ActivatableNameCost>): Maybe<string> => {
    const current_id = ActivatableNameCost.A.id (entry)
    const mcurrent_level = ActivatableNameCost.A.tier (entry)

    if (isJust (mcurrent_level) && notElem (current_id) (List ("DISADV_34", "DISADV_50"))) {
      return Just (getFinalLevelName (l10n)
                                        (entry)
                                        (fromJust (mcurrent_level)))
    }

    return Nothing
  }

const putLevelName =
  (addLevelToName: boolean) =>
  (l10n: L10nRecord) =>
  (entry: Record<ActivatableNameCost>): Record<ActivatableNameCost> =>
    pipe_ (
      entry,
      getLevelNameIfValid (l10n),
      fmap (levelName => addLevelToName
                           ? pipe_ (
                               entry,
                               over (ActivatableNameCostL.name)
                                    (flip (appendStr) (levelName)),
                               set (ActivatableNameCostL.levelName)
                                   (Just (levelName))
                             )
                           : set (ActivatableNameCostL.levelName)
                                 (Just (levelName))
                                 (entry)),
      fromMaybe (entry)
    )

/**
 * Calculates level name and level-based cost and (optionally) updates `name`.
 * @param locale
 * @param addTierToCombinedTier If true, does not add `tierName` to `name`.
 */
export const convertPerTierCostToFinalCost =
  (addLevelToName: boolean) =>
  (l10n: L10nRecord) =>
    pipe (
      putLevelName (addLevelToName) (l10n),
      putCurrentCost
    )

export const getActiveWithNoCustomCost =
  filter (pipe (ActiveObject.A.cost, isNothing))
