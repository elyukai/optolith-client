import { notP } from "../../Data/Bool";
import { equals, notEquals } from "../../Data/Eq";
import { ident, thrush } from "../../Data/Function";
import { fmap, fmapF } from "../../Data/Functor";
import { set } from "../../Data/Lens";
import { append, consF, countWith, elemF, List, map, notNull, partition } from "../../Data/List";
import { all, any, bindF, ensure, fromMaybe_, Just, liftM2, liftM3, listToMaybe, mapMaybe, Maybe, maybe, Nothing } from "../../Data/Maybe";
import { lte } from "../../Data/Num";
import { elems, lookup, lookupF, OrderedMap } from "../../Data/OrderedMap";
import { member } from "../../Data/OrderedSet";
import { Record } from "../../Data/Record";
import { fst, snd } from "../../Data/Tuple";
import { uncurryN, uncurryN3, uncurryN5, uncurryN6, uncurryN9 } from "../../Data/Tuple/Curry";
import { IC, MagicalGroup } from "../Constants/Groups";
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../Constants/Ids";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent, createInactiveActivatableSkillDependent } from "../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../Models/ActiveEntries/ActiveObject";
import { HeroModel } from "../Models/Hero/HeroModel";
import { CantripCombined } from "../Models/View/CantripCombined";
import { SpellWithRequirements, SpellWithRequirementsL } from "../Models/View/SpellWithRequirements";
import { Cantrip } from "../Models/Wiki/Cantrip";
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Spell, SpellL } from "../Models/Wiki/Spell";
import { SelectOption, selectToDropdownOption } from "../Models/Wiki/sub/SelectOption";
import { WikiModel } from "../Models/Wiki/WikiModel";
import { getModifierByActiveLevel } from "../Utilities/Activatable/activatableModifierUtils";
import { getMagicalTraditionsHeroEntries } from "../Utilities/Activatable/traditionUtils";
import { composeL } from "../Utilities/compose";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy";
import { isSpellDecreasable, isSpellIncreasable, isUnfamiliarSpell } from "../Utilities/Increasable/spellUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { validatePrerequisites } from "../Utilities/Prerequisites/validatePrerequisitesUtils";
import { filterByAvailability } from "../Utilities/RulesUtils";
import { mapGetToMaybeSlice, mapGetToSlice } from "../Utilities/SelectorsUtils";
import { sortRecordsBy, sortRecordsByName } from "../Utilities/sortBy";
import { misNumberM } from "../Utilities/typeCheckUtils";
import { getStartEl } from "./elSelectors";
import { getRuleBooksEnabled } from "./rulesSelectors";
import { getCantripsSortOptions, getSpellsCombinedSortOptions, getSpellsSortOptions } from "./sortOptionsSelectors";
import { getAdvantages, getCantrips, getDisadvantages, getHeroProp, getInactiveSpellsFilterText, getLocaleAsProp, getMaybeSpecialAbilities, getPhase, getSpecialAbilities, getSpells, getSpellsFilterText, getWiki, getWikiCantrips, getWikiSpecialAbilities, getWikiSpells } from "./stateSelectors";
import { getEnableActiveItemHints } from "./uisettingsSelectors";

const HA = HeroModel.A
const WA = WikiModel.A
const ELA = ExperienceLevel.A
const ADA = ActivatableDependent.A
const AOA = ActiveObject.A
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
  getMagicalTraditionsHeroEntries
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
                           notEquals<string> (SpecialAbilityId.TraditionMeistertalentierte)
                         ))
                         (xs))
)

