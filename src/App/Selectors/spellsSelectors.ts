import { notEquals } from "../../Data/Eq"
import { cnst } from "../../Data/Function"
import { fmap, fmapF } from "../../Data/Functor"
import { set } from "../../Data/Lens"
import { append, countWith, elemF, fnull, List, ListI, map, notNull, partition } from "../../Data/List"
import { any, bindF, ensure, Just, liftM2, mapMaybe, Maybe, maybe, Nothing } from "../../Data/Maybe"
import { lte } from "../../Data/Num"
import { elems, lookup, lookupF } from "../../Data/OrderedMap"
import { member } from "../../Data/OrderedSet"
import { Record } from "../../Data/Record"
import { fst, snd } from "../../Data/Tuple"
import { uncurryN, uncurryN3, uncurryN5, uncurryN6 } from "../../Data/Tuple/Curry"
import { MagicalGroup } from "../Constants/Groups"
import { AdvantageId, Phase, SpecialAbilityId } from "../Constants/Ids.gen"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent } from "../Models/ActiveEntries/ActivatableSkillDependent"
import { HeroModel } from "../Models/Hero/HeroModel"
import { CantripCombined } from "../Models/View/CantripCombined"
import { SpellWithRequirements, SpellWithRequirementsL } from "../Models/View/SpellWithRequirements"
import { Cantrip } from "../Models/Wiki/Cantrip"
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { Spell, SpellL } from "../Models/Wiki/Spell"
import { SelectOption, selectToDropdownOption } from "../Models/Wiki/sub/SelectOption"
import { StaticData } from "../Models/Wiki/WikiModel"
import { getMagicalTraditionsHeroEntries } from "../Utilities/Activatable/traditionUtils"
import { composeL } from "../Utilities/compose"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy"
import { prefixSA } from "../Utilities/IDUtils"
import { getInactiveSpellsForAnimist, getInactiveSpellsForArcaneBardOrDancer, getInactiveSpellsForIntuitiveMages, getInactiveSpellsForOtherTradition, getInactiveSpellsForSchelme, isIdInSpecialAbilityList, isSpellDecreasable, isSpellIncreasable, isSpellsRitualsCountMaxReached, isUnfamiliarSpell } from "../Utilities/Increasable/spellUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { validatePrerequisites } from "../Utilities/Prerequisites/validatePrerequisitesUtils"
import { filterByAvailability } from "../Utilities/RulesUtils"
import { mapGetToMaybeSlice, mapGetToSlice } from "../Utilities/SelectorsUtils"
import { sortByMulti, sortRecordsByName } from "../Utilities/sortBy"
import { getStartEl } from "./elSelectors"
import { getRuleBooksEnabled } from "./rulesSelectors"
import { getCantripsSortOptions, getSpellsCombinedSortOptions, getSpellsSortOptions } from "./sortOptionsSelectors"
import { getAdvantages, getCantrips, getHeroProp, getInactiveSpellsFilterText, getMaybeSpecialAbilities, getPhase, getSpecialAbilities, getSpellsFilterText, getTransferredUnfamiliarSpells, getWiki, getWikiCantrips, getWikiSpecialAbilities } from "./stateSelectors"
import { getEnableActiveItemHints } from "./uisettingsSelectors"


const HA = HeroModel.A
const SDA = StaticData.A
const ELA = ExperienceLevel.A
const ASDA = ActivatableSkillDependent.A
const CA = Cantrip.A
const CCA = CantripCombined.A
const SWRA = SpellWithRequirements.A
const SWRL = SpellWithRequirementsL
const SA = Spell.A
const SL = SpellL
const SAA = SpecialAbility.A
const SOA = SelectOption.A


export const getMagicalTraditionsFromHero = createMaybeSelector (
  getSpecialAbilities,
  getMagicalTraditionsHeroEntries,
)


