import { ThunkAction } from 'redux-thunk';
import { AppState } from '../reducers/app';

export type AsyncAction<R = void> = ThunkAction<R, AppState, undefined>;
