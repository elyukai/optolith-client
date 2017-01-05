import { combineReducers } from 'redux';
import AuthReducer, { AuthState } from './AuthReducer';
import HeroReducer, { HeroState } from './HeroReducer';
import HerolistReducer, { HerolistState } from './HerolistReducer';
import LoadingReducer, { LoadingState } from './LoadingReducer';
import LocationReducer, { LocationState } from './LocationReducer';

export const version = [ 0, 14, 59 ];

export interface Action {
	type: string;
	payload?: any;
	error?: boolean;
	meta?: any;
}

export interface AppState {
	auth: AuthState;
	hero: HeroState;
	herolist: HerolistState;
	loading: LoadingState;
	location: LocationState;
}

export default (state: AppState | {} = {}, action: Action): AppState => {
	return {
		auth: AuthReducer(state.auth, action),
		hero: HeroReducer(state.hero, action),
		herolist: HerolistReducer(state.herolist, action),
		loading: LoadingReducer(state.loading, action),
		location: LocationReducer(state.location, action, state.auth ? state.auth.loggedIn : false)
	}
};
