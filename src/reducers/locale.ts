import { ReceiveInitialDataAction } from '../actions/IOActions';
import { SetLocaleAction } from '../actions/LocaleActions';
import { ActionTypes } from '../constants/ActionTypes';
import { Book } from '../types/data.d';
import { UIMessages } from '../types/ui.d';

type Action = ReceiveInitialDataAction | SetLocaleAction;

export interface LocaleState {
  id?: string;
  type: 'default' | 'set';
  messages?: UIMessages;
  books: Map<string, Book>;
}

const initialState: LocaleState = {
  type: 'default',
  books: new Map()
};

export function locale(state: LocaleState = initialState, action: Action): LocaleState {
  switch (action.type) {
    case ActionTypes.RECEIVE_INITIAL_DATA: {
      const id = action.payload.config && action.payload.config.locale || action.payload.defaultLocale;
      return {
        ...state,
        type: action.payload.config && action.payload.config.locale ? 'set' : 'default',
        id,
        messages: action.payload.locales[id].ui
      };
    }

    case ActionTypes.SET_LOCALE:
      return {
        ...state,
        type: action.payload.localeType,
        id: action.payload.localeType === 'set' ? action.payload.locale : undefined
      };

    default:
      return state;
  }
}
