import { LoadHeroAction } from '../actions/HerolistActions';
import { AddAdventurePointsAction } from '../actions/ProfileActions';
import { ActionTypes } from '../constants/ActionTypes';

type Action = LoadHeroAction | AddAdventurePointsAction;

export interface DisAdvAdventurePoints extends Array<number> {
  /**
   * Spent AP for Advantages/Disadvantages in total.
   */
  0: number;
  /**
   * Spent AP for magical Advantages/Disadvantages.
   */
  1: number;
  /**
   * Spent AP for blessed Advantages/Disadvantages.
   */
  2: number;
}

// export interface AdventurePointsState {
//   total: number;
//   spent: number;
//   adv: DisAdvAdventurePoints;
//   disadv: DisAdvAdventurePoints;
// }

export type AdventurePointsState = number;

const initialState: AdventurePointsState = 0;

export function adventurePoints(
  state: AdventurePointsState = initialState,
  action: Action,
): AdventurePointsState {
  switch (action.type) {
    case ActionTypes.LOAD_HERO:
      return action.payload.data.ap.total;

    case ActionTypes.ADD_ADVENTURE_POINTS:
      return state + action.payload.amount;

    default:
      return state;
  }
}
