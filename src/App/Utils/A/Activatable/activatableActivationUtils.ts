/**
 * Handles activation, deactivation and level change of active `Activatable`
 * entries.
 *
 * @file src/utils/activatableActivationUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { pipe } from "ramda";
import { ident } from "../../../../Data/Function";
import { over } from "../../../../Data/Lens";
import { append, empty, List } from "../../../../Data/List";
import { alt, fromMaybe, fromMaybe_, Just, Maybe, Nothing } from "../../../../Data/Maybe";
import { OrderedMap } from "../../../../Data/OrderedMap";
import { Record } from "../../../../Data/Record";
import { ActivatableDependent, ActivatableDependentL, createPlainActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../../Models/ActiveEntries/ActiveObject";
import { HeroModelRecord } from "../../../Models/Hero/HeroModel";
import { Advantage } from "../../../Models/Wiki/Advantage";
import { Activatable, AllRequirementObjects, AllRequirements, LevelAwarePrerequisites } from "../../../Models/Wiki/wikiTypeHelpers";
import { addDependencies } from "../../Dependencies/dependencyUtils";
import { adjustEntryDef, setHeroStateItem } from "../../heroStateUtils";
import { flattenPrerequisites } from "../../P/Prerequisites/flattenPrerequisites";
import { getGeneratedPrerequisites } from "../../P/Prerequisites/prerequisitesUtils";
import { ActivatableReducer, OptionalActivatableReducer } from "../../reducerUtils";
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
  (getActive: (hero_entry: Record<ActivatableDependent>) => Record<ActiveObject>) =>
  (changeDependencies: typeof addDependencies) =>
  (changeActive: ident<List<Record<ActiveObject>>>) =>
  (add: boolean) =>
  (hero: HeroModelRecord) =>
  (wiki_entry: Activatable) =>
  (hero_entry: Maybe<Record<ActivatableDependent>>) =>
                       // Source id
    changeDependencies (id (wiki_entry))

                       // get the prerequisites that need to be applied as
                       // dependencies to all objects the activation or
                       // deactivation depends on
                       (getCombinedPrerequisites (add)
                                                 (wiki_entry)
                                                 (hero_entry)
                                                 (getActive (
                                                   fromMaybe_<Record<ActivatableDependent>>
                                                     (() => createPlainActivatableDependent
                                                       (id (wiki_entry)))
                                                     (hero_entry)
                                                 )))

                       // modify the list of `ActiveObjects` and pass the hero
                       // to `changeDependencies` so that it can apply all the
                       // dependencies to the updated hero
                       (adjustEntryDef (over (ActivatableDependentL.active) (changeActive))
                                       (id (wiki_entry))
                                       (hero))

/**
 * Activates the entry with the given parameters and adds all needed
 * dependencies.
 * @param active The `ActiveObject`.
 */
export const activateByObject =
  (active: Record<ActiveObject>): OptionalActivatableReducer =>
    changeActiveLength (
      () => active,
      DependencyUtils.addDependencies,
      arr => arappend (active),
      true
    )

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
  (index: number): ActivatableReducer => (state, wikiEntry, instance) =>
    Maybe.fromMaybe (state) (
      instance.get ("active") .subscript (index)
        .fmap (head =>
          changeActiveLength (
            () => head,
            DependencyUtils.removeDependencies,
            arr => ardeleteAt (index),
            false
          ) (state, wikiEntry, Just (instance))
        )
    )

/**
 * Changes the tier of a specific active entry and adds or removes dependencies
 * if needed.
 * @param index The index of the `ActiveObject` in `instance.active`.
 * @param tier The final tie
 */
export function setTier (index: number, tier: number): ActivatableReducer {
  return (state, wikiEntry, instance) => {
    const previousActive = instance.get ("active")
    const previousTier = previousActive
      .subscript (index)
      .bind (target => target.lookup ("tier"))

    const active = previousActive.modifyAt (
      index,
      prev => prev.insert ("tier") (tier)
    )

    const firstState = setHeroStateItem (
      instance.get ("id"),
      instance.insert ("active") (active),
      state
    )

    const prerequisites = wikiEntry.get ("prerequisites")

    console.log (
      index,
      tier,
      previousTier,
      active,
      instance.insert ("active") (active),
      firstState
    )

    if (
      Maybe.isJust (firstState)
      && Maybe.isJust (previousTier)
      && Maybe.fromJust (previousTier) !== tier
    ) {
      if (prerequisites instanceof OrderedMap) {
        const flatPrerequisites = flattenPrerequisites (prerequisites)
                                                       (previousTier)
                                                       (Just (tier))

        if (Maybe.fromJust (previousTier) > tier) {
          return DependencyUtils.removeDependencies (
            Maybe.fromJust (firstState),
            flatPrerequisites,
            instance.get ("id")
          )
        }

        return DependencyUtils.addDependencies (
          Maybe.fromJust (firstState),
          flatPrerequisites,
          instance.get ("id")
        )
      }

      return Maybe.fromJust (firstState)
    }

    return state
  }
}
