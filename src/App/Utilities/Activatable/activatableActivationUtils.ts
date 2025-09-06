/**
 * Handles activation, deactivation and level change of active `Activatable`
 * entries.
 *
 * @file src/Utilities/activatableActivationUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { equals, notEquals } from "../../../Data/Eq"
import { flip, ident } from "../../../Data/Function"
import { over, set } from "../../../Data/Lens"
import { append, consF, deleteAt, empty, find, List, modifyAt, subscriptF } from "../../../Data/List"
import { alt, any, bindF, fromMaybe, Just, Maybe, maybe, Nothing } from "../../../Data/Maybe"
import { isOrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { ActivatableDependent, ActivatableDependentL } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject, ActiveObjectL } from "../../Models/ActiveEntries/ActiveObject"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { Advantage } from "../../Models/Wiki/Advantage"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { Activatable, AllRequirements } from "../../Models/Wiki/wikiTypeHelpers"
import { addDependencies, removeDependencies } from "../Dependencies/dependencyUtils"
import { adjustEntryDef } from "../heroStateUtils"
import { pipe, pipe_ } from "../pipe"
import { flattenPrerequisites } from "../Prerequisites/flattenPrerequisites"
import { getGeneratedPrerequisites } from "../Prerequisites/prerequisitesUtils"
import { convertUIStateToActiveObject } from "./activatableConvertUtils"

const AOA = ActiveObject.A
const { tier } = ActiveObject.AL
const AAL = Advantage.AL
const SOA = SelectOption.A
const { id, prerequisites } = Advantage.AL
const { active } = ActivatableDependent.AL

const getStaticPrerequisites =
  (entry: Record<ActiveObject>) =>
    flattenPrerequisites (alt (tier (entry)) (Just (1)))
                         (Nothing)

const getPrerequisitesFromSelectOption =
  (wiki_entry: Activatable) =>
  (entry: Record<ActiveObject>): List<AllRequirements> =>
    pipe_ (
      entry,
      AOA.sid,
      bindF (sid => pipe_ (
                      wiki_entry,
                      AAL.select,
                      bindF (find (pipe (SOA.id, equals (sid))))
                    )),
      bindF (SOA.prerequisites),
      fromMaybe (List ()),
    )

/**
 * Get matching flattened final static and dynamic prerequisites.
 */
export const getCombinedPrerequisites =
  (add: boolean) =>
  (static_data: StaticDataRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Maybe<Record<ActivatableDependent>>) =>
  (entry: Record<ActiveObject>): List<AllRequirements> =>
    pipe_ (
      getStaticPrerequisites (entry)
                             (prerequisites (wiki_entry)),
      append (getPrerequisitesFromSelectOption (wiki_entry)
                                               (entry)),
      append (fromMaybe<List<AllRequirements>> (empty)
                                               (getGeneratedPrerequisites (add)
                                                                          (static_data)
                                                                          (wiki_entry)
                                                                          (hero_entry)
                                                                          (entry))),
    )

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
  (static_data: StaticDataRecord) =>
  (entry: Record<ActiveObject>) =>
  (wiki_entry: Activatable) =>
  (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
    pipe (
      // modify the list of `ActiveObjects` and pass the hero
      // to `changeDependencies` so that it can apply all the
      // dependencies to the updated hero
      adjustEntryDef (over (ActivatableDependentL.active) (modifyActiveObjects))
                     (id (wiki_entry)),

                         // Source id
      modifyDependencies (id (wiki_entry))

                         // get the prerequisites that need to be applied as
                         // dependencies to all objects the activation or
                         // deactivation depends on
                         (getCombinedPrerequisites (add)
                                                   (static_data)
                                                   (wiki_entry)
                                                   (mhero_entry)
                                                   (entry))
    )

/**
 * Activates the entry with the given parameters and adds all needed
 * dependencies.
 * @param entry The `ActiveObject`.
 */
export const activateByObject =
  (entry: Record<ActiveObject>) =>
    flip (changeActiveLength (addDependencies)
                             (consF (entry))
                             (true))
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
  (static_data: StaticDataRecord) =>
  (index: number) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Record<ActivatableDependent>) =>
  (hero: HeroModelRecord) =>
    maybe (hero)
          ((active_entry: Record<ActiveObject>) =>
            changeActiveLength (removeDependencies)
                               (deleteAt (index))
                               (false)
                               (static_data)
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

    if (any (notEquals (new_level)) (prev_level)) {
      if (isOrderedMap (current_prerequisites)) {
        const flatPrerequisites = flattenPrerequisites (Just (new_level))
                                                       (prev_level)
                                                       (current_prerequisites)

        if (Maybe.fromJust (prev_level) > new_level) {
          return removeDependencies (id (wiki_entry))
                                    (flatPrerequisites)
                                    (hero_modified)
        }
        else {
          return addDependencies (id (wiki_entry))
                                 (flatPrerequisites)
                                 (hero_modified)
        }
      }
      else {
        return hero_modified
      }
    }
    else {
      return hero
    }
  }

export function saveRule (
    rule: string,
    hero: HeroModelRecord,
    index: number,
    itemId: string
  ): HeroModelRecord {
  return adjustEntryDef (over (ActivatableDependentL.active)
    (modifyAt (index)
      (set (ActiveObjectL.sid2)
        (Just (rule)))))
  (itemId)
  (hero)
}
