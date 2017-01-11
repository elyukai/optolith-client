import AuthReducer, { AuthState } from './AuthReducer';
import HeroReducer, { HeroState } from './HeroReducer';
import HerolistReducer, { HerolistState } from './HerolistReducer';
import LoadingReducer, { LoadingState } from './LoadingReducer';
import LocationReducer, { LocationState } from './LocationReducer';
import UIReducer, { UIState } from './UIReducer';

export const version = [ 0, 14, 59 ];

export interface AppState {
	auth: AuthState;
	hero: HeroState;
	herolist: HerolistState;
	loading: LoadingState;
	location: LocationState;
	ui: UIState;
}

export type InitialAppState = { [slice in keyof AppState]: undefined };

export default (state: AppState | InitialAppState = {} as InitialAppState, action: any): AppState => {
	return {
		auth: AuthReducer(state.auth, action),
		hero: HeroReducer(state.hero, action),
		herolist: HerolistReducer(state.herolist, action),
		loading: LoadingReducer(state.loading, action),
		location: LocationReducer(state.location, action, state.auth ? state.auth.loggedIn : false),
		ui: UIReducer(state.ui, action)
	}
};
