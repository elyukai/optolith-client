/**
 * Checks if an `Activatable` entry is available to be activated.
 *
 * @file src/utils/activatableInactiveValidationUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { pipe } from "ramda";
import { ident } from "../../../../Data/Function";
import { fmap } from "../../../../Data/Functor";
import { elem, flength, foldr, isList, List, notElem } from "../../../../Data/List";
import { all, any, bind, bindF, fromMaybe, isJust, isNothing, listToMaybe, Maybe, sum } from "../../../../Data/Maybe";
import { isOrderedMap, lookup } from "../../../../Data/OrderedMap";
import { Record } from "../../../../Data/Record";
import { ActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../../Models/ActiveEntries/ActiveObject";
import { HeroModel, HeroModelRecord } from "../../../Models/Hero/HeroModel";
import { ActivatableDependency } from "../../../Models/Hero/heroTypeHelpers";
import { Pact } from "../../../Models/Hero/Pact";
import { Rules } from "../../../Models/Hero/Rules";
import { isSpecialAbility, SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { WikiModel, WikiModelRecord } from "../../../Models/Wiki/WikiModel";
import { Activatable } from "../../../Models/Wiki/wikiTypeHelpers";
import { countActiveGroupEntries, hasActiveGroupEntry } from "../../entryGroupUtils";
import { getAllEntriesByGroup } from "../../heroStateUtils";
import { add, gte, inc, lte } from "../../mathUtils";
import { not } from "../../not";
import { getFirstLevelPrerequisites } from "../../P/Prerequisites/flattenPrerequisites";
import { validatePrerequisites } from "../../P/Prerequisites/validatePrerequisitesUtils";
import * as CheckStyleUtils from "./checkStyleUtils";
import { isActive, isMaybeActive } from "./isActive";

const { specialAbilities } = WikiModel.A
const { specialAbilities: hero_specialAbilities, pact, rules } = HeroModel.A
const { id, gr, prerequisites, cost, tiers, max } = SpecialAbility.A
const { active, dependencies } = ActivatableDependent.A
const { tier } = ActiveObject.A
const { level } = Pact.A
const { enableLanguageSpecializations } = Rules.A

const isAdditionDisabledForCombatStyle =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Record<SpecialAbility>): boolean => {
    const combination_hero_entry = lookup ("SA_164") (hero_specialAbilities (hero))
    const combination_wiki_entry = lookup ("SA_164") (specialAbilities (wiki))

    if (isNothing (combination_hero_entry)) {
      return hasActiveGroupEntry (wiki) (hero) (9, 10)
    }

    if (isMaybeActive (combination_hero_entry)) {
      const totalActive = countActiveGroupEntries (wiki) (hero) (9, 10)

      const equalTypeStylesActive =
        countActiveGroupEntries (wiki) (hero) (gr (wiki_entry))

      return totalActive >= 3 || equalTypeStylesActive >= 2
    }

    return any (pipe (gr, hasActiveGroupEntry (wiki) (hero)))
               (combination_wiki_entry)
  }

const isAdditionDisabledSpecialAbilitySpecific =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Record<SpecialAbility>): boolean => {
    const current_id = id (wiki_entry)

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

    // Pact Gifts
    if (gr (wiki_entry) === 30) {
      const dunkles_abbild = lookup ("SA_667") (hero_specialAbilities (hero))

      const allPactPresents = getAllEntriesByGroup (specialAbilities (wiki))
                                                   (hero_specialAbilities (hero))
                                                   (30)

      const countPactPresents =
        foldr ((obj: Record<ActivatableDependent>) => {
                if (isActive (obj)) {
                  const wikiObj = lookup (id (obj)) (specialAbilities (wiki))

                  if (
                    any (pipe (prerequisites, isOrderedMap))
                        (wikiObj)
                    && any (pipe (cost, isList))
                           (wikiObj)
                    && isJust (bind (wikiObj) (tiers))
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
  (wiki_entry: Activatable): boolean => {
    if (isSpecialAbility (wiki_entry)) {
      return isAdditionDisabledSpecialAbilitySpecific (wiki) (hero) (wiki_entry)
    }

    return validatePrerequisites (wiki)
                                 (hero)
                                 (getFirstLevelPrerequisites (prerequisites (wiki_entry)))
                                 (id (wiki_entry))
  }

const hasGeneralRestrictionToAdd =
  any (pipe (dependencies, elem<ActivatableDependency> (false)))

const hasReachedMaximumEntries =
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
    any (gte (fromMaybe (0)
                        (fmap (pipe (active, flength))
                              (mhero_entry))))
        (max (wiki_entry))

const hasReachedImpossibleMaximumLevel = Maybe.elem (0)

const isInvalidExtendedSpecialAbility =
  (wiki_entry: Activatable) =>
  (validExtendedSpecialAbilities: List<string>) =>
    CheckStyleUtils.isExtendedSpecialAbility (wiki_entry)
    && notElem (id (wiki_entry)) (validExtendedSpecialAbilities)

/**
 * Checks if the given entry can be added.
 * @param obj
 * @param state The current hero's state.
 */
export const isAdditionDisabled =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (validExtendedSpecialAbilities: List<string>) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
  (max_level: Maybe<number>) =>
    isAdditionDisabledEntrySpecific (wiki) (hero) (wiki_entry)
    || hasGeneralRestrictionToAdd (mhero_entry)
    || hasReachedMaximumEntries (wiki_entry) (mhero_entry)
    || hasReachedImpossibleMaximumLevel (max_level)
    || isInvalidExtendedSpecialAbility (wiki_entry) (validExtendedSpecialAbilities)
