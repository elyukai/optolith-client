import { Action, AnyAction } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { AppState } from "../Models/AppState"

export type ReduxAction<R = void, D extends Action = AnyAction> =
  ThunkAction<R, AppState, undefined, D>

export type ReduxActions<R = void, D extends Action = AnyAction> = ReduxAction<R, D> | D

export type ReduxDispatch<A extends Action = AnyAction> =
  ThunkDispatch<AppState, undefined, A>
