import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../reducers/appReducer';

export type AsyncAction<R = void, D extends Action = AnyAction> =
  ThunkAction<R, AppState, undefined, D>;