export const getActiveSpells = createMaybeSelector (
  getStartEl,
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.ExceptionalSkill),
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.PropertyKnowledge),
  getWiki,
  getHeroProp,
  getMagicalTraditionsFromHero,
  (mstart_el, mexceptional_skill, maproperty_knowledge, wiki, hero, trads) => {
    const isUnfamiliar = isUnfamiliarSpell (trads)

    return fmap ((start_el: Record<ExperienceLevel>) =>
                  thrush (elems (HA.spells (hero)))
                         (mapMaybe (pipe (
                           ensure (ASDA.active),
                           bindF (hero_entry =>
                                   pipe_ (
                                     wiki,
                                     WA.spells,
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
                                         isUnfamiliar: isUnfamiliar (wiki_entry),
                                         stateEntry: hero_entry,
                                         wikiEntry: wiki_entry,
                                       }))
                                   ))
                         ))))
                (mstart_el)
  }
)

export const getActiveAndInactiveCantrips = createMaybeSelector (
  getMagicalTraditionsFromHero,
  getWikiCantrips,
  getCantrips,
  uncurryN3 (trads =>
             wiki_cantrips => fmap (hero_cantrips => {
                                    const isUnfamiliar = isUnfamiliarSpell (trads)

                                    return pipe_ (
                                      wiki_cantrips,
                                      elems,
                                      map (wiki_entry => CantripCombined ({
                                        wikiEntry: wiki_entry,
                                        active: member (CA.id (wiki_entry))
                                                       (hero_cantrips),
                                        isUnfamiliar: isUnfamiliar (wiki_entry),
                                      })),
                                      partition (CCA.active)
                                    )
                                  }))
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
  pipe (
    fmap (countWith (pipe (
                      SWRA.wikiEntry,
                      SA.gr,
                      elemF (List<MagicalGroup> (MagicalGroup.Spells, MagicalGroup.Rituals))
                    ))),
    Maybe.sum
  )
)

export const getIsMaximumOfSpellsReached = createMaybeSelector (
  getActiveSpellsCounter,
  getPhase,
  getStartEl,
  uncurryN3 (active =>
             liftM2 (phase =>
                     start_el => {
                       if (phase > 2) {
                         return false
                       }

                       return active >= ELA.maxSpellsLiturgicalChants (start_el)
                     }))
)

const getUnfamiliarSpellsCount = createMaybeSelector (
  getActiveSpells,
  maybe (0) (countWith (SWRA.isUnfamiliar))
)

const isUnfamiliarSpellsActivationDisabled = createMaybeSelector (
  getUnfamiliarSpellsCount,
  getStartEl,
  uncurryN (count => maybe (false) (pipe (ELA.maxUnfamiliarSpells, lte (count))))
)

export const isActivationDisabled = createMaybeSelector (
  getActiveSpellsCounter,
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.GrosseZauberauswahl),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.KleineZauberauswahl),
  getMagicalTraditionsFromHero,
  getStartEl,
  getPhase,
  uncurryN6 (active_spells =>
             mbonus =>
             mmalus =>
             hero_trads =>
               liftM2 (start_el =>
                       phase =>
                         pipe_ (
                           hero_trads,
                           listToMaybe,
                           maybe (true)
                                 (trad => {
                                   const trad_id = ADA.id (trad)

                                   if (trad_id === SpecialAbilityId.TraditionIntuitiveZauberer) {
                                     const max_spells =
                                       getModifierByActiveLevel (Just (3))
                                                                (mbonus)
                                                                (mmalus)

                                     if (active_spells >= max_spells) {
                                       return true
                                     }
                                   }

                                   const maxSpellsLiturgicalChants =
                                     ExperienceLevel.A.maxSpellsLiturgicalChants (start_el)

                                   return phase < 3 && active_spells >= maxSpellsLiturgicalChants
                                 })
                         )))
)

type Combined = Record<SpellWithRequirements>

