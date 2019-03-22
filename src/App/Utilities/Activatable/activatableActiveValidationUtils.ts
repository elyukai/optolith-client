/**
 * Contains helper functions for calculating restrictions of changing active
 * `Activatables`: Minimum level, maximum level and if the entry can be removed.
 *
 * @author Lukas Obermann
 */

import { pipe } from "ramda";
import { equals } from "../../../Data/Eq";
import { flip, thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { any, countWith, elem, filter, find, flength, foldl, intersect, isList, List, sdelete } from "../../../Data/List";
import { alt, altF, bindF, ensure, fromJust, isJust, Just, liftM2, Maybe, Nothing, or, sum } from "../../../Data/Maybe";
import { elems, isOrderedMap, lookupF } from "../../../Data/OrderedMap";
import { size } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { ActivatableDependent, isActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId";
import { DependencyObject } from "../../Models/ActiveEntries/DependencyObject";
import { SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActivatableDependency, Dependent } from "../../Models/Hero/heroTypeHelpers";
import { Pact } from "../../Models/Hero/Pact";
import { ActivatableActivationValidation } from "../../Models/View/ActivatableActivationValidationObject";
import { ExperienceLevel } from "../../Models/Wiki/ExperienceLevel";
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { isSpecialAbility, SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable, AllRequirementObjects, EntryWithCategory, LevelAwarePrerequisites, SID } from "../../Models/Wiki/wikiTypeHelpers";
import { countActiveGroupEntries } from "../entryGroupUtils";
import { getAllEntriesByGroup, getHeroStateItem, mapListByIdKeyMap } from "../heroStateUtils";
import { ifElse } from "../ifElse";
import { isOwnTradition } from "../Increasable/liturgicalChantUtils";
import { add, gt, gte, inc, lt, subtract, subtractBy } from "../mathUtils";
import { notP } from "../not";
import { flattenPrerequisites } from "../Prerequisites/flattenPrerequisites";
import { setPrerequisiteId } from "../Prerequisites/setPrerequisiteId";
import { validateLevel, validateObject } from "../Prerequisites/validatePrerequisitesUtils";
import { isBoolean, isObject } from "../typeCheckUtils";
import { getWikiEntry, isActivatableWikiEntry } from "../WikiUtils";
import { countActiveSkillEntries } from "./activatableSkillUtils";
import { isStyleValidToRemove } from "./ExtendedStyleUtils";
import { isActive } from "./isActive";
import { getActiveSelections } from "./selectionUtils";
import { getBlessedTraditionFromWiki, getMagicalTraditions } from "./traditionUtils";

const hasRequiredMinimumLevel =
  (min_level: Maybe<number>) => (max_level: Maybe<number>): boolean =>
    isJust (max_level) && isJust (min_level)

const { blessings, cantrips, liturgicalChants, specialAbilities, pact } = HeroModel.A
const { specialAbilities: wiki_specialAbilities } = WikiModel.A
const { maxCombatTechniqueRating, maxSkillRating } = ExperienceLevel.A
const { id, dependencies: addependencies, active: adactive } = ActivatableDependent.A
const { active: asdactive } = ActivatableSkillDependent.A
const { active: doactive, sid, sid2, tier, origin } = DependencyObject.A
const { prerequisites, tiers } = SpecialAbility.A
const { id: ra_id } = RequireActivatable.A
const { level } = Pact.A

const isRequiredByOthers =
  (current_active: Record<ActiveObject>) =>
  (state_entry: Record<ActivatableDependent>): boolean =>
    pipe (
           addependencies,
           any (
             ifElse<ActivatableDependency, boolean, boolean>
               (isBoolean)
               (e => e && flength (adactive (state_entry)) === 1)
               (e => equals (sid (current_active)) (sid (e))
                 && equals (sid2 (current_active)) (sid2 (e))
                 && equals (tier (current_active)) (tier (e))
                 || isJust (tier (e))
                 && isJust (tier (current_active))
                 && or (fmap (equals (Maybe.gte (tier (e))
                                                (tier (current_active))))
                             (doactive (e))))
           )
         )
         (state_entry)

/**
 * Checks if you can somehow remove an ActiveObject from the given entry.
 */
const isRemovalDisabledEntrySpecific =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActivatableDependent>) =>
  (active: Record<ActiveObject>): boolean => {
    const mstart_el =
      lookupF (WikiModel.A.experienceLevels (wiki))
              (HeroModel.A.experienceLevel (hero))

    switch (id (wiki_entry)) {
      // Exceptional Skill
      case "ADV_16": {
        // value of target skill
        const mvalue =
          pipe (
                 bindF (lookupF (HeroModel.A.skills (hero))),
                 fmap (SkillDependent.A.value)
               )
               (sid (active) as Maybe<string>)

        // amount of active Exceptional Skill advantages for the same skill
        const counter = countWith (pipe (sid, equals (sid (active))))
                                  (adactive (hero_entry))

        // if the maximum value is reached removal needs to be disabled
        return or (liftM2 (gte)
                          (mvalue)
                          (fmap (pipe (maxSkillRating, add (counter)))
                                (mstart_el)))
      }

      // Exceptional Combat Technique
      case "ADV_17": {
        // value of target combat technique
        const mvalue =
          pipe (
                 bindF (lookupF (HeroModel.A.combatTechniques (hero))),
                 fmap (SkillDependent.A.value)
               )
               (sid (active) as Maybe<string>)

        // if the maximum value is reached removal needs to be disabled
        return or (liftM2 (gte)
                          (mvalue)
                          (fmap (pipe (maxCombatTechniqueRating, inc))
                                (mstart_el)))
      }

      // Magical traditions
      case "SA_70":
      case "SA_255":
      case "SA_345":
      case "SA_346":
      case "SA_676":
      case "SA_677":
      case "SA_678":
      case "SA_679":
      case "SA_680":
      case "SA_681": {
        // All active tradition entries
        const traditions =
          getMagicalTraditions (HeroModel.A.specialAbilities (hero))

        const multiple_traditions = flength (traditions) > 1

        // multiple traditions are currently not supported and there must be no
        // active spell or cantrip
        return multiple_traditions
          || countActiveSkillEntries ("spells") (hero) > 0
          || size (cantrips (hero)) > 0
      }

      // Blessed traditions
      case "SA_86":
      case "SA_682":
      case "SA_683":
      case "SA_684":
      case "SA_685":
      case "SA_686":
      case "SA_687":
      case "SA_688":
      case "SA_689":
      case "SA_690":
      case "SA_691":
      case "SA_692":
      case "SA_693":
      case "SA_694":
      case "SA_695":
      case "SA_696":
      case "SA_697":
      case "SA_698": {
        // there must be no active liturgical chant or blessing
        return countActiveSkillEntries ("liturgicalChants") (hero) > 0
          || size (blessings (hero)) > 0
      }

      // Combat Style Combination
      case "SA_164": {
        const armedStyleActive = countActiveGroupEntries (wiki) (hero) (9)
        const unarmedStyleActive = countActiveGroupEntries (wiki) (hero) (10)
        const totalActive = armedStyleActive + unarmedStyleActive

        // default is 1 per group (armed/unarmed), but with this SA 1 more in
        // one group: maximum of 3, but max 2 per group. If max is reached, this
        // SA cannot be removed
        return totalActive >= 3
          || armedStyleActive >= 2
          || unarmedStyleActive >= 2
      }

      // Magical Style Combination
      case "SA_266": {
        const totalActive = countActiveGroupEntries (wiki) (hero) (13)

        // default is 1, but with this SA its 2. If it's 2 this SA is neccessary
        // and cannot be removed
        return totalActive >= 2
      }

      // Extended Blessed Special Abilities that allow to learn liturgical
      // chants of different traditions
      case "SA_623":
      case "SA_625":
      case "SA_632": {
        const mblessed_tradition =
          getBlessedTraditionFromWiki (WikiModel.A.specialAbilities (wiki))
                                      (specialAbilities (hero))

        // Wiki entries for all active liturgical chants
        const active_chants =
          pipe (
                 liturgicalChants,
                 elems,
                 filter<Record<ActivatableSkillDependent>> (asdactive),
                 mapListByIdKeyMap (WikiModel.A.liturgicalChants (wiki))
               )
               (hero)

        // If there are chants active that do not belong to the own tradition
        const mactive_unfamiliar_chants =
          fmap (pipe (isOwnTradition, notP, any, thrush (active_chants)))
               (mblessed_tradition)

        return or (mactive_unfamiliar_chants)
      }

      default:
        // if there is any dependency that disables the possibility to remove
        // the entry
        return any ((dep: ActivatableDependency) => {
                     // If there is a top-level dependency for the whole entry,
                     // it must be `true` because `false` would have prevented
                     // the entry from being added.
                     if (isBoolean (dep)) {
                       return true
                     }

                     // A Just if the depedency exists because of a list of ids
                     // in a prerequiste. Contains the source id of the object
                     // where the prerequisite is from.
                     const current_origin = origin (dep)

                     if (isJust (current_origin)) {
                       return or (
                         pipe (
                                getWikiEntry (wiki),
                                bindF<EntryWithCategory, Activatable>
                                  (ensure (isActivatableWikiEntry)),

                                // Get flat prerequisites for origin entry
                                fmap (origin_entry =>
                                  flattenPrerequisites (prerequisites (origin_entry))
                                                       (alt (tiers (origin_entry)) (Just (1)))
                                                       (Nothing)),

                                // Get the prerequisite that matches this entry
                                // to get all other options from list
                                bindF (find ((req): req is AllRequirementObjects => {
                                              if (typeof req === "string") {
                                                return false
                                              }

                                              const current_id = ra_id (req)

                                              // the id must be a list of ids
                                              // because otherwise no options in
                                              // terms of fulfilling the
                                              // prerequisite would be possible
                                              return isList (current_id)
                                                // check if the current entry's
                                                // id is actually a member of
                                                // the prerequisite
                                                && elem (id (wiki_entry))
                                                        (current_id)
                                            })),


                                // Check if there are other entries that would
                                // match the prerequisite so that this entry
                                // could be removed
                                fmap (req =>
                                  any ((x: string) =>
                                        validateObject (wiki)
                                                        (hero)
                                                        (setPrerequisiteId (x) (req))
                                                        (id (wiki_entry)))
                                      (sdelete (id (wiki_entry)) (ra_id (req) as List<string>))
                                )

                              )
                              (fromJust (current_origin))
                       )
                     }

                     // sid of the current dependency
                     const current_dep_sid = sid (dep)

                     if (Maybe.any (isList) (current_dep_sid)) {
                       // list of possible sids to fulfill the prerequisite
                       // and thus to fulfill the dependency
                       const xs = fromJust (current_dep_sid) as List<number>

                       const current_active_selections = getActiveSelections (hero_entry)

                       // there must be at least two active sids being contained
                       // in the list of possible sids so that one of them can
                       // be removed
                       const multiple_valid_for_dependency =
                         flength (intersect (current_active_selections) (xs)) > 1

                       // must be negated because it must return `false` if
                       // the dependency says it can be removed
                       return !multiple_valid_for_dependency
                     }

                     return false
                   })
                   (addependencies (hero_entry))
    }
  }

const isStyleSpecialAbilityRemovalDisabled =
  (hero: HeroModelRecord) =>
  (wiki_entry: Activatable): boolean =>
    isSpecialAbility (wiki_entry)
    && !isStyleValidToRemove (hero)
                             (Just (wiki_entry))

const getSermonsAndVisionsMinTier =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (more: boolean) =>
  (gr: number): Maybe<number> =>
    fmap (more ? subtractBy (3) : subtract (3))
         (ensure (more ? gt (3) : lt (3))
                 (countWith (isActive)
                            (getAllEntriesByGroup (wiki_specialAbilities (wiki))
                                                  (specialAbilities (state))
                                                  (gr))))

const getEntrySpecificMinimumLevel =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (x: Record<ActiveObjectWithId>): Maybe<number> => {
    switch (id (x)) {
      // Große Zauberauswahl
      case "ADV_58":
        return fmap (subtractBy (3))
                    (ensure (gt (3))
                            (countActiveSkillEntries ("spells")
                                                     (hero)))

      // Zahlreiche Predigten
      case "ADV_79":
        return getSermonsAndVisionsMinTier (wiki) (hero) (true) (24)

      // Zahlreiche Visionen
      case "ADV_80":
        return getSermonsAndVisionsMinTier (wiki) (hero) (true) (27)

      // Wenige Predigten
      case "DISADV_72":
        return getSermonsAndVisionsMinTier (wiki) (hero) (false) (24)

      // Wenige Visionen
      case "DISADV_73":
        return getSermonsAndVisionsMinTier (wiki) (hero) (false) (27)

      default:
        return Nothing
    }
  }

type isDependencyObject = (x: ActivatableDependency) => x is Record<DependencyObject>

const adjustMinimumLevelByDependencies =
  (entry: Record<ActiveObjectWithId>) =>
    flip (foldl ((min: Maybe<number>): (dep: ActivatableDependency) => Maybe<number> =>
                  pipe (
                    // dependency must include a minimum level, which only occurs
                    // in a DependencyObject
                    ensure (isObject as isDependencyObject),
                    // get the level dependency from the object and ensure it's
                    // greater than the current mininumu level and that
                    bindF (dep => bindF<number, number>
                                    (ensure (dep_level => sum (min) < dep_level
                                                          && or (liftM2<SID, SID, boolean>
                                                                  (equals)
                                                                  (sid (dep))
                                                                  (sid (entry)))))
                                    (tier (dep))),
                    // if the current dependency's level is not valid, return
                    // the current minimum
                    altF (min)
                  )))

/**
 * Get minimum valid tier.
 */
export const getMinTier =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>) =>
  (entry_dependencies: List<ActivatableDependency>): Maybe<number> =>
    pipe (adjustMinimumLevelByDependencies (entry)
                                           (entry_dependencies))
         (getEntrySpecificMinimumLevel (wiki)
                                       (hero)
                                       (entry))

