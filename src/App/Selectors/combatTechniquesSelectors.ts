import { ident, thrush } from "../../Data/Function"
import { fmap, fmapF } from "../../Data/Functor"
import { consF, filter, fnull, List, map } from "../../Data/List"
import { Just, liftM2, Maybe, maybe, Nothing } from "../../Data/Maybe"
import { add, divideBy, gt, max, subtractBy } from "../../Data/Num"
import { findWithDefault, foldrWithKey, lookup } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { uncurryN, uncurryN5 } from "../../Data/Tuple/Curry"
import { IdPrefixes } from "../Constants/IdPrefixes"
import { CombatTechniqueId, SpecialAbilityId } from "../Constants/Ids.gen"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { createSkillDependentWithValue6, SkillDependent } from "../Models/ActiveEntries/SkillDependent"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { CombatTechniqueWithAttackParryBase, CombatTechniqueWithAttackParryBaseA_ } from "../Models/View/CombatTechniqueWithAttackParryBase"
import { CombatTechniqueWithRequirements } from "../Models/View/CombatTechniqueWithRequirements"
import { CombatTechnique } from "../Models/Wiki/CombatTechnique"
import { StaticData } from "../Models/Wiki/WikiModel"
import { isMaybeActive } from "../Utilities/Activatable/isActive"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy"
import { compareLocale } from "../Utilities/I18n"
import { prefixId } from "../Utilities/IDUtils"
import { isDecreaseDisabled, isIncreaseDisabled } from "../Utilities/Increasable/combatTechniqueUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { filterByAvailabilityAndPred, isEntryFromCoreBook } from "../Utilities/RulesUtils"
import { comparingR, sortByMulti } from "../Utilities/sortBy"
import { getMaxAttributeValueByID } from "./attributeSelectors"
import { getRuleBooksEnabled } from "./rulesSelectors"
import { getCombatTechniquesWithRequirementsSortOptions } from "./sortOptionsSelectors"
import { getAttributes, getCombatTechniques, getCombatTechniquesFilterText, getCurrentHeroPresent, getSpecialAbilities, getWiki, getWikiCombatTechniques } from "./stateSelectors"

const CTA = CombatTechnique.A
const SDA = SkillDependent.A
const CTWAPBA = CombatTechniqueWithAttackParryBase.A
const CTWRA = CombatTechniqueWithRequirements.A
const ADA = ActivatableDependent.A

/**
 * Calculate the AT or PA mod by passing the current attributes' state as well
 * as the relevant ids.
 */
const getPrimaryAttrMod =
  (attributes: HeroModel["attributes"]) =>
    pipe (
      getMaxAttributeValueByID (attributes),
      subtractBy (8),
      divideBy (3),
      Math.floor,
      max (0)
    )

const getAttackBase =
  (attributes: HeroModel["attributes"]) =>
  (wiki_entry: Record<CombatTechnique>) =>
  (hero_entry: Record<SkillDependent>): number =>
    pipe_ (
      CTA.gr (wiki_entry) === 2
        ? CTA.primary (wiki_entry)
        : List (prefixId (IdPrefixes.ATTRIBUTES) (1)),
      getPrimaryAttrMod (attributes),
      add (SDA.value (hero_entry))
    )

const getParryBase =
  (attributes: HeroModel["attributes"]) =>
  (wiki_entry: Record<CombatTechnique>) =>
  (hero_entry: Record<SkillDependent>): Maybe<number> => {
    const curr_id = CTA.id (wiki_entry)
    const curr_gr = CTA.gr (wiki_entry)

    return curr_gr === 2
      || curr_id === prefixId (IdPrefixes.COMBAT_TECHNIQUES) (6)
      || curr_id === prefixId (IdPrefixes.COMBAT_TECHNIQUES) (8)
        ? Nothing
        : Just (Math.round (SDA.value (hero_entry) / 2)
                 + getPrimaryAttrMod (attributes) (CTA.primary (wiki_entry)))
  }