export const getInactiveSpells = createMaybeSelector (
  getWiki,
  getMagicalTraditionsFromHero,
  getWikiSpells,
  getHeroProp,
  getMagicalTraditionsFromWiki,
  isUnfamiliarSpellsActivationDisabled,
  getIsMaximumOfSpellsReached,
  getSpells,
  isActivationDisabled,
  uncurryN9 (
    wiki =>
    trads_hero =>
    wiki_spells =>
    hero =>
    trads_wiki =>
    is_max_unfamiliar =>
      liftM3 (is_max =>
              hero_spells =>
              is_activation_disabled => {
        const isLastTrad = pipe_ (trads_wiki, listToMaybe, fmap (SAA.id), Maybe.elemF)

        const isSpellPrereqsValid =
          (entry: Record<Spell>) =>
            validatePrerequisites (wiki)
                                  (hero)
                                  (SA.prerequisites (entry))
                                  (SA.id (entry))

        const isUnfamiliar = isUnfamiliarSpell (trads_hero)

        // Intuitive Magier/Animisten können nur max. 1 C-Zauber,
        // keine D-Zauber und keine Rituale erlernen
        if (isLastTrad (SpecialAbilityId.TraditionIntuitiveZauberer)
            || isLastTrad (SpecialAbilityId.TraditionAnimisten)) {
          if (is_max || is_activation_disabled) {
            return List<Combined> ()
          }

          const f = (k: string) => (wiki_entry: Record<Spell>) => {
            const mhero_entry = lookup (k) (hero_spells)

            if (isSpellPrereqsValid (wiki_entry)
                // Intuitive Magier können nur Zauber erlernen,
                // Animisten dürfen auch Animistenkräfte erlernen:
                && (
                  SA.gr (wiki_entry) === MagicalGroup.Spells
                  || (SA.gr (wiki_entry) === MagicalGroup.Animistenkräfte
                      && isLastTrad (SpecialAbilityId.TraditionAnimisten))
                )
                // Muss inaktiv sein:
                && all (notP (ASDA.active)) (mhero_entry)
                // Keine Zauber mit Steigerungsfaktor D:
                && SA.ic (wiki_entry) < IC.D
                // Nur ein C Zauber:
                && !(SA.ic (wiki_entry) === IC.C && isAnySpellActiveWithImpCostC (wiki_spells)
                                                                                 (hero_spells))
                // Es dürfen nur maximal 3 Zauber erlernt werden
                && (countWith (pipe (ASDA.id, lookupF (wiki_spells), maybe (false)
                                    (pipe (SA.gr, equals<MagicalGroup> (MagicalGroup.Spells)))))
                              (elems (hero_spells)) < 3
                    || SA.gr (wiki_entry) === MagicalGroup.Animistenkräfte)) {
              return consF (SpellWithRequirements ({
                wikiEntry: wiki_entry,
                stateEntry: fromMaybe_ (() => createInactiveActivatableSkillDependent (k))
                                       (mhero_entry),
                isUnfamiliar: false,
                isDecreasable: Nothing,
                isIncreasable: Nothing,
              }))
            }

            return ident as ident<List<Record<SpellWithRequirements>>>
          }

          return OrderedMap.foldrWithKey (f)
                                         (List ())
                                         (wiki_spells)
        }

        if (isLastTrad (SpecialAbilityId.TraditionZauberbarden)
            || isLastTrad (SpecialAbilityId.TraditionZaubertaenzer)) {
          if (is_max || is_activation_disabled) {
            return List<Combined> ()
          }

          const msub_trad =
            pipe_ (
              trads_hero,
              listToMaybe,
              bindF (pipe (ADA.active, listToMaybe)),
              bindF (AOA.sid),
              misNumberM
            )

          const g = (k: string) => (wiki_entry: Record<Spell>) => {
            const mhero_entry = lookup (k) (hero_spells)

            if (isSpellPrereqsValid (wiki_entry)
                && !isUnfamiliar (wiki_entry)
                && Maybe.or (fmapF (msub_trad) (elemF (SA.subtradition (wiki_entry))))
                && all (notP (ASDA.active)) (mhero_entry)) {
              return consF (SpellWithRequirements ({
                wikiEntry: wiki_entry,
                stateEntry: fromMaybe_ (() => createInactiveActivatableSkillDependent (k))
                                       (mhero_entry),
                isUnfamiliar: false,
                isDecreasable: Nothing,
                isIncreasable: Nothing,
              }))
            }

            return ident as ident<List<Record<SpellWithRequirements>>>
          }

          return OrderedMap.foldrWithKey (g)
                                         (List ())
                                         (wiki_spells)
        }

        const h = (k: string) => (wiki_entry: Record<Spell>) => {
          const mhero_entry = lookup (k) (hero_spells)

          if ((!(is_max || is_activation_disabled) || SA.gr (wiki_entry) > MagicalGroup.Rituals)
              && isSpellPrereqsValid (wiki_entry)
              && (!isUnfamiliar (wiki_entry)
                  || (SA.gr (wiki_entry) <= MagicalGroup.Rituals && !is_max_unfamiliar))
              && all (notP (ASDA.active)) (mhero_entry)) {
            return consF (SpellWithRequirements ({
              wikiEntry: wiki_entry,
              stateEntry:
                fromMaybe_ (() => createInactiveActivatableSkillDependent (k))
                           (mhero_entry),
              isUnfamiliar: isUnfamiliar (wiki_entry),
              isDecreasable: Nothing,
              isIncreasable: Nothing,
            }))
          }

          return ident as ident<List<Record<SpellWithRequirements>>>
        }

        return OrderedMap.foldrWithKey (h)
                                       (List ())
                                       (wiki_spells)
      })
  )
)

