import * as PactActions from '../actions/PactActions';
import { ActionTypes } from '../constants/ActionTypes';

type Action =
  PactActions.SetPactCategoryAction |
  PactActions.SetPactLevelAction |
  PactActions.SetTargetDomainAction |
  PactActions.SetTargetNameAction |
  PactActions.SetTargetTypeAction;

export type PactState = PactActions.Pact | null;

export function pactReducer(
  state: PactState = null,
  action: Action,
): PactState {
  switch (action.type) {
    case ActionTypes.SET_PACT_CATEGORY: {
      const { category } = action.payload;
      if (category === undefined) {
        return null;
      }
      return {
        category,
        level: 1,
        type: 1,
        domain: '',
        name: ''
      };
    }

    case ActionTypes.SET_PACT_LEVEL:
    case ActionTypes.SET_TARGET_TYPE:
    case ActionTypes.SET_TARGET_DOMAIN:
    case ActionTypes.SET_TARGET_NAME: {
      if (state !== null) {
        return {
          ...state,
          ...action.payload
        };
      }
      return null;
    }

    default:
      return state;
  }
}
