import { ThunkAction } from 'redux-thunk';
import { AppState } from '../reducers/app';

export type AsyncAction = ThunkAction<void, AppState, undefined>;
