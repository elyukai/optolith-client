import * as R from 'ramda';
import { AddAdventurePointsAction } from '../Actions/ProfileActions';
import { ActionTypes } from '../Constants/ActionTypes';
import * as Data from '../Models/Hero/heroTypeHelpers';
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
