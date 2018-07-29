import { SelectCultureAction } from '../actions/CultureActions';
import { SelectProfessionAction } from '../actions/ProfessionActions';
import { SelectProfessionVariantAction } from '../actions/ProfessionVariantActions';
import { SelectRaceAction, SetRaceVariantAction } from '../actions/RaceActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Data from '../types/data.d';
import { Record } from '../utils/dataUtils';

type Action =
  SelectRaceAction |
  SetRaceVariantAction |
  SelectCultureAction |
  SelectProfessionAction |
  SelectProfessionVariantAction;

export function rcpReducer(
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SELECT_RACE:
      return state
        .insert('race', action.payload.id)
        .insert('raceVariant', action.payload.variantId)
        .insert('culture', undefined)
        .insert('profession', undefined)
        .insert('professionVariant', undefined);

    case ActionTypes.SET_RACE_VARIANT:
      return state
        .insert('raceVariant', action.payload.id)
        .insert('culture', undefined)
        .insert('profession', undefined)
        .insert('professionVariant', undefined);

    case ActionTypes.SELECT_CULTURE:
      return state
        .insert('culture', action.payload.id)
        .insert('profession', undefined)
        .insert('professionVariant', undefined);

    case ActionTypes.SELECT_PROFESSION:
      return state
        .insert('profession', action.payload.id)
        .insert('professionVariant', undefined);

    case ActionTypes.SELECT_PROFESSION_VARIANT:
      return state.insert('professionVariant', action.payload.id)

    default:
      return state;
  }
}