const getMaybeMagicalTraditionsFromHero = createMaybeSelector (
  getMaybeSpecialAbilities,
  fmap (getMagicalTraditionsHeroEntries)
)


export const getMagicalTraditionsFromWiki = createMaybeSelector (
  getWikiSpecialAbilities,
  getMagicalTraditionsFromHero,
  uncurryN (
    wiki_special_abilities =>
      mapMaybe (pipe (ActivatableDependent.A.id, lookupF (wiki_special_abilities)))
  )
)


export const getIsSpellsTabAvailable = createMaybeSelector (
  getMaybeMagicalTraditionsFromHero,
  any (xs => notNull (xs)
             && List.all (pipe (
                           ActivatableDependent.A.id,
                           notEquals<string> (SpecialAbilityId.traditionSavant)
                         ))
                         (xs))
)


const getIsUnfamiliarSpell = createMaybeSelector (
  getTransferredUnfamiliarSpells,
  getMagicalTraditionsFromHero,
  uncurryN (isUnfamiliarSpell)
)


export const getActiveSpells = createMaybeSelector (
  getMagicalTraditionsFromWiki,
  getStartEl,
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.exceptionalSkill),
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.propertyKnowledge),
  getWiki,
  getHeroProp,
  getIsUnfamiliarSpell,
  (trads, mstart_el, mexceptional_skill, maproperty_knowledge, wiki, hero, isUnfamiliar) => {
    const isLastTrad = isIdInSpecialAbilityList (trads)

    const isUnfamiliarCustom =
      isLastTrad (SpecialAbilityId.traditionSchelme)
      || isLastTrad (SpecialAbilityId.traditionZauberalchimisten)
      ? () => false
      : isUnfamiliar

    return fmapF (mstart_el)
                 (start_el =>
                   pipe_ (
                     hero,
                     HA.spells,
                     elems,
                     mapMaybe (pipe (
                       ensure (ASDA.active),
                       bindF (hero_entry =>
                               pipe_ (
                                 wiki,
                                 SDA.spells,
                                 lookup (ASDA.id (hero_entry)),
                                 fmap (wiki_entry =>
                                   SpellWithRequirements ({
                                     isIncreasable:
                                       isSpellIncreasable (start_el)
                                                          (HA.phase (hero))
                                                          (HA.attributes (hero))
                                                          (mexceptional_skill)
                                                          (maproperty_knowledge)
                                                          (wiki_entry)
                                                          (hero_entry),
                                     isDecreasable:
                                       isSpellDecreasable (wiki)
                                                          (hero)
                                                          (maproperty_knowledge)
                                                          (wiki_entry)
                                                          (hero_entry),
                                     isUnfamiliar: isUnfamiliarCustom (wiki_entry),
                                     stateEntry: hero_entry,
                                     wikiEntry: wiki_entry,
                                   }))
                               ))
                    ))
                   ))
  }
)


export const getActiveAndInactiveCantrips = createMaybeSelector (
  getWiki,
  getHeroProp,
  getMagicalTraditionsFromWiki,
  getIsUnfamiliarSpell,
  getWikiCantrips,
  getCantrips,
  uncurryN6 (wiki =>
             hero =>
             trads =>
             isUnfamiliar =>
             wiki_cantrips =>
             heroCantrips => {
               const isLastTrad = isIdInSpecialAbilityList (trads)

               const isUnfamiliarCustom =
                 isLastTrad (SpecialAbilityId.traditionSchelme)
                 || isLastTrad (SpecialAbilityId.traditionZauberalchimisten)
                 ? () => false
                 : isUnfamiliar

               return fmapF (heroCantrips)
                            (hero_cantrips => pipe_ (
                                                wiki_cantrips,
                                                elems,
                                                mapMaybe (wiki_entry => {
                                                  const id = CA.id (wiki_entry)
                                                  const prerequisites =
                                                    CA.prerequisites (wiki_entry)

                                                  const active = member (id)
                                                                        (hero_cantrips)

                                                  if (
                                                    !active
                                                    && !validatePrerequisites (wiki)
                                                                              (hero)
                                                                              (prerequisites)
                                                                              (id)
                                                  ) {
                                                    return Nothing
                                                  }

                                                  return Just (CantripCombined ({
                                                    wikiEntry: wiki_entry,
                                                    active,
                                                    isUnfamiliar: isUnfamiliarCustom (wiki_entry),
                                                  }))
                                                }),
                                                partition (CCA.active)
                                              ))
             })
)


