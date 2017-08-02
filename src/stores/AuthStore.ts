import { ReceiveInitialDataAction } from '../actions/FileActions';
import { ReceiveLoginAction, ReceiveLogoutAction, ReceiveNewUsernameAction } from '../actions/ServerActions';
import * as ActionTypes from '../constants/ActionTypes';

import { Store } from './Store';

type Action = ReceiveLoginAction | ReceiveNewUsernameAction | ReceiveLogoutAction | ReceiveInitialDataAction;

class AuthStoreStatic extends Store {
	private name = '';
	private displayName = '';
	private email = '';
	private sessionToken?: string;
	readonly dispatchToken: string;

	getAll() {
		return {
			displayName: this.displayName,
			email: this.email,
			name: this.name,
			sessionToken: this.sessionToken,
		};
	}

	getName() {
		return this.name;
	}

	getDisplayName() {
		return this.displayName;
	}

	getToken() {
		return this.sessionToken;
	}

	private update(name: string, displayName: string, email: string, sessionToken?: string) {
		this.name = name;
		this.displayName = displayName;
		this.email = email;
		this.sessionToken = sessionToken;
	}

	private updateName(name: string) {
		this.name = name;
	}

	private reset() {
		this.name = '';
		this.displayName = '';
		this.email = '';
		this.sessionToken = undefined;
	}
}

export const AuthStore = new AuthStoreStatic();
