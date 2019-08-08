/**
 * Checks if an `Activatable` entry is available to be activated.
 *
 * @file src/Utilities/activatableInactiveValidationUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { not } from "../../../Data/Bool";
import { ident } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { elem, flength, foldr, isList, List, notElem } from "../../../Data/List";
import { all, any, bind, bindF, fromMaybe, isJust, listToMaybe, Maybe, sum } from "../../../Data/Maybe";
import { add, inc, lte } from "../../../Data/Num";
import { isOrderedMap, lookup } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Tuple } from "../../../Data/Tuple";
import { sel2, sel3 } from "../../../Data/Tuple/Select";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActivatableDependency } from "../../Models/Hero/heroTypeHelpers";
import { Pact } from "../../Models/Hero/Pact";
import { Rules } from "../../Models/Hero/Rules";
import { Advantage } from "../../Models/Wiki/Advantage";
import { isSpecialAbility, SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable } from "../../Models/Wiki/wikiTypeHelpers";
import { countActiveGroupEntries, hasActiveGroupEntry } from "../entryGroupUtils";
import { getAllEntriesByGroup } from "../heroStateUtils";
import { pipe, pipe_ } from "../pipe";
import { getFirstLevelPrerequisites } from "../Prerequisites/flattenPrerequisites";
import { validatePrerequisites } from "../Prerequisites/validatePrerequisitesUtils";
import * as CheckStyleUtils from "./checkStyleUtils";
import { isActive, isMaybeActive } from "./isActive";

const { specialAbilities } = WikiModel.AL
const AAL = Advantage.AL
const { specialAbilities: hero_specialAbilities, pact, rules } = HeroModel.AL
const { active, dependencies } = ActivatableDependent.AL
const { tier } = ActiveObject.AL
const { level } = Pact.AL
const { enableLanguageSpecializations } = Rules.AL

const isAdditionDisabledForCombatStyle =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Record<SpecialAbility>): boolean => {
    const combination_hero_entry = lookup ("SA_164") (hero_specialAbilities (hero))

    // Combination-SA is active, which allows 3 styles to be active,
    // but only a maximum of 2 from one type (armed/unarmed).
    if (isMaybeActive (combination_hero_entry)) {
      const totalActive = countActiveGroupEntries (wiki) (hero) (9, 10)

      const equalTypeStylesActive =
        countActiveGroupEntries (wiki) (hero) (AAL.gr (wiki_entry))

      return totalActive >= 3 || equalTypeStylesActive >= 2
    }
    // Otherwise, only one of each type can be active.
    else {
      return pipe_ (wiki_entry, AAL.gr, hasActiveGroupEntry (wiki) (hero))
    }
  }

const isAdditionDisabledSpecialAbilitySpecific =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
  (wiki_entry: Record<SpecialAbility>): boolean => {
    const current_id = AAL.id (wiki_entry)

    // Combat Styles
    if (CheckStyleUtils.isCombatStyleSpecialAbility (wiki_entry)) {
      return isAdditionDisabledForCombatStyle (wiki) (hero) (wiki_entry)
    }

    // Magical Styles
    if (CheckStyleUtils.isMagicalStyleSpecialAbility (wiki_entry)) {
      const combination_hero_entry = lookup ("SA_266") (hero_specialAbilities (hero))
      const total_active = countActiveGroupEntries (wiki) (hero) (13)

      return total_active >= (isMaybeActive (combination_hero_entry) ? 2 : 1)
    }

    // Blessed Styles
    if (CheckStyleUtils.isBlessedStyleSpecialAbility (wiki_entry)) {
      return hasActiveGroupEntry (wiki) (hero) (25)
    }

    // Skill Styles
    if (CheckStyleUtils.isSkillStyleSpecialAbility (wiki_entry)) {
      return hasActiveGroupEntry (wiki) (hero) (33)
    }

    // Combat Style Combination
    if (current_id === "SA_164") {
      return !hasActiveGroupEntry (wiki) (hero) (9, 10)
    }

    // Magical Style Combination
    if (current_id === "SA_266") {
      return !hasActiveGroupEntry (wiki) (hero) (13)
    }

    // Dunkles Abbild der Bündnisgabe
    if (current_id === "SA_667") {
      return hasActiveGroupEntry (wiki) (hero) (30)
    }

    // Weg der Schreiberin
    if (current_id === "SA_1075") {
      return flength (sel2 (matching_script_and_lang_related)) >= 1
             && flength (sel3 (matching_script_and_lang_related)) >= 1
    }

    // Pact Gifts
    if (AAL.gr (wiki_entry) === 30) {
      const dunkles_abbild = lookup ("SA_667") (hero_specialAbilities (hero))

      const allPactPresents = getAllEntriesByGroup (specialAbilities (wiki))
                                                   (hero_specialAbilities (hero))
                                                   (30)

      const countPactPresents =
        foldr ((obj: Record<ActivatableDependent>) => {
                if (isActive (obj)) {
                  const wikiObj = lookup (AAL.id (obj)) (specialAbilities (wiki))

                  if (
                    any (pipe (AAL.prerequisites, isOrderedMap))
                        (wikiObj)
                    && any (pipe (AAL.cost, isList))
                           (wikiObj)
                    && isJust (bind (wikiObj) (AAL.tiers))
                  ) {
                    return add (sum (
                      bindF (tier) (listToMaybe (active (obj)))
                    ))
                  }

                  return inc
                }

                return ident as ident<number>
              })
              (0)
              (allPactPresents)

      return isMaybeActive (dunkles_abbild)
        || all (pipe (level, lte (countPactPresents))) (pact (hero))
    }

    if (current_id === "SA_699") {
      return pipe (rules, enableLanguageSpecializations, not) (hero)
    }

    if (elem (AAL.gr (wiki_entry)) (List (31, 32))) {
      // TODO: add option to activate vampire or lycanthropy and activate this
      // SAs based on that option
      return true
    }

    return false
  }

/**
 * Checks if you can somehow add an ActiveObject to the given entry.
 * @param state The present state of the current hero.
 * @param instance The entry.
 */
