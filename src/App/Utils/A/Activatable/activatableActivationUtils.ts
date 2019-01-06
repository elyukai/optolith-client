/**
 * Handles activation, deactivation and level change of active `Activatable`
 * entries.
 *
 * @file src/utils/activatableActivationUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { pipe } from "ramda";
import { List } from "../../../../Data/List";
import { Just, Maybe, Nothing } from "../../../../Data/Maybe";
import { OrderedMap } from "../../../../Data/OrderedMap";
import { Record } from "../../../../Data/Record";
import { ActivatableDependent, createActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../../Models/ActiveEntries/ActiveObject";
import { Activatable, AllRequirements, LevelAwarePrerequisites } from "../../../Models/Wiki/wikiTypeHelpers";
import { removeHeroStateItem, setHeroStateItem } from "../../heroStateUtils";
import { flattenPrerequisites } from "../../prerequisites/flattenPrerequisites";
import { getGeneratedPrerequisites } from "../../Prerequisites/prerequisitesUtils";
import { ActivatableReducer, OptionalActivatableReducer } from "../../reducerUtils";
import { convertUIStateToActiveObject } from "./activatableConvertUtils";

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

type ChangeActive =
  (activeArr: List<Record<ActiveObject>>) => List<Record<ActiveObject>>

const getStaticPrerequisites =
  (active: Record<ActiveObject>) =>
  (prerequisites: LevelAwarePrerequisites): List<AllRequirements> =>
    flattenPrerequisites (prerequisites) (active.lookup ("tier").alt (Just (1))) (Nothing ())

/**
 * Get matching flattened final static and dynamic prerequisites.
 * @param wikiEntry
 * @param instance
 * @param active
 */
export const getCombinedPrerequisites = (
  wikiEntry: Activatable,
  instance: Maybe<Record<ActivatableDependent>>,
  active: Record<ActiveObject>,
  add: boolean
): List<AllRequirements> =>
  Maybe.fromJust (
    Maybe.pure (
      getStaticPrerequisites (active) (wikiEntry.get ("prerequisites"))
    )
      .mappend (
        getGeneratedPrerequisites (wikiEntry, instance, active, add)
      )
  )

/**
 * Calculates changed instance.
 * @param instance
 * @param changeActive
 */
const getChangedInstance = (
  instance: Record<ActivatableDependent>,
  changeActive: ChangeActive
) => (state: Record<HeroDependent>): Record<HeroDependent> => {
  const changeInstance = pipe (
    Record.modify<ActivatableDependent, "active"> (changeActive) ("active"),
    current =>
      isActivatableDependentUnused (current)
      ? removeHeroStateItem (instance.get ("id"))
      : setHeroStateItem (instance.get ("id")) (current)
  )

  return Maybe.fromMaybe (state) (changeInstance (instance) (state))
}

/**
 * Adds or removes active instance and related prerequisites based on passed
 * functions.
 * @param getActive
 * @param changeDependencies
 * @param changeActive
 * @param add If an entry should be added or removed.
 */
const changeActiveLength = (
  getActive: (instance: Record<ActivatableDependent>) => Record<ActiveObject>,
  changeDependencies: typeof DependencyUtils.addDependencies,
  changeActive: ChangeActive,
  add: boolean
) => (
  state: Record<HeroDependent>,
  wikiEntry: Activatable,
  instance: Maybe<Record<ActivatableDependent>>
) => {
  const justInstance = Maybe.fromMaybe (createActivatableDependent (wikiEntry.get ("id")))
    (instance)

  const active = getActive (justInstance)

  return changeDependencies (
    getChangedInstance (justInstance, changeActive) (state),
    getCombinedPrerequisites (wikiEntry, instance, active, add),
    wikiEntry.get ("id")
  )
}

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
