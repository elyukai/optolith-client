import { first, last } from 'lodash';
import { Action } from 'redux';
import { ActionTypes } from '../constants/ActionTypes';

export interface UndoState<S> {
  past: S[];
  present: S;
  future: S[];
}

export type UndoReducer<S, A> =
  (state: UndoState<S>, action: A) => UndoState<S>;

export function undo<S, A extends Action = Action>(
  reducer: (state: S | undefined, action: A) => S,
  resetActionTypes?: ActionTypes[]
): UndoReducer<S, A> {
  const initialState: UndoState<S> = {
    past: [],
    present: reducer(undefined, {} as A),
    future: []
  };

  return function undoHandler(state: UndoState<S> = initialState, action: A) {
    const { past, future, present } = state;
    switch (action.type) {
      case ActionTypes.UNDO: {
        const previous = last(past);
        const newPast = past.slice(0, past.length - 1);
        if (previous) {
          return {
            past: newPast,
            present: previous,
            future: [present, ...future]
          };
        }
        return state;
      }

      case ActionTypes.REDO: {
        const next = first(future);
        const newFuture = future.slice(1);
        if (next) {
          return {
            future: newFuture,
            present: next,
            past: [...past, present]
          };
        }
        return state;
      }

      default: {
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          if (resetActionTypes && resetActionTypes.includes(action.type)) {
            return {
              past: [],
              present,
              future: []
            };
          }
          return state;
        }
        if (resetActionTypes && resetActionTypes.includes(action.type)) {
          return {
            past: [],
            present: newPresent,
            future: []
          };
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: []
        };
      }
    }
  };
}