export const getCombatTechniquesForView = createMaybeSelector (
  getWiki,
  getWikiCombatTechniques,
  getAttributes,
  getSpecialAbilities,
  getCombatTechniques,
  uncurryN5 (staticData =>
             wiki_combat_techniques =>
             attributes =>
             special_abilities =>
               fmap ((combatTechniques): List<Record<CombatTechniqueWithAttackParryBase>> =>
                 pipe_ (
                   wiki_combat_techniques,
                   foldrWithKey ((id: string) => (wiki_entry: Record<CombatTechnique>) => {
                                const hero_entry =
                                  findWithDefault (createSkillDependentWithValue6 (id))
                                                  (id)
                                                  (combatTechniques)

                                if (id === CombatTechniqueId.spittingFire
                                    && maybe (true)
                                             (pipe (ADA.active, fnull))
                                             (lookup (SpecialAbilityId.feuerschlucker)
                                                     (special_abilities))) {
                                  // If SF Feuerschlucker is not active, do not
                                  // show CT Spitting Fire
                                  return ident as
                                    ident<List<Record<CombatTechniqueWithAttackParryBase>>>
                                }

                                return consF (CombatTechniqueWithAttackParryBase ({
                                  at: getAttackBase (attributes) (wiki_entry) (hero_entry),
                                  pa: getParryBase (attributes) (wiki_entry) (hero_entry),
                                  stateEntry: hero_entry,
                                  wikiEntry: wiki_entry,
                                }))
                              })
                              (List.empty),
                   sortByMulti ([ comparingR (CombatTechniqueWithAttackParryBaseA_.name)
                                             (compareLocale (staticData)) ])
                 )))
)

export const getCombatTechniquesForSheet = createMaybeSelector (
  getWiki,
  getCombatTechniquesForView,
  uncurryN (staticData =>
             fmap (filter (x => SDA.value (CTWAPBA.stateEntry (x)) > 6
                                || isEntryFromCoreBook (CTA.src)
                                                       (StaticData.A.books (staticData))
                                                       (CTWAPBA.wikiEntry (x)))))
)

const getGr = pipe (CTWAPBA.wikiEntry, CTA.gr)
const getValue = pipe (CTWAPBA.stateEntry, SDA.value)
type CTWAPB = CombatTechniqueWithAttackParryBase

export const getAllCombatTechniques = createMaybeSelector (
  getCombatTechniquesForView,
  getCurrentHeroPresent,
  getWiki,
  (mcombat_techniques, mhero, wiki) =>
    liftM2 ((combatTechniques: List<Record<CTWAPB>>) => (hero: HeroModelRecord) => {
             const hunter = lookup<string> (SpecialAbilityId.hunter)
                                           (HeroModel.A.specialAbilities (hero))

             const hunterRequiresMinimum =
               isMaybeActive (hunter)
               && thrush (combatTechniques) (List.any (x => getGr (x) === 2 && getValue (x) >= 10))

             return thrush (combatTechniques)
                           (map (x =>
                             CombatTechniqueWithRequirements ({
                               at: CTWAPBA.at (x),
                               pa: CTWAPBA.pa (x),
                               isDecreasable: !isDecreaseDisabled (wiki)
                                                                  (hero)
                                                                  (CTWAPBA.wikiEntry (x))
                                                                  (CTWAPBA.stateEntry (x))
                                                                  (hunterRequiresMinimum),
                               isIncreasable: !isIncreaseDisabled (wiki)
                                                                  (hero)
                                                                  (CTWAPBA.wikiEntry (x))
                                                                  (CTWAPBA.stateEntry (x)),
                               stateEntry: CTWAPBA.stateEntry (x),
                               wikiEntry: CTWAPBA.wikiEntry (x),
                             })))
           })
           (mcombat_techniques)
           (mhero)
)

export const getAvailableCombatTechniques = createMaybeSelector (
  getRuleBooksEnabled,
  getAllCombatTechniques,
  uncurryN (av => fmap (filterByAvailabilityAndPred (pipe (CTWRA.wikiEntry, CTA.src))
                                                    (pipe (CTWRA.stateEntry, SDA.value, gt (6)))
                                                    (av)))
)

export const getFilteredCombatTechniques = createMaybeSelector (
  getAvailableCombatTechniques,
  getCombatTechniquesWithRequirementsSortOptions,
  getCombatTechniquesFilterText,
  (mcombat_techniques, sortOptions, filterText) =>
    fmapF (mcombat_techniques)
          (filterAndSortRecordsBy (0)
                                  ([ pipe (CTWRA.wikiEntry, CTA.name) ])
                                  (sortOptions)
                                  (filterText))
)