export const getActiveCantrips = createMaybeSelector (
  getActiveAndInactiveCantrips,
  fmap (fst)
)


export const getInactiveCantrips = createMaybeSelector (
  getActiveAndInactiveCantrips,
  fmap (snd)
)


export const getActiveSpellsCounter = createMaybeSelector (
  getActiveSpells,
  maybe (0)
        (countWith (pipe (
                     SWRA.wikiEntry,
                     SA.gr,
                     elemF (List<MagicalGroup> (MagicalGroup.Spells, MagicalGroup.Rituals))
                   )))
)


const getUnfamiliarSpellsCount = createMaybeSelector (
  getActiveSpells,
  maybe (0) (countWith (SWRA.isUnfamiliar))
)


const isUnfamiliarSpellsActivationDisabled = createMaybeSelector (
  getPhase,
  getUnfamiliarSpellsCount,
  getStartEl,
  uncurryN3 (phase => count => phase > Phase.creation
                               ? cnst (false)
                               : maybe (false)
                                       (pipe (ELA.maxUnfamiliarSpells, lte (count))))
)


export const getInactiveSpells = createMaybeSelector (
  getWiki,
  getMagicalTraditionsFromHero,
  getHeroProp,
  getMagicalTraditionsFromWiki,
  isUnfamiliarSpellsActivationDisabled,
  uncurryN5 (
    wiki =>
    trads_hero =>
    hero =>
    trads_wiki =>
    (is_max_unfamiliar): List<Record<SpellWithRequirements>> => {
      const isLastTrad = isIdInSpecialAbilityList (trads_wiki)

      const is_spells_rituals_count_max_reached = isSpellsRitualsCountMaxReached (wiki)
                                                                                 (hero)
                                                                                 (isLastTrad)

      const isUnfamiliar = isUnfamiliarSpell (HA.transferredUnfamiliarSpells (hero))
                                             (trads_hero)

      if (isLastTrad (SpecialAbilityId.traditionIntuitiveMage)) {
        return getInactiveSpellsForIntuitiveMages (wiki)
                                                  (hero)
                                                  (is_spells_rituals_count_max_reached)
      }

      if (isLastTrad (SpecialAbilityId.traditionSchelme)) {
        return getInactiveSpellsForSchelme (wiki)
                                           (hero)
                                           (is_spells_rituals_count_max_reached)
      }

      if (isLastTrad (SpecialAbilityId.traditionZauberalchimisten)) {
        return List ()
      }

      if (isLastTrad (SpecialAbilityId.traditionAnimisten)) {
        return getInactiveSpellsForAnimist (wiki)
                                           (hero)
                                           (is_spells_rituals_count_max_reached)
      }

      if (isLastTrad (SpecialAbilityId.traditionArcaneBard)
          || isLastTrad (SpecialAbilityId.traditionArcaneDancer)) {
        return getInactiveSpellsForArcaneBardOrDancer (wiki)
                                                      (hero)
                                                      (isUnfamiliar)
                                                      (trads_hero)
      }

      return getInactiveSpellsForOtherTradition (wiki)
                                                (hero)
                                                (is_spells_rituals_count_max_reached)
                                                (is_max_unfamiliar)
                                                (isUnfamiliar)
    }
  )
)


export const isNoSpellActivatable = createMaybeSelector (
  getInactiveSpells,
  fnull
)


