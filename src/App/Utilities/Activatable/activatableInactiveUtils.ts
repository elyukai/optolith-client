/**
 * Get the needed options for `Activatable` entries that are available to
 * activate.
 *
 * @file src/Utilities/activatableInactiveUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { notP } from "../../../Data/Bool"
import { equals, notEquals } from "../../../Data/Eq"
import { cnst, ident } from "../../../Data/Function"
import { fmap, fmapF, mapReplace } from "../../../Data/Functor"
import { over, set } from "../../../Data/Lens"
import { consF, countWith, elem, elemF, filter, find, flength, fnull, foldr, isList, List, map, mapByIdKeyMap, notElem, notElemF, notNull, nub, subscript } from "../../../Data/List"
import { all, ap, bind, bindF, ensure, fromJust, fromMaybe, guard, isJust, isNothing, join, Just, liftM2, listToMaybe, Maybe, maybe, maybeToList, Nothing, or, thenF } from "../../../Data/Maybe"
import { add, gt, gte, inc, multiply } from "../../../Data/Num"
import { alter, elems, foldrWithKey, isOrderedMap, lookup, lookupF, member, OrderedMap } from "../../../Data/OrderedMap"
import { Record, RecordI } from "../../../Data/Record"
import { filterMapListT, filterT, mapT } from "../../../Data/Transducer"
import { fst, Pair, snd, Tuple } from "../../../Data/Tuple"
import { traceShowId } from "../../../Debug/Trace"
import { Aspect, CombatTechniqueGroupId, MagicalTradition, SkillGroup, SpecialAbilityGroup } from "../../Constants/Groups"
import { AdvantageId, DisadvantageId, SkillId, SpecialAbilityId } from "../../Constants/Ids.gen"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject"
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { Pact } from "../../Models/Hero/Pact"
import { Rules } from "../../Models/Hero/Rules"
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories"
import { InactiveActivatable, InactiveActivatableL } from "../../Models/View/InactiveActivatable"
import { Advantage } from "../../Models/Wiki/Advantage"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../Models/Wiki/Skill"
import { Spell } from "../../Models/Wiki/Spell"
import { Application } from "../../Models/Wiki/sub/Application"
import { SelectOption, SelectOptionL } from "../../Models/Wiki/sub/SelectOption"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { Activatable } from "../../Models/Wiki/wikiTypeHelpers"
import { composeT } from "../compose"
import { filterUnfamiliar } from "../Dependencies/TransferredUnfamiliarUtils"
import { countActiveGroupEntries } from "../entryGroupUtils"
import { getAllEntriesByGroup } from "../heroStateUtils"
import { prefixSA } from "../IDUtils"
import { getTraditionOfAspect } from "../Increasable/liturgicalChantUtils"
import { isUnfamiliarSpell } from "../Increasable/spellUtils"
import { pipe, pipe_ } from "../pipe"
import { validateLevel, validatePrerequisites } from "../Prerequisites/validatePrerequisitesUtils"
import { isEntryAvailable } from "../RulesUtils"
import { sortRecordsByName } from "../sortBy"
import { isNumber, isString, isStringM, misNumberM, misStringM } from "../typeCheckUtils"
import { getMaxLevelForDecreaseEntry, getSermonsAndVisionsCount } from "./activatableActiveValidationUtils"
import { isAdditionDisabled } from "./activatableInactiveValidationUtils"
import { modifyByLevel } from "./activatableModifierUtils"
import { countActiveSkillEntries } from "./activatableSkillUtils"
import { isMaybeActive } from "./isActive"
import { getActiveSecondarySelections, getActiveSelections, getActiveSelectionsMaybe, getRequiredSelections } from "./selectionUtils"
import { getBlessedTradition, getMagicalTraditionsHeroEntries, mapBlessedNumIdToTradId } from "./traditionUtils"

const SDA = StaticData.A
const HA = HeroModel.A
const AAL = Advantage.AL
const LCA = LiturgicalChant.A
const SpA = Spell.A
const ADA = ActivatableDependent.A
const ASDA = ActivatableSkillDependent.A
const SkDA = SkillDependent.A
const SOA = SelectOption.A
const AppA = Application.A
const AOA = ActiveObject.A
const SpAL = Spell.AL
const SA = Skill.A
const RA = Rules.A
const SOL = SelectOptionL
const IAA = InactiveActivatable.A
const IAL = InactiveActivatableL
const PA = Pact.A
const APCA = AdventurePointsCategories.A

/**
 * `isNotActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is activated for the passed
 * `ActivatableDependent`.
 */
