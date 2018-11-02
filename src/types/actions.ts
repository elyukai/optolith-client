import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../reducers/appReducer';

export type AsyncAction<R = void, D extends Action = Action> =
  ThunkAction<R, AppState, undefined, D>;

export type AllAction<R = void, D extends Action = Action> = AsyncAction<R, D> | D;
