import { Action, AnyAction } from "redux";
import { flip, ident } from "../../Data/Function";
import { set } from "../../Data/Lens";
import { cons, elem, empty, List, uncons } from "../../Data/List";
import { maybe } from "../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../Data/Record";
import { fst, Pair, snd } from "../../Data/Tuple";
import { ActionTypes } from "../Constants/ActionTypes";

export interface UndoState<S> {
  "@@name": "UndoState"
  past: List<S>
  present: S
  future: List<S>
}

export const createUndoState =
  <S> (x: S) => fromDefault ("UndoState")
                            <UndoState<S>> ({
                              past: List.empty,
                              present: x,
                              future: List.empty,
                            })

export type UndoReducer<S, A> =
  (state: UndoState<S>, action: A) => UndoState<S>

/**
 * `undo :: [ActionTypes] -> [ActionTypes] -> s -> (a -> s -> s) -> a -> s -> s`
 *
 * `undo rs is def reducer` returns a reducer for a specified state of type `s`
 * with a history record. The record will update on every action that is
 * dispatched. That means, you can go easily back and forth in history of this
 * specific state slice. The default state `def` is used to create the new
 * history record. If you want to reset the history on specific actions, contain
 * their `ActionTypes` in the `rs` list. If you want specific actions to be
 * ignored &ndash; so that an action directly affects the present and does not
 * affect future and past &ndash; add the specific `ActionTypes` to the `is`
 * list. The `reducer` is the reducer that changes the actual state slice on an
 * action.
 */
export const undo =
  (resetActionTypes: List<ActionTypes>) =>
  (ignoreActionTypes: List<ActionTypes>) =>
  <S>
  (defaultState: S) =>
  <A extends Action = AnyAction>
  (reducer: (action: A) => (state: S) => S) => {
    const L = createUndoState (defaultState)

    const LL = makeLenses (L)

    const undoHandler =
      (action: A): ident<Record<UndoState<S>>> =>
      state => {
        if (action.type === ActionTypes.UNDO) {
          return maybe
            (state)
            ((unconsed: Pair<S, List<S>>) => L ({
              past: snd (unconsed),
              // @ts-ignore
              present: fst (unconsed),
              future: cons (L.AL.future (state)) (L.AL.present (state)),
            }))
            (uncons (L.AL.past (state)))
        }

        if (action.type === ActionTypes.REDO) {
          return maybe
            (state)
            ((unconsed: Pair<S, List<S>>) => L ({
              past: cons (L.AL.past (state)) (L.AL.present (state)),
              // @ts-ignore
              present: fst (unconsed),
              future: snd (unconsed),
            }))
            (uncons (L.AL.future (state)))
        }

        const newPresent = reducer (action) (L.AL.present (state))

        if (L.AL.present (state) === newPresent) {
          if (elem (action.type) (resetActionTypes)) {
            return L ({
              // @ts-ignore
              present: L.AL.present (state),
              past: empty,
              future: empty,
            })
          }

          return state
        }

        if (elem (action.type) (resetActionTypes)) {
          return L ({
            // @ts-ignore
            present: newPresent,
            past: empty,
            future: empty,
          })
        }

        if (elem (action.type) (ignoreActionTypes)) {
          return set (LL.present) (newPresent) (state)
        }

        return L ({
          past: cons (L.AL.past (state)) (L.AL.present (state)),
          // @ts-ignore
          present: newPresent,
          future: empty,
        })
      }

    undoHandler.default = L.default
    undoHandler.A = L.AL
    undoHandler.A_ = L.A
    undoHandler.L = makeLenses (L)

    return undoHandler
  }

/**
 * Calls `undo` without having any `ActionTypes` to reset history or to not
 * change history after an action has been dispatched.
 */
export const undoSimple = undo (empty) (empty)

/**
 * Calls `undo` only with `ActionTypes` to reset history.
 */
export const undoR = flip (undo) (empty)

/**
 * Calls `undo` only `ActionTypes` to not change history after an action has
 * been dispatched.
 */
export const undoI = undo (empty)
