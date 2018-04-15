import { ThunkAction } from 'redux-thunk';
import { AppState } from '../reducers/app';
import { AnyAction } from 'redux';
import { Action } from 'redux';

export type AsyncAction<R = void, D extends Action = AnyAction> = ThunkAction<R, AppState, undefined, D>;
