/**
 * Contains helper functions for calculating restrictions of changing active
 * `Activatables`: Minimum level, maximum level and if the entry can be removed.
 *
 * @author Lukas Obermann
 */

import { not, notP } from "../../../Data/Bool"
import { equals } from "../../../Data/Eq"
import { flip, Functn, thrush } from "../../../Data/Function"
import { fmap } from "../../../Data/Functor"
import { all, any, countWith, elem, filter, find, flength, foldl, isList, List, mapByIdKeyMap, notElemF, notNull, sdelete } from "../../../Data/List"
import { alt, bind, bindF, catMaybes, ensure, fromJust, fromMaybe, isJust, isNothing, Just, liftM2, mapMaybe, Maybe, maybe, Nothing, or, sum } from "../../../Data/Maybe"
import { add, gt, gte, inc, lt, lte, max, min, subtract, subtractBy } from "../../../Data/Num"
import { elems, isOrderedMap, lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap"
import { size } from "../../../Data/OrderedSet"
import { Record } from "../../../Data/Record"
import { MagicalGroup, SpecialAbilityGroup } from "../../Constants/Groups"
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids.gen"
import { ActivatableDependent, isActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent"
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject"
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId"
import { DependencyObject } from "../../Models/ActiveEntries/DependencyObject"
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { ActivatableDependency, Dependent } from "../../Models/Hero/heroTypeHelpers"
import { Pact } from "../../Models/Hero/Pact"
import { TransferUnfamiliar, UnfamiliarGroup } from "../../Models/Hero/TransferUnfamiliar"
import { ActivatableActivationValidation } from "../../Models/View/ActivatableActivationValidationObject"
import { Advantage } from "../../Models/Wiki/Advantage"
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement"
import { SocialPrerequisite } from "../../Models/Wiki/prerequisites/SocialPrerequisite"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { Spell } from "../../Models/Wiki/Spell"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { Activatable, EntryWithCategory, LevelAwarePrerequisites, PrerequisitesWithIds, SID } from "../../Models/Wiki/wikiTypeHelpers"
import { MatchingScriptAndLanguageRelated } from "../../Selectors/activatableSelectors"
import { countActiveGroupEntries } from "../entryGroupUtils"
import { getAllEntriesByGroup, getHeroStateItem } from "../heroStateUtils"
import { prefixSA } from "../IDUtils"
import { isOwnTradition } from "../Increasable/liturgicalChantUtils"
import { ensure as newEnsure, toNewMaybe } from "../Maybe"
import { pipe, pipe_ } from "../pipe"
import { flattenPrerequisites } from "../Prerequisites/flattenPrerequisites"
import { setPrerequisiteId } from "../Prerequisites/setPrerequisiteId"
import { validateLevel, validateObject } from "../Prerequisites/validatePrerequisitesUtils"
import { isBoolean, isNumber, misNumberM, misStringM } from "../typeCheckUtils"
import { getWikiEntry, isActivatableWikiEntry } from "../WikiUtils"
import { countActiveSkillEntries } from "./activatableSkillUtils"
import { isStyleValidToRemove } from "./ExtendedStyleUtils"
import { isActive } from "./isActive"
import { findSelectOption, getActiveSelections } from "./selectionUtils"
import { getBlessedTraditionFromWiki, getMagicalTraditionsHeroEntries, isBlessedTradId, isMagicalTradId } from "./traditionUtils"

const hasRequiredMinimumLevel =
  (min_level: Maybe<number>) => (max_level: Maybe<number>): boolean =>
    isJust (max_level) && isJust (min_level)

const HA = HeroModel.A
const SDA = StaticData.A
const ELA = ExperienceLevel.A
const SOA = SelectOption.A
const AAL = Advantage.AL
const ADA = ActivatableDependent.A
const ASDA = ActivatableSkillDependent.A
const DOA = DependencyObject.A
const AOA = ActiveObject.A
const AOWIA = ActiveObjectWithId.A
const RAAL = RequireActivatable.AL
const PA = Pact.A
const SA = Spell.A
const LCA = LiturgicalChant.A
const TUA = TransferUnfamiliar.A

/**
 * Checks if you can somehow remove an ActiveObject from the given entry.
 */
const isRemovalDisabledEntrySpecific =
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  ({
    isEntryRequiringMatchingScriptAndLangActive,
    scriptsWithMatchingLanguages,
    languagesWithMatchingScripts,
    languagesWithDependingScripts,
  }: MatchingScriptAndLanguageRelated) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActivatableDependent>) =>

  // tslint:disable-next-line: cyclomatic-complexity
  (active: Record<ActiveObjectWithId>): boolean => {
    const id = AAL.id (wiki_entry)

    const mstart_el =
      lookupF (SDA.experienceLevels (wiki))
              (HA.experienceLevel (hero))

    if (isMagicalTradId (id)) {
      // All active tradition entries
      const traditions =
        getMagicalTraditionsHeroEntries (HA.specialAbilities (hero))

      const multiple_traditions = flength (traditions) > 1

      // multiple traditions are currently not supported and there must be no
      // active spell or cantrip
      return multiple_traditions
        || countActiveSkillEntries ("spells") (hero) > 0
        || size (HA.cantrips (hero)) > 0
    }
    else if (isBlessedTradId (id)) {
      // there must be no active liturgical chant or blessing
      return countActiveSkillEntries ("liturgicalChants") (hero) > 0
        || size (HA.blessings (hero)) > 0
    }

    switch (id) {
      case AdvantageId.exceptionalSkill: {
        // value of target skill
        const mvalue =
          pipe_ (
            active,
            AOWIA.sid,
            misStringM,
            bindF (lookupF (HA.skills (hero))),
            fmap (SkillDependent.AL.value)
          )

        // amount of active Exceptional Skill advantages for the same skill
        const counter = countWith (pipe (AOA.sid, equals (AOWIA.sid (active))))
                                  (ADA.active (hero_entry))

        // if the maximum value is reached removal needs to be disabled
        return or (liftM2 (gte)
                          (mvalue)
                          (fmap (pipe (ELA.maxSkillRating, add (counter)))
                                (mstart_el)))
      }

      case AdvantageId.exceptionalCombatTechnique: {
        // value of target combat technique
        const value =
          pipe_ (
            active,
            AOWIA.sid,
            misStringM,
            bindF (lookupF (HeroModel.A.combatTechniques (hero))),
            maybe (6) (SkillDependent.A.value)
          )

        // if the maximum value is reached removal needs to be disabled
        return maybe (true) (pipe (ELA.maxCombatTechniqueRating, inc, lte (value))) (mstart_el)
      }

      case SpecialAbilityId.literacy: {
        return isEntryRequiringMatchingScriptAndLangActive
          && scriptsWithMatchingLanguages.length < 2
          && toNewMaybe (AOWIA.sid (active))
              .bind (sid => newEnsure (sid, isNumber))
              .maybe (false, sid => scriptsWithMatchingLanguages.includes (sid))
      }

      case SpecialAbilityId.language: {
        const isRequiredByEntryRequiringMatchingScriptAndLanguage =
          isEntryRequiringMatchingScriptAndLangActive
          && languagesWithMatchingScripts.length < 2
          && toNewMaybe (AOWIA.sid (active))
              .bind (sid => newEnsure (sid, isNumber))
              .maybe (false, sid => languagesWithMatchingScripts.includes (sid))

        const isRequiredByDependingLanguage =
          toNewMaybe (AOWIA.sid (active))
            .bind (sid => newEnsure (sid, isNumber))
            .maybe (false, sid =>
              languagesWithDependingScripts
                .findM (languageGroupOfScript =>
                  languageGroupOfScript.includes (sid))
                .maybe (false, languageGroupOfScript =>
                  languageGroupOfScript
                    .mapMaybe (idOfGroup =>
                      toNewMaybe (find ((ao: Record<ActiveObject>) =>
                                          Maybe.elemF (AOA.sid (ao)) (idOfGroup))
                                       (ADA.active (hero_entry))))
                    .length < 2))

        return isRequiredByEntryRequiringMatchingScriptAndLanguage || isRequiredByDependingLanguage
      }

      case SpecialAbilityId.propertyKnowledge:
        return pipe_ (
          active,
          AOWIA.sid,
          misNumberM,
          maybe (false)
                (prop_id => OrderedMap.any ((spell: Record<ActivatableSkillDependent>) =>
                                             ASDA.value (spell) > 14
                                             && pipe_ (
                                                  spell,
                                                  ASDA.id,
                                                  lookupF (SDA.spells (wiki)),
                                                  maybe (true)
                                                        (pipe (SA.property, equals (prop_id)))
                                                ))
                                           (HA.spells (hero)))
        )

      case SpecialAbilityId.aspectKnowledge: {
        const all_aspcs = getActiveSelections (hero_entry)

        return pipe_ (
          active,
          AOWIA.sid,
          misNumberM,
          maybe (false)
                (aspc_id => {
                  const other_aspcs = sdelete<string | number> (aspc_id) (all_aspcs)

                  return OrderedMap.any ((chant: Record<ActivatableSkillDependent>) =>
                                          ASDA.value (chant) > 14
                                          && pipe_ (
                                               chant,
                                               ASDA.id,
                                               lookupF (SDA.liturgicalChants (wiki)),
                                               maybe (true)
                                                     (pipe (
                                                       LCA.aspects,
                                                       aspcs => elem (aspc_id) (aspcs)
                                                                && all (notElemF (other_aspcs))
                                                                       (aspcs)
                                                     ))
                                             ))
                                        (HA.liturgicalChants (hero))
                })
        )
      }

      case SpecialAbilityId.combatStyleCombination: {
        const armedStyleActive = countActiveGroupEntries (wiki)
                                                         (hero)
                                                         (SpecialAbilityGroup.CombatStylesArmed)

        const unarmedStyleActive = countActiveGroupEntries (wiki)
                                                           (hero)
                                                           (SpecialAbilityGroup.CombatStylesUnarmed)

        const totalActive = armedStyleActive + unarmedStyleActive

        // default is 1 per group (armed/unarmed), but with this SA 1 more in
        // one group: maximum of 3, but max 2 per group. If max is reached, this
        // SA cannot be removed
        return totalActive >= 3
          || armedStyleActive >= 2
          || unarmedStyleActive >= 2
      }

      case SpecialAbilityId.magicStyleCombination: {
        const totalActive = countActiveGroupEntries (wiki) (hero) (13)

        // default is 1, but with this SA its 2. If it's 2 this SA is neccessary
        // and cannot be removed
        return totalActive >= 2
      }

      // Extended Blessed Special Abilities that allow to learn liturgical
      // chants of different traditions
      case SpecialAbilityId.zugvoegel:
      case SpecialAbilityId.jaegerinnenDerWeissenMaid:
      case SpecialAbilityId.anhaengerDesGueldenen: {
        const mblessed_tradition =
          getBlessedTraditionFromWiki (SDA.specialAbilities (wiki))
                                      (HA.specialAbilities (hero))

        // Wiki entries for all active liturgical chants
        const active_chants =
          pipe_ (
            hero,
            HA.liturgicalChants,
            elems,
            filter<Record<ActivatableSkillDependent>> (ASDA.active),
            mapByIdKeyMap (SDA.liturgicalChants (wiki))
          )

        // If there are chants active that do not belong to the own tradition
        const mactive_unfamiliar_chants =
          fmap (pipe (isOwnTradition, notP, any, thrush (active_chants)))
               (mblessed_tradition)

        return or (mactive_unfamiliar_chants)
      }

      // entries transferring unfamiliar special abilities (start)

      case prefixSA (SpecialAbilityId.traditionGuildMages):
      case SpecialAbilityId.madaschwesternStil:
      case SpecialAbilityId.scholarDesMagierkollegsZuHoningen:
      case SpecialAbilityId.zaubervariabilitaet:
      case SpecialAbilityId.scholarDerHalleDesLebensZuNorburg:
      case SpecialAbilityId.scholarDesKreisesDerEinfuehlung: {
        const m_static_spell_enhancements = pipe_ (
          wiki,
          SDA.specialAbilities,
          lookup (prefixSA (SpecialAbilityId.spellEnhancement))
        )

        const active_spell_enhancements = pipe_ (
          hero,
          HA.specialAbilities,
          lookup (prefixSA (SpecialAbilityId.spellEnhancement)),
          liftM2 ((static_spell_enhancements: Record<SpecialAbility>) =>
                    pipe (
                      ADA.active,
                      mapMaybe (pipe (
                        AOA.sid,
                        misNumberM,
                        findSelectOption (static_spell_enhancements),
                        bindF (SOA.target)
                      ))
                    ))
                 (m_static_spell_enhancements),
          fromMaybe (List<string> ())
        )

        type Target = string | UnfamiliarGroup

        const targets =
          id === SpecialAbilityId.zaubervariabilitaet
            ? List<Target> (UnfamiliarGroup.Spells)
            : catMaybes (List (
                pipe_ (active, AOWIA.sid, misStringM),
                pipe_ (active, AOWIA.sid2, misStringM),
                pipe_ (active, AOWIA.sid3, misStringM)
              ))

        const target_matches_id =
          (target: Target) =>
          (spell_id: string) =>
            typeof target === "string"
              // The target must be the same …
              ? target === spell_id
              // … or it must be from the same category
              : target === UnfamiliarGroup.Spells

        const relevant_spell_enhancements = pipe_ (
          active_spell_enhancements,
          filter (spell_id => any (Functn.flip (target_matches_id) (spell_id)) (targets))
        )

        // spell enhancements must exist to possibly be a dependency
        // also, a spell must be selected and it has to have an active spell
        // enhancement to be relevant
        if (notNull (active_spell_enhancements)
            && notNull (targets)
            && notNull (relevant_spell_enhancements)) {
          const transferred = HA.transferredUnfamiliarSpells (hero)

          return pipe_ (
            relevant_spell_enhancements,
            // check for alternative transferred dependency matches for all
            // targets that would allow this entry to be removed
            all (spell_id => pipe_ (
              transferred,
              // It cannot be the same entry
              any (tu => TUA.srcId (tu) !== id && target_matches_id (TUA.id (tu)) (spell_id))
            )),
            // if all spell enhancement have alternative, it can be safely
            // removed and thus removal is "not" disabled
            not
          )
        }

        return false
      }

      default:
        return false
    }
  }

const isLevelMatched = (required_level_opt: Maybe<number>, active_level_opt: Maybe<number>) =>
  maybe (true)
        ((required_level: number) => maybe (false) (gte (required_level)) (active_level_opt))
        (required_level_opt)

const isSidMatched = (
  required_sid_opt: Maybe<string | number | List<number>>,
  active_sid_opt: Maybe<SID>
) =>
  maybe (true)
        ((required_sid: string | number | List<number>) =>
          maybe (false) (equals (required_sid)) (active_sid_opt))
        (required_sid_opt)

const isEntryDisabledByDependencies =
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Activatable) =>
  (state_entry: Record<ActivatableDependent>) =>
  (current_active: Record<ActiveObjectWithId>): boolean => {
    const active_sid_opt = AOWIA.sid (current_active)
    const active_sid2_opt = AOWIA.sid2 (current_active)
    const active_level_opt = AOWIA.tier (current_active)

    const active_num = flength (ADA.active (state_entry))

    return pipe_ (
      state_entry,
      ADA.dependencies,

      // if there is any dependency that disables the possibility to remove
      // the entry
      any (dep => {
        if (isBoolean (dep)) {
          return dep && active_num < 2
        }

        // Try to find out if the dependency object targets this entry
        const applies_to_sid1 = isSidMatched (DOA.sid (dep), active_sid_opt)
        const applies_to_sid2 = isSidMatched (DOA.sid2 (dep), active_sid2_opt)
        const applies_to_level = isLevelMatched (DOA.tier (dep), active_level_opt)

        if (applies_to_sid1 && applies_to_sid2 && applies_to_level) {
          // A Just if the depedency exists because of a list of ids
          // in a prerequiste. Contains the source id of the object
          // where the prerequisite is from.
          const current_origin = DOA.origin (dep)

          if (isJust (current_origin)) {
            return pipe_ (
              fromJust (current_origin),
              getWikiEntry (wiki),
              bindF<EntryWithCategory, Activatable>
                (ensure (isActivatableWikiEntry)),

              // Get flat prerequisites for origin entry
              fmap ((origin_entry: Activatable) =>
                flattenPrerequisites (Nothing)
                                     (alt (AAL.tiers (origin_entry)) (Just (1)))
                                     (AAL.prerequisites (origin_entry))),

              // Get the prerequisite that matches this entry
              // to get all other options from list
              bindF (find ((req): req is PrerequisitesWithIds => {
                            if (typeof req === "string" || SocialPrerequisite.is (req)) {
                              return false
                            }

                            const current_id = RAAL.id (req)

                            // the id must be a list of ids
                            // because otherwise no options in
                            // terms of fulfilling the
                            // prerequisite would be possible
                            return isList (current_id)

                              // check if the current entry's
                              // id is actually a member of
                              // the prerequisite
                              && elem (AAL.id (wiki_entry))
                                      (current_id)
                          })),

              // Check if there are other entries that would
              // match the prerequisite so that this entry
              // could be removed
              fmap ((req: PrerequisitesWithIds) =>
               !any ((x: string) =>
                      validateObject (wiki)
                                      (hero)
                                      (setPrerequisiteId (x) (req))
                                      (AAL.id (wiki_entry)))
                    (sdelete (AAL.id (wiki_entry))
                             (RAAL.id (req) as List<string>))),
              or
            )
          }

          return pipe_ (
            state_entry,
            ADA.active,
            countWith (other_active =>
              isSidMatched (DOA.sid (dep), AOA.sid (other_active))
              && isSidMatched (DOA.sid2 (dep), AOA.sid2 (other_active))
              && isLevelMatched (DOA.tier (dep), AOA.tier (other_active))),

            // If multiple entries match the dependency, the current one must be
            // one of them, another one can fulfill it so that the current one
            // can be safely removed
            lt (2)
          )
        }

        return false
      })
    )
  }

