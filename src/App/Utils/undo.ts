import { Action } from "redux";
import { cons, empty, List, uncons } from "../../Data/List";
import { maybe } from "../../Data/Maybe";
import { fst, Pair, snd } from "../../Data/Pair";
import { ActionTypes } from "../Constants/ActionTypes";

export interface UndoState<S> {
  past: List<S>
  present: S
  future: List<S>
}

export type UndoReducer<S, A> =
  (state: UndoState<S>, action: A) => UndoState<S>

export function undo<S, A extends Action = Action> (
  reducer: (state: S | undefined, action: A) => S,
  resetActionTypes?: ActionTypes[],
  ignoreActionTypes?: ActionTypes[]
): UndoReducer<S, A> {
  const initialState: UndoState<S> = {
    past: empty,
    // tslint:disable-next-line:no-object-literal-type-assertion
    present: reducer (undefined, {} as A),
    future: empty,
  }

  return function undoHandler (state: UndoState<S> = initialState, action: A): UndoState<S> {
    const { past, future, present } = state

    if (action.type === ActionTypes.UNDO) {
      return maybe
        (state)
        ((unconsed: Pair<S, List<S>>) => ({
          past: snd (unconsed),
          present: fst (unconsed),
          future: cons (future) (present),
        }))
        (uncons (past))
    }

    if (action.type === ActionTypes.REDO) {
      return maybe
        (state)
        ((unconsed: Pair<S, List<S>>) => ({
          past: cons (past) (present),
          present: fst (unconsed),
          future: snd (unconsed),
        }))
        (uncons (future))
    }

    const newPresent = reducer (present, action)

    if (present === newPresent) {
      if (resetActionTypes && resetActionTypes.includes (action.type)) {
        return {
          present,
          past: empty,
          future: empty,
        }
      }

      return state
    }

    if (resetActionTypes && resetActionTypes.includes (action.type)) {
      return {
        present: newPresent,
        past: empty,
        future: empty,
      }
    }

    if (ignoreActionTypes && ignoreActionTypes.includes (action.type)) {
      return {
        present: newPresent,
        past,
        future,
      }
    }

    return {
      past: cons (past) (present),
      present: newPresent,
      future: empty,
    }
  }
}

export function undoExisting<S, A extends Action = Action> (
  reducer: (state: S, action: A) => S,
  resetActionTypes?: ActionTypes[],
  ignoreActionTypes?: ActionTypes[]
): UndoReducer<S, A> {
  return function undoHandler (state: UndoState<S>, action: A): UndoState<S> {
    const { past, future, present } = state

    if (action.type === ActionTypes.UNDO) {
      return maybe
        (state)
        ((unconsed: Pair<S, List<S>>) => ({
          past: snd (unconsed),
          present: fst (unconsed),
          future: cons (future) (present),
        }))
        (uncons (past))
    }

    if (action.type === ActionTypes.REDO) {
      return maybe
        (state)
        ((unconsed: Pair<S, List<S>>) => ({
          past: cons (past) (present),
          present: fst (unconsed),
          future: snd (unconsed),
        }))
        (uncons (future))
    }

    const newPresent = reducer (present, action)

    if (present === newPresent) {
      if (resetActionTypes && resetActionTypes.includes (action.type)) {
        return {
          present,
          past: empty,
          future: empty,
        }
      }

      return state
    }

    if (resetActionTypes && resetActionTypes.includes (action.type)) {
      return {
        present: newPresent,
        past: empty,
        future: empty,
      }
    }

    if (ignoreActionTypes && ignoreActionTypes.includes (action.type)) {
      return {
        present: newPresent,
        past,
        future,
      }
    }

    return {
      past: cons (past) (present),
      present: newPresent,
      future: empty,
    }
  }
}

export function wrapWithHistoryObject<T> (obj: T): UndoState<T> {
  return {
    future: empty,
    past: empty,
    present: obj,
  }
}
