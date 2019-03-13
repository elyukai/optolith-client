import { Action, AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../Reducers/appReducer";

export type AsyncAction<R = void, D extends Action = AnyAction> =
  ThunkAction<R, AppState, undefined, D>

export type AllAction<R = void, D extends Action = AnyAction> = AsyncAction<R, D> | D
