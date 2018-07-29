import * as AttributesActions from '../actions/AttributesActions';
import * as ProfessionActions from '../actions/ProfessionActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Data from '../types/data.d';
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

function addedEnergiesReducer(
  state: Record<Data.HeroDependent>,
  action: AddedEnergyAction
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ADD_LIFE_POINT:
      return state.modify(
        energies => energies.modify(x => x + 1, 'addedLifePoints'),
        'energies'
      );

    case ActionTypes.ADD_ARCANE_ENERGY_POINT:
      return state.modify(
        energies => energies.modify(x => x + 1, 'addedArcaneEnergyPoints'),
        'energies'
      );

    case ActionTypes.ADD_KARMA_POINT:
      return state.modify(
        energies => energies.modify(x => x + 1, 'addedKarmaPoints'),
        'energies'
      );

    case ActionTypes.REMOVE_LIFE_POINT:
      return state.modify(
        energies => energies.modify(x => x - 1, 'addedLifePoints'),
        'energies'
      );

    case ActionTypes.REMOVE_ARCANE_ENERGY_POINT:
      return state.modify(
        energies => energies.modify(x => x - 1, 'addedArcaneEnergyPoints'),
        'energies'
      );

    case ActionTypes.REMOVE_KARMA_POINT:
      return state.modify(
        energies => energies.modify(x => x - 1, 'addedKarmaPoints'),
        'energies'
      );

    default:
      return state;
  }
}

export function energiesReducer(
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
      return addedEnergiesReducer(state, action);

    case ActionTypes.ADD_BOUGHT_BACK_AE_POINT:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x + 1, 'redeemed'),
          'permanentArcaneEnergyPoints'
        ),
        'energies'
      );

    case ActionTypes.ADD_BOUGHT_BACK_KP_POINT:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x + 1, 'redeemed'),
          'permanentKarmaPoints'
        ),
        'energies'
      );

    case ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x - 1, 'redeemed'),
          'permanentArcaneEnergyPoints'
        ),
        'energies'
      );

    case ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x - 1, 'redeemed'),
          'permanentKarmaPoints'
        ),
        'energies'
      );

    case ActionTypes.ADD_LOST_LP_POINT:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x + 1, 'lost'),
          'permanentLifePoints'
        ),
        'energies'
      );

    case ActionTypes.ADD_LOST_AE_POINT:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x + 1, 'lost'),
          'permanentArcaneEnergyPoints'
        ),
        'energies'
      );

    case ActionTypes.ADD_LOST_KP_POINT:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x + 1, 'lost'),
          'permanentKarmaPoints'
        ),
        'energies'
      );

    case ActionTypes.REMOVE_LOST_LP_POINT:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x - 1, 'lost'),
          'permanentLifePoints'
        ),
        'energies'
      );

    case ActionTypes.REMOVE_LOST_AE_POINT:
      return state.modify(
        energies => energies.modify(
          obj => obj
            .modify(x => obj.get('lost') === x ? x - 1 : x, 'redeemed')
            .modify(x => x - 1, 'lost'),
          'permanentArcaneEnergyPoints'
        ),
        'energies'
      );

    case ActionTypes.REMOVE_LOST_KP_POINT:
      return state.modify(
        energies => energies.modify(
          obj => obj
            .modify(x => obj.get('lost') === x ? x - 1 : x, 'redeemed')
            .modify(x => x - 1, 'lost'),
          'permanentKarmaPoints'
        ),
        'energies'
      );

    case ActionTypes.ADD_LOST_LP_POINTS:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x + action.payload.value, 'lost'),
          'permanentLifePoints'
        ),
        'energies'
      );

    case ActionTypes.ADD_LOST_AE_POINTS:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x + action.payload.value, 'lost'),
          'permanentArcaneEnergyPoints'
        ),
        'energies'
      );

    case ActionTypes.ADD_LOST_KP_POINTS:
      return state.modify(
        energies => energies.modify(
          obj => obj.modify(x => x + action.payload.value, 'lost'),
          'permanentKarmaPoints'
        ),
        'energies'
      );

    default:
      return state;
  }
}
