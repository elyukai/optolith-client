import { ActionTypes } from '../constants/ActionTypes';
import { Maybe } from '../utils/dataUtils';
import { getSystemLocale } from '../utils/IOUtils';

export interface SetLocaleAction {
  type: ActionTypes.SET_LOCALE;
  payload: {
    locale: string;
    localeType: 'default' | 'set';
  };
}

export const setLocale = (locale: Maybe<string>): SetLocaleAction => ({
  type: ActionTypes.SET_LOCALE,
  payload: {
    locale: Maybe.fromMaybe (getSystemLocale ()) (locale),
    localeType: Maybe.isNothing (locale) ? 'default' : 'set'
  }
});
