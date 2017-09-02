import { applyMiddleware, createStore, Dispatch } from 'redux';
import ReduxThunk from 'redux-thunk';
import { app, AppState } from '../reducers/app';

export const store = createStore(app, applyMiddleware(ReduxThunk));

export type AsyncAction = (dispatch: Dispatch<AppState>, getState: () => AppState) => void;