const isAnySpellActiveWithImpCostC =
  (wiki_spells: OrderedMap<string, Record<Spell>>) =>
    OrderedMap.any ((x: Record<ActivatableSkillDependent>) => ASDA.active (x)
                                                              && pipe_ (
                                                                x,
                                                                ASDA.id,
                                                                lookupF (wiki_spells),
                                                                maybe (false)
                                                                      (pipe (SA.ic, equals (IC.C)))
                                                              ))

export const getAvailableInactiveSpells = createMaybeSelector (
  getRuleBooksEnabled,
  getInactiveSpells,
  uncurryN (a => fmap (filterByAvailability (pipe (SWRA.wikiEntry, SA.src)) (a)))
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
  uncurryN (liftM2<ListCombined, ListCombined, ListCombined> (append))
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
  getLocaleAsProp,
  (mcombineds, sort_options, filter_text) =>
    fmapF (mcombineds)
          (filterAndSortRecordsBy (0)
                                  ([getNameFromSpellOrCantrip as getNameFromSpellOrCantrip])
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
                                              ([getNameFromSpellOrCantrip as
                                                getNameFromSpellOrCantrip])
                                              (sort_options)
                                              (filter_text)
                                              (areActiveItemHintsEnabled
                                                ? append (active) (inactive)
                                                : inactive) as ListCombined))
)

export const getCantripsForSheet = createMaybeSelector (
  getCantripsSortOptions,
  getActiveCantrips,
  uncurryN (sort_options => fmap (sortRecordsBy (sort_options)))
)

export const getSpellsForSheet = createMaybeSelector (
  getSpellsSortOptions,
  getMagicalTraditionsFromHero,
  getActiveSpells,
  uncurryN3 (sort_options =>
              hero_trads => fmap (pipe (
                                   map (s => isUnfamiliarSpell (hero_trads) (SWRA.wikiEntry (s))
                                               ? s
                                               : set (composeL (SWRL.wikiEntry, SL.tradition))
                                                     (List ())
                                                     (s)),
                                   sortRecordsBy (sort_options)
                                 )))
)

export const getAllSpellsForManualGuildMageSelect = createMaybeSelector (
  getLocaleAsProp,
  getRuleBooksEnabled,
  getWikiSpecialAbilities,
  uncurryN3 (l10n => av => pipe (
                             lookup<string> (SpecialAbilityId.TraditionGuildMages),
                             bindF (SAA.select),
                             fmap (pipe (
                               filterByAvailability (SOA.src) (av),
                               map (selectToDropdownOption),
                               sortRecordsByName (l10n)
                             ))
                           ))
)
