import { remote } from 'electron';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { SetLocaleAction } from '../actions/LocaleActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { Locale, ToListById } from '../types/data.d';
import { RawLocale } from '../types/rawdata.d';
import { Store } from './Store';

type Action = ReceiveInitialDataAction | SetLocaleAction;

class LocaleStoreStatic extends Store {
	private currentLocale: string | undefined;
	private currentLocaleSetting: string;
	private localesById: ToListById<Locale> = {};
	private locales: string[] = [];
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_INITIAL_DATA:
					this.setLocales(action.payload.locales);
					this.updateLocale(action.payload.config.locale);
					this.updateLocaleSetting(action.payload.config.locale);
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

	getCurrentId() {
		return this.currentLocale;
	}

	getCurrentIdType() {
		return this.currentLocaleSetting;
	}

	getCurrent() {
		if (typeof this.currentLocale === 'string') {
			return this.localesById[this.currentLocale] || {};
		}
		return {} as Locale;
	}

	getForSave() {
		if (this.currentLocaleSetting === 'default') {
			return;
		}
		else {
			return this.getCurrentId();
		}
	}

	private setLocales(locales: ToListById<RawLocale>) {
		this.locales = Object.keys(locales);
		const uiLocales = this.locales.map(e => locales[e].ui);
		uiLocales.forEach((locale, index) => {
			this.localesById[this.locales[index]] = locale;
		});
	}

	private updateLocale(locale: string = remote.app.getLocale().match(/^de/) ? 'de-DE' : 'en-US') {
		this.currentLocale = locale;
	}

	private updateLocaleSetting(locale?: string) {
		this.currentLocaleSetting = !locale ? 'default' : 'set';
	}
}

export const LocaleStore = new LocaleStoreStatic();

export function getLocale() {
	return LocaleStore.getCurrent();
}
