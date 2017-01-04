import { FetchDataAction } from '../actions/ServerActions';
import { LoginAction, LogoutAction } from '../actions/AuthActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = FetchDataAction | LoginAction | LogoutAction;

export interface AuthState {
	readonly name: string;
	readonly displayName: string;
	readonly email: string;
	readonly sessionToken: string;
}

const initialState = <AuthState>{
	name: '',
	displayName: '',
	email: '',
	sessionToken: ''
};

export default (state = initialState, action: Action): AuthState => {
	switch (action.type) {
		// Only for test purpose:
		case ActionTypes.FETCH_DATA:
			return {
				name: 'Elytherion',
				displayName: 'Obi',
				email: 'lukas.obermann@live.de',
				sessionToken: '0123456789ABCDEF'
			};

		case ActionTypes.LOGIN:
			return action.payload;

		case ActionTypes.LOGOUT:
			return {
				name: '',
				displayName: '',
				email: '',
				sessionToken: ''
			};

		// UPDATE_USERNAME

		default:
			return state;
	}
};
