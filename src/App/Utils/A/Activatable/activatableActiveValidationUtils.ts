/**
 * Contains helper functions for calculating restrictions of changing active
 * `Activatables`: Minimum level, maximum level and if the entry can be removed.
 *
 * @author Lukas Obermann
 */

import { pipe } from "ramda";
import { equals } from "../../../../Data/Eq";
import { thrush } from "../../../../Data/Function";
import { any, countWith, filter, length, List } from "../../../../Data/List";
import { bindF, fmap, isJust, liftM2, Maybe, or } from "../../../../Data/Maybe";
import { elems, lookupF } from "../../../../Data/OrderedMap";
import { size } from "../../../../Data/OrderedSet";
import { Record } from "../../../../Data/Record";
import { ActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../../Models/ActiveEntries/ActiveObject";
import { ActiveObjectWithId } from "../../../Models/ActiveEntries/ActiveObjectWithId";
import { DependencyObject } from "../../../Models/ActiveEntries/DependencyObject";
import { SkillDependent } from "../../../Models/ActiveEntries/SkillDependent";
import { HeroModel, HeroModelRecord } from "../../../Models/Hero/HeroModel";
import { ActivatableActivationValidationObject, ActivatableDependency } from "../../../Models/Hero/heroTypeHelpers";
import { ExperienceLevel } from "../../../Models/Wiki/ExperienceLevel";
import { isSpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { WikiModel, WikiModelRecord } from "../../../Models/Wiki/WikiModel";
import { Activatable, LevelAwarePrerequisites } from "../../../Models/Wiki/wikiTypeHelpers";
import { countActiveGroupEntries } from "../../entryGroupUtils";
import { getAllEntriesByGroup, getHeroStateItem, mapListByIdKeyMap } from "../../heroStateUtils";
import { ifElse } from "../../ifElse";
import { isOwnTradition } from "../../Increasable/liturgicalChantUtils";
import { match } from "../../match";
import { add, gte, inc } from "../../mathUtils";
import { notP } from "../../not";
import { validateLevel } from "../../Prerequisites/validatePrerequisitesUtils";
import { isBoolean, isObject } from "../../typeCheckUtils";
import { getWikiEntry } from "../../WikiUtils";
import { countActiveSkillEntries } from "./activatableSkillUtils";
import { isStyleValidToRemove } from "./ExtendedStyleUtils";
import { isActive } from "./isActive";
import { getBlessedTraditionFromWiki, getMagicalTraditions } from "./traditionUtils";

const hasRequiredMinimumLevel =
  (minTier: Maybe<number>) => (tiers: Maybe<number>): boolean =>
    isJust (tiers) && isJust (minTier)

const { blessings, cantrips, liturgicalChants, specialAbilities } = HeroModel.A
const { maxCombatTechniqueRating, maxSkillRating } = ExperienceLevel.A
const { id, dependencies: addependencies, active: adactive } = ActivatableDependent.A
const { active: asdactive } = ActivatableSkillDependent.A
const { active: doactive, sid, sid2, tier } = DependencyObject.A

const isRequiredByOthers =
  (current_active: Record<ActiveObject>) =>
  (state_entry: Record<ActivatableDependent>): boolean =>
    pipe (
           addependencies,
           any (
             ifElse<ActivatableDependency, boolean, boolean>
               (isBoolean)
               (e => e && length (adactive (state_entry)) === 1)
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
 * Even if the entry itself is valid, it might be that there is a minimum level
 * required or that other entries depend on this entry.
 */
const isSuperRemoveDisabled =
  (levels: Maybe<number>) =>
  (minimum_level: Maybe<number>) =>
  (hero_entry: Record<ActivatableDependent>) =>
  (active: Record<ActiveObject>) =>
    // Disable if a minimum level is required
    hasRequiredMinimumLevel (minimum_level) (levels)

    // Disable if other entries depend on this entry
    || isRequiredByOthers (active) (hero_entry)

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

        const multiple_traditions = length (traditions) > 1

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
                 filter (asdactive),
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
        return false
    }

  //     .on (
  //       both (
  //         () => Maybe.fromJust<ActivatableCategory> (
  //           wiki_entry.lookup ('category')
  //         ) === Categories.SPECIAL_ABILITIES,
  //         () => equals (
  //           isStyleValidToRemove (
  //             state,
  //             Maybe.pure (wiki_entry as Record<SpecialAbility>)
  //           ),
  //           false
  //         )
  //       ),
  //       T
  //     )
  //     .otherwise (
  //       () => state_entry .get ('dependencies')
  //         .any (dep => {
  //           if (typeof dep === 'object' && Maybe.isJust (dep .lookup ('origin'))) {
  //             return Maybe.fromMaybe (true) (
  //               getWikiEntry<Activatable>
  //                 (wiki)
  //                 (Maybe.fromJust (dep.lookup ('origin') as Just<string>))
  //                 .bind (
  //                   originEntry => flattenPrerequisites (originEntry.get ('prerequisites'))
  //                                                       (originEntry.lookup ('tiers')
  //                                                         .alt (Just (1)))
  //                                                       (Nothing ())
  //                     .find ((r): r is AllRequirementObjects => {
  //                       if (typeof r === 'string') {
  //                         return false
  //                       }
  //                       else {
  //                         const id = r.get ('id')
  //                         const origin = dep.lookup ('origin')

  //                         return id instanceof List
  //                           && Maybe.isJust (origin)
  //                           && id.elem (Maybe.fromJust (origin))
  //                       }
  //                     })
  //                     .fmap (
  //                       (req: AllRequirementObjects) =>
  //                         (req.get ('id') as List<string>)
  //                           .foldl<number> (
  //                             acc => e => validateObject (
  //                               wiki,
  //                               state,
  //                               req.merge (Record.of ({
  //                                 id: e,
  //                               })) as AllRequirementObjects,
  //                               wiki_entry.get ('id')
  //                             ) ? acc + 1 : acc
  //                           ) (0) > 1
  //                     )
  //                 )
  //             )
  //           }
  //           else if (typeof dep === 'object') {
  //             const eSid = dep.lookup ('sid')

  //             if (Maybe.isJust (eSid) && Maybe.fromJust (eSid) instanceof List) {
  //               const list = Maybe.fromJust (eSid) as List<number>

  //               const maybeSid = active.lookup ('sid')
  //                 .bind<boolean> (sid => {
  //                   if (list.elem (sid as number)) {
  //                     return getActiveSelections (Maybe.pure (state_entry))
  //                       .fmap (
  //                         activeSelections => !activeSelections.any (
  //                           n => n !== sid && activeSelections.elem (n as number)
  //                         )
  //                       )
  //                   }
  //                   else {
  //                     return Maybe.empty ()
  //                   }
  //                 })

  //               if (Maybe.isJust (maybeSid)) {
  //                 return Maybe.fromJust (maybeSid)
  //               }
  //             }
  //           }

  //           return false
  //         })
  //     )
  // )
  }

const isStyleSpecialAbilityRemovalDisabled =
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActivatableDependent>) =>
  (active: Record<ActiveObject>): boolean =>
    isSpecialAbility (wiki_entry) && !isStyleValidToRemove ()

const getSermonsAndVisionsMinTier =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (more: boolean) =>
  (gr: number): Maybe<number> =>
  Maybe.ensure (more ? lt (3) : gt (3)) (
    getAllEntriesByGroup (
      wiki.get ('specialAbilities'),
      state.get ('specialAbilities'),
      gr
    )
      .filter (isActive)
      .length ()
  )
    .fmap (more ? add (-3) : subtract (3))

/**
 * Get minimum valid tier.
 * @param dependencies The current instance dependencies.
 */
export const getMinTier =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (obj: Record<ActiveObjectWithId>) =>
  (dependencies: List<ActivatableDependency>) =>
  (sid: Maybe<string | number>): Maybe<number> =>
    pipe (
      dependencies.foldl<Maybe<number>> (
        min => dependency =>
          Maybe.ensure (
            isObject as (e: ActivatableDependency) => e is Record<DependencyObject>
          ) (dependency)
            .bind (
              e => e.lookup ('tier')
                .bind (Maybe.ensure (
                  tier => min.alt (Maybe.pure (0))
                    .lt (Maybe.pure (tier))
                    && Maybe.isJust (e.lookup ('sid'))
                    && e.lookup ('sid')
                      .equals (sid)
                ))
            )
            .alt (min)
      )
    ) (
      match<string, Maybe<number>> (obj.get ('id'))
        .on (
          'ADV_58',
          () => Maybe.ensure (lt (3)) (countActiveSkillEntries (state, 'spells'))
            .fmap (add (-3))
        )
        .on ('ADV_79', () => getSermonsAndVisionsMinTier (
          wiki,
          state,
          true,
          24
        ))
        .on ('ADV_80', () => getSermonsAndVisionsMinTier (
          wiki,
          state,
          true,
          27
        ))
        .on ('DISADV_72', () => getSermonsAndVisionsMinTier (
          wiki,
          state,
          false,
          24
        ))
        .on ('DISADV_73', () => getSermonsAndVisionsMinTier (
          wiki,
          state,
          false,
          27
        ))
        .otherwise (Maybe.empty)
    )

/**
 * Get maximum valid tier.
 */
export const getMaxTier =
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord) =>
  (prerequisites: LevelAwarePrerequisites) =>
  (dependencies: List<ActivatableDependency>) =>
  (id: string): Maybe<number> =>
    match<string, Maybe<number>> (id)
      .on (
        both (
          equals ('SA_667'),
          always (Maybe.isJust (state.lookup ('pact')))
        ),
        () => state.lookup ('pact')
          .bind (pact => pact.lookup ('level'))
      )
      .otherwise (() => !(prerequisites instanceof List) ? validateLevel (
        wiki,
        state,
        prerequisites,
        dependencies,
        id
      ) : Maybe.empty ())

