import { ReceiveInitialDataAction } from '../actions/IOActions';
import { SetLocaleAction } from '../actions/LocaleActions';
import { ActionTypes } from '../constants/ActionTypes';
import { UIMessages } from '../types/ui.d';

type Action = ReceiveInitialDataAction | SetLocaleAction;

export interface LocaleState {
  id?: string;
  type: 'default' | 'set';
  messages?: UIMessages;
}

const initialState: LocaleState = {
  type: 'default'
};

export function localeReducer(state: LocaleState = initialState, action: Action): LocaleState {
  switch (action.type) {
    case ActionTypes.RECEIVE_INITIAL_DATA: {
      const id =
        action.payload.config
        && (action.payload.config.locale || action.payload.defaultLocale);

      return {
        type: action.payload.config && action.payload.config.locale ? 'set' : 'default',
        id,
        messages: typeof id === 'string' ? action.payload.locales[id].ui : undefined
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
