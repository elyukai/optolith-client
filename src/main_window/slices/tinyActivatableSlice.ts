import { ActionCreatorWithPayload, Draft, UnknownAction, createAction } from "@reduxjs/toolkit"
import { TinyActivatableMap } from "../../shared/domain/activatable/activatableEntry.ts"
import { Reducer, createImmerReducer } from "../../shared/utils/redux.ts"
import { CharacterState } from "./characterSlice.ts"

/**
 * Functions for working with simple activatable entries.
 */
export type TinyActivatableSlice<N extends string, E extends string> = {
  /**
   * The actions that can be dispatched to modify the state.
   */
  actions: {
    /**
     * Adds the entry with the given id.
     */
    addAction: ActionCreatorWithPayload<{ id: number }, `${N}/add${E}`>

    /**
     * Remove the entry with the given id.
     */
    removeAction: ActionCreatorWithPayload<{ id: number }, `${N}/remove${E}`>
  }

  /**
   * The reducer that handles the actions.
   */
  reducer: Reducer<CharacterState, UnknownAction>
}

/**
 * Creates a slice for a map of simple activatable entries.
 */
export const createTinyActivatableSlice = <N extends string, E extends string>(config: {
  namespace: N
  entityName: E
  getState: (state: Draft<CharacterState>) => Draft<TinyActivatableMap>
}): TinyActivatableSlice<N, E> => {
  const addAction = createAction<{ id: number }, `${N}/add${E}`>(
    `${config.namespace}/add${config.entityName}`,
  )
  const removeAction = createAction<{ id: number }, `${N}/remove${E}`>(
    `${config.namespace}/remove${config.entityName}`,
  )

  const reducer = createImmerReducer((state: Draft<CharacterState>, action) => {
    const focusedState = config.getState(state)
    if (addAction.match(action)) {
      if (!Object.hasOwn(focusedState, action.payload.id)) {
        focusedState[action.payload.id] = {
          id: action.payload.id,
          active: true,
        }
      }
    } else if (removeAction.match(action)) {
      if (Object.hasOwn(focusedState, action.payload.id)) {
        delete focusedState[action.payload.id]
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
