import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import ListStore from './ListStore';
import Store from './Store';

type Action = ReceiveInitialDataAction | RequestHeroAvatarAction | ReceiveHeroAvatarAction | RequestHeroDataAction | ReceiveHeroDataAction | RequestHerolistAction | ReceiveHerolistAction | RequestLoginAction | ReceiveLoginAction | RequestLogoutAction | ReceiveLogoutAction | RequestNewUsernameAction | ReceiveNewUsernameAction | RequestUserDeletionAction | ReceiveUserDeletionAction | RequestRegistrationAction | ReceiveRegistrationAction;

class LoaderStoreStatic extends Store {
	private loading = true;
	private loadingText = 'Lädt Datentabellen';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.REQUEST_HERO_AVATAR:
				case ActionTypes.REQUEST_HERO_DATA:
				case ActionTypes.REQUEST_HEROLIST:
				case ActionTypes.REQUEST_LOGIN:
				case ActionTypes.REQUEST_LOGOUT:
				case ActionTypes.REQUEST_NEW_USERNAME:
				case ActionTypes.REQUEST_REGISTRATION:
				case ActionTypes.REQUEST_USER_DELETION:
					this.startLoading();
					break;

				case ActionTypes.RECEIVE_INITIAL_DATA:
					AppDispatcher.waitFor([ListStore.dispatchToken]);
					this.stopLoading();
					break;

				case ActionTypes.RECEIVE_HERO_AVATAR:
				case ActionTypes.RECEIVE_HERO_DATA:
				case ActionTypes.RECEIVE_HEROLIST:
				case ActionTypes.RECEIVE_LOGIN:
				case ActionTypes.RECEIVE_LOGOUT:
				case ActionTypes.RECEIVE_NEW_USERNAME:
				case ActionTypes.RECEIVE_REGISTRATION:
				case ActionTypes.RECEIVE_USER_DELETION:
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

const LoaderStore = new LoaderStoreStatic();

export default LoaderStore;
