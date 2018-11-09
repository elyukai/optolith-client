import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as AttributesActions from '../actions/AttributesActions';
import * as SubwindowsActions from '../actions/SubwindowsActions';
import { AppState } from '../reducers/appReducer';
import { getAdjustmentValue, getAttributesForView, getAttributeSum, getAvailableAdjustmentIds } from '../selectors/attributeSelectors';
import { getDerivedCharacteristics } from '../selectors/derivedCharacteristicsSelectors';
import { getMaxTotalAttributeValues } from '../selectors/elSelectors';
import { getIsInCharacterCreation, getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getAddPermanentEnergy, getCurrentAttributeAdjustmentId, getEditPermanentEnergy } from '../selectors/stateSelectors';
import { Maybe } from '../utils/dataUtils';
import { Attributes, AttributesDispatchProps, AttributesOwnProps, AttributesStateProps } from '../views/attributes/Attributes';

const mapStateToProps = (state: AppState, ownProps: AttributesOwnProps): AttributesStateProps => ({
  adjustmentValue: getAdjustmentValue (state),
  attributes: getAttributesForView (state),
  availableAttributeIds: getAvailableAdjustmentIds (state),
  currentAttributeId: getCurrentAttributeAdjustmentId (state),
  isInCharacterCreation: getIsInCharacterCreation (state),
  isRemovingEnabled: getIsRemovingEnabled (state),
  derived: getDerivedCharacteristics (state, ownProps),
  maxTotalAttributeValues: getMaxTotalAttributeValues (state),
  sum: getAttributeSum (state),
  getEditPermanentEnergy: getEditPermanentEnergy (state),
  getAddPermanentEnergy: getAddPermanentEnergy (state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Action, AppState>,
  { locale }: AttributesOwnProps
): AttributesDispatchProps => ({
  addPoint: (id: string) => {
    dispatch (AttributesActions.addAttributePoint (id) (locale));
  },
  removePoint: (id: string) => {
    dispatch (AttributesActions.removeAttributePoint (id));
  },
  addLifePoint: () => {
    dispatch (AttributesActions.addLifePoint (locale));
  },
  addArcaneEnergyPoint: () => {
    dispatch (AttributesActions.addArcaneEnergyPoint (locale));
  },
  addKarmaPoint: () => {
    dispatch (AttributesActions.addKarmaPoint (locale));
  },
  removeLifePoint: () => {
    dispatch (AttributesActions.removeLifePoint ());
  },
  removeArcaneEnergyPoint: () => {
    dispatch (AttributesActions.removeArcaneEnergyPoint ());
  },
  removeKarmaPoint: () => {
    dispatch (AttributesActions.removeKarmaPoint ());
  },
  addLostLPPoint: () => {
    dispatch (AttributesActions.addLostLPPoint ());
  },
  removeLostLPPoint: () => {
    dispatch (AttributesActions.removeLostLPPoint ());
  },
  addLostLPPoints: (value: number) => {
    dispatch (AttributesActions.addLostLPPoints (value));
  },
  addBoughtBackAEPoint: () => {
    dispatch (AttributesActions.addBoughtBackAEPoint (locale));
  },
  removeBoughtBackAEPoint: () => {
    dispatch (AttributesActions.removeBoughtBackAEPoint ());
  },
  addLostAEPoint: () => {
    dispatch (AttributesActions.addLostAEPoint ());
  },
  removeLostAEPoint: () => {
    dispatch (AttributesActions.removeLostAEPoint ());
  },
  addLostAEPoints: (value: number) => {
    dispatch (AttributesActions.addLostAEPoints (value));
  },
  addBoughtBackKPPoint: () => {
    dispatch (AttributesActions.addBoughtBackKPPoint (locale));
  },
  removeBoughtBackKPPoint: () => {
    dispatch (AttributesActions.removeBoughtBackKPPoint ());
  },
  addLostKPPoint: () => {
    dispatch (AttributesActions.addLostKPPoint ());
  },
  removeLostKPPoint: () => {
    dispatch (AttributesActions.removeLostKPPoint ());
  },
  addLostKPPoints: (value: number) => {
    dispatch (AttributesActions.addLostKPPoints (value));
  },
  openAddPermanentEnergyLoss: (energy: 'LP' | 'AE' | 'KP') => {
    dispatch (SubwindowsActions.openAddPermanentEnergyLoss (energy));
  },
  closeAddPermanentEnergyLoss: () => {
    dispatch (SubwindowsActions.closeAddPermanentEnergyLoss ());
  },
  openEditPermanentEnergy: (energy: 'LP' | 'AE' | 'KP') => {
    dispatch (SubwindowsActions.openEditPermanentEnergy (energy));
  },
  closeEditPermanentEnergy: () => {
    dispatch (SubwindowsActions.closeEditPermanentEnergy ());
  },
  setAdjustmentId: (id: Maybe<string>) => {
    if (Maybe.isJust (id)) {
      dispatch (AttributesActions.setAdjustmentId (Maybe.fromJust (id)));
    }
  },
});

export const connectAttributes =
  connect<AttributesStateProps, AttributesDispatchProps, AttributesOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const AttributesContainer = connectAttributes (Attributes);
