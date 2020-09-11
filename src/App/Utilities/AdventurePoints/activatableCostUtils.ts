/**
 * Calculate the Adventure Points for when removing the entry. This might not
 * be the actual cost. In those cases the AP difference needs to be calculated
 * for AP spent total.
 *
 * @file src/Utilities/activatableCostUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { cnst, flip, ident } from "../../../Data/Function"
import { fmap, fmapF } from "../../../Data/Functor"
import { over, set } from "../../../Data/Lens"
import { appendStr, countWith, filter, find, foldl, ifoldr, isList, List, map, notElem, notNull, subscript, subscriptF, sum } from "../../../Data/List"
import { any, bind, bindF, elem, elemF, ensure, fromJust, fromMaybe, isJust, isNothing, joinMaybeList, Just, liftM2, listToMaybe, mapMaybe, Maybe, maybe, Nothing } from "../../../Data/Maybe"
import { add, dec, gt, multiply, negate } from "../../../Data/Num"
import { lookup, lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Pair } from "../../../Data/Tuple"
import { Category } from "../../Constants/Categories"
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids"
import { ActivatableDependent, isActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject"
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { ActivatableNameCost, ActivatableNameCostA_, ActivatableNameCostL, ActivatableNameCostL_, ActivatableNameCostSafeCost } from "../../Models/View/ActivatableNameCost"
import { Advantage } from "../../Models/Wiki/Advantage"
import { Disadvantage, isDisadvantage } from "../../Models/Wiki/Disadvantage"
import { Skill } from "../../Models/Wiki/Skill"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { Activatable, EntryWithCategory, SkillishEntry } from "../../Models/Wiki/wikiTypeHelpers"
import { isMaybeActive } from "../Activatable/isActive"
import { getSelectOptionCost } from "../Activatable/selectionUtils"
import { nbsp, nobr } from "../Chars"
import { getHeroStateItem } from "../heroStateUtils"
import { translate } from "../I18n"
import { getCategoryById } from "../IDUtils"
import { toRoman } from "../NumberUtils"
import { pipe, pipe_ } from "../pipe"
import { isNumber, misNumberM, misStringM } from "../typeCheckUtils"
import { getWikiEntry, isActivatableWikiEntry, isSkillishWikiEntry } from "../WikiUtils"

const HA = HeroModel.A
const AAL = Advantage.AL
const AOWIA = ActiveObjectWithId.A

const isDisadvantageActive =
  (id: string) =>
    pipe (
      HA.disadvantages,
      lookup (id),
      isMaybeActive
    )

const getCostForEntryWithSkillSel =
  (ensureId: (x: Maybe<number | string>) => Maybe<string>) =>
  (wiki: StaticDataRecord) =>
  (mcurrent_sid: Maybe<string | number>) =>
  (mcurrent_cost: Maybe<number | List<number>>) =>
    pipe_ (
      mcurrent_sid,
      ensureId,
      bindF (getWikiEntry (wiki)),
      bindF<EntryWithCategory, SkillishEntry> (ensure (isSkillishWikiEntry)),
      bindF (skill => pipe_ (
                        mcurrent_cost,
                        bindF (ensure (isList)),

                        // Use the IC as an index for the list
                        // of AP
                        bindF (subscriptF (Skill.AL.ic (skill) - 1))
                      ))
    )

const isPersonalityFlawNotPaid =
  (sid: number) =>
  (paid_entries_max: number) =>
  (isEntryToAdd: boolean) =>
  (all_active: List<Record<ActiveObject>>) =>
  (mcurrent_sid: Maybe<string | number>) =>
    elemF (mcurrent_sid) (sid)
    && countWith ((e: Record<ActiveObject>) =>
                   pipe (ActiveObject.AL.sid, elem<string | number> (sid)) (e)

                   // Entries with custom cost are ignored for the rule
                   && isNothing (ActiveObject.AL.cost (e)))
                 (all_active) > (isEntryToAdd ? paid_entries_max - 1 : paid_entries_max)

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

/**
 * Returns the value(s) how the spent AP value would change after removing the
 * respective entry.
 *
 * @param isEntryToAdd If `entry` has not been added to the list of active
 * entries yet, this must be `true`, otherwise `false`.
 */
