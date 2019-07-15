/**
 * Contains helper functions for calculating restrictions of changing active
 * `Activatables`: Minimum level, maximum level and if the entry can be removed.
 *
 * @author Lukas Obermann
 */

import { notP } from "../../../Data/Bool";
import { equals } from "../../../Data/Eq";
import { flip, thrush } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { any, countWith, elem, filter, find, flength, foldl, intersect, isList, List, mapByIdKeyMap, sdelete } from "../../../Data/List";
import { alt, bind, bindF, ensure, fromJust, isJust, isNothing, Just, liftM2, Maybe, maybe, Nothing, or, sum } from "../../../Data/Maybe";
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
import { Activatable, AllRequirementObjects, EntryWithCategory, LevelAwarePrerequisites } from "../../Models/Wiki/wikiTypeHelpers";
import { countActiveGroupEntries } from "../entryGroupUtils";
import { getAllEntriesByGroup, getHeroStateItem } from "../heroStateUtils";
import { prefixSA } from "../IDUtils";
import { ifElse } from "../ifElse";
import { isOwnTradition } from "../Increasable/liturgicalChantUtils";
import { add, gt, gte, inc, lt, min, subtract, subtractBy } from "../mathUtils";
import { pipe, pipe_ } from "../pipe";
import { flattenPrerequisites } from "../Prerequisites/flattenPrerequisites";
import { setPrerequisiteId } from "../Prerequisites/setPrerequisiteId";
import { validateLevel, validateObject } from "../Prerequisites/validatePrerequisitesUtils";
import { isBoolean } from "../typeCheckUtils";
import { getWikiEntry, isActivatableWikiEntry } from "../WikiUtils";
import { countActiveSkillEntries } from "./activatableSkillUtils";
import { isStyleValidToRemove } from "./ExtendedStyleUtils";
import { isActive } from "./isActive";
import { getActiveSelections } from "./selectionUtils";
import { getBlessedTraditionFromWiki, getMagicalTraditionsHeroEntries } from "./traditionUtils";

const hasRequiredMinimumLevel =
  (min_level: Maybe<number>) => (max_level: Maybe<number>): boolean =>
    isJust (max_level) && isJust (min_level)

const { blessings, cantrips, liturgicalChants, specialAbilities, pact } = HeroModel.AL
const { specialAbilities: wiki_specialAbilities } = WikiModel.AL
const { maxCombatTechniqueRating, maxSkillRating } = ExperienceLevel.AL
const { id, dependencies: addependencies, active: adactive } = ActivatableDependent.AL
const { active: asdactive } = ActivatableSkillDependent.AL
const DOA = DependencyObject.A
const AOWIA = ActiveObjectWithId.A
const { active: doactive, sid, sid2, tier, origin } = DependencyObject.AL
const { prerequisites, tiers } = SpecialAbility.AL
const { id: ra_id } = RequireActivatable.AL
const { level } = Pact.AL

const isRequiredByOthers =
  (current_active: Record<ActiveObject>) =>
  (state_entry: Record<ActivatableDependent>): boolean =>
    pipe (
           addependencies,
           any (
             ifElse<ActivatableDependency, boolean>
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
      lookupF (WikiModel.AL.experienceLevels (wiki))
              (HeroModel.AL.experienceLevel (hero))

    switch (id (wiki_entry)) {
      // Exceptional Skill
      case "ADV_16": {
        // value of target skill
        const mvalue =
          pipe (
                 bindF (lookupF (HeroModel.AL.skills (hero))),
                 fmap (SkillDependent.AL.value)
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
                 bindF (lookupF (HeroModel.AL.combatTechniques (hero))),
                 fmap (SkillDependent.AL.value)
               )
               (sid (active) as Maybe<string>)

        // if the maximum value is reached removal needs to be disabled
        return or (liftM2 (gte)
                          (mvalue)
                          (fmap (pipe (maxCombatTechniqueRating, inc))
                                (mstart_el)))
      }

      // Magical traditions
      case prefixSA (70):
      case prefixSA (255):
      case prefixSA (345):
      case prefixSA (346):
      case prefixSA (676):
      case prefixSA (677):
      case prefixSA (678):
      case prefixSA (679):
      case prefixSA (680):
      case prefixSA (681):
      case prefixSA (1255):
      case prefixSA (750):
      case prefixSA (726):
      case prefixSA (1221): {
        // All active tradition entries
        const traditions =
          getMagicalTraditionsHeroEntries (HeroModel.AL.specialAbilities (hero))

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
      case "SA_698":
      case "SA_1049": {
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
          getBlessedTraditionFromWiki (WikiModel.AL.specialAbilities (wiki))
                                      (specialAbilities (hero))

        // Wiki entries for all active liturgical chants
        const active_chants =
          pipe (
                 liturgicalChants,
                 elems,
                 filter<Record<ActivatableSkillDependent>> (asdactive),
                 mapByIdKeyMap (WikiModel.AL.liturgicalChants (wiki))
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
                                  flattenPrerequisites (Nothing)
                                                       (alt (tiers (origin_entry)) (Just (1)))
                                                       (prerequisites (origin_entry))),

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

      default:
        return Nothing
    }
  }

const getEntrySpecificMaximumLevel =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry_id: string): Maybe<number> => {
    switch (entry_id) {
      // Wenige Predigten
      case "DISADV_72":
        return getSermonsAndVisionsMinTier (wiki) (hero) (false) (24)

      // Wenige Visionen
      case "DISADV_73":
        return getSermonsAndVisionsMinTier (wiki) (hero) (false) (27)

      // Dunkles Abbild der Bündnisgabe
      case "SA_667":
        return pipe_ (hero, pact, fmap (level))

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
                                                             && maybe (false)
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
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>) =>
  (entry_dependencies: List<ActivatableDependency>): Maybe<number> =>
    adjustMinimumLevelByDependencies (entry)
                                     (entry_dependencies)
                                     (getEntrySpecificMinimumLevel (wiki)
                                                                   (hero)
                                                                   (entry))

const minMaybe: (mx: Maybe<number>) => (my: Maybe<number>) => Maybe<number> =
  mx => my => isNothing (mx) ? my : isNothing (my) ? mx : Just (min (fromJust (mx)) (fromJust (my)))

/**
 * Get maximum valid tier.
 */
export const getMaxTier =
  (wiki: WikiModelRecord) =>
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
