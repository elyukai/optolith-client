import { clipboard } from 'electron';
import { ActionTypes } from '../constants/ActionTypes';
import { Alert } from '../types/data';
import { Record } from '../utils/dataUtils';
import { translate, UIMessages } from '../utils/I18n';

export interface AddAlertAction {
  type: ActionTypes.ADD_ALERT;
  payload: Alert;
}

export const addAlert = (options: Alert): AddAlertAction => ({
  type: ActionTypes.ADD_ALERT,
  payload: options,
});

export const addErrorAlert = (options: Alert, locale: Record<UIMessages>): AddAlertAction => {
  // @ts-ignore
  // FIXME: Remove @ts-ignore when TS/redux-thunk fixed problem with extending `Action`.
  const buttons: Alert['buttons'] = [
    {
      label: translate (locale, 'copy'),
      dispatchOnClick: () => clipboard.writeText (options.message),
    },
    {
      label: translate (locale, 'ok'),
    },
  ];

  return {
    type: ActionTypes.ADD_ALERT,
    payload: {
      ...options,
      buttons,
    },
  };
};

export interface RemoveAlertAction {
  type: ActionTypes.REMOVE_ALERT;
}

export const removeAlert = (): RemoveAlertAction => ({
  type: ActionTypes.REMOVE_ALERT,
});
