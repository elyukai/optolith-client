import { Action } from 'redux';
import { ActionTypes } from '../constants/ActionTypes';
import { List, Maybe, Tuple } from './dataUtils';

export interface UndoState<S> {
  past: List<S>;
  present: S;
  future: List<S>;
}

export type UndoReducer<S, A> =
  (state: UndoState<S>, action: A) => UndoState<S>;

export function undo<S, A extends Action = Action> (
  reducer: (state: S | undefined, action: A) => S,
  resetActionTypes?: ActionTypes[],
  ignoreActionTypes?: ActionTypes[]
): UndoReducer<S, A> {
  const initialState: UndoState<S> = {
    past: List.of (),
    // tslint:disable-next-line:no-object-literal-type-assertion
    present: reducer (undefined, {} as A),
    future: List.of (),
  };

  return function undoHandler (state: UndoState<S> = initialState, action: A): UndoState<S> {
    const { past, future, present } = state;

    if (action.type === ActionTypes.UNDO) {
      return Maybe.maybe<Tuple<S, List<S>>, UndoState<S>> (state) (
        unconsed => ({
          past: Tuple.snd (unconsed),
          present: Tuple.fst (unconsed),
          future: future .cons (present),
        })
      ) (List.uncons (past));
    }

    if (action.type === ActionTypes.REDO) {
      return Maybe.maybe<Tuple<S, List<S>>, UndoState<S>> (state) (
        unconsed => ({
          past: past .cons (present),
          present: Tuple.fst (unconsed),
          future: Tuple.snd (unconsed),
        })
      ) (List.uncons (future));
    }

    const newPresent = reducer (present, action);

    if (present === newPresent) {
      if (resetActionTypes && resetActionTypes.includes (action.type)) {
        return {
          present,
          past: List.empty (),
          future: List.empty (),
        };
      }

      return state;
    }

    if (resetActionTypes && resetActionTypes.includes (action.type)) {
      return {
        present: newPresent,
        past: List.empty (),
        future: List.empty (),
      };
    }

    if (ignoreActionTypes && ignoreActionTypes.includes (action.type)) {
      return {
        present: newPresent,
        past,
        future,
      };
    }

    return {
      past: past.cons (present),
      present: newPresent,
      future: List.empty (),
    };
  };
}

export function undoExisting<S, A extends Action = Action> (
  reducer: (state: S, action: A) => S,
  resetActionTypes?: ActionTypes[],
  ignoreActionTypes?: ActionTypes[]
): UndoReducer<S, A> {
  return function undoHandler (state: UndoState<S>, action: A): UndoState<S> {
    const { past, future, present } = state;

    if (action.type === ActionTypes.UNDO) {
      return Maybe.maybe<Tuple<S, List<S>>, UndoState<S>>
        (state)
        (unconsed => ({
          past: Tuple.snd (unconsed),
          present: Tuple.fst (unconsed),
          future: future.cons (present),
        }))
        (List.uncons (past));
    }

    if (action.type === ActionTypes.REDO) {
      return Maybe.maybe<Tuple<S, List<S>>, UndoState<S>>
        (state)
        (unconsed => ({
          past: past.cons (present),
          present: Tuple.fst (unconsed),
          future: Tuple.snd (unconsed),
        }))
        (List.uncons (future));
    }

    const newPresent = reducer (present, action);

    if (present === newPresent) {
      if (resetActionTypes && resetActionTypes.includes (action.type)) {
        return {
          present,
          past: List.empty (),
          future: List.empty (),
        };
      }

      return state;
    }

    if (resetActionTypes && resetActionTypes.includes (action.type)) {
      return {
        present: newPresent,
        past: List.empty (),
        future: List.empty (),
      };
    }

    if (ignoreActionTypes && ignoreActionTypes.includes (action.type)) {
      return {
        present: newPresent,
        past,
        future,
      };
    }

    return {
      past: past.cons (present),
      present: newPresent,
      future: List.empty (),
    };
  };
}

export function wrapWithHistoryObject<T> (obj: T): UndoState<T> {
  return {
    future: List.empty (),
    past: List.empty (),
    present: obj,
  };
}