export const getAvailableInactiveSpells = createMaybeSelector (
  getRuleBooksEnabled,
  getInactiveSpells,
  uncurryN (a => filterByAvailability (pipe (SWRA.wikiEntry, SA.src)) (a))
)


export const getAvailableInactiveCantrips = createMaybeSelector (
  getRuleBooksEnabled,
  getInactiveCantrips,
  uncurryN (a => fmap (filterByAvailability (pipe (CCA.wikiEntry, CA.src)) (a)))
)


type ListCombined = List<Record<SpellWithRequirements> | Record<CantripCombined>>


export const getActiveSpellsAndCantrips = createMaybeSelector (
  getActiveSpells,
  getActiveCantrips,
  uncurryN (liftM2<ListCombined, ListCombined, ListCombined> (append))
)


export const getAvailableInactiveSpellsAndCantrips = createMaybeSelector (
  getAvailableInactiveSpells,
  getAvailableInactiveCantrips,
  uncurryN (inactive_spells => fmap (append<ListI<ListCombined>> (inactive_spells)))
)


type getNameFromSpellOrCantrip =
  (x: Record<SpellWithRequirements | CantripCombined>) => string


const getNameFromSpellOrCantrip =
  (x: Record<SpellWithRequirements> | Record<CantripCombined>) =>
    SpellWithRequirements.is (x)
      ? pipe_ (x, SWRA.wikiEntry, SA.name)
      : pipe_ (x, CCA.wikiEntry, CA.name)


export const getFilteredActiveSpellsAndCantrips = createMaybeSelector (
  getActiveSpellsAndCantrips,
  getSpellsCombinedSortOptions,
  getSpellsFilterText,
  (mcombineds, sort_options, filter_text) =>
    fmapF (mcombineds)
          (filterAndSortRecordsBy (0)
                                  ([ getNameFromSpellOrCantrip as getNameFromSpellOrCantrip ])
                                  (sort_options)
                                  (filter_text)) as Maybe<ListCombined>
)


export const getFilteredInactiveSpellsAndCantrips = createMaybeSelector (
  getSpellsCombinedSortOptions,
  getInactiveSpellsFilterText,
  getEnableActiveItemHints,
  getAvailableInactiveSpellsAndCantrips,
  getActiveSpellsAndCantrips,
  uncurryN5 (sort_options =>
             filter_text =>
             areActiveItemHintsEnabled =>
             liftM2 (inactive =>
                     active =>
                       filterAndSortRecordsBy (0)
                                              ([ getNameFromSpellOrCantrip as
                                                 getNameFromSpellOrCantrip ])
                                              (sort_options)
                                              (filter_text)
                                              (areActiveItemHintsEnabled
                                                ? append (active) (inactive)
                                                : inactive) as ListCombined))
)


export const getCantripsForSheet = createMaybeSelector (
  getCantripsSortOptions,
  getActiveCantrips,
  uncurryN (sort_options => fmap (sortByMulti (sort_options)))
)


export const getSpellsForSheet = createMaybeSelector (
  getSpellsSortOptions,
  getIsUnfamiliarSpell,
  getActiveSpells,
  uncurryN3 (sort_options =>
             isUnfamiliar => fmap (pipe (
                                    map (s => isUnfamiliar (SWRA.wikiEntry (s))
                                                ? s
                                                : set (composeL (SWRL.wikiEntry, SL.tradition))
                                                      (List ())
                                                      (s)),
                                    sortByMulti (sort_options)
                                  )))
)


export const getAllSpellsForManualGuildMageSelect = createMaybeSelector (
  getWiki,
  getRuleBooksEnabled,
  getWikiSpecialAbilities,
  uncurryN3 (staticData => av => pipe (
                             lookup (prefixSA (SpecialAbilityId.traditionGuildMages)),
                             bindF (SAA.select),
                             fmap (pipe (
                               filterByAvailability (SOA.src) (av),
                               map (selectToDropdownOption),
                               sortRecordsByName (staticData)
                             ))
                           ))
)