const isStyleSpecialAbilityRemovalDisabled =
  (hero: HeroModelRecord) =>
  (wiki_entry: Activatable): boolean =>
    SpecialAbility.is (wiki_entry)
    && !isStyleValidToRemove (hero)
                             (Just (wiki_entry))

export const getMinLevelForIncreaseEntry: (def: number) => (count: number) => Maybe<number> =

  // the entry allows to have more entries, which would not be possible without.
  // The minimum is simply the count - def, because if there are def + 1
  // entries, it must be at least 1, if there are def + 2 entries,
  // it must be at least 2. And if the count is not greater than def, the
  // increase entry is not used so we dont need a restriction
  def => pipe (ensure (gt (def)), fmap (subtractBy (def)))

export const getMaxLevelForDecreaseEntry: (def: number) => (count: number) => Maybe<number> =

  // the more entries the user buys, the less levels are
  // possible. If the user has 3 or more entries, the decrease entry cannot
  // be used at all. In those cases (which should not happen), the maximum
  // will be 0.
  def => pipe (subtract (def), max (0), Just)

export const getSermonsAndVisionsCount =
  (wiki: StaticDataRecord) =>
  (state: HeroModelRecord):
  (gr: number) => number =>
    pipe (
      getAllEntriesByGroup (SDA.specialAbilities (wiki))
                           (HA.specialAbilities (state)),
      countWith (isActive)
    )

