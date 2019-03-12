import { SelectCultureAction } from '../Actions/CultureActions';
import { SelectProfessionAction } from '../Actions/ProfessionActions';
import { SelectProfessionVariantAction } from '../Actions/ProfessionVariantActions';
import { SelectRaceAction, SetRaceVariantAction } from '../Actions/RaceActions';
import { ActionTypes } from '../Constants/ActionTypes';
import * as Data from '../Models/Hero/heroTypeHelpers';
import { Nothing, Record } from '../utils/dataUtils';

type Action =
  SelectRaceAction |
  SetRaceVariantAction |
  SelectCultureAction |
  SelectProfessionAction |
  SelectProfessionVariantAction;

export function rcpReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SELECT_RACE:
      return state
        .insert ('race') (action.payload.id)
        .insertMaybe ('raceVariant') (action.payload.variantId)
        .insertMaybe ('culture') (Nothing ())
        .insertMaybe ('profession') (Nothing ())
        .insertMaybe ('professionVariant') (Nothing ());

    case ActionTypes.SET_RACE_VARIANT:
      return state
        .insert ('raceVariant') (action.payload.id)
        .insertMaybe ('culture') (Nothing ())
        .insertMaybe ('profession') (Nothing ())
        .insertMaybe ('professionVariant') (Nothing ());

    case ActionTypes.SELECT_CULTURE:
      return state
        .insert ('culture') (action.payload.id)
        .insertMaybe ('profession') (Nothing ())
        .insertMaybe ('professionVariant') (Nothing ());

    case ActionTypes.SELECT_PROFESSION:
      return state
        .insert ('profession') (action.payload.id)
        .insertMaybe ('professionVariant') (Nothing ());

    case ActionTypes.SELECT_PROFESSION_VARIANT:
      return state .insertMaybe ('professionVariant') (action.payload.id);

    default:
      return state;
  }
}
