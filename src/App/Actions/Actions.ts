import { Action, AnyAction } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { AppStateRecord } from "../Models/AppState"

export type ReduxAction<R = void, D extends Action = AnyAction> =
  ThunkAction<R, AppStateRecord, undefined, D>

export type ReduxActions<R = void, D extends Action = AnyAction> = ReduxAction<R, D> | D

export type ReduxDispatch<A extends Action = AnyAction> =
  ThunkDispatch<AppStateRecord, undefined, A>
