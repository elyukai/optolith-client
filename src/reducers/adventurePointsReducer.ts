import * as R from 'ramda';
import { AddAdventurePointsAction } from '../actions/ProfileActions';
import * as Data from '../App/Models/Hero/heroTypeHelpers';
import { ActionTypes } from '../constants/ActionTypes';
import { Record } from '../utils/dataUtils';

type Action = AddAdventurePointsAction;

export function adventurePointsReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ADD_ADVENTURE_POINTS:
      return state .modify<'adventurePointsTotal'> (R.add (action.payload.amount))
                                                   ('adventurePointsTotal');

    default:
      return state;
  }
}
