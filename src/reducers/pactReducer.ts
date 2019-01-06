import * as PactActions from '../actions/PactActions';
import * as Data from '../App/Models/Hero/heroTypeHelpers';
import { ActionTypes } from '../constants/ActionTypes';
import { Maybe, Record } from '../utils/dataUtils';

type Action =
  PactActions.SetPactCategoryAction |
  PactActions.SetPactLevelAction |
  PactActions.SetTargetDomainAction |
  PactActions.SetTargetNameAction |
  PactActions.SetTargetTypeAction;

export function pactReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_PACT_CATEGORY: {
      const { category } = action.payload;

      if (Maybe.isJust (category)) {
        return state.insert ('pact') (
          Record.of<Data.Pact> ({
            category: Maybe.fromJust (category),
            level: 1,
            type: 1,
            domain: '',
            name: '',
          })
        );
      }

      return state.delete ('pact') as Record<Data.HeroDependent>;
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
