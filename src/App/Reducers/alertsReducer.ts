import { AddAlertAction, RemoveAlertAction } from '../Actions/AlertActions';
import { ActionTypes } from '../Constants/ActionTypes';
import { Alert } from '../Models/Hero/heroTypeHelpers';
import { List, Maybe } from '../utils/dataUtils';

type Action = AddAlertAction | RemoveAlertAction;

export type AlertsState = List<Alert>;

export function alertsReducer (
  state: AlertsState = List.of (),
  action: Action
): AlertsState {
  switch (action.type) {
    case ActionTypes.ADD_ALERT:
      return state.cons (action.payload);

    case ActionTypes.REMOVE_ALERT:
      return Maybe.fromMaybe (state) (List.tail_ (state));

    default:
      return state;
  }
}
