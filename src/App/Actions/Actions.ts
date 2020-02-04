import { Action, AnyAction } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { Record } from "../../Data/Record"
import { AppState } from "../Reducers/appReducer"

export type ReduxAction<R = void, D extends Action = AnyAction> =
  ThunkAction<R, Record<AppState>, undefined, D>

export type ReduxActions<R = void, D extends Action = AnyAction> = ReduxAction<R, D> | D

export type ReduxDispatch<A extends Action = AnyAction> =
  ThunkDispatch<Record<AppState>, undefined, A>
