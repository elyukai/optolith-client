import { ReceiveInitialDataAction } from '../Actions/IOActions';
import { SetLocaleAction } from '../Actions/LocaleActions';
import { ActionTypes } from '../Constants/ActionTypes';
import { UIMessages } from '../types/ui';
import { List, OrderedMap } from '../utils/dataUtils';

type Action = ReceiveInitialDataAction | SetLocaleAction;

export interface LocaleState {
  id?: string;
  type: 'default' | 'set';
  messages?: UIMessages;
}

const initialState: LocaleState = {
  type: 'default'
};

export function localeReducer (state: LocaleState = initialState, action: Action): LocaleState {
  switch (action.type) {
    case ActionTypes.RECEIVE_INITIAL_DATA: {
      const id =
        action.payload.config
        && (action.payload.config.locale || action.payload.defaultLocale);

      return {
        type: action.payload.config && action.payload.config.locale ? 'set' : 'default',
        id,
        messages: typeof id === 'string'
          ? OrderedMap.of (Object.entries (action.payload.locales[id].ui))
            .toKeyValueObjectWith (e => Array.isArray (e) ? List.fromArray (e) : e) as UIMessages
          : undefined
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