const isNotActive =
  pipe (
    getActiveSelectionsMaybe,
    fromMaybe<List<string | number>> (List.empty),
    activeSelections => pipe (
      SOA.id,
      notElemF (activeSelections)
    )
  )

/**
 * `areNoSameActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if a select option is not activated more than once for the passed
 * `ActivatableDependent`.
 */
const areNoSameActive =
  pipe (
    getActiveSelectionsMaybe,
    fromMaybe<List<string | number>> (List.empty),
    activeSelections => pipe (
      SOA.id,
      current_id => countWith (equals (current_id)) (activeSelections) < 2
    )
  )

/**
 * `isNotRequired :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is required for the passed
 * `ActivatableDependent`.
 */
const isNotRequired =
  pipe (
    getRequiredSelections,
    fromMaybe<List<string | number | List<number>>> (List.empty),
    requiredSelections => pipe (
      SOA.id,
      notElemF (requiredSelections)
    )
  )


/**
 * `isNotRequiredNotActive :: Maybe ActivatableDependent -> SelectOption -> Bool`
 *
 * Test if the id of the passed select option is neither required nor activated
 * for the passed `ActivatableDependent`.
 */
const isNotRequiredNotActive =
  (mhero_entry: Maybe<Record<ActivatableDependent>>) => {
    const isNoActiveSelection = isNotActive (mhero_entry)
    const isNoRequiredSelection = isNotRequired (mhero_entry)

    return (e: Record<SelectOption>) =>
      isNoActiveSelection (e) && isNoRequiredSelection (e)
  }

/**
 * Increment the value at the specified key by `1`. If there is no value at that
 * key, the value will be set to `0`.
 */
const incMapVal = alter (pipe (maybe (1) (inc), Just))

const addChantToCounter =
  (chant: Record<LiturgicalChant>) =>
  (mp: OrderedMap<number, number>) =>
    foldr ((aspect: Aspect) => OrderedMap.insertWith (add) <number> (aspect) (1))
          (mp)
          (LCA.aspects (chant))

const addSpellToCounter = pipe (SpA.property, incMapVal)

const filterSkillsGte10 = filter (pipe (ASDA.value, gte (10)))

const foldCounter =
  foldrWithKey<number, number, List<number>> (k => x => x >= 3 ? consF (k) : ident)
                                             (List.empty)

/**
 * `getPropsWith3Gte10 :: Wiki -> Hero -> [Int]`
 *
 * Returns a list containing all properties where at least 3 spells with at
 * least SR 10 belong to.
 */
const getPropsWith3Gte10 =
  (staticData: StaticDataRecord) =>
    pipe (
      HA.spells,
      elems,
      filterSkillsGte10,
      mapByIdKeyMap (SDA.spells (staticData)),
      foldr (addSpellToCounter) (OrderedMap.empty),
      foldCounter
    )

/**
 * `getAspectsWith3Gte10 :: Wiki -> Hero -> [Int]`
 *
 * Returns a list containing all aspects where at least 3 chants with at least
 * SR 10 belong to.
 */
const getAspectsWith3Gte10 =
  (staticData: StaticDataRecord) =>
    pipe (
      HA.liturgicalChants,
      elems,
      filterSkillsGte10,
      traceShowId,
      mapByIdKeyMap (SDA.liturgicalChants (staticData)),
      traceShowId,
      foldr (addChantToCounter) (OrderedMap.empty),
      traceShowId,
      OrderedMap.foldrWithKey ((k: number) => (x: number) => (xs: List<number>) =>
                                x >= 3 ? consF (k) (xs) : xs)
                              (List.empty),
      traceShowId,
    )

const isSocialSkill =
  (staticData: StaticDataRecord) =>
    pipe (
      SOA.id,
      ensure (isString),
      bindF (lookupF (SDA.skills (staticData))),
      fmap (pipe (SA.gr, equals (SkillGroup.Social))),
      or
    )

