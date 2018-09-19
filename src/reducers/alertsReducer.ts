import { AddAlertAction, RemoveAlertAction } from '../actions/AlertActions';
import { ActionTypes } from '../constants/ActionTypes';
import { Alert } from '../types/data';
import { List, Maybe, Tuple } from '../utils/dataUtils';

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
      return Maybe.fromMaybe (state) (List.uncons (state) .fmap (Tuple.snd));

    default:
      return state;
  }
}
