import { remote } from 'electron';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { SetLocaleAction } from '../actions/LocaleActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { ToListById, UILocale } from '../types/data.d';
import { RawLocale } from '../types/rawdata.d';
import { alert } from '../utils/alert';
import { Store } from './Store';

type Action = ReceiveInitialDataAction | SetLocaleAction;

class LocaleStoreStatic extends Store {
	private locale: string | undefined;
	private type: string;
	private messages: UILocale;
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_INITIAL_DATA:
					this.updateLocale(action.payload.config.locale);
					this.updateLocaleSetting(action.payload.config.locale);
					this.setLocales(action.payload.locales);
					break;

				case ActionTypes.SET_LOCALE:
					this.updateLocale(action.payload.locale);
					this.updateLocaleSetting(action.payload.locale);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	getMessages() {
		return this.messages || {};
	}

	getLocale() {
		return this.locale;
	}

	getLocaleType() {
		return this.type;
	}

	getForSave() {
		if (this.type === 'default') {
			return;
		}
		else {
			return this.getLocale();
		}
	}

	private setLocales(locales: ToListById<RawLocale>) {
		if (!this.locale) {
			alert('The required locale is not available.');
			throw new URIError('The required locale is not available.');
		}
		this.messages = locales[this.locale].ui;
	}

	private updateLocale(locale: string = this.getSystemLocale()) {
		this.locale = locale;
	}

	private updateLocaleSetting(locale?: string) {
		this.type = !locale ? 'default' : 'set';
	}

	getSystemLocale() {
		return remote.app.getLocale().match(/^de/) ? 'de-DE' : 'en-US';
	}
}

export const LocaleStore = new LocaleStoreStatic();

export function getLocale() {
	return LocaleStore.getMessages();
}
