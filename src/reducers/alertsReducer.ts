import { AddAlertAction, RemoveAlertAction } from '../actions/AlertActions';
import { ActionTypes } from '../constants/ActionTypes';
import { Alert } from '../types/data';
import { List } from '../utils/dataUtils';

type Action = AddAlertAction | RemoveAlertAction;

export type AlertsState = List<Alert>;

export function alertsReducer(
  state: AlertsState = List.of(),
  action: Action
): AlertsState {
  switch (action.type) {
    case ActionTypes.ADD_ALERT:
      return state.prepend(action.payload);

    case ActionTypes.REMOVE_ALERT:
      return state.tail();

    default:
      return state;
  }
}
