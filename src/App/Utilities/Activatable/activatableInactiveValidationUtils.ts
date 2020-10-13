/**
 * Checks if an `Activatable` entry is available to be activated.
 *
 * @file src/Utilities/activatableInactiveValidationUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { not } from "../../../Data/Bool"
import { ident } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { elem, flength, foldr, isList, List, notElem } from "../../../Data/List"
import { all, any, bind, bindF, fromMaybe, isJust, listToMaybe, Maybe, sum } from "../../../Data/Maybe"
import { add, inc, lte } from "../../../Data/Num"
import { isOrderedMap, lookup } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { sel2, sel3 } from "../../../Data/Tuple/Select"
import { SpecialAbilityGroup } from "../../Constants/Groups"
import { SpecialAbilityId } from "../../Constants/Ids"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { ActivatableDependency } from "../../Models/Hero/heroTypeHelpers"
import { Pact } from "../../Models/Hero/Pact"
import { Rules } from "../../Models/Hero/Rules"
import { Advantage } from "../../Models/Wiki/Advantage"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { Activatable } from "../../Models/Wiki/wikiTypeHelpers"
import { countActiveGroupEntries, hasActiveGroupEntry } from "../entryGroupUtils"
import { getAllEntriesByGroup } from "../heroStateUtils"
import { pipe, pipe_ } from "../pipe"
import { getFirstLevelPrerequisites } from "../Prerequisites/flattenPrerequisites"
import { validatePrerequisites } from "../Prerequisites/validatePrerequisitesUtils"
import * as CheckStyleUtils from "./checkStyleUtils"
import { isActive, isMaybeActive } from "./isActive"

const SDA = StaticData.A
const AAL = Advantage.AL
const SAA = SpecialAbility.A
const HA = HeroModel.A
const ADA = ActivatableDependent.A
const AOA = ActiveObject.A
const PA = Pact.A
const RA = Rules.A

const isAdditionDisabledForCombatStyle =
  (staticData: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Record<SpecialAbility>): boolean => {
    const combination_hero_entry = lookup<string> (SpecialAbilityId.CombatStyleCombination)
                                                  (HA.specialAbilities (hero))

    // Combination-SA is active, which allows 3 styles to be active,
    // but only a maximum of 2 from one type (armed/unarmed).
    if (isMaybeActive (combination_hero_entry)) {
      const totalActive =
        countActiveGroupEntries (staticData)
                                (hero)
                                (
                                  SpecialAbilityGroup.CombatStylesArmed,
                                  SpecialAbilityGroup.CombatStylesUnarmed
                                )

      const equalTypeStylesActive =
        countActiveGroupEntries (staticData) (hero) (SAA.gr (wiki_entry))

      return totalActive >= 3 || equalTypeStylesActive >= 2
    }

    // Otherwise, only one of each type can be active.
    else {
      return pipe_ (wiki_entry, SAA.gr, hasActiveGroupEntry (staticData) (hero))
    }
  }

const isAdditionDisabledSpecialAbilitySpecific =
  (staticData: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
  (wiki_entry: Record<SpecialAbility>): boolean => {
    const current_id = SAA.id (wiki_entry)

    if (CheckStyleUtils.isCombatStyleSpecialAbility (wiki_entry)) {
      return isAdditionDisabledForCombatStyle (staticData) (hero) (wiki_entry)
    }

    if (CheckStyleUtils.isMagicalStyleSpecialAbility (wiki_entry)) {
      const combination_hero_entry = lookup<string> (SpecialAbilityId.MagicStyleCombination)
                                                    (HA.specialAbilities (hero))

      const total_active = countActiveGroupEntries (staticData)
                                                   (hero)
                                                   (SpecialAbilityGroup.MagicalStyles)

      return total_active >= (isMaybeActive (combination_hero_entry) ? 2 : 1)
    }

    if (CheckStyleUtils.isBlessedStyleSpecialAbility (wiki_entry)) {
      return hasActiveGroupEntry (staticData) (hero) (SpecialAbilityGroup.BlessedStyles)
    }

    if (current_id === SpecialAbilityId.CombatStyleCombination) {
      return !hasActiveGroupEntry (staticData)
                                  (hero)
                                  (
                                    SpecialAbilityGroup.CombatStylesArmed,
                                    SpecialAbilityGroup.CombatStylesUnarmed
                                  )
    }

    if (current_id === SpecialAbilityId.MagicStyleCombination) {
      return !hasActiveGroupEntry (staticData) (hero) (SpecialAbilityGroup.MagicalStyles)
    }

    if (current_id === SpecialAbilityId.DunklesAbbildDerBuendnisgabe) {
      return hasActiveGroupEntry (staticData) (hero) (SpecialAbilityGroup.Paktgeschenke)
    }

    if (current_id === SpecialAbilityId.WegDerSchreiberin) {
      return flength (sel2 (matching_script_and_lang_related)) >= 1
             && flength (sel3 (matching_script_and_lang_related)) >= 1
    }

    if (SAA.gr (wiki_entry) === SpecialAbilityGroup.Paktgeschenke) {
      const dunkles_abbild = lookup<string> (SpecialAbilityId.DunklesAbbildDerBuendnisgabe)
                                            (HA.specialAbilities (hero))

      const allPactPresents = getAllEntriesByGroup (SDA.specialAbilities (staticData))
                                                   (HA.specialAbilities (hero))
                                                   (SpecialAbilityGroup.Paktgeschenke)

      const countPactPresents =
        foldr ((obj: Record<ActivatableDependent>) => {
                if (isActive (obj)) {
                  const wikiObj = lookup (ADA.id (obj)) (SDA.specialAbilities (staticData))

                  if (
                    any (pipe (SAA.prerequisites, isOrderedMap))
                        (wikiObj)
                    && any (pipe (SAA.cost, isList))
                           (wikiObj)
                    && isJust (bind (wikiObj) (SAA.tiers))
                  ) {
                    return add (sum (
                      bindF (AOA.tier) (listToMaybe (ADA.active (obj)))
                    ))
                  }

                  return inc
                }

                return ident as ident<number>
              })
              (0)
              (allPactPresents)

                         // isFaeriePact?
      const isDisabled = all (pipe (PA.category, lte (1))) (HA.pact (hero))
                         ? isMaybeActive (dunkles_abbild)
                           || all (pipe (PA.level, lte (countPactPresents))) (HA.pact (hero))

                         // is Lesser Pact?
                         : all (pipe (PA.level, lte (0))) (HA.pact (hero))

                         // Lesser Pact only provides 3 PactGifts
                         ? countPactPresents >= 3

                         // Normal DemonPact: KdV + 7 PactGifts
                         : all (pipe (PA.level, lte (countPactPresents - 7))) (HA.pact (hero))

      return isDisabled
    }

    if (current_id === SpecialAbilityId.LanguageSpecializations) {
      return pipe (HA.rules, RA.enableLanguageSpecializations, not) (hero)
    }

    if (elem (SAA.gr (wiki_entry)) (List (31, 32))) {
      // TODO: add option to activate vampire or lycanthropy and activate this
      //       SAs based on that option
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
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
  (wiki_entry: Activatable): boolean =>
    (
      SpecialAbility.is (wiki_entry)
      && isAdditionDisabledSpecialAbilitySpecific (wiki)
                                                  (hero)
                                                  (matching_script_and_lang_related)
                                                  (wiki_entry)
    )
    || !validatePrerequisites (wiki)
                              (hero)
                              (getFirstLevelPrerequisites (AAL.prerequisites (wiki_entry)))
                              (AAL.id (wiki_entry))

const hasGeneralRestrictionToAdd =
  any (pipe (ADA.dependencies, elem<ActivatableDependency> (false)))

const hasReachedMaximumEntries =
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
    any (lte (fromMaybe (0)
                        (fmap (pipe (ADA.active, flength))
                              (mhero_entry))))
        (AAL.max (wiki_entry))

const hasReachedImpossibleMaximumLevel = Maybe.elem (0)

const isInvalidExtendedSpecialAbility =
  (wiki_entry: Activatable) =>
  (validExtendedSpecialAbilities: List<string>) =>
    CheckStyleUtils.isExtendedSpecialAbility (wiki_entry)
    && notElem (AAL.id (wiki_entry)) (validExtendedSpecialAbilities)

const doesNotApplyToMagActionsThoughRequired =
  (required_apply_to_mag_actions: boolean) =>
  (wiki_entry: Activatable): boolean =>
    SpecialAbility.is (wiki_entry)
    ? false
    : required_apply_to_mag_actions && Advantage.AL.isExclusiveToArcaneSpellworks (wiki_entry)

/**
 * Checks if the given entry can be added.
 * @param obj
 * @param state The current hero's state.
 */
export const isAdditionDisabled =
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (required_apply_to_mag_actions: boolean) =>
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
    || doesNotApplyToMagActionsThoughRequired (required_apply_to_mag_actions) (wiki_entry)
