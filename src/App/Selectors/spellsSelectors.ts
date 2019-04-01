import { ident, thrush } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { consF, countWith, elemF, List, map, notNull, partition } from "../../Data/List";
import { all, bindF, elem, ensure, fromMaybe_, liftM2, liftM4, liftM5, listToMaybe, mapMaybe, Maybe, Nothing } from "../../Data/Maybe";
import { elems, lookup, lookupF, OrderedMap } from "../../Data/OrderedMap";
import { member } from "../../Data/OrderedSet";
import { fst, snd, uncurryN, uncurryN3, uncurryN4, uncurryN7 } from "../../Data/Pair";
import { Record } from "../../Data/Record";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent, createInactiveActivatableSkillDependent } from "../Models/ActiveEntries/ActivatableSkillDependent";
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel";
import { CantripCombined } from "../Models/View/CantripCombined";
import { SpellWithRequirements, SpellWithRequirementsL } from "../Models/View/SpellWithRequirements";
import { Cantrip } from "../Models/Wiki/Cantrip";
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Spell, SpellL } from "../Models/Wiki/Spell";
import { WikiModel } from "../Models/Wiki/WikiModel";
import { getModifierByActiveLevel } from "../Utilities/Activatable/activatableModifierUtils";
import { getMagicalTraditionsHeroEntries } from "../Utilities/Activatable/traditionUtils";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { prefixAdv, prefixSA } from "../Utilities/IDUtils";
import { isOwnTradition, isSpellDecreasable, isSpellIncreasable } from "../Utilities/Increasable/spellUtils";
import { notP } from "../Utilities/not";
import { pipe, pipe_ } from "../Utilities/pipe";
import { validatePrerequisites } from "../Utilities/Prerequisites/validatePrerequisitesUtils";
import { filterByAvailability } from "../Utilities/RulesUtils";
import { mapGetToMaybeSlice } from "../Utilities/SelectorsUtils";
import { getStartEl } from "./elSelectors";
import { getRuleBooksEnabled } from "./rulesSelectors";
import { getSpellsSortOptions } from "./sortOptionsSelectors";
import { getAdvantages, getCantrips, getCurrentHeroPresent, getDisadvantages, getInactiveSpellsFilterText, getLocaleAsProp, getPhase, getSpecialAbilities, getSpells, getSpellsFilterText, getWiki, getWikiCantrips, getWikiSpecialAbilities, getWikiSpells } from "./stateSelectors";
import { getEnableActiveItemHints } from "./uisettingsSelectors";

const HA = HeroModel.A
const WA = WikiModel.A
const ELA = ExperienceLevel.A
const ADA = ActivatableDependent.A
const ASDA = ActivatableSkillDependent.A
const CA = Cantrip.A
const CCA = CantripCombined.A
const SWRA = SpellWithRequirements.A
const SWRL = SpellWithRequirementsL
const SA = Spell.A
const SL = SpellL
const SAA = SpecialAbility.A

export const getMagicalTraditionsFromHero = createMaybeSelector (
  getSpecialAbilities,
  fmap (getMagicalTraditionsHeroEntries)
)

export const getMagicalTraditionsFromWiki = createMaybeSelector (
  getWikiSpecialAbilities,
  getMagicalTraditionsFromHero,
  uncurryN (
    wiki_special_abilities =>
      fmap (mapMaybe (pipe (ActivatableDependent.A.id, lookupF (wiki_special_abilities))))
  )
)

export const getIsSpellsTabAvailable = createMaybeSelector (
  getMagicalTraditionsFromHero,
  pipe (fmap (notNull), elem<boolean> (true))
)

export const getActiveSpells = createMaybeSelector (
  getStartEl,
  mapGetToMaybeSlice (getAdvantages) (prefixAdv (16)),
  mapGetToMaybeSlice (getSpecialAbilities) (prefixSA (72)),
  getWiki,
  getCurrentHeroPresent,
  (mstart_el, mexceptional_skill, maproperty_knowledge, wiki, mhero) =>
    liftM2 ((hero: HeroModelRecord) => (start_el: Record<ExperienceLevel>) =>
             thrush (elems (HA.liturgicalChants (hero)))
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
                                    stateEntry: hero_entry,
                                    wikiEntry: wiki_entry,
                                  })
                                )
                              ))
                    ))))
           (mhero)
           (mstart_el)
)

