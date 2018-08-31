import { AddAdventurePointsAction } from '../actions/ProfileActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Data from '../types/data';
import { Record } from '../utils/dataUtils';

type Action = AddAdventurePointsAction;

export function adventurePointsReducer (
  state: Record<Data.HeroDependent>,
  action: Action,
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ADD_ADVENTURE_POINTS:
      return state.modify<'adventurePoints'> (
        slice => slice.modify<'total'> (total => total + action.payload.amount) ('total')
      ) ('adventurePoints');

    default:
      return state;
  }
}