/**
 * Checks if the given ActiveObject can be removed or changed in tier.
 * @param obj The ActiveObject with origin id.
 * @param state The current hero's state.
 */
export const getIsRemovalOrChangeDisabled =
  (obj: Record<ActiveObjectWithId>) =>
  (wiki: WikiModelRecord) =>
  (state: HeroModelRecord): Maybe<Record<ActivatableActivationValidationObject>> =>
    getWikiEntry<Activatable> (wiki) (obj.get ('id'))
      .bind (
        wikiEntry => getHeroStateItem<Record<ActivatableDependent>> (
          obj.get ('id')
        ) (state)
          .fmap (instance => {
            const minTier = getMinTier (
              wiki,
              state,
              obj,
              instance.get ('dependencies'),
              obj.lookup ('sid')
            )

            return obj.mergeMaybe (Record.of ({
              disabled: isSuperRemoveDisabled (entry.lookup ('tiers')) (minTier) (instance) (active) (isRemovalDisabledEntrySpecific (
                wiki,
                state,
                wikiEntry,
                instance,
                obj as Record<any>,
                minTier
              )),
              minTier,
              maxTier: getMaxTier (
                wiki,
                state,
                wikiEntry.get ('prerequisites'),
                instance.get ('dependencies'),
                obj.get ('id')
              ),
            })) as Record<ActivatableActivationValidationObject>
          })
      )