const isAddExistSkillSpecAllowed =
  (hero: HeroModelRecord) =>
  (counter: OrderedMap<string | number, List<string | number>>) =>
  (curr_select_id: string | number) =>
    pipe_ (
      curr_select_id,
      ensure (isString),
      bindF (lookupF (HA.skills (hero))),
      liftM2 ((apps: List<string | number>) =>
              (skill: Record<SkillDependent>) =>
                flength (apps) < 3 && SkDA.value (skill) >= (flength (apps) + 1) * 6)
             (lookupF (counter) (curr_select_id)),
      or
    )

const isAddNotExistSkillSpecAllowed =
  (hero: HeroModelRecord) =>
  (curr_select_id: string | number) =>
    pipe_ (
      curr_select_id,
      ensure (isString),
      bindF (lookupF (HA.skills (hero))),
      fmap (skill => SkDA.value (skill) >= 6),
      or
    )

const is3or4 = (x: string | number): x is number => x === 3 || x === 4

/**
 * Modifies the select options of specific entries to match current conditions.
 */
const modifySelectOptions =
  (staticData: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (hero_magical_traditions: List<Record<ActivatableDependent>>) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>): ident<Maybe<List<Record<SelectOption>>>> => {
    const current_id = AAL.id (wiki_entry)

    const isAvailable =
      composeT (
        filterT (isEntryAvailable (SDA.books (staticData))
                                  (RA.enabledRuleBooks (HA.rules (hero)))
                                  (RA.enableAllRuleBooks (HA.rules (hero)))
                                  (SOA.src)),
        filterT (pipe (
          SOA.prerequisites,
          Maybe.all (reqs => validatePrerequisites (staticData)
                                                   (hero)
                                                   (reqs)
                                                   (current_id))
        ))
      )

    const isNoRequiredOrActiveSelection =
      composeT (isAvailable, filterT (isNotRequiredNotActive (mhero_entry)))

    const isNoRequiredSelection =
      composeT (isAvailable, filterT (isNotRequired (mhero_entry)))

    switch (current_id) {
      case AdvantageId.exceptionalSkill: {
        const hasLessThanTwoSameIdActiveSelections = filterT (areNoSameActive (mhero_entry))

        return fmap (filterMapListT (composeT (
                                      isNoRequiredSelection,
                                      hasLessThanTwoSameIdActiveSelections
                                    )))
      }

      case DisadvantageId.personalityFlaw: {
        const unique_selections = maybe (List<number> ())
                                        (pipe (
                                          getActiveSelections,
                                          filter (isNumber),
                                          nub
                                        ))
                                        (mhero_entry)

        const isInfiniteActive: (id: number) => (x: Record<SelectOption>) => boolean =
          id => x => SOA.id (x) === id && elem (id) (unique_selections)

        const isPrejudiceAndActive = isInfiniteActive (7)

        const isUnworldlyAndActive = isInfiniteActive (8)

        const isNotActiveAndMaxNotReached: (x: Record<SelectOption>) => boolean =
          x => isNotActive (mhero_entry) (x)
               && isNotRequired (mhero_entry) (x)
               && flength (unique_selections) < 2

        const filterOptions =
          composeT (
            isAvailable,
            filterT (a => isPrejudiceAndActive (a)
                          || isUnworldlyAndActive (a)
                          || isNotActiveAndMaxNotReached (a))
          )

        return fmap (filterMapListT (filterOptions))
      }

      case DisadvantageId.negativeTrait:
      case DisadvantageId.maimed:
        return fmap (filterMapListT (isNoRequiredOrActiveSelection))

      case DisadvantageId.incompetent: {
        const isAdvActive =
          pipe (lookupF (HA.advantages (hero)), isMaybeActive)

        const isNotSocialSkill = notP (isSocialSkill (staticData))

        return fmap (filterMapListT (composeT (
                                      isNoRequiredOrActiveSelection,
                                      filterT (e =>

                                        // Socially Adaptable and Inspire Confidence
                                        // require no Incompetence in social skills
                                        (isAdvActive (AdvantageId.sociallyAdaptable)
                                        || isAdvActive (AdvantageId.inspireConfidence)
                                          ? isNotSocialSkill (e)
                                          : true))
                                    )))
      }

      case SpecialAbilityId.skillSpecialization: {
        const mcounter = getActiveSecondarySelections (mhero_entry)

        return fmap (filterMapListT (composeT (
          isNoRequiredSelection,
          filterT (e => {
            const curr_select_id = SOA.id (e)

            // if mcounter is available, mhero_entry must be a Just and thus
            // there can be active selections
            if (isJust (mcounter)) {
              const counter = fromJust (mcounter)

              if (member (curr_select_id) (counter)) {
                return isAddExistSkillSpecAllowed (hero)
                                                  (counter)
                                                  (curr_select_id)
              }
            }

            // otherwise we only need to check if the skill rating is at
            // least 6, as there can't be an activated selection.
            return isAddNotExistSkillSpecAllowed (hero) (curr_select_id)
          }),
          mapT (e => {
            const curr_select_id = SOA.id (e)

            const mcounts = bind (mcounter) (lookup (curr_select_id))

            const adjustSelectOption =
              pipe (
                over (SOL.cost)
                     (isJust (mcounts)

                       // Increase cost if there are active specializations
                       // for the same skill
                       ? fmap (multiply (flength (fromJust (mcounts)) + 1))

                       // otherwise return current cost
                       : ident),
                over (SOL.applications)
                     (fmap (filter (app => {
                                     const isInactive =
                                       all (notElem<number | string>
                                             (AppA.id (app)))
                                           (mcounts)

                                     const arePrerequisitesMet =
                                       validatePrerequisites (staticData)
                                                             (hero)
                                                             (maybeToList (AppA.prerequisite (app)))
                                                             (current_id)

                                     return isInactive
                                       && arePrerequisitesMet
                                   })))
              )

            return adjustSelectOption (e)
          })
        )))
      }

      case prefixSA (SpecialAbilityId.traditionGuildMages): {
        return fmap (filterUnfamiliar (pipe (
                                        SpA.tradition,
                                        trads => notElem (MagicalTradition.General) (trads)
                                                 && notElem (MagicalTradition.GuildMages) (trads)
                                      ))
                                      (staticData))
      }

      case SpecialAbilityId.propertyKnowledge: {
        const isValidProperty =
          filterT (pipe (SOA.id, elemF<string | number> (getPropsWith3Gte10 (staticData) (hero))))

        return fmap (filterMapListT (composeT (
                                      isNoRequiredOrActiveSelection,
                                      isValidProperty
                                    )))
      }

      case SpecialAbilityId.propertyFocus: {
        const isActivePropertyKnowledge =
          filterT (notP (pipe_ (
                          hero,
                          HA.specialAbilities,
                          lookup<string> (SpecialAbilityId.propertyKnowledge),
                          isNotActive
                        )))

        return fmap (filterMapListT (composeT (
                                      isNoRequiredOrActiveSelection,
                                      isActivePropertyKnowledge
                                    )))
      }

      case SpecialAbilityId.aspectKnowledge: {
        const valid_aspects = getAspectsWith3Gte10 (staticData) (hero)

        traceShowId (valid_aspects)

        const isAspectValid = pipe (SOA.id, elemF<string | number> (valid_aspects))

        return maybe (ident as ident<Maybe<List<Record<SelectOption>>>>)
                     ((blessed_trad: Record<ActivatableDependent>) =>
                       fmap (filterMapListT (composeT (
                                              filterT (pipe (
                                                SOA.id,
                                                ensure (isNumber),
                                                bindF (pipe (
                                                  getTraditionOfAspect,
                                                  mapBlessedNumIdToTradId
                                                )),
                                                Maybe.elem (AAL.id (blessed_trad))
                                              )),
                                              isNoRequiredOrActiveSelection,
                                              filterT (isAspectValid)
                                            ))))
                     (getBlessedTradition (HA.specialAbilities (hero)))
      }

      case SpecialAbilityId.adaptionZauber: {
        const isWikiEntryFromUnfamiliarTrad =
          isUnfamiliarSpell (HA.transferredUnfamiliarSpells (hero))
                            (hero_magical_traditions)

        const isSpellAbove10 =
          pipe (
            SOA.id,
            ensure (isString),
            bindF (lookupF (HA.spells (hero))),
            maybe (false) (pipe (ASDA.value, gte (10)))
          )

        const isFromUnfamiliarTrad =
          pipe (
            SOA.id,
            ensure (isString),
            bindF (lookupF (SDA.spells (staticData))),
            maybe (false) (isWikiEntryFromUnfamiliarTrad)
          )

        return fmap (filterMapListT (composeT (
                                      isNoRequiredOrActiveSelection,
                                      filterT (isSpellAbove10),
                                      filterT (isFromUnfamiliarTrad)
                                    )))
      }

      case prefixSA (SpecialAbilityId.spellEnhancement):
      case prefixSA (SpecialAbilityId.chantEnhancement): {
        const getTargetHeroEntry = current_id === prefixSA (SpecialAbilityId.spellEnhancement)
          ? bindF (lookupF (HA.spells (hero)))
          : bindF (lookupF (HA.liturgicalChants (hero)))

        const getTargetWikiEntry:
          ((x: Maybe<string>) => Maybe<Record<Spell> | Record<LiturgicalChant>>) =
          current_id === prefixSA (SpecialAbilityId.spellEnhancement)
            ? bindF (lookupF (SDA.spells (staticData)))
            : bindF (lookupF (SDA.liturgicalChants (staticData)))

        const isNotUnfamiliar =
          (x: Record<Spell> | Record<LiturgicalChant>) =>
            LiturgicalChant.is (x)
            || !isUnfamiliarSpell (HA.transferredUnfamiliarSpells (hero))
                                  (hero_magical_traditions)
                                  (x)

        return fmap (foldr (isNoRequiredOrActiveSelection (e => {
                             const mtarget_hero_entry = getTargetHeroEntry (SOA.target (e))
                             const mtarget_wiki_entry = getTargetWikiEntry (SOA.target (e))

                             if (
                               isJust (mtarget_wiki_entry)
                               && isJust (mtarget_hero_entry)
                               && isNotUnfamiliar (fromJust (mtarget_wiki_entry))
                               && ASDA.value (fromJust (mtarget_hero_entry))
                                  >= maybe (0)
                                           (pipe (multiply (4), add (4)))
                                           (SOA.level (e))
                             ) {
                               const target_wiki_entry = fromJust (mtarget_wiki_entry)

                               return consF (
                                 set (SOL.name)
                                     (`${SpAL.name (target_wiki_entry)}: ${SOA.name (e)}`)
                                     (e)
                               )
                             }

                             return ident as ident<List<Record<SelectOption>>>
                           }))
                           (List ()))
      }

      case SpecialAbilityId.languageSpecializations: {
        return pipe_ (
          staticData,
          SDA.specialAbilities,
          lookup<string> (SpecialAbilityId.language),
          bindF (AAL.select),
          maybe (cnst (Nothing) as ident<Maybe<List<Record<SelectOption>>>>)
                (current_select => {
                  const available_langs =

                          // Pair: fst = sid, snd = current_level
                    maybe (List<Pair<number, number>> ())
                          (pipe (
                            ADA.active,
                            foldr ((obj: Record<ActiveObject>) =>
                                    pipe_ (
                                      obj,
                                      AOA.tier,
                                      bindF (current_level =>
                                              pipe_ (
                                                guard (is3or4 (current_level)),
                                                thenF (AOA.sid (obj)),
                                                misNumberM,
                                                fmap (current_sid =>
                                                       consF (Pair (
                                                               current_sid,
                                                               current_level
                                                             )))
                                              )),
                                      fromMaybe (
                                        ident as ident<List<Pair<number, number>>>
                                      )
                                    ))
                                  (List ())
                          ))
                          (pipe_ (
                            hero,
                            HA.specialAbilities,
                            lookup<string> (SpecialAbilityId.language)
                          ))

                  const filterLanguages =
                    foldr (isNoRequiredOrActiveSelection
                          (e => {
                            const lang =
                              find ((l: Pair<number, number>) =>
                                     fst (l) === SOA.id (e))
                                   (available_langs)

                            if (isJust (lang)) {
                              const isMotherTongue =
                                snd (fromJust (lang)) === 4

                              if (isMotherTongue) {
                                return consF (set (SOL.cost) (Just (0)) (e))
                              }

                              return consF (e)
                            }

                            return ident as ident<List<Record<SelectOption>>>
                          }))
                          (List ())

                  return cnst (Just (filterLanguages (current_select)))
                })
        )
      }

      case SpecialAbilityId.madaschwesternStil: {
        return fmap (filterUnfamiliar (pipe (
                                        SpA.tradition,
                                        trads => notElem (MagicalTradition.General) (trads)
                                                 && notElem (MagicalTradition.Witches) (trads)
                                      ))
                                      (staticData))
      }

      case SpecialAbilityId.scholarDesMagierkollegsZuHoningen: {
        const allowed_traditions = List (
                                     MagicalTradition.Druids,
                                     MagicalTradition.Elves,
                                     MagicalTradition.Witches
                                   )

        const mtransferred_spell_trads = pipe_ (
                                           HA.specialAbilities (hero),
                                           lookup (prefixSA (SpecialAbilityId.traditionGuildMages)),
                                           bindF (pipe (ADA.active, listToMaybe)),
                                           bindF (pipe (AOA.sid, isStringM)),
                                           bindF (lookupF (SDA.spells (staticData))),
                                           fmap (SpA.tradition)
                                         )

        if (isNothing (mtransferred_spell_trads)) {
          return ident
        }

        const transferred_spell_trads = fromJust (mtransferred_spell_trads)

        // Contains all allowed trads the first spell does not have
        const trad_diff = filter (notElemF (transferred_spell_trads))
                                 (allowed_traditions)

        const has_transferred_all_traditions_allowed = fnull (trad_diff)

        return fmap (filterUnfamiliar (pipe (
                                        SpA.tradition,
                                        has_transferred_all_traditions_allowed
                                          ? trads =>
                                              notElem (MagicalTradition.General) (trads)
                                              && List.any (elemF (allowed_traditions)) (trads)
                                          : trads =>
                                              notElem (MagicalTradition.General) (trads)
                                              && List.any (elemF (trad_diff)) (trads)
                                      ))
                                      (staticData))
      }

      default:
        return fmap (filterMapListT (isNoRequiredOrActiveSelection))
    }
  }