const getEntrySpecificCost =
  (isEntryToAdd: boolean) =>
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Maybe<Record<ActivatableDependent>>) =>

  // tslint:disable-next-line: cyclomatic-complexity
  (entry: Record<ActiveObjectWithId>): Maybe<number | List<number>> => {
    const current_id = AOWIA.id (entry)
    const mcurrent_sid = AOWIA.sid (entry)
    const mcurrent_sid2 = AOWIA.sid2 (entry)
    const mcurrent_sid3 = AOWIA.sid3 (entry)
    const mcurrent_level = AOWIA.tier (entry)

    const mcurrent_cost = AAL.cost (wiki_entry)

    const all_active = joinMaybeList (fmap (ActivatableDependent.A.active) (hero_entry))

    switch (current_id) {
      // Entry with Skill selection
      case AdvantageId.Aptitude:
      case AdvantageId.ExceptionalSkill:
      case AdvantageId.ExceptionalCombatTechnique:
      case AdvantageId.WeaponAptitude:
      case DisadvantageId.Incompetent:
      case SpecialAbilityId.AdaptionZauber:
      case SpecialAbilityId.FavoriteSpellwork:
      case SpecialAbilityId.Forschungsgebiet:
      case SpecialAbilityId.Expertenwissen:
      case SpecialAbilityId.Wissensdurst:
      case SpecialAbilityId.Lieblingsliturgie:
      case SpecialAbilityId.WegDerGelehrten:
      case SpecialAbilityId.WegDerKuenstlerin:
      case SpecialAbilityId.Fachwissen: {
        return getCostForEntryWithSkillSel (misStringM)
                                           (wiki)
                                           (mcurrent_sid)
                                           (mcurrent_cost)
      }

      case DisadvantageId.PersonalityFlaw: {
        if (
          // 7 = "Prejudice" => more than one entry possible
          // more than one entry of Prejudice does not contribute to AP spent
          isPersonalityFlawNotPaid (7) (1) (isEntryToAdd) (all_active) (mcurrent_sid)

          // 8 = "Unworldly" => more than one entry possible
          // more than two entries of Unworldly do not contribute to AP spent
          || isPersonalityFlawNotPaid (8) (2) (isEntryToAdd) (all_active) (mcurrent_sid)
        ) {
          return Just (0)
        }

        return getSelectOptionCost (wiki_entry) (mcurrent_sid)
      }

      case DisadvantageId.Principles:
      case DisadvantageId.Obligations: {
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
        return fmapF (misNumberM (mcurrent_cost))
                     (multiply (current_level - current_second_max_level))
      }

      case DisadvantageId.BadHabit: {
        // more than three entries cannot contribute to AP spent; entries with
        // custom cost are ignored for the rule's effect
        if (countWith (pipe (ActiveObject.AL.cost, isNothing))
                      (all_active) > (isEntryToAdd ? 2 : 3)) {
          return Nothing
        }

        return mcurrent_cost
      }

      case SpecialAbilityId.SkillSpecialization: {
        return pipe_ (
          mcurrent_sid,
          misStringM,
          bindF (
            current_sid =>
              fmapF (lookup (current_sid)
                            (StaticData.A.skills (wiki)))
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
                      * Skill.AL.ic (skill))
          )
        )
      }

      case SpecialAbilityId.Language: {
        // Native Tongue (level 4) does not cost anything
        return elem (4) (mcurrent_level) ? Nothing : mcurrent_cost
      }

      case SpecialAbilityId.PropertyKnowledge:
      case SpecialAbilityId.AspectKnowledge: {
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

      case SpecialAbilityId.TraditionWitches: {
        // There are two disadvantages that, when active, decrease the cost of
        // this tradition by 10 AP each
        const decreaseCost = (id: string) => (cost: number) =>
          isDisadvantageActive (id) (hero) ? cost - 10 : cost

        return pipe_ (
          mcurrent_cost,
          misNumberM,
          fmap (pipe (
            decreaseCost (DisadvantageId.NoFlyingBalm),
            decreaseCost (DisadvantageId.NoFamiliar)
          ))
        )
      }

      case SpecialAbilityId.Recherchegespuer: {
        // The AP cost for this SA consist of two parts: AP based on the IC of
        // the main subject (from "SA_531"/Wissensdurst) in addition to AP based
        // on the IC of the side subject selected in this SA.

        const mhero_entry_SA_531 = lookup<string> (SpecialAbilityId.Wissensdurst)
                                                  (HA.specialAbilities (hero))

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
            ActiveObject.AL.sid,
            misStringM,
            bindF (lookupF (StaticData.A.skills (wiki))),
            bindF (pipe (Skill.A.ic, dec, subscript (current_cost)))
          )

        return liftM2 (add)
                      (getCostFromHeroEntry (entry))
                      (pipe_ (
                        hero_entry_SA_531,
                        ActivatableDependent.A.active,
                        listToMaybe,
                        bindF (getCostFromHeroEntry)
                      ))
      }

      case SpecialAbilityId.LanguageSpecializations: {
        if (isNothing (mcurrent_sid)) {
          return Nothing
        }

        const current_sid = fromJust (mcurrent_sid)

        return pipe (
                      HA.specialAbilities,
                      lookup<string> (SpecialAbilityId.Language),
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

      case SpecialAbilityId.Handwerkskunst:
      case SpecialAbilityId.KindDerNatur:
      case SpecialAbilityId.KoerperlichesGeschick:
      case SpecialAbilityId.SozialeKompetenz:
      case SpecialAbilityId.Universalgenie: {
        return pipe_ (
          List (mcurrent_sid, mcurrent_sid2, mcurrent_sid3),
          mapMaybe (sid => getCostForEntryWithSkillSel (misStringM)
                                                       (wiki)
                                                       (sid)
                                                       (mcurrent_cost)),
          sum,
          ensure (gt (0))
        )
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
 * Returns the AP value and if the entry is an automatic entry
 */
const getTotalCost =
  (isEntryToAdd: boolean) =>
  (automatic_advantages: List<string>) =>
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>) =>
  (hero_entry: Maybe<Record<ActivatableDependent>>) =>
  (wiki_entry: Activatable): Pair<number | List<number>, boolean> => {
    const custom_cost = AOWIA.cost (entry)

    const is_automatic = List.elem (AAL.id (wiki_entry)) (automatic_advantages)

    if (isJust (custom_cost)) {
      const is_disadvantage = Disadvantage.is (wiki_entry)

      return Pair (is_disadvantage ? -fromJust (custom_cost) : fromJust (custom_cost), is_automatic)
    }

    const mentry_specifc_cost = getEntrySpecificCost (isEntryToAdd)
                                                     (wiki)
                                                     (hero)
                                                     (wiki_entry)
                                                     (hero_entry)
                                                     (entry)

    const current_cost = fromMaybe<number | List<number>> (0) (mentry_specifc_cost)

    if (isDisadvantage (wiki_entry)) {
      return Pair (
        isList (current_cost) ? map (negate) (current_cost) : -current_cost,
        is_automatic
      )
    }

    return Pair (current_cost, is_automatic)
  }

/**
 * Returns the AP you get when removing the ActiveObject.
 *
 * @param isEntryToAdd If `entry` has not been added to the list of active
 * entries yet, this must be `true`, otherwise `false`.
 */
export const getCost =
  (isEntryToAdd: boolean) =>
  (automatic_advantages: List<string>) =>
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>): Maybe<Pair<number | List<number>, boolean>> => {
    const current_id = AOWIA.id (entry)

    return pipe_ (
      getWikiEntry (wiki) (current_id),
      bindF (ensure (isActivatableWikiEntry)),
      fmap (getTotalCost (isEntryToAdd)
                         (automatic_advantages)
                         (wiki)
                         (hero)
                         (entry)
                         (bind (getHeroStateItem (hero) (current_id))
                               (ensure (isActivatableDependent))))
    )
  }

/**
 * Uses the results from `getCost` saved in `ActivatableNameCost` to calculate
 * the final cost value (and no list).
 */
const putCurrentCost =
  (entry: Record<ActivatableNameCost>): Record<ActivatableNameCostSafeCost> =>
    over (ActivatableNameCostL.finalCost)
         ((current_cost): number => {
           const current_id = ActivatableNameCostA_.id (entry)
           const category = getCategoryById (current_id)
           const mcurrent_level = ActivatableNameCostA_.tier (entry)

           // If the AP cost is still a List, and it is a Special Ability, it
           // must be a list that represents the cost *for* each level separate,
           // thus all relevant values must be summed up. In case of an
           // advantage or disadvantage, it represents the cost *at* each level,
           // so it does not need to be accumulated.
           if (isList (current_cost)) {
            const current_level = fromMaybe (1) (mcurrent_level)

             if (elem (Category.SPECIAL_ABILITIES) (category)) {
               return ifoldr (i => i <= (current_level - 1) ? add : cnst (ident as ident<number>))
                             (0)
                             (current_cost)
             }

             return fromMaybe (0) (subscript (current_cost) (current_level - 1))
           }

           // Usually, a single AP value represents the value has to be
           // multiplied by the level to result in the final cost. There are two
           // disadvantages where this is not valid.
           if (
             isJust (mcurrent_level)
             && current_id !== DisadvantageId.Principles
             && current_id !== DisadvantageId.Obligations
             && isNothing (ActivatableNameCostA_.customCost (entry))
           ) {
             return maybe (0) (multiply (current_cost)) (mcurrent_level)
           }

           return current_cost
         })
         (entry) as Record<ActivatableNameCostSafeCost>

/**
 * Gets the level string that has to be appended to the name.
 */
const getLevel = (level: number) => `${nbsp}${toRoman (level)}`

/**
 * Gets the level string that has to be appended to the name. For special
 * abilities, where levels are bought separately, this means it has to display a
 * range when multiple levels have been bought.
 */
const getSpecialAbilityLevel =
  (level: number) => level > 1 ? `${nbsp}I${nobr}–${nobr}${toRoman (level)}` : getLevel (level)

/**
 * Id-based check if the entry is a special ability.
 */
const isSpecialAbilityById =
  pipe (getCategoryById, elem<Category> (Category.SPECIAL_ABILITIES))

/**
 * Gets the level string that hast to be appended to the name. This string is
 * aware of differences between dis/advantages and special abilties as well as
 * it handles the Native Tongue level for languages.
 */
const getFinalLevelName =
  (staticData: StaticDataRecord) =>
  (entry: Record<ActivatableNameCost>) =>

  /**
   * @param current_level This is the same value from param `entry`, but this is
   * ensured to be a number.
   */
  (current_level: number) => {
    const current_id = ActivatableNameCostA_.id (entry)
    const current_cost = ActivatableNameCost.A.finalCost (entry)

    if (current_id === SpecialAbilityId.Language && current_level === 4) {
      return `${nbsp}${translate (staticData) ("specialabilities.nativetonguelevel")}`
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
  (staticData: StaticDataRecord) =>
  (entry: Record<ActivatableNameCost>): Maybe<string> => {
    const current_id = ActivatableNameCostA_.id (entry)
    const mcurrent_level = ActivatableNameCostA_.tier (entry)

    if (isJust (mcurrent_level)
        && notElem (current_id) (List (DisadvantageId.Principles, DisadvantageId.Obligations))) {
      return Just (getFinalLevelName (staticData) (entry) (fromJust (mcurrent_level)))
    }

    return Nothing
  }

export const putLevelName =
  (addLevelToName: boolean) =>
  (staticData: StaticDataRecord) =>
  (entry: Record<ActivatableNameCost>): Record<ActivatableNameCost> =>
    pipe_ (
      entry,
      getLevelNameIfValid (staticData),
      fmap (levelName => addLevelToName
                           ? pipe_ (
                               entry,
                               over (ActivatableNameCostL_.name)
                                    (flip (appendStr) (levelName)),
                               set (ActivatableNameCostL_.levelName)
                                   (Just (levelName))
                             )
                           : set (ActivatableNameCostL_.levelName)
                                 (Just (levelName))
                                 (entry)),
      fromMaybe (entry)
    )

/**
 * Calculates level name and level-based cost and (optionally) updates `name`.
 * @param locale
 * @param addLevelToName If true, does not add `current_level` to `name`.
 */
export const convertPerTierCostToFinalCost =
  (addLevelToName: boolean) =>
  (staticData: StaticDataRecord) =>
    pipe (
      putLevelName (addLevelToName) (staticData),
      putCurrentCost
    )

export const getActiveWithNoCustomCost =
  filter (pipe (ActiveObject.A.cost, isNothing))