export const getActiveAndInactiveCantrips = createMaybeSelector (
  getWikiCantrips,
  getCantrips,
  uncurryN (wiki_cantrips => fmap (hero_cantrips => pipe_ (
                                                            wiki_cantrips,
                                                            elems,
                                                            map (wiki_entry => CantripCombined ({
                                                              wikiEntry: wiki_entry,
                                                              active: member (CA.id (wiki_entry))
                                                                             (hero_cantrips),
                                                            })),
                                                            partition (CCA.active)
                                                          )))
)

export const getActiveCantrips = createMaybeSelector (
  getActiveAndInactiveCantrips,
  fmap (fst)
)

export const getInactiveCantrips = createMaybeSelector (
  getActiveAndInactiveCantrips,
  fmap (snd)
)

export const getAreMaxUnfamiliar = createMaybeSelector (
  getMagicalTraditionsFromWiki,
  getPhase,
  getStartEl,
  getActiveSpells,
  uncurryN4 (liftM4 (trads =>
                     phase =>
                     start_el =>
                     xs => {
                       if (phase > 2) {
                         return false
                       }

                       const max = ELA.maxUnfamiliarSpells (start_el)

                       const unfamiliarSpells =
                         countWith ((x: Record<SpellWithRequirements>) =>
                                      pipe_ (x, SWRA.wikiEntry, SA.gr) < 3
                                      && pipe_ (x, SWRA.stateEntry, ASDA.active)
                                      && !isOwnTradition (trads) (SWRA.wikiEntry (x)))
                                   (xs)

                       return unfamiliarSpells >= max
                     }))
)

