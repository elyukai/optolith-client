import { ActionCreatorWithPayload, Draft, UnknownAction, createAction } from "@reduxjs/toolkit"
import { ImprovementCost } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { cachedAdventurePointsForActivatable } from "../../shared/domain/adventurePoints/ratedEntry.ts"
import { ActivatableRated, ActivatableRatedMap } from "../../shared/domain/rated/ratedEntry.ts"
import { Reducer, createImmerReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"
import { DatabaseState } from "./databaseSlice.ts"

/**
 * Functions for working with rated entries that can be activated and have
 * enhancements.
 */
export type ActivatableRatedSlice<N extends string, E extends string> = {
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
  reducer: Reducer<CharacterState, UnknownAction, [database: DatabaseState]>
}

/**
 * Creates a slice for a map of rated entries.
 */
export const createActivatableRatedSlice = <N extends string, E extends string>(config: {
  namespace: N
  entityName: E
  getState: (state: Draft<CharacterState>) => Draft<ActivatableRatedMap>
  getImprovementCost: (
    id: number,
    database: DatabaseState,
    character: CharacterState,
  ) => ImprovementCost
  createEmptyActivatableRated: (id: number) => ActivatableRated
}): ActivatableRatedSlice<N, E> => {
  const updateCachedAdventurePoints = (
    entry: Draft<ActivatableRated>,
    database: DatabaseState,
    character: Draft<CharacterState>,
  ) => {
    entry.cachedAdventurePoints = cachedAdventurePointsForActivatable(
      entry.value,
      entry.boundAdventurePoints,
      config.getImprovementCost(entry.id, database, character),
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
        config.getState(state)[action.payload.id] ??= config.createEmptyActivatableRated(
          action.payload.id,
        )
      } else if (removeAction.match(action)) {
        delete config.getState(state)[action.payload.id]
      } else if (incrementAction.match(action)) {
        const entry = (config.getState(state)[action.payload.id] ??=
          config.createEmptyActivatableRated(action.payload.id))
        if (entry.value === undefined) {
          entry.value = 0
        } else {
          entry.value++
        }
        updateCachedAdventurePoints(entry, database, state)
      } else if (decrementAction.match(action)) {
        const entry = config.getState(state)[action.payload.id]
        if (entry !== undefined && entry.value !== undefined && entry.value > 0) {
          entry.value--
          updateCachedAdventurePoints(entry, database, state)
        }
      } else if (setAction.match(action)) {
        const entry = (config.getState(state)[action.payload.id] ??=
          config.createEmptyActivatableRated(action.payload.id))
        if (action.payload.value >= 0) {
          entry.value = action.payload.value
          updateCachedAdventurePoints(entry, database, state)
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
