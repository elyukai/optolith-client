import { ActionCreatorWithPayload, AnyAction, Draft, createAction } from "@reduxjs/toolkit"
import { TinyActivatableSet } from "../../shared/domain/activatableEntry.ts"
import { Reducer, createImmerReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"

/**
 * Functions for working with simple activatable entries.
 */
export type SimpleActivatableSlice<N extends string, E extends string> = {
  /**
   * The actions that can be dispatched to modify the state.
   */
  actions: {
    /**
     * Adds the entry with the given id.
     */
    addAction: ActionCreatorWithPayload<number, `${N}/add${E}`>

    /**
     * Remove the entry with the given id.
     */
    removeAction: ActionCreatorWithPayload<number, `${N}/remove${E}`>
  }

  /**
   * The reducer that handles the actions.
   */
  reducer: Reducer<CharacterState, AnyAction>
}

/**
 * Creates a slice for a map of simple activatable entries.
 */
export const createSimpleActivatableSlice = <N extends string, E extends string>(config: {
  namespace: N
  entityName: E
  getState: (state: Draft<CharacterState>) => Draft<TinyActivatableSet>
}): SimpleActivatableSlice<N, E> => {
  const addAction = createAction<number, `${N}/add${E}`>(
    `${config.namespace}/add${config.entityName}`,
  )
  const removeAction = createAction<number, `${N}/remove${E}`>(
    `${config.namespace}/remove${config.entityName}`,
  )

  const reducer = createImmerReducer((state: Draft<CharacterState>, action) => {
    const focusedState = config.getState(state)
    if (addAction.match(action)) {
      if (!focusedState.includes(action.payload)) {
        focusedState.push(action.payload)
      }
    } else if (removeAction.match(action)) {
      if (focusedState.includes(action.payload)) {
        focusedState.splice(focusedState.indexOf(action.payload), 1)
      }
    }
  })

  return {
    actions: {
      addAction,
      removeAction,
    },
    reducer,
  }
}