type OtherOptionsModifier = ident<Record<InactiveActivatable>>

const getSermonOrVisionCountMax =
  (hero: HeroModelRecord) =>
  (adv_id: string) =>
  (disadv_id: string) =>
    modifyByLevel (3)
                  (lookup (adv_id) (HA.advantages (hero)))
                  (lookup (disadv_id) (HA.disadvantages (hero)))

const modifyOtherOptions =
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (adventure_points: Record<AdventurePointsCategories>) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>): Maybe<OtherOptionsModifier> => {
    const current_id = AAL.id (wiki_entry)

    switch (current_id) {
      case DisadvantageId.wenigePredigten:
        return pipe_ (
          SpecialAbilityGroup.Predigten,
          getSermonsAndVisionsCount (wiki) (hero),
          getMaxLevelForDecreaseEntry (3),
          set (IAL.maxLevel),
          Just
        )

      case DisadvantageId.wenigeVisionen:
        return pipe_ (
          SpecialAbilityGroup.Visionen,
          getSermonsAndVisionsCount (wiki) (hero),
          getMaxLevelForDecreaseEntry (3),
          set (IAL.maxLevel),
          Just
        )

      case DisadvantageId.smallSpellSelection: {
        return pipe_ (
          hero,
          countActiveSkillEntries ("spells"),
          getMaxLevelForDecreaseEntry (3),
          set (IAL.maxLevel),
          Just
        )
      }

      case SpecialAbilityId.craftInstruments: {
        return join (liftM2 (
                              (woodworking: Record<SkillDependent>) =>
                              (metalworking: Record<SkillDependent>) =>
                                SkDA.value (woodworking) + SkDA.value (metalworking) >= 12
                                  ? Just (ident)
                                  : Nothing
                            )
                            (pipe (HA.skills, lookup<string> (SkillId.woodworking)) (hero))
                            (pipe (HA.skills, lookup<string> (SkillId.metalworking)) (hero)))
      }

      case SpecialAbilityId.hunter: {
        return pipe_ (
          CombatTechniqueGroupId.Ranged,
          getAllEntriesByGroup (SDA.combatTechniques (wiki))
                               (HA.combatTechniques (hero)),
          filter (pipe (SkDA.value, gte (10))),
          flength,
          ensure (gt (0)),
          mapReplace (ident)
        )
      }

      case prefixSA (SpecialAbilityId.traditionGuildMages):
      case SpecialAbilityId.traditionWitches:
      case SpecialAbilityId.traditionElves:
      case SpecialAbilityId.traditionDruids:
      case SpecialAbilityId.traditionIllusionist:
      case SpecialAbilityId.traditionQabalyaMage:
      case SpecialAbilityId.traditionGeoden:
      case SpecialAbilityId.traditionZauberalchimisten:
      case SpecialAbilityId.traditionSchelme:
      case SpecialAbilityId.traditionBrobimGeoden: {
        return pipe_ (
          hero,
          HA.specialAbilities,
          getMagicalTraditionsHeroEntries,
          ensure (List.fnull),
          mapReplace (ident)
        )
      }

      case SpecialAbilityId.propertyKnowledge:
      case SpecialAbilityId.aspectKnowledge: {
        return pipe_ (
          wiki_entry,
          AAL.cost,
          bindF<number | List<number>, List<number>> (ensure (isList)),
          bindF (costs => subscript (costs)
                                    (maybe (0)
                                           (pipe (ADA.active, flength))
                                           (mhero_entry))),
          fmap (pipe (Just, set (IAL.cost)))
        )
      }

      case SpecialAbilityId.traditionChurchOfPraios:
      case SpecialAbilityId.traditionChurchOfRondra:
      case SpecialAbilityId.traditionChurchOfBoron:
      case SpecialAbilityId.traditionChurchOfHesinde:
      case SpecialAbilityId.traditionChurchOfPhex:
      case SpecialAbilityId.traditionChurchOfPeraine:
      case SpecialAbilityId.traditionChurchOfEfferd:
      case SpecialAbilityId.traditionChurchOfTravia:
      case SpecialAbilityId.traditionChurchOfFirun:
      case SpecialAbilityId.traditionChurchOfTsa:
      case SpecialAbilityId.traditionChurchOfIngerimm:
      case SpecialAbilityId.traditionChurchOfRahja:
      case SpecialAbilityId.traditionCultOfTheNamelessOne:
      case SpecialAbilityId.traditionChurchOfAves:
      case SpecialAbilityId.traditionChurchOfIfirn:
      case SpecialAbilityId.traditionChurchOfKor:
      case SpecialAbilityId.traditionChurchOfNandus:
      case SpecialAbilityId.traditionChurchOfSwafnir:
      case SpecialAbilityId.traditionCultOfNuminoru: {
        return pipe_ (
          hero,
          HA.specialAbilities,
          getBlessedTradition,
          x => isJust (x) ? Nothing : Just (ident)
        )
      }

      case SpecialAbilityId.recherchegespuer: {
        return pipe_ (
          hero,
          HA.specialAbilities,
          lookup<string> (SpecialAbilityId.wissensdurst),
          fmap (ADA.active),
          bindF (listToMaybe),
          bindF (AOA.sid),
          misStringM,
          bindF (lookupF (SDA.skills (wiki))),
          bindF (skill => pipe (
                                 bindF<number | List<number>, List<number>> (ensure (isList)),
                                 fmap (pipe (
                                        map (add (SA.ic (skill))),
                                        Just,
                                        set (IAL.cost)
                                      ))
                               )
                               (AAL.cost (wiki_entry)))
        )
      }

      case SpecialAbilityId.predigtDerGemeinschaft:
      case SpecialAbilityId.predigtDerZuversicht:
      case SpecialAbilityId.predigtDesGottvertrauens:
      case SpecialAbilityId.predigtDesWohlgefallens:
      case SpecialAbilityId.predigtWiderMissgeschicke: {
        const isAdvActive =
          pipe (lookupF (HA.advantages (hero)), isMaybeActive)

        const max =
          getSermonOrVisionCountMax (hero)
                                    (AdvantageId.zahlreichePredigten)
                                    (DisadvantageId.wenigePredigten)

        const isLessThanMax =
          countActiveGroupEntries (wiki)
                                  (hero)
                                  (SpecialAbilityGroup.Predigten) < max

        return (isAdvActive (AdvantageId.prediger) && isLessThanMax)
          || isAdvActive (AdvantageId.blessed)
          ? Just (ident)
          : Nothing
      }

      case SpecialAbilityId.visionDerBestimmung:
      case SpecialAbilityId.visionDerEntrueckung:
      case SpecialAbilityId.visionDerGottheit:
      case SpecialAbilityId.visionDesSchicksals:
      case SpecialAbilityId.visionDesWahrenGlaubens: {
        const isAdvActive =
          pipe (lookupF (HA.advantages (hero)), isMaybeActive)

        const max =
          getSermonOrVisionCountMax (hero)
                                    (AdvantageId.zahlreicheVisionen)
                                    (DisadvantageId.wenigeVisionen)

        const isLessThanMax =
          countActiveGroupEntries (wiki)
                                  (hero)
                                  (SpecialAbilityGroup.Visionen) < max

        return (isAdvActive (AdvantageId.visionaer) && isLessThanMax)
          || isAdvActive (AdvantageId.blessed)
          ? Just (ident)
          : Nothing
      }

      case SpecialAbilityId.dunklesAbbildDerBuendnisgabe: {
        return pipe_ (
          hero,
          HA.pact,
          fmap (pipe (PA.level, Just, set (IAL.maxLevel)))
        )
      }

      case SpecialAbilityId.traditionArcaneBard:
      case SpecialAbilityId.traditionArcaneDancer:
      case SpecialAbilityId.traditionIntuitiveMage:
      case SpecialAbilityId.traditionSavant:
      case SpecialAbilityId.traditionAnimisten: {
        return APCA.spentOnMagicalAdvantages (adventure_points) <= 25
          && APCA.spentOnMagicalDisadvantages (adventure_points) <= 25
          && pipe_ (
              hero,
              HA.specialAbilities,
              getMagicalTraditionsHeroEntries,
              fnull
            )
          ? Just (ident)
          : Nothing
      }

      default:
        return Just (ident)
    }
  }

