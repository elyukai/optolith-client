import { ActionCreatorWithPayload, AnyAction, Draft, createAction } from "@reduxjs/toolkit"
import { ImprovementCost } from "../../shared/domain/adventurePoints/improvementCost.ts"
import { cachedAdventurePoints } from "../../shared/domain/adventurePoints/ratedEntry.ts"
import { Rated, RatedMap } from "../../shared/domain/rated/ratedEntry.ts"
import { DraftReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"
import { DatabaseState } from "./databaseSlice.ts"

/**
 * A slice that handles rated entries.
 */
export type RatedSlice<N extends string, E extends string> = {
  /**
   * The actions that can be dispatched to modify the state.
   */
  actions: {
    /**
     * Increments the value of the entry with the given id.
     */
    incrementEntry: ActionCreatorWithPayload<{ id: number }, `${N}/increment${E}`>

    /**
     * Sets the value of the entry with the given id.
     */
    setEntry: ActionCreatorWithPayload<{ id: number; value: number }, `${N}/set${E}`>

    /**
     * Decrements the value of the entry with the given id.
     */
    decrementEntry: ActionCreatorWithPayload<{ id: number }, `${N}/decrement${E}`>
  }

  /**
   * The reducer that handles the actions.
   */
  reducer: DraftReducer<CharacterState, AnyAction, [database: DatabaseState]>
}

/**
 * Create a reducer, actions and selectors for a slice that handles rated
 * entries.
 */
export const createRatedSlice = <N extends string, E extends string>(config: {
  namespace: N
  entityName: E
  getState: (state: Draft<CharacterState>) => Draft<RatedMap>
  minValue: number
  getImprovementCost: (id: number, database: DatabaseState) => ImprovementCost
  createEmptyRated: (id: number) => Rated
}): RatedSlice<N, E> => {
  const updateCachedAdventurePoints = (entry: Draft<Rated>, database: DatabaseState) => {
    entry.cachedAdventurePoints = cachedAdventurePoints(
      entry.value,
      config.minValue,
      entry.boundAdventurePoints,
      config.getImprovementCost(entry.id, database),
    )
    return entry
  }

  const incrementEntry = createAction<{ id: number }, `${N}/increment${E}`>(
    `${config.namespace}/increment${config.entityName}`,
  )
  const setEntry = createAction<{ id: number; value: number }, `${N}/set${E}`>(
    `${config.namespace}/set${config.entityName}`,
  )
  const decrementEntry = createAction<{ id: number }, `${N}/decrement${E}`>(
    `${config.namespace}/decrement${config.entityName}`,
  )

  const reducer: DraftReducer<CharacterState, AnyAction, [database: DatabaseState]> = (
    state,
    action,
    database,
  ) => {
    if (incrementEntry.match(action)) {
      const entry = (config.getState(state)[action.payload.id] ??= config.createEmptyRated(
        action.payload.id,
      ))
      entry.value++
      updateCachedAdventurePoints(entry, database)
    } else if (setEntry.match(action)) {
      const entry = (config.getState(state)[action.payload.id] ??= config.createEmptyRated(
        action.payload.id,
      ))
      if (action.payload.value >= config.minValue) {
        entry.value = action.payload.value
        updateCachedAdventurePoints(entry, database)
      }
    } else if (decrementEntry.match(action)) {
      const entry = config.getState(state)[action.payload.id]
      if (entry !== undefined && entry.value > config.minValue) {
        entry.value--
        updateCachedAdventurePoints(entry, database)
      }
    }
  }

  return {
    actions: {
      incrementEntry,
      decrementEntry,
      setEntry,
    },
    reducer,
  }
}
