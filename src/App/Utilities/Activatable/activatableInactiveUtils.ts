/**
 * Get the needed options for `Activatable` entries that are available to
 * activate.
 *
 * @file src/Utilities/activatableInactiveUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { notP } from "../../../Data/Bool";
import { equals } from "../../../Data/Eq";
import { cnst, flip, ident, thrush } from "../../../Data/Function";
import { fmap, fmapF, mapReplace } from "../../../Data/Functor";
import * as IntMap from "../../../Data/IntMap";
import { over, set } from "../../../Data/Lens";
import { consF, countWith, elemF, filter, find, flength, fnull, foldr, isList, List, map, mapByIdKeyMap, notElem, notElemF, notNull, subscript } from "../../../Data/List";
import { all, bind, bindF, ensure, fromJust, fromMaybe, guard, guard_, isJust, join, Just, liftM2, listToMaybe, Maybe, maybe, Nothing, or, thenF } from "../../../Data/Maybe";
import { add, gt, gte, inc, multiply } from "../../../Data/Num";
import { alter, elems, foldrWithKey, isOrderedMap, lookup, lookupF, member, OrderedMap } from "../../../Data/OrderedMap";
import { Record, RecordI } from "../../../Data/Record";
import { filterMapListT, filterT, mapT } from "../../../Data/Transducer";
import { fst, Pair, snd, Tuple } from "../../../Data/Tuple";
import { CombatTechniqueGroup, SkillGroup, SpecialAbilityGroup } from "../../Constants/Groups";
import { AdvantageId, DisadvantageId, SkillId, SpecialAbilityId } from "../../Constants/Ids";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { Pact } from "../../Models/Hero/Pact";
import { Rules } from "../../Models/Hero/Rules";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { InactiveActivatable, InactiveActivatableL } from "../../Models/View/InactiveActivatable";
import { Advantage } from "../../Models/Wiki/Advantage";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant";
import { Skill } from "../../Models/Wiki/Skill";
import { Spell } from "../../Models/Wiki/Spell";
import { Application } from "../../Models/Wiki/sub/Application";
import { SelectOption, SelectOptionL } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable } from "../../Models/Wiki/wikiTypeHelpers";
import { composeT } from "../compose";
import { countActiveGroupEntries } from "../entryGroupUtils";
import { getAllEntriesByGroup } from "../heroStateUtils";
import { getTraditionOfAspect } from "../Increasable/liturgicalChantUtils";
import { isUnfamiliarSpell } from "../Increasable/spellUtils";
import { pipe, pipe_ } from "../pipe";
import { validateLevel, validatePrerequisites } from "../Prerequisites/validatePrerequisitesUtils";
import { isEntryAvailable } from "../RulesUtils";
import { sortRecordsByName } from "../sortBy";
import { isNumber, isString, misNumberM, misStringM } from "../typeCheckUtils";
import { getMaxLevelForDecreaseEntry, getSermonsAndVisionsCount } from "./activatableActiveValidationUtils";
import { isAdditionDisabled } from "./activatableInactiveValidationUtils";
import { getModifierByActiveLevel } from "./activatableModifierUtils";
import { countActiveSkillEntries } from "./activatableSkillUtils";
import { isMaybeActive } from "./isActive";
import { getActiveSecondarySelections, getActiveSelectionsMaybe, getRequiredSelections } from "./selectionUtils";
import { getBlessedTradition, getMagicalTraditionsHeroEntries, mapBlessedNumIdToTradId } from "./traditionUtils";

const WA = WikiModel.A
const HA = HeroModel.A

const AAL = Advantage.AL
const { aspects, ic } = LiturgicalChant.AL
const { property } = Spell.AL
const { active, dependencies } = ActivatableDependent.AL
const { value } = ActivatableSkillDependent.AL

const SOA = SelectOption.A
const AppA = Application.A
const AOA = ActiveObject.A
const SpAL = Spell.AL
const SA = Skill.A
const RA = Rules.A

const { cost: select_costL, applications, name: nameL } = SelectOptionL
const { sid } = ActiveObject.AL
const IAL = InactiveActivatableL
const { level: pact_level } = Pact.AL
const { spentOnMagicalAdvantages, spentOnMagicalDisadvantages } = AdventurePointsCategories.AL

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
    flip (foldr<number, IntMap.IntMap<number>> (flip (IntMap.insertWith (add)) (1)))
         (aspects (chant))

const addSpellToCounter = pipe (property, incMapVal)

const filterSkillsGte10 = filter<Record<ActivatableSkillDependent>> (pipe (value, gte (10)))

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
  (wiki: WikiModelRecord) =>
    pipe (
      HA.spells,
      elems,
      filterSkillsGte10,
      mapByIdKeyMap (WA.spells (wiki)),
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
  (wiki: WikiModelRecord) =>
    pipe (
      HA.liturgicalChants,
      elems,
      filterSkillsGte10,
      mapByIdKeyMap (WA.liturgicalChants (wiki)),
      foldr (addChantToCounter) (IntMap.empty),
      IntMap.foldrWithKey<number, List<number>> (k => x => x >= 3 ? consF (k) : ident)
                                                (List.empty)
    )

const is7or8 = elemF<string | number> (List (7, 8))

/**
 * Modifies the select options of specific entries to match current conditions.
 */