const isAdditionDisabledEntrySpecific =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
  (wiki_entry: Activatable): boolean =>
    isSpecialAbility (wiki_entry)
    && isAdditionDisabledSpecialAbilitySpecific (wiki)
                                                (hero)
                                                (matching_script_and_lang_related)
                                                (wiki_entry)
    || !validatePrerequisites (wiki)
                              (hero)
                              (getFirstLevelPrerequisites (AAL.prerequisites (wiki_entry)))
                              (AAL.id (wiki_entry))

const hasGeneralRestrictionToAdd =
  any (pipe (dependencies, elem<ActivatableDependency> (false)))

const hasReachedMaximumEntries =
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
    any (lte (fromMaybe (0)
                        (fmap (pipe (active, flength))
                              (mhero_entry))))
        (AAL.max (wiki_entry))

const hasReachedImpossibleMaximumLevel = Maybe.elem (0)

const isInvalidExtendedSpecialAbility =
  (wiki_entry: Activatable) =>
  (validExtendedSpecialAbilities: List<string>) =>
    CheckStyleUtils.isExtendedSpecialAbility (wiki_entry)
    && notElem (AAL.id (wiki_entry)) (validExtendedSpecialAbilities)

/**
 * Checks if the given entry can be added.
 * @param obj
 * @param state The current hero's state.
 */
export const isAdditionDisabled =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (validExtendedSpecialAbilities: List<string>) =>
  (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
  (max_level: Maybe<number>): boolean =>
    isAdditionDisabledEntrySpecific (wiki) (hero) (matching_script_and_lang_related) (wiki_entry)
    || hasGeneralRestrictionToAdd (mhero_entry)
    || hasReachedMaximumEntries (wiki_entry) (mhero_entry)
    || hasReachedImpossibleMaximumLevel (max_level)
    || isInvalidExtendedSpecialAbility (wiki_entry) (validExtendedSpecialAbilities)
