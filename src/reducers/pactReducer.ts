import * as PactActions from '../actions/PactActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Data from '../types/data';
import { Record } from '../utils/dataUtils';

type Action =
  PactActions.SetPactCategoryAction |
  PactActions.SetPactLevelAction |
  PactActions.SetTargetDomainAction |
  PactActions.SetTargetNameAction |
  PactActions.SetTargetTypeAction;

export function pactReducer (
  state: Record<Data.HeroDependent>,
  action: Action,
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_PACT_CATEGORY: {
      const { category } = action.payload;

      if (category === undefined) {
        return state.delete ('pact') as Record<Data.HeroDependent>;
      }

      return state.insert ('pact') (
        Record.of<Data.Pact> ({
          category,
          level: 1,
          type: 1,
          domain: '',
          name: ''
        })
      );
    }

    case ActionTypes.SET_PACT_LEVEL:
    case ActionTypes.SET_TARGET_TYPE:
    case ActionTypes.SET_TARGET_DOMAIN:
    case ActionTypes.SET_TARGET_NAME:
      return state.modify<'pact'> (pact => pact.merge (Record.of (action.payload))) ('pact');

    default:
      return state;
  }
}