const getEntrySpecificMinimumLevel =
  (staticData: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  ({
    isEntryRequiringMatchingScriptAndLangActive,
    scriptsWithMatchingLanguages,
    languagesWithMatchingScripts,
  }: MatchingScriptAndLanguageRelated) =>
  (x: Record<ActiveObjectWithId>): Maybe<number> => {
    switch (AOWIA.id (x)) {
      case AdvantageId.largeSpellSelection:
        return pipe_ (
          hero,
          countActiveSkillEntries ("spells"),
          getMinLevelForIncreaseEntry (3)
        )

      case AdvantageId.zahlreichePredigten:
        return pipe_ (
          24,
          getSermonsAndVisionsCount (staticData) (hero),
          getMinLevelForIncreaseEntry (3)
        )

      case AdvantageId.zahlreicheVisionen:
        return pipe_ (
          27,
          getSermonsAndVisionsCount (staticData) (hero),
          getMinLevelForIncreaseEntry (3)
        )

      case SpecialAbilityId.literacy: {
        return isEntryRequiringMatchingScriptAndLangActive
          && scriptsWithMatchingLanguages.length < 2
          && toNewMaybe (AOWIA.sid (x))
              .bind (sid => newEnsure (sid, isNumber))
              .maybe (false, sid => scriptsWithMatchingLanguages.includes (sid))
          ? Just (3)
          : Nothing
      }

      case SpecialAbilityId.language: {
        return isEntryRequiringMatchingScriptAndLangActive
          && languagesWithMatchingScripts.length < 2
          && toNewMaybe (AOWIA.sid (x))
              .bind (sid => newEnsure (sid, isNumber))
              .maybe (false, sid => languagesWithMatchingScripts.includes (sid))
          ? Just (3)
          : Nothing
      }

      case SpecialAbilityId.imitationszauberei:
        return pipe_ (
          hero,
          HA.spells,
          elems,
          countWith (pipe (
                      ASDA.id,
                      lookupF (SDA.spells (staticData)),
                      maybe (false)
                            (pipe (SA.gr, gr => gr === MagicalGroup.Spells))
                    )),
          ensure (gt (0))
        )

      default:
        return Nothing
    }
  }

const getEntrySpecificMaximumLevel =
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (entry_id: string): Maybe<number> => {
    switch (entry_id) {
      case DisadvantageId.smallSpellSelection:
        return pipe_ (hero, countActiveSkillEntries ("spells"), getMaxLevelForDecreaseEntry (3))

      case DisadvantageId.wenigePredigten:
        return pipe_ (24, getSermonsAndVisionsCount (wiki) (hero), getMaxLevelForDecreaseEntry (3))

      case DisadvantageId.wenigeVisionen:
        return pipe_ (27, getSermonsAndVisionsCount (wiki) (hero), getMaxLevelForDecreaseEntry (3))

      case SpecialAbilityId.dunklesAbbildDerBuendnisgabe:
        return pipe_ (hero, HA.pact, fmap (PA.level))

      default:
        return Nothing
    }
  }

type MinLevelDepSid = string | number | List<number>

const adjustMinimumLevelByDependencies =
  (entry: Record<ActiveObjectWithId>) =>
    flip (foldl ((min_level: Maybe<number>): (dep: ActivatableDependency) => Maybe<number> =>
                  pipe (

                    // dependency must include a minimum level, which only occurs
                    // in a DependencyObject
                    ensure (DependencyObject.is),

                    // get the level dependency from the object and ensure it's
                    // greater than the current minimum level and that
                    bindF (dep => bind (DOA.tier (dep))

                                                             // new min must be lower than current
                                                             // min level
                                       (ensure (dep_level => sum (min_level) < dep_level

                                                             // if the DependencyObject defines a
                                                             // sid, too, the entry must match the
                                                             // sid as well. A DependencyObject
                                                             // without a sid is valid for all
                                                             // entries (in case of calculating a
                                                             // minimum level)
                                                             && maybe (true)
                                                                      (flip (Maybe.elem)
                                                                            <MinLevelDepSid>
                                                                            (AOWIA.sid (entry)))
                                                                      (DOA.sid (dep))))),

                    // if the current dependency's level is not valid, return
                    // the current minimum
                    flip (alt) (min_level)
                  )))

/**
 * Get minimum valid tier.
 */
export const getMinTier =
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (matchingScriptAndLanguageRelated: MatchingScriptAndLanguageRelated) =>
  (entry: Record<ActiveObjectWithId>) =>
  (entry_dependencies: List<ActivatableDependency>): Maybe<number> =>
    adjustMinimumLevelByDependencies (entry)
                                     (entry_dependencies)
                                     (getEntrySpecificMinimumLevel (wiki)
                                                                  (hero)
                                                                  (matchingScriptAndLanguageRelated)
                                                                  (entry))

const minMaybe: (mx: Maybe<number>) => (my: Maybe<number>) => Maybe<number> =
  mx => my => isNothing (mx) ? my : isNothing (my) ? mx : Just (min (fromJust (mx)) (fromJust (my)))

/**
 * Get maximum valid tier.
 */
export const getMaxTier =
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (entry_prerequisites: LevelAwarePrerequisites) =>
  (entry_dependencies: List<ActivatableDependency>) =>
  (entry_id: string): Maybe<number> => {
    const entry_specific_max_level = getEntrySpecificMaximumLevel (wiki) (hero) (entry_id)

    if (isOrderedMap (entry_prerequisites)) {
      return minMaybe (entry_specific_max_level)
                      (validateLevel (wiki)
                                     (hero)
                                     (entry_prerequisites)
                                     (entry_dependencies)
                                     (entry_id))
    }

    return entry_specific_max_level
  }

/**
 * Checks if the given ActiveObject can be removed or changed in tier.
 * @param obj The ActiveObject with origin id.
 * @param state The current hero's state.
 */
export const getIsRemovalOrChangeDisabled =
  (wiki: StaticDataRecord) =>
  (hero: HeroModelRecord) =>
  (matchingScriptAndLanguageRelated: MatchingScriptAndLanguageRelated) =>
  (entry: Record<ActiveObjectWithId>): Maybe<Record<ActivatableActivationValidation>> =>
    pipe (
           getWikiEntry (wiki),
           bindF<EntryWithCategory, Activatable> (ensure (isActivatableWikiEntry)),
           bindF (
             wiki_entry =>
               pipe_ (
                 entry,
                 AOWIA.id,
                 getHeroStateItem (hero),
                 bindF<Dependent, Record<ActivatableDependent>>
                   (ensure (isActivatableDependent)),
                 fmap ((hero_entry: Record<ActivatableDependent>) => {
                   const minimum_level = getMinTier (wiki)
                                                    (hero)
                                                    (matchingScriptAndLanguageRelated)
                                                    (entry)
                                                    (ADA.dependencies (hero_entry))

                   return ActivatableActivationValidation ({
                     disabled:

                       // Disable if a minimum level is required
                       hasRequiredMinimumLevel (minimum_level)
                                               (AAL.tiers (wiki_entry))

                       // Disable if style special ability is required for
                       // extended special abilities
                       || isStyleSpecialAbilityRemovalDisabled (hero)
                                                               (wiki_entry)

                       // Disable if other entries depend on this entry
                       || isEntryDisabledByDependencies (wiki)
                                                        (hero)
                                                        (wiki_entry)
                                                        (hero_entry)
                                                        (entry)

                       // Disable if specific entry conditions disallow
                       // remove
                       || isRemovalDisabledEntrySpecific (wiki)
                                                         (hero)
                                                         (matchingScriptAndLanguageRelated)
                                                         (wiki_entry)
                                                         (hero_entry)
                                                         (entry),
                     minLevel: minimum_level,
                     maxLevel: getMaxTier (wiki)
                                          (hero)
                                          (AAL.prerequisites (wiki_entry))
                                          (ADA.dependencies (hero_entry))
                                          (AOWIA.id (entry)),
                   })
                 })
               )
           )
         )
         (AOWIA.id (entry))