/**
 * Get maximum valid tier.
 */
export const getMaxTier =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry_prerequisites: LevelAwarePrerequisites) =>
  (entry_dependencies: List<ActivatableDependency>) =>
  (entry_id: string): Maybe<number> => {
    const current_pact = pact (hero)

    if (entry_id === "SA_667" && isJust (current_pact)) {
      return Just (level (fromJust (current_pact)))
    }

    if (isOrderedMap (entry_prerequisites)) {
      return validateLevel (wiki)
                           (hero)
                           (entry_prerequisites)
                           (entry_dependencies)
                           (entry_id)
    }

    return Nothing
  }

/**
 * Checks if the given ActiveObject can be removed or changed in tier.
 * @param obj The ActiveObject with origin id.
 * @param state The current hero's state.
 */
export const getIsRemovalOrChangeDisabled =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>): Maybe<Record<ActivatableActivationValidation>> =>
    pipe (
           getWikiEntry (wiki),
           bindF<EntryWithCategory, Activatable> (ensure (isActivatableWikiEntry)),
           bindF (
             wiki_entry =>
               pipe (
                      id,
                      getHeroStateItem (hero),
                      bindF<Dependent, Record<ActivatableDependent>>
                        (ensure (isActivatableDependent)),
                      fmap (hero_entry => {
                        const minimum_level = getMinTier (wiki)
                                                         (hero)
                                                         (entry)
                                                         (addependencies (hero_entry))

                        return ActivatableActivationValidation ({
                          id: id (entry),
                          index: ActiveObjectWithId.A.index (entry),
                          cost: ActiveObjectWithId.A.cost (entry),
                          sid: ActiveObjectWithId.A.sid (entry),
                          sid2: sid2 (entry),
                          tier: tier (entry),
                          disabled:
                            // Disable if a minimum level is required
                            hasRequiredMinimumLevel (minimum_level)
                                                    (tiers (wiki_entry))

                            // Disable if other entries depend on this entry
                            || isRequiredByOthers (entry)
                                                  (hero_entry)

                            // Disable if style special ability is required for
                            // extended special abilities
                            || isStyleSpecialAbilityRemovalDisabled (hero)
                                                                    (wiki_entry)

                            // Disable if specific entry conditions disallow
                            // remove
                            || isRemovalDisabledEntrySpecific (wiki)
                                                              (hero)
                                                              (wiki_entry)
                                                              (hero_entry)
                                                              (entry),
                          minLevel: minimum_level,
                          maxLevel: getMaxTier (wiki)
                                               (hero)
                                               (prerequisites (wiki_entry))
                                               (addependencies (hero_entry))
                                               (id (entry)),
                        })
                      })
                    )
                    (entry)
           )
         )
         (id (entry))
