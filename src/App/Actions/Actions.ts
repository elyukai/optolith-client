import { Action, UnknownAction } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { AppStateRecord } from "../Models/AppState"

export type ReduxAction<R = void, D extends Action = UnknownAction> = ThunkAction<
  R,
  AppStateRecord,
  undefined,
  D
>

export type ReduxActions<R = void, D extends Action = UnknownAction> = ReduxAction<R, D> | D

export type ReduxDispatch<A extends Action = UnknownAction> = ThunkDispatch<
  AppStateRecord,
  undefined,
  A
>