/**
 * Calculates whether an Activatable is valid to add or not and, if valid,
 * calculates and filters necessary properties and selection lists. Returns a
 * Maybe of the result or `undefined` if invalid.
 */
export const getInactiveView =
  (staticData: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (automatic_advantages: List<string>) =>
  (required_apply_to_mag_actions: boolean) =>
  (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
  (adventure_points: Record<AdventurePointsCategories>) =>
  (validExtendedSpecialAbilities: List<string>) =>
  (hero_magical_traditions: List<Record<ActivatableDependent>>) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>): Maybe<Record<InactiveActivatable>> => {
    const current_id = AAL.id (wiki_entry)
    const current_prerequisites = AAL.prerequisites (wiki_entry)

    const max_level = isOrderedMap (current_prerequisites)
      ? validateLevel (staticData)
                      (hero)
                      (current_prerequisites)
                      (maybe<ActivatableDependent["dependencies"]> (List ())
                                                                   (ADA.dependencies)
                                                                   (mhero_entry))
                      (current_id)
      : Nothing

    const isNotValid = isAdditionDisabled (staticData)
                                          (hero)
                                          (required_apply_to_mag_actions)
                                          (validExtendedSpecialAbilities)
                                          (matching_script_and_lang_related)
                                          (wiki_entry)
                                          (mhero_entry)
                                          (max_level)

    if (!isNotValid) {
      return pipe_ (
        wiki_entry,
        AAL.select,
        modifySelectOptions (staticData)
                            (hero)
                            (hero_magical_traditions)
                            (wiki_entry)
                            (mhero_entry),
        ensure (maybe (true) (notNull)),
        fmap (select_options => InactiveActivatable ({
                                  id: current_id,
                                  name: SpAL.name (wiki_entry),
                                  cost: AAL.cost (wiki_entry),
                                  maxLevel: max_level,
                                  heroEntry: mhero_entry,
                                  wikiEntry: wiki_entry as Record<RecordI<Activatable>>,
                                  selectOptions: fmapF (select_options)
                                                       (sortRecordsByName (staticData)),
                                  isAutomatic: List.elem (AAL.id (wiki_entry))
                                                         (automatic_advantages),
                                })),
        ap (modifyOtherOptions (staticData)
                               (hero)
                               (adventure_points)
                               (wiki_entry)
                               (mhero_entry)),
        bindF (ensure (pipe (IAA.maxLevel, maybe (true) (notEquals (0)))))
      )
    }

    return Nothing
  }