export const getActiveSpellsCounter = createMaybeSelector (
  getActiveSpells,
  pipe (
    fmap (countWith (pipe (SWRA.wikiEntry, SA.gr, elemF (List (1, 2))))),
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

type Combined = Record<SpellWithRequirements>

export const getInactiveSpells = createMaybeSelector (
  getWiki,
  getMagicalTraditionsFromHero,
  getWikiSpells,
  getCurrentHeroPresent,
  getMagicalTraditionsFromWiki,
  getIsMaximumOfSpellsReached,
  getAreMaxUnfamiliar,
  getSpells,
  uncurryN7 (
    wiki =>
    mtrads_hero =>
    wiki_spells =>
      liftM5 (hero =>
              trads_wiki =>
              is_max =>
              is_max_unfamiliar =>
              hero_spells => {
        if (is_max) {
          return List<Combined> ()
        }

        const isLastTrad = pipe_ (trads_wiki, listToMaybe, fmap (SAA.id), Maybe.elemF)

        const isSpellPrereqsValid =
          (entry: Record<Spell>) =>
            validatePrerequisites (wiki)
                                  (hero)
                                  (SA.prerequisites (entry))
                                  (SA.id (entry))

        if (isLastTrad (prefixSA (679))) {
          const f = (k: string) => (wiki_entry: Record<Spell>) => {
            const mhero_entry = lookup (k) (hero_spells)

            if (isSpellPrereqsValid (wiki_entry)
                && (isOwnTradition (trads_wiki) (wiki_entry) || is_max_unfamiliar)
                && all (notP (ASDA.active)) (mhero_entry)) {
              return consF (SpellWithRequirements ({
                wikiEntry: wiki_entry,
                stateEntry: fromMaybe_ (() => createInactiveActivatableSkillDependent (k))
                                       (mhero_entry),
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

        if (isLastTrad (prefixSA (677)) || isLastTrad (prefixSA (678))) {
          // TODO
          const g = (k: string) => (wiki_entry: Record<Spell>) => {
            const mhero_entry = lookup (k) (hero_spells)

            if (isSpellPrereqsValid (wiki_entry)
                && (isOwnTradition (trads_wiki) (wiki_entry) || is_max_unfamiliar)
                && all (notP (ASDA.active)) (mhero_entry)) {
              return consF (SpellWithRequirements ({
                wikiEntry: wiki_entry,
                stateEntry: fromMaybe_ (() => createInactiveActivatableSkillDependent (k))
                                       (mhero_entry),
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

          if (all (notP (ASDA.active)) (mhero_entry)) {
            return consF (SpellWithRequirements ({
              wikiEntry: wiki_entry,
              stateEntry:
                fromMaybe_ (() => createInactiveActivatableSkillDependent (k))
                           (mhero_entry),
              isDecreasable: Nothing,
              isIncreasable: Nothing,
            }))
          }

          return ident as ident<List<Record<SpellWithRequirements>>>
        }

        return OrderedMap.foldrWithKey (h)
                                       (List ())
                                       (wiki_spells)
      }))
)

type ListCombined = List<Record<SpellWithRequirements> | Record<CantripCombined>>

export const getInactiveSpells_ = createMaybeSelector (
  getUnfilteredInactiveSpells,
  getAreMaxUnfamiliar,
  getIsMaximumOfSpellsReached,
  getCurrentHeroPresent,
  getMagicalTraditionsFromHero,
  getMagicalTraditionsFromWiki,
  getWiki,
  (
    maybeUnfilteredInactiveSpells,
    areMaxUnfamiliar,
    isMaximumOfSpellsReached,
    maybeHero,
    maybeStateTraditions,
    maybeTraditions,
    wiki
  ) => maybeHero.bind (
    hero => maybeTraditions.bind (
      traditions => maybeStateTraditions.bind (
        stateTraditions =>
          maybeUnfilteredInactiveSpells.fmap<InactiveSpells> (
            unfilteredInactiveSpells => {
              if (traditions.null ()) {
                return emptyInactiveSpells
              }

              const lastTraditionId = Maybe.listToMaybe (traditions)
                .fmap (tradition => tradition.get ("id"))

              const validateSpellPrerequisites = (entry: Record<SpellIsActive>) =>
                validatePrerequisites (wiki, hero, entry.get ("prerequisites"), entry.get ("id"))

              if (Maybe.elem ("SA_679") (lastTraditionId)) {
                return unfilteredInactiveSpells.elems ()
                  .partition (
                    entry => entry.get ("gr") < 3
                      && !isMaximumOfSpellsReached
                      && validateSpellPrerequisites (entry)
                      && (
                        isOwnTradition (traditions, entry as unknown as Record<Spell>)
                        || !areMaxUnfamiliar
                      )
                  )
              }

              if (
                Maybe.elem ("SA_677") (lastTraditionId)
                || Maybe.elem ("SA_678") (lastTraditionId)
              ) {
                return Maybe.fromMaybe (emptyInactiveSpells) (
                  Maybe.listToMaybe (stateTraditions)
                    .fmap (tradition => tradition.get ("active"))
                    .bind (Maybe.listToMaybe)
                    .bind (active => active.lookup ("sid"))
                    .fmap (
                      subTradition => unfilteredInactiveSpells.elems ()
                        .partition (
                          entry => entry.get ("subtradition").elem (subTradition as number)
                        )
                    )
                )
              }

              return unfilteredInactiveSpells.elems ()
                .partition (
                  entry => (!isMaximumOfSpellsReached || entry.get ("gr") > 2)
                    && validateSpellPrerequisites (entry)
                    && (
                      isOwnTradition (traditions, entry as unknown as Record<Spell>)
                      || (entry.get ("gr") < 3 && !areMaxUnfamiliar)
                    )
                )
            }
          )
      )
    )
  )
)

export const getAvailableInactiveSpells = createMaybeSelector (
  getInactiveSpells,
  getRuleBooksEnabled,
  (maybeList, maybeAvailablility) => maybeList.bind (
    list => maybeAvailablility.fmap (
      availablility => filterByAvailability (Tuple.fst (list), availablility)
    )
  )
)

type ActiveListCombined = List<Record<SpellWithRequirements> | Record<CantripCombined>>
type InactiveListCombined = List<Record<SpellIsActive> | Record<CantripCombined>>

export const getActiveSpellsAndCantrips = createMaybeSelector (
  getActiveSpells,
  getActiveCantrips,
  (spells: Maybe<ActiveListCombined>, cantrips) => spells .mappend (cantrips)
)

export const getAvailableInactiveSpellsAndCantrips = createMaybeSelector (
  getAvailableInactiveSpells,
  getInactiveCantrips,
  (spells: Maybe<InactiveListCombined>, cantrips) => spells .mappend (cantrips)
)

export const getFilteredActiveSpellsAndCantrips = createMaybeSelector (
  getActiveSpellsAndCantrips,
  getSpellsSortOptions,
  getSpellsFilterText,
  getLocaleAsProp,
  (maybeSpells, sortOptions, filterText, locale) => maybeSpells.fmap (
    spells => filterAndSortObjects (
      spells as List<Record<CantripCombined | SpellWithRequirements>>,
      locale.get ("id"),
      filterText,
      sortOptions as AllSortOptions<CantripCombined | SpellWithRequirements>
    ) as ActiveListCombined
  )
)

export const getFilteredInactiveSpellsAndCantrips = createMaybeSelector (
  getAvailableInactiveSpellsAndCantrips,
  getActiveSpellsAndCantrips,
  getSpellsSortOptions,
  getInactiveSpellsFilterText,
  getLocaleAsProp,
  getEnableActiveItemHints,
  (maybeInactive, maybeActive, sortOptions, filterText, locale, areActiveItemHintsEnabled) =>
    Maybe.liftM2<InactiveListCombined, InactiveListCombined, InactiveListCombined>
      (active => inactive => areActiveItemHintsEnabled
        ? filterAndSortObjects (
          List.mappend (inactive) (active) as List<Record<CantripCombined | Spell>>,
          locale.get ("id"),
          filterText,
          sortOptions as AllSortOptions<CantripCombined | Spell>
        ) as InactiveListCombined
        : filterAndSortObjects (
          inactive as List<Record<CantripCombined | Spell>>,
          locale.get ("id"),
          filterText,
          sortOptions as AllSortOptions<CantripCombined | Spell>
        ) as InactiveListCombined)
      (maybeActive as Maybe<InactiveListCombined>)
      (maybeInactive)
)

const getMaxSpellsModifier = (
  maybeIncrease: Maybe<Record<ActivatableDependent>>,
  maybeDecrease: Maybe<Record<ActivatableDependent>>
) => getModifierByActiveLevel (maybeIncrease) (maybeDecrease) (Just (3))

export const isActivationDisabled = createMaybeSelector (
  getStartEl,
  getPhase,
  getActiveSpellsCounter,
  getMagicalTraditionsFromHero,
  mapGetToMaybeSlice (getAdvantages, "ADV_58"),
  mapGetToMaybeSlice (getDisadvantages, "DISADV_59"),
  (
    maybeStartEl,
    maybePhase,
    maybeActiveSpellsCounter,
    maybeTraditions,
    maybeBonus,
    maybePenalty
  ) =>
    Maybe.fromMaybe (true) (
      Maybe.liftM4 ((traditions: List<Record<ActivatableDependent>>) =>
                      (startEl: Record<ExperienceLevel>) =>
                        (phase: number) =>
                          (activeSpellsCounter: number) =>
                            Maybe.fromMaybe (true) (
                              List.uncons (traditions).fmap (
                                unconsTraditions => {
                                  const lastTraditionId = Tuple.fst (unconsTraditions).get ("id")

                                  if (lastTraditionId === "SA_679") {
                                    const maxSpells = getMaxSpellsModifier (
                                      maybeBonus,
                                      maybePenalty
                                    )

                                    if (activeSpellsCounter >= maxSpells) {
                                      return true
                                    }
                                  }

                                  const maxSpellsLiturgies = startEl.get ("maxSpellsLiturgies")

                                  return phase < 3 && activeSpellsCounter >= maxSpellsLiturgies
                                }
                              )
                            )
                   )
                   (maybeTraditions)
                   (maybeStartEl)
                   (maybePhase)
                   (maybeActiveSpellsCounter)
    )
)

export const getCantripsForSheet = createMaybeSelector (
  getActiveCantrips,
  R.identity
)

export const getSpellsForSheet = createMaybeSelector (
  getActiveSpellsCombined,
  getMagicalTraditionsFromWiki,
  getLocaleAsProp,
  (maybeSpells, maybeTraditions, locale) =>
    maybeSpells
      .bind (
        spells => maybeTraditions.fmap (
          traditions => spells.map (
            spell => spell.modify<"tradition"> (
              x => isOwnTradition (traditions, spell as any as Record<Spell>) ? List.of () : x
            ) ("tradition")
          )
        )
      )
      .fmap (list => sortObjects (list, locale .get ("id")))
)
