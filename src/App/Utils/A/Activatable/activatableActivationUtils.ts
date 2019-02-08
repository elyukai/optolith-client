/**
 * Handles activation, deactivation and level change of active `Activatable`
 * entries.
 *
 * @file src/utils/activatableActivationUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { pipe } from "ramda";
import { equals } from "../../../../Data/Eq";
import { ident } from "../../../../Data/Function";
import { over, set } from "../../../../Data/Lens";
import { append, consF, deleteAt, empty, List, modifyAt, subscriptF } from "../../../../Data/List";
import { alt, any, bindF, fromMaybe, Just, Maybe, maybe, Nothing } from "../../../../Data/Maybe";
import { isOrderedMap } from "../../../../Data/OrderedMap";
import { Record } from "../../../../Data/Record";
import { ActivatableDependent, ActivatableDependentL } from "../../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject, ActiveObjectL } from "../../../Models/ActiveEntries/ActiveObject";
import { HeroModelRecord } from "../../../Models/Hero/HeroModel";
import { Advantage } from "../../../Models/Wiki/Advantage";
import { Activatable, AllRequirementObjects, AllRequirements, LevelAwarePrerequisites } from "../../../Models/Wiki/wikiTypeHelpers";
import { addDependencies, removeDependencies } from "../../Dependencies/dependencyUtils";
import { adjustEntryDef } from "../../heroStateUtils";
import { flattenPrerequisites } from "../../P/Prerequisites/flattenPrerequisites";
import { getGeneratedPrerequisites } from "../../P/Prerequisites/prerequisitesUtils";
import { convertUIStateToActiveObject } from "./activatableConvertUtils";

const { tier } = ActiveObject.A
const { id, prerequisites } = Advantage.A
const { active } = ActivatableDependent.A

export interface ActivatableActivatePayload extends ActivatableActivateOptions {
  wiki: Activatable
  instance?: Record<ActivatableDependent>
}

export interface ActivatableActivateOptions {
  id: string
  sel?: string | number
  sel2?: string | number
  input?: string
  tier?: number
  cost: number
  customCost?: number
}

const getStaticPrerequisites =
  (entry: Record<ActiveObject>) =>
  (entry_prerequisites: LevelAwarePrerequisites): List<AllRequirements> =>
    flattenPrerequisites (entry_prerequisites)
                         (alt (tier (entry)) (Just (1)))
                         (Nothing)

/**
 * Get matching flattened final static and dynamic prerequisites.
 */
export const getCombinedPrerequisites =
  (add: boolean) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Maybe<Record<ActivatableDependent>>) =>
  (entry: Record<ActiveObject>): List<AllRequirements> =>
    append (getStaticPrerequisites (entry)
                                   (prerequisites (wiki_entry)))
           (fromMaybe<List<AllRequirementObjects>> (empty)
                                                   (getGeneratedPrerequisites (add)
                                                                              (wiki_entry)
                                                                              (hero_entry)
                                                                              (entry)))

/**
 * Adds or removes active instance and related prerequisites based on passed
 * functions.
 * @param getActive
 * @param changeDependencies
 * @param changeActive
 * @param add If an entry should be added or removed.
 */
const changeActiveLength =
  (modifyDependencies: typeof addDependencies) =>
  (modifyActiveObjects: ident<List<Record<ActiveObject>>>) =>
  (add: boolean) =>
  (entry: Record<ActiveObject>) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Maybe<Record<ActivatableDependent>>) =>
  (hero: HeroModelRecord) =>
                       // Source id
    modifyDependencies (id (wiki_entry))

                       // get the prerequisites that need to be applied as
                       // dependencies to all objects the activation or
                       // deactivation depends on
                       (getCombinedPrerequisites (add)
                                                 (wiki_entry)
                                                 (hero_entry)
                                                 (entry))

                       // modify the list of `ActiveObjects` and pass the hero
                       // to `changeDependencies` so that it can apply all the
                       // dependencies to the updated hero
                       (adjustEntryDef (over (ActivatableDependentL.active) (modifyActiveObjects))
                                       (id (wiki_entry))
                                       (hero))

/**
 * Activates the entry with the given parameters and adds all needed
 * dependencies.
 * @param entry The `ActiveObject`.
 */
export const activateByObject =
  (entry: Record<ActiveObject>) =>
    changeActiveLength (addDependencies)
                       (consF (entry))
                       (true)
                       (entry)

/**
 * Activates the entry with the given parameters and adds all needed
 * dependencies.
 * @param x0 The object given by the view.
 */
export const activate = pipe (
  convertUIStateToActiveObject,
  activateByObject
)

/**
 * Deactivates the entry with the given parameters and removes all previously
 * needed dependencies.
 * @param index The index of the `ActiveObject` in `obj.active`.
 */
export const deactivate =
  (index: number) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActivatableDependent>) =>
  (hero: HeroModelRecord) =>
    maybe (hero)
          ((active_entry: Record<ActiveObject>) =>
            changeActiveLength (removeDependencies)
                               (deleteAt (index))
                               (false)
                               (active_entry)
                               (wiki_entry)
                               (Just (hero_entry))
                               (hero))
          (pipe (active, subscriptF (index)) (hero_entry))

/**
 * Changes the level of a specific active entry and adds or removes dependencies
 * if needed.
 * @param index The index of the `ActiveObject` in `instance.active`.
 * @param new_level The new level.
 */
export const setLevel =
  (index: number) =>
  (new_level: number) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActivatableDependent>) =>
  (hero: HeroModelRecord) => {
    const prev_active = active (hero_entry)

    const prev_level = bindF (tier) (subscriptF (index) (prev_active))

    const hero_modified = adjustEntryDef (over (ActivatableDependentL.active)
                                               (modifyAt (index)
                                                         (set (ActiveObjectL.tier)
                                                              (Just (new_level)))))
                                         (id (hero_entry))
                                         (hero)

    const current_prerequisites = prerequisites (wiki_entry)

    if (any (equals (new_level)) (prev_level)) {
      if (isOrderedMap (current_prerequisites)) {
        const flatPrerequisites = flattenPrerequisites (current_prerequisites)
                                                       (prev_level)
                                                       (Just (new_level))

        if (Maybe.fromJust (prev_level) > new_level) {
          return removeDependencies (id (wiki_entry))
                                    (flatPrerequisites)
                                    (hero_modified)
        }

        return addDependencies (id (wiki_entry))
                               (flatPrerequisites)
                               (hero_modified)
      }

      return hero_modified
    }

    return hero
  }
