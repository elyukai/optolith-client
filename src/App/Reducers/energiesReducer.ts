import { ident } from "../../Data/Function";
import { over, view } from "../../Data/Lens";
import { add, dec, inc } from "../../Data/Num";
import * as AttributesActions from "../Actions/AttributesActions";
import * as ProfessionActions from "../Actions/ProfessionActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { EnergiesL } from "../Models/Hero/Energies";
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { PermanentEnergyLossL } from "../Models/Hero/PermanentEnergyLoss";
import { PermanentEnergyLossAndBoughtBackL } from "../Models/Hero/PermanentEnergyLossAndBoughtBack";
import { composeL } from "../Utilities/compose";
import { pipe } from "../Utilities/pipe";

type AddedEnergyAction =
  AttributesActions.AddArcaneEnergyPointAction |
  AttributesActions.AddKarmaPointAction |
  AttributesActions.AddLifePointAction |
  AttributesActions.RemoveArcaneEnergyPointAction |
  AttributesActions.RemoveKarmaPointAction |
  AttributesActions.RemoveLifePointAction

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
  AttributesActions.RemoveLostLPPointAction

const { energies } = HeroModelL

const {
  addedArcaneEnergyPoints,
  addedKarmaPoints,
  addedLifePoints,
  permanentArcaneEnergyPoints,
  permanentKarmaPoints,
  permanentLifePoints,
} = EnergiesL

const { lost } = PermanentEnergyLossL
const { lost: lost_, redeemed } = PermanentEnergyLossAndBoughtBackL

const addedEnergiesReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ADD_LIFE_POINT:
        return over (composeL (energies, addedLifePoints))
                    (inc)

      case ActionTypes.ADD_ARCANE_ENERGY_POINT:
        return over (composeL (energies, addedArcaneEnergyPoints))
                    (inc)

      case ActionTypes.ADD_KARMA_POINT:
        return over (composeL (energies, addedKarmaPoints))
                    (inc)

      case ActionTypes.REMOVE_LIFE_POINT:
        return over (composeL (energies, addedLifePoints))
                    (dec)

      case ActionTypes.REMOVE_ARCANE_ENERGY_POINT:
        return over (composeL (energies, addedArcaneEnergyPoints))
                    (dec)

      case ActionTypes.REMOVE_KARMA_POINT:
        return over (composeL (energies, addedKarmaPoints))
                    (dec)

      default:
        return ident
    }
  }

export const energiesReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ADD_LIFE_POINT:
      case ActionTypes.ADD_ARCANE_ENERGY_POINT:
      case ActionTypes.ADD_KARMA_POINT:
      case ActionTypes.REMOVE_LIFE_POINT:
      case ActionTypes.REMOVE_ARCANE_ENERGY_POINT:
      case ActionTypes.REMOVE_KARMA_POINT:
        return addedEnergiesReducer (action)

      case ActionTypes.ADD_BOUGHT_BACK_AE_POINT:
        return over (composeL (energies, permanentArcaneEnergyPoints, redeemed))
                    (inc)

      case ActionTypes.ADD_BOUGHT_BACK_KP_POINT:
        return over (composeL (energies, permanentKarmaPoints, redeemed))
                    (inc)

      case ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT:
        return over (composeL (energies, permanentArcaneEnergyPoints, redeemed))
                    (dec)

      case ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT:
        return over (composeL (energies, permanentKarmaPoints, redeemed))
                    (dec)

      case ActionTypes.ADD_LOST_LP_POINT:
        return over (composeL (energies, permanentLifePoints, lost))
                    (inc)

      case ActionTypes.ADD_LOST_AE_POINT:
        return over (composeL (energies, permanentArcaneEnergyPoints, lost_))
                    (inc)

      case ActionTypes.ADD_LOST_KP_POINT:
        return over (composeL (energies, permanentKarmaPoints, lost_))
                    (inc)

      case ActionTypes.REMOVE_LOST_LP_POINT:
        return over (composeL (energies, permanentLifePoints, lost))
                    (dec)

      case ActionTypes.REMOVE_LOST_AE_POINT:
        return over (composeL (energies, permanentArcaneEnergyPoints))
                    (x => pipe (
                                 over (redeemed)
                                      (red => view (lost_) (x) === red ? dec (red) : red),
                                 over (lost_) (dec)
                               )
                               (x))

      case ActionTypes.REMOVE_LOST_KP_POINT:
        return over (composeL (energies, permanentKarmaPoints))
                    (x => pipe (
                                 over (redeemed)
                                      (red => view (lost_) (x) === red ? dec (red) : red),
                                 over (lost_) (dec)
                               )
                               (x))

      case ActionTypes.ADD_LOST_LP_POINTS:
        return over (composeL (energies, permanentLifePoints, lost))
                    (add (action.payload.value))

      case ActionTypes.ADD_LOST_AE_POINTS:
        return over (composeL (energies, permanentArcaneEnergyPoints, lost_))
                    (add (action.payload.value))

      case ActionTypes.ADD_LOST_KP_POINTS:
        return over (composeL (energies, permanentKarmaPoints, lost_))
                    (add (action.payload.value))

      default:
        return ident
    }
  }
