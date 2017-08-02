import { RequestLoginAction, RequestLogoutAction, RequestRegistrationAction } from '../actions/AuthActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { ReceiveLoginAction, ReceiveLogoutAction, ReceiveRegistrationAction } from '../actions/ServerActions';
import * as ActionTypes from '../constants/ActionTypes';

import { ListStore } from './ListStore';
import { Store } from './Store';

type Action = ReceiveInitialDataAction | RequestLoginAction | ReceiveLoginAction | RequestLogoutAction | ReceiveLogoutAction | RequestRegistrationAction | ReceiveRegistrationAction;

class LoaderStoreStatic extends Store {
	private loading = true;
	private loadingText = 'Lädt Datentabellen';
	readonly dispatchToken: string;

	isLoading() {
		return this.loading;
	}

	getLoadingText() {
		return this.loadingText;
	}

	private startLoading(text = '') {
		this.loading = true;
		this.loadingText = text;
	}

	private stopLoading() {
		this.loading = false;
		this.loadingText = '';
	}
}

export const LoaderStore = new LoaderStoreStatic();