const modifySelectOptions =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (hero_magical_traditions: List<Record<ActivatableDependent>>) =>
  (wiki_entry: Activatable) =>
  // tslint:disable-next-line: cyclomatic-complexity
  (mhero_entry: Maybe<Record<ActivatableDependent>>): ident<Maybe<List<Record<SelectOption>>>> => {
    const current_id = AAL.id (wiki_entry)

    const isAvailable =
      composeT (
        filterT (isEntryAvailable (WA.books (wiki))
                                  (RA.enabledRuleBooks (HA.rules (hero)))
                                  (RA.enableAllRuleBooks (HA.rules (hero)))
                                  (SOA.src)),
        filterT (pipe (
          SOA.prerequisites,
          Maybe.all (reqs => validatePrerequisites (wiki)
                                                  (hero)
                                                  (reqs)
                                                  (current_id))
        ))
      )

    const isNoRequiredOrActiveSelection =
      composeT (isAvailable, filterT (isNotRequiredNotActive (mhero_entry)))

    const isNoRequiredSelection =
      composeT (isAvailable, filterT (isNotRequired (mhero_entry)))

    const isNoActiveSelection =
      isNotActive (mhero_entry)

    switch (current_id) {
      case AdvantageId.ExceptionalSkill: {
        const hasLessThanTwoSameIdActiveSelections = filterT (areNoSameActive (mhero_entry))

        return fmap (filterMapListT (composeT (
                                      isNoRequiredSelection,
                                      hasLessThanTwoSameIdActiveSelections
                                    )))
      }

      case DisadvantageId.PersonalityFlaw:
      case DisadvantageId.NegativeTrait:
      case DisadvantageId.Maimed: {
        if (current_id === DisadvantageId.PersonalityFlaw) {
          return fmap (filterMapListT (composeT (
                                        isNoRequiredSelection,
                                        filterT (e => is7or8 (SOA.id (e))
                                                      || isNoActiveSelection (e))
                                      )))
        }
        else {
          return fmap (filterMapListT (isNoRequiredOrActiveSelection))
        }
      }

      case DisadvantageId.Incompetent: {
        const isAdvActive =
          pipe (lookupF (HA.advantages (hero)), isMaybeActive)

        const isNotSocialSkill = notP (isSocialSkill (wiki))

        return fmap (filterMapListT (composeT (
                                      isNoRequiredOrActiveSelection,
                                      filterT (e =>
                                        // Socially Adaptable and Inspire Confidence
                                        // require no Incompetence in social skills
                                        (isAdvActive (AdvantageId.SociallyAdaptable)
                                        || isAdvActive (AdvantageId.InspireConfidence)
                                          ? isNotSocialSkill (e)
                                          : true))
                                    )))
      }

      case SpecialAbilityId.SkillSpecialization: {
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
                over (select_costL)
                     (isJust (mcounts)
                       // Increase cost if there are active specializations
                       // for the same skill
                       ? fmap (multiply (flength (fromJust (mcounts)) + 1))

                       // otherwise return current cost
                       : ident),
                over (applications)
                     (fmap (filter (app => {
                                     const isInactive =
                                       all (notElem<number | string>
                                             (AppA.id (app)))
                                           (mcounts)

                                     const arePrerequisitesMet =
                                       all (pipe (
                                             validatePrerequisites (wiki)
                                                                   (hero),
                                             thrush (current_id)
                                           ))
                                           (AppA.prerequisites (app))

                                     return isInactive
                                       && arePrerequisitesMet
                                   })))
              )

            return adjustSelectOption (e)
          })
        )))
      }

      case SpecialAbilityId.PropertyKnowledge: {
        const isValidProperty =
          filterT (pipe (SOA.id, elemF<string | number> (getPropsWith3Gte10 (wiki) (hero))))

        return fmap (filterMapListT (composeT (
                                      isNoRequiredOrActiveSelection,
                                      isValidProperty
                                    )))
      }

      case SpecialAbilityId.PropertyFocus: {
        const isActivePropertyKnowledge =
          filterT (notP (pipe_ (
                          hero,
                          HA.specialAbilities,
                          lookup<string> (SpecialAbilityId.PropertyKnowledge),
                          isNotActive
                        )))

        return fmap (filterMapListT (composeT (
                                      isNoRequiredOrActiveSelection,
                                      isActivePropertyKnowledge
                                    )))
      }

      case SpecialAbilityId.AspectKnowledge: {
        const valid_aspects = getAspectsWith3Gte10 (wiki) (hero)

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

      case SpecialAbilityId.AdaptionZauber: {
        const isWikiEntryFromUnfamiliarTrad = isUnfamiliarSpell (hero_magical_traditions)

        const isSpellAbove10 =
          pipe (
            SOA.id,
            ensure (isString),
            bindF (lookupF (HA.spells (hero))),
            maybe (false) (pipe (value, gte (10)))
          )

        const isFromUnfamiliarTrad =
          pipe (
            SOA.id,
            ensure (isString),
            bindF (lookupF (WA.spells (wiki))),
            maybe (false) (isWikiEntryFromUnfamiliarTrad)
          )

        return fmap (filterMapListT (composeT (
                                      isNoRequiredOrActiveSelection,
                                      filterT (isSpellAbove10),
                                      filterT (isFromUnfamiliarTrad)
                                    )))
      }

      case SpecialAbilityId.SpellExtensions:
      case SpecialAbilityId.ChantExtensions: {
        const getTargetHeroEntry = current_id === SpecialAbilityId.SpellExtensions
          ? bindF (lookupF (HA.spells (hero)))
          : bindF (lookupF (HA.liturgicalChants (hero)))

        const getTargetWikiEntry:
          ((x: Maybe<string>) => Maybe<Record<Spell> | Record<LiturgicalChant>>) =
          current_id === SpecialAbilityId.SpellExtensions
            ? bindF (lookupF (WA.spells (wiki)))
            : bindF (lookupF (WA.liturgicalChants (wiki)))

        const isNotUnfamiliar =
          (x: Record<Spell> | Record<LiturgicalChant>) =>
            LiturgicalChant.is (x) || !isUnfamiliarSpell (hero_magical_traditions) (x)

        return fmap (foldr (isNoRequiredOrActiveSelection (e => {
                             const mtarget_hero_entry = getTargetHeroEntry (SOA.target (e))
                             const mtarget_wiki_entry = getTargetWikiEntry (SOA.target (e))

                             if (
                               isJust (mtarget_wiki_entry)
                               && isJust (mtarget_hero_entry)
                               && isNotUnfamiliar (fromJust (mtarget_wiki_entry))
                               && value (fromJust (mtarget_hero_entry))
                                  >= maybe (0)
                                           (pipe (multiply (4), add (4)))
                                           (SOA.level (e))
                             ) {
                               const target_wiki_entry = fromJust (mtarget_wiki_entry)

                               return consF (
                                 set (nameL)
                                     (`${SpAL.name (target_wiki_entry)}: ${SOA.name (e)}`)
                                     (e)
                               )
                             }

                             return ident as ident<List<Record<SelectOption>>>
                           }))
                           (List ()))
      }

      case SpecialAbilityId.LanguageSpecializations: {
        return pipe_ (
          wiki,
          WA.specialAbilities,
          lookup<string> (SpecialAbilityId.Language),
          bindF (AAL.select),
          maybe (cnst (Nothing) as ident<Maybe<List<Record<SelectOption>>>>)
                (current_select => {
                  const available_langs =
                          // Pair: fst = sid, snd = current_level
                    maybe (List<Pair<number, number>> ())
                          (pipe (
                            active,
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
                            lookup<string> (SpecialAbilityId.Language)
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
                                  return consF (set (select_costL) (Just (0)) (e))
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

      default:
        return fmap (filterMapListT (isNoRequiredOrActiveSelection))
    }
  }

const isSocialSkill =
  (wiki: WikiModelRecord) =>
    pipe (
      SOA.id,
      ensure (isString),
      bindF (lookupF (WA.skills (wiki))),
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
                flength (apps) < 3 && value (skill) >= (flength (apps) + 1) * 6)
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
      fmap (skill => value (skill) >= 6),
      or
    )

const is3or4 = (x: string | number): x is number => x === 3 || x === 4

type OtherOptionsModifier = ident<Record<InactiveActivatable>>

const modifyOtherOptions =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (ap: Record<AdventurePointsCategories>) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>): Maybe<OtherOptionsModifier> => {
    const current_id = AAL.id (wiki_entry)

    switch (current_id) {
      case DisadvantageId.WenigePredigten:
        return pipe_ (
          SpecialAbilityGroup.Predigten,
          getSermonsAndVisionsCount (wiki) (hero),
          getMaxLevelForDecreaseEntry (3),
          set (IAL.maxLevel),
          Just
        )

      case DisadvantageId.WenigeVisionen:
        return pipe_ (
          SpecialAbilityGroup.Visionen,
          getSermonsAndVisionsCount (wiki) (hero),
          getMaxLevelForDecreaseEntry (3),
          set (IAL.maxLevel),
          Just
        )

      case DisadvantageId.KleineZauberauswahl: {
        return pipe_ (
          hero,
          countActiveSkillEntries ("spells"),
          getMaxLevelForDecreaseEntry (3),
          set (IAL.maxLevel),
          Just
        )
      }

      case SpecialAbilityId.CraftInstruments: {
        return join (liftM2 (
                              (woodworking: Record<SkillDependent>) =>
                              (metalworking: Record<SkillDependent>) =>
                                value (woodworking) + value (metalworking) >= 12
                                  ? Just (ident)
                                  : Nothing
                            )
                            (pipe (HA.skills, lookup<string> (SkillId.Woodworking)) (hero))
                            (pipe (HA.skills, lookup<string> (SkillId.Metalworking)) (hero)))
      }

      case SpecialAbilityId.Hunter: {
        return pipe_ (
          CombatTechniqueGroup.Ranged,
          getAllEntriesByGroup (WA.combatTechniques (wiki))
                               (HA.combatTechniques (hero)),
          filter (pipe (value, gte (10))),
          flength,
          ensure (gt (0)),
          mapReplace (ident)
        )
      }

      case SpecialAbilityId.TraditionGuildMages:
      case SpecialAbilityId.TraditionWitches:
      case SpecialAbilityId.TraditionElves:
      case SpecialAbilityId.TraditionDruids:
      case SpecialAbilityId.TraditionScharlatane:
      case SpecialAbilityId.TraditionQabalyamagier:
      case SpecialAbilityId.TraditionGeoden:
      case SpecialAbilityId.TraditionZauberalchimisten:
      case SpecialAbilityId.TraditionSchelme:
      case SpecialAbilityId.TraditionBrobimGeoden: {
        return pipe (
                      HA.specialAbilities,
                      getMagicalTraditionsHeroEntries,
                      ensure (List.fnull),
                      mapReplace (ident)
                    )
                    (hero)
      }

      case SpecialAbilityId.PropertyKnowledge:
      case SpecialAbilityId.AspectKnowledge: {
        return pipe (
                      AAL.cost,
                      bindF<number | List<number>, List<number>> (ensure (isList)),
                      bindF (costs => subscript (costs)
                                                (maybe (0) (pipe (active, flength)) (mhero_entry))),
                      fmap (pipe (Just, set (IAL.cost)))
                    )
                    (wiki_entry)
      }

      case SpecialAbilityId.TraditionChurchOfPraios:
      case SpecialAbilityId.TraditionChurchOfRondra:
      case SpecialAbilityId.TraditionChurchOfBoron:
      case SpecialAbilityId.TraditionChurchOfHesinde:
      case SpecialAbilityId.TraditionChurchOfPhex:
      case SpecialAbilityId.TraditionChurchOfPeraine:
      case SpecialAbilityId.TraditionChurchOfEfferd:
      case SpecialAbilityId.TraditionChurchOfTravia:
      case SpecialAbilityId.TraditionChurchOfFirun:
      case SpecialAbilityId.TraditionChurchOfTsa:
      case SpecialAbilityId.TraditionChurchOfIngerimm:
      case SpecialAbilityId.TraditionChurchOfRahja:
      case SpecialAbilityId.TraditionCultOfTheNamelessOne:
      case SpecialAbilityId.TraditionChurchOfAves:
      case SpecialAbilityId.TraditionChurchOfIfirn:
      case SpecialAbilityId.TraditionChurchOfKor:
      case SpecialAbilityId.TraditionChurchOfNandus:
      case SpecialAbilityId.TraditionChurchOfSwafnir:
      case SpecialAbilityId.TraditionCultOfNuminoru: {
        return pipe_ (
                       hero,
                       HA.specialAbilities,
                       getBlessedTradition,
                       maybe<Maybe<OtherOptionsModifier>> (Just (ident)) (() => Nothing)
                     )
      }

      case SpecialAbilityId.Recherchegespuer: {
        return pipe (
                      HA.specialAbilities,
                      lookup<string> (SpecialAbilityId.Wissensdurst),
                      fmap (active),
                      bindF (listToMaybe),
                      bindF (sid),
                      misStringM,
                      bindF (lookupF (WA.skills (wiki))),
                      bindF (skill => pipe (
                                             bindF<number | List<number>, List<number>>
                                               (ensure (isList)),
                                             fmap (pipe (
                                                    map (add (ic (skill))),
                                                    Just,
                                                    set (IAL.cost)
                                                  ))
                                           )
                                           (AAL.cost (wiki_entry)))
                    )
                    (hero)
      }

      case SpecialAbilityId.PredigtDerGemeinschaft:
      case SpecialAbilityId.PredigtDerZuversicht:
      case SpecialAbilityId.PredigtDesGottvertrauens:
      case SpecialAbilityId.PredigtDesWohlgefallens:
      case SpecialAbilityId.PredigtWiderMissgeschicke: {
        return mapReplace (ident)
                          (guard_ (() => {
                                    const isAdvActive =
                                      pipe (lookupF (HA.advantages (hero)), isMaybeActive)

                                    const max =
                                      getModifierByActiveLevel
                                        (Just (3))
                                        (lookup<string> (AdvantageId.ZahlreichePredigten)
                                                        (HA.advantages (hero)))
                                        (lookup<string> (DisadvantageId.WenigePredigten)
                                                        (HA.disadvantages (hero)))

                                    const isLessThanMax =
                                      countActiveGroupEntries (wiki)
                                                              (hero)
                                                              (SpecialAbilityGroup.Predigten) < max

                                    return (isAdvActive (AdvantageId.Prediger) && isLessThanMax)
                                      || isAdvActive (AdvantageId.Blessed)
                                  }))
      }

      case SpecialAbilityId.VisionDerBestimmung:
      case SpecialAbilityId.VisionDerEntrückung:
      case SpecialAbilityId.VisionDerGottheit:
      case SpecialAbilityId.VisionDesSchicksals:
      case SpecialAbilityId.VisionDesWahrenGlaubens: {
        return mapReplace (ident)
                          (guard_ (() => {
                                    const isAdvActive =
                                      pipe (lookupF (HA.advantages (hero)), isMaybeActive)

                                    const max =
                                      getModifierByActiveLevel
                                        (Just (3))
                                        (lookup<string> (AdvantageId.ZahlreicheVisionen)
                                                        (HA.advantages (hero)))
                                        (lookup<string> (DisadvantageId.WenigeVisionen)
                                                        (HA.disadvantages (hero)))

                                    const isLessThanMax =
                                      countActiveGroupEntries (wiki)
                                                              (hero)
                                                              (SpecialAbilityGroup.Visionen) < max

                                    return (isAdvActive (AdvantageId.Visionaer) && isLessThanMax)
                                      || isAdvActive (AdvantageId.Blessed)
                                  }))
      }

      case SpecialAbilityId.DunklesAbbildDerBuendnisgabe: {
        return pipe (
                      HA.pact,
                      fmap (pipe (pact_level, Just, set (IAL.maxLevel)))
                    )
                    (hero)
      }

      case SpecialAbilityId.TraditionZauberbarden:
      case SpecialAbilityId.TraditionZaubertaenzer:
      case SpecialAbilityId.TraditionIntuitiveZauberer:
      case SpecialAbilityId.TraditionMeistertalentierte:
      case SpecialAbilityId.TraditionAnimisten: {
        return mapReplace (ident)
                          (guard (spentOnMagicalAdvantages (ap) <= 25
                                  && spentOnMagicalDisadvantages (ap) <= 25
                                  && pipe_ (
                                      hero,
                                      HA.specialAbilities,
                                      getMagicalTraditionsHeroEntries,
                                      fnull
                                    )))
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
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (automatic_advantages: List<string>) =>
  (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
  (adventure_points: Record<AdventurePointsCategories>) =>
  (validExtendedSpecialAbilities: List<string>) =>
  (hero_magical_traditions: List<Record<ActivatableDependent>>) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>): Maybe<Record<InactiveActivatable>> => {
    const current_id = AAL.id (wiki_entry)
    const current_prerequisites = AAL.prerequisites (wiki_entry)

    const max_level = isOrderedMap (current_prerequisites)
      ? validateLevel (wiki)
                      (hero)
                      (current_prerequisites)
                      (maybe<ActivatableDependent["dependencies"]> (List ())
                                                                   (dependencies)
                                                                   (mhero_entry))
                      (current_id)
      : Nothing

    const isNotValid = isAdditionDisabled (wiki)
                                          (hero)
                                          (validExtendedSpecialAbilities)
                                          (matching_script_and_lang_related)
                                          (wiki_entry)
                                          (mhero_entry)
                                          (max_level)

    if (!isNotValid) {
      const specificSelections = modifySelectOptions (wiki)
                                                     (hero)
                                                     (hero_magical_traditions)
                                                     (wiki_entry)
                                                     (mhero_entry)
                                                     (AAL.select (wiki_entry))

      const mmodifyOtherOptions = modifyOtherOptions (wiki)
                                                     (hero)
                                                     (adventure_points)
                                                     (wiki_entry)
                                                     (mhero_entry)


      return liftM2 ((modify: ident<Record<InactiveActivatable>>) =>
                     (select_options: Maybe<List<Record<SelectOption>>>) =>
                      modify (InactiveActivatable ({
                        id: current_id,
                        name: SpAL.name (wiki_entry),
                        cost: AAL.cost (wiki_entry),
                        maxLevel: max_level,
                        heroEntry: mhero_entry,
                        wikiEntry: wiki_entry as Record<RecordI<Activatable>>,
                        selectOptions: fmapF (select_options) (sortRecordsByName (l10n)),
                        isAutomatic: List.elem (AAL.id (wiki_entry)) (automatic_advantages),
                      })))
                    (mmodifyOtherOptions)
                    (ensure (maybe (true) (notNull)) (specificSelections))
    }

    return Nothing
  }
