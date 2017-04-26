import { RequestLoginAction, RequestLogoutAction, RequestRegistrationAction } from '../actions/AuthActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { ReceiveLoginAction, ReceiveLogoutAction, ReceiveRegistrationAction } from '../actions/ServerActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { ListStore } from './ListStore';
import { Store } from './Store';

type Action = ReceiveInitialDataAction | RequestLoginAction | ReceiveLoginAction | RequestLogoutAction | ReceiveLogoutAction | RequestRegistrationAction | ReceiveRegistrationAction;

class LoaderStoreStatic extends Store {
	private loading = true;
	private loadingText = 'Lädt Datentabellen';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.REQUEST_LOGIN:
				case ActionTypes.REQUEST_LOGOUT:
				case ActionTypes.REQUEST_REGISTRATION:
					this.startLoading();
					break;

				case ActionTypes.RECEIVE_INITIAL_DATA:
					AppDispatcher.waitFor([ListStore.dispatchToken]);
					this.stopLoading();
					break;

				case ActionTypes.RECEIVE_LOGIN:
				case ActionTypes.RECEIVE_LOGOUT:
				case ActionTypes.RECEIVE_REGISTRATION:
					this.stopLoading();
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

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
