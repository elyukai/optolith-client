import { ReceiveDataTablesAction } from '../actions/ServerActions';
import { ReceiveLoginAction, ReceiveLogoutAction, ReceiveNewUsernameAction, ReceiveUserDeletionAction } from '../actions/AuthActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = ReceiveDataTablesAction | ReceiveNewUsernameAction | ReceiveLoginAction | ReceiveLogoutAction | ReceiveUserDeletionAction;

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
		case ActionTypes.RECEIVE_DATA_TABLES:
			return {
				name: 'Elytherion',
				displayName: 'Obi',
				email: 'lukas.obermann@live.de',
				sessionToken: '0123456789ABCDEF'
			};

		case ActionTypes.RECEIVE_LOGIN: {
			const { name, displayName, email, sessionToken } = action.payload;
			return { name, displayName, email, sessionToken };
		}

		case ActionTypes.RECEIVE_LOGOUT:
		case ActionTypes.RECEIVE_USER_DELETION:
			return {
				name: '',
				displayName: '',
				email: '',
				sessionToken: ''
			};

		case ActionTypes.RECEIVE_NEW_USERNAME:
			return { ...state, name: action.payload.name };

		default:
			return state;
	}
};
