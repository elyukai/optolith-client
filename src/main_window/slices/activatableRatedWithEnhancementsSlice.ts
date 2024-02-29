import { ActionCreatorWithPayload, AnyAction, Draft, createAction } from "@reduxjs/toolkit"
import { ImprovementCost } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { cachedAdventurePointsForActivatableWithEnhancements } from "../../shared/domain/adventurePoints/ratedEntry.ts"
import { RegistrationMethod } from "../../shared/domain/dependencies/registrationHelpers.ts"
import {
  ActivatableRatedWithEnhancements,
  ActivatableRatedWithEnhancementsMap,
} from "../../shared/domain/rated/ratedEntry.ts"
import { Reducer, createImmerReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"
import { DatabaseState } from "./databaseSlice.ts"

/**
 * Functions for working with rated entries that can be activated and have
 * enhancements.
 */
export type ActivatableRatedWithEnhancementsSlice<N extends string, E extends string> = {
  /**
   * The actions that can be dispatched to modify the state.
   */
  actions: {
    /**
     * Add the entry with the given id.
     */
    addAction: ActionCreatorWithPayload<{ id: number }, `${N}/add${E}`>

    /**
     * Remove the entry with the given id.
     */
    removeAction: ActionCreatorWithPayload<{ id: number }, `${N}/remove${E}`>

    /**
     * Increments the value of the entry with the given id.
     */
    incrementAction: ActionCreatorWithPayload<{ id: number }, `${N}/increment${E}`>

    /**
     * Decrements the value of the entry with the given id.
     */
    decrementAction: ActionCreatorWithPayload<{ id: number }, `${N}/decrement${E}`>

    /**
     * Sets the value of the entry with the given id.
     */
    setAction: ActionCreatorWithPayload<{ id: number; value: number }, `${N}/set${E}`>
  }

  /**
   * The reducer that handles the actions.
   */
  reducer: Reducer<CharacterState, AnyAction, [database: DatabaseState]>
}

/**
 * Creates a slice for a map of rated entries.
 */
export const createActivatableRatedWithEnhancementsSlice = <
  N extends string,
  E extends string,
  P,
  IdO extends { tag: string },
>(config: {
  namespace: N
  entityName: E
  getState: (state: Draft<CharacterState>) => Draft<ActivatableRatedWithEnhancementsMap>
  getImprovementCost: (id: number, database: DatabaseState) => ImprovementCost
  getEnhancementAdventurePointsModifier: (
    id: number,
    enhancementId: number,
    database: DatabaseState,
  ) => number
  getPrerequisites: (id: number, database: DatabaseState) => P[]
  createIdentifierObject: (id: number) => IdO
  registerOrUnregisterPrerequisitesAsDependencies: (
    method: RegistrationMethod,
    character: Draft<CharacterState>,
    prerequisites: P[],
    sourceId: IdO,
  ) => void
  createEmptyActivatableRatedWithEnhancements: (id: number) => ActivatableRatedWithEnhancements
}): ActivatableRatedWithEnhancementsSlice<N, E> => {
  const updateCachedAdventurePoints = (
    entry: Draft<ActivatableRatedWithEnhancements>,
    database: DatabaseState,
  ) => {
    entry.cachedAdventurePoints = cachedAdventurePointsForActivatableWithEnhancements(
      entry.value,
      entry.boundAdventurePoints,
      config.getImprovementCost(entry.id, database),
      Object.values(entry.enhancements).map(enhancement => enhancement.id),
      enhancementId =>
        config.getEnhancementAdventurePointsModifier(entry.id, enhancementId, database),
    )
    return entry
  }

  const addAction = createAction<{ id: number }, `${N}/add${E}`>(
    `${config.namespace}/add${config.entityName}`,
  )

  const removeAction = createAction<{ id: number }, `${N}/remove${E}`>(
    `${config.namespace}/remove${config.entityName}`,
  )

  const incrementAction = createAction<{ id: number }, `${N}/increment${E}`>(
    `${config.namespace}/increment${config.entityName}`,
  )

  const decrementAction = createAction<{ id: number }, `${N}/decrement${E}`>(
    `${config.namespace}/decrement${config.entityName}`,
  )

  const setAction = createAction<{ id: number; value: number }, `${N}/set${E}`>(
    `${config.namespace}/set${config.entityName}`,
  )

  const reducer = createImmerReducer(
    (state: Draft<CharacterState>, action, database: DatabaseState) => {
      if (addAction.match(action)) {
        config.getState(state)[action.payload.id] ??=
          config.createEmptyActivatableRatedWithEnhancements(action.payload.id)
        config.registerOrUnregisterPrerequisitesAsDependencies(
          RegistrationMethod.Add,
          state,
          config.getPrerequisites(action.payload.id, database),
          config.createIdentifierObject(action.payload.id),
        )
      } else if (removeAction.match(action)) {
        config.registerOrUnregisterPrerequisitesAsDependencies(
          RegistrationMethod.Remove,
          state,
          config.getPrerequisites(action.payload.id, database),
          config.createIdentifierObject(action.payload.id),
        )
        delete config.getState(state)[action.payload.id]
      } else if (incrementAction.match(action)) {
        const entry = (config.getState(state)[action.payload.id] ??=
          config.createEmptyActivatableRatedWithEnhancements(action.payload.id))
        if (entry.value === undefined) {
          entry.value = 0
        } else {
          entry.value++
        }
        updateCachedAdventurePoints(entry, database)
      } else if (decrementAction.match(action)) {
        const entry = config.getState(state)[action.payload.id]
        if (entry !== undefined && entry.value !== undefined && entry.value > 0) {
          entry.value--
          updateCachedAdventurePoints(entry, database)
        }
      } else if (setAction.match(action)) {
        const entry = (config.getState(state)[action.payload.id] ??=
          config.createEmptyActivatableRatedWithEnhancements(action.payload.id))
        if (action.payload.value >= 0) {
          entry.value = action.payload.value
          updateCachedAdventurePoints(entry, database)
        }
      }
    },
  )

  return {
    actions: {
      addAction,
      removeAction,
      incrementAction,
      decrementAction,
      setAction,
    },
    reducer,
  }
}
