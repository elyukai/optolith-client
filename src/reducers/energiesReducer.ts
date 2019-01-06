import * as R from 'ramda';
import * as AttributesActions from '../actions/AttributesActions';
import * as ProfessionActions from '../actions/ProfessionActions';
import * as Data from '../App/Models/Hero/heroTypeHelpers';
import { ifElse } from '../App/Utils/ifElse';
import { ActionTypes } from '../constants/ActionTypes';
import { Record } from '../utils/dataUtils';

type AddedEnergyAction =
  AttributesActions.AddArcaneEnergyPointAction |
  AttributesActions.AddKarmaPointAction |
  AttributesActions.AddLifePointAction |
  AttributesActions.RemoveArcaneEnergyPointAction |
  AttributesActions.RemoveKarmaPointAction |
  AttributesActions.RemoveLifePointAction;

type Action =
  AddedEnergyAction |
  ProfessionActions.SetSelectionsAction |
  AttributesActions.AddBoughtBackAEPointAction |
  AttributesActions.AddBoughtBackKPPointAction |
  AttributesActions.AddLostAEPointAction |
  AttributesActions.AddLostAEPointsAction |
  AttributesActions.AddLostKPPointAction |
  AttributesActions.AddLostKPPointsAction |
  AttributesActions.RemoveBoughtBackAEPointAction |
  AttributesActions.RemoveBoughtBackKPPointAction |
  AttributesActions.RemoveLostAEPointAction |
  AttributesActions.RemoveLostKPPointAction |
  AttributesActions.AddLostLPPointAction |
  AttributesActions.AddLostLPPointsAction |
  AttributesActions.RemoveLostLPPointAction;

function addedEnergiesReducer (
  state: Record<Data.HeroDependent>,
  action: AddedEnergyAction
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ADD_LIFE_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'addedLifePoints'> (R.inc) ('addedLifePoints')
      ) ('energies');

    case ActionTypes.ADD_ARCANE_ENERGY_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'addedArcaneEnergyPoints'> (R.inc) ('addedArcaneEnergyPoints')
      ) ('energies');

    case ActionTypes.ADD_KARMA_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'addedKarmaPoints'> (R.inc) ('addedKarmaPoints')
      ) ('energies');

    case ActionTypes.REMOVE_LIFE_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'addedLifePoints'> (R.dec) ('addedLifePoints')
      ) ('energies');

    case ActionTypes.REMOVE_ARCANE_ENERGY_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'addedArcaneEnergyPoints'> (R.dec) ('addedArcaneEnergyPoints')
      ) ('energies');

    case ActionTypes.REMOVE_KARMA_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'addedKarmaPoints'> (R.dec) ('addedKarmaPoints')
      ) ('energies');

    default:
      return state;
  }
}

export function energiesReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ADD_LIFE_POINT:
    case ActionTypes.ADD_ARCANE_ENERGY_POINT:
    case ActionTypes.ADD_KARMA_POINT:
    case ActionTypes.REMOVE_LIFE_POINT:
    case ActionTypes.REMOVE_ARCANE_ENERGY_POINT:
    case ActionTypes.REMOVE_KARMA_POINT:
      return addedEnergiesReducer (state, action);

    case ActionTypes.ADD_BOUGHT_BACK_AE_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentArcaneEnergyPoints'> (
          obj => obj.modify<'redeemed'> (R.inc) ('redeemed')
        ) ('permanentArcaneEnergyPoints')
      ) ('energies');

    case ActionTypes.ADD_BOUGHT_BACK_KP_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentKarmaPoints'> (
          obj => obj.modify<'redeemed'> (R.inc) ('redeemed')
        ) ('permanentKarmaPoints')
      ) ('energies');

    case ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentArcaneEnergyPoints'> (
          obj => obj.modify<'redeemed'> (R.dec) ('redeemed')
        ) ('permanentArcaneEnergyPoints')
      ) ('energies');

    case ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentKarmaPoints'> (
          obj => obj.modify<'redeemed'> (R.dec) ('redeemed')
        ) ('permanentKarmaPoints')
      ) ('energies');

    case ActionTypes.ADD_LOST_LP_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentLifePoints'> (
          obj => obj.modify<'lost'> (R.inc) ('lost')
        ) ('permanentLifePoints')
      ) ('energies');

    case ActionTypes.ADD_LOST_AE_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentArcaneEnergyPoints'> (
          obj => obj.modify<'lost'> (R.inc) ('lost')
        ) ('permanentArcaneEnergyPoints')
      ) ('energies');

    case ActionTypes.ADD_LOST_KP_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentKarmaPoints'> (
          obj => obj.modify<'lost'> (R.inc) ('lost')
        ) ('permanentKarmaPoints')
      ) ('energies');

    case ActionTypes.REMOVE_LOST_LP_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentLifePoints'> (
          obj => obj.modify<'lost'> (R.dec) ('lost')
        ) ('permanentLifePoints')
      ) ('energies');

    case ActionTypes.REMOVE_LOST_AE_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentArcaneEnergyPoints'> (
          obj => obj
            .modify<'redeemed'> (x => obj.get ('lost') === x ? x - 1 : x) ('redeemed')
            .modify<'lost'> (R.dec) ('lost')
        ) ('permanentArcaneEnergyPoints')
      ) ('energies');

    case ActionTypes.REMOVE_LOST_KP_POINT:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentKarmaPoints'> (
          obj => obj
            .modify<'redeemed'> (
              ifElse<number, number> (R.equals (obj.get ('lost'))) (R.dec) (R.identity)
            ) ('redeemed')
            .modify<'lost'> (R.dec) ('lost')
        ) ('permanentKarmaPoints')
      ) ('energies');

    case ActionTypes.ADD_LOST_LP_POINTS:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentLifePoints'> (
          obj => obj.modify<'lost'> (R.add (action.payload.value)) ('lost')
        ) ('permanentLifePoints')
      ) ('energies');

    case ActionTypes.ADD_LOST_AE_POINTS:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentArcaneEnergyPoints'> (
          obj => obj.modify<'lost'> (R.add (action.payload.value)) ('lost')
        ) ('permanentArcaneEnergyPoints')
      ) ('energies');

    case ActionTypes.ADD_LOST_KP_POINTS:
      return state.modify<'energies'> (
        energies => energies.modify<'permanentKarmaPoints'> (
          obj => obj.modify<'lost'> (R.add (action.payload.value)) ('lost')
        ) ('permanentKarmaPoints')
      ) ('energies');

    default:
      return state;
  }
}
