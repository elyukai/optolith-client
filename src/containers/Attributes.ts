import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as AttributesActions from '../actions/AttributesActions';
import * as SubwindowsActions from '../actions/SubwindowsActions';
import { AppState } from '../reducers/app';
import { getAdjustmentValue, getAvailableAdjustmentIds, getCurrentAdjustmentId, getForView, getSum } from '../selectors/attributeSelectors';
import { getDerivedCharacteristics } from '../selectors/derivedCharacteristicsSelectors';
import { getStartEl } from '../selectors/elSelectors';
import { isInCharacterCreation, getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getAddPermanentEnergy, getEditPermanentEnergy } from '../selectors/stateSelectors';
import { Attributes, AttributesDispatchProps, AttributesOwnProps, AttributesStateProps } from '../views/attributes/Attributes';

function mapStateToProps(state: AppState) {
	return {
		adjustmentValue: getAdjustmentValue(state),
		attributes: getForView(state),
		availableAttributeIds: getAvailableAdjustmentIds(state),
		currentAttributeId: getCurrentAdjustmentId(state),
		isInCharacterCreation: isInCharacterCreation(state),
		isRemovingEnabled: getIsRemovingEnabled(state),
		derived: getDerivedCharacteristics(state),
		maxTotalAttributeValues: getStartEl(state).maxTotalAttributeValues,
		sum: getSum(state),
		getEditPermanentEnergy: getEditPermanentEnergy(state),
		getAddPermanentEnergy: getAddPermanentEnergy(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addPoint: (id: string) => {
			const action = AttributesActions._addPoint(id);
			if (action) {
				dispatch(action);
			}
		},
		removePoint: (id: string) => {
			dispatch(AttributesActions._removePoint(id));
		},
		addLifePoint: () => {
			dispatch(AttributesActions._addLifePoint());
		},
		addArcaneEnergyPoint: () => {
			dispatch(AttributesActions._addArcaneEnergyPoint());
		},
		addKarmaPoint: () => {
			dispatch(AttributesActions._addKarmaPoint());
		},
		removeLifePoint: () => {
			dispatch(AttributesActions.removeLifePoint());
		},
		removeArcaneEnergyPoint: () => {
			dispatch(AttributesActions.removeArcaneEnergyPoint());
		},
		removeKarmaPoint: () => {
			dispatch(AttributesActions.removeKarmaPoint());
		},
		addLostLPPoint: () => {
			dispatch(AttributesActions._addLostLPPoint());
		},
		removeLostLPPoint: () => {
			dispatch(AttributesActions._removeLostLPPoint());
		},
		addLostLPPoints: (value: number) => {
			dispatch(AttributesActions._addLostLPPoints(value));
		},
		addBoughtBackAEPoint: () => {
			dispatch(AttributesActions._addBoughtBackAEPoint());
		},
		removeBoughtBackAEPoint: () => {
			dispatch(AttributesActions._removeBoughtBackAEPoint());
		},
		addLostAEPoint: () => {
			dispatch(AttributesActions._addLostAEPoint());
		},
		removeLostAEPoint: () => {
			dispatch(AttributesActions._removeLostAEPoint());
		},
		addLostAEPoints: (value: number) => {
			dispatch(AttributesActions._addLostAEPoints(value));
		},
		addBoughtBackKPPoint: () => {
			dispatch(AttributesActions._addBoughtBackKPPoint());
		},
		removeBoughtBackKPPoint: () => {
			dispatch(AttributesActions._removeBoughtBackKPPoint());
		},
		addLostKPPoint: () => {
			dispatch(AttributesActions._addLostKPPoint());
		},
		removeLostKPPoint: () => {
			dispatch(AttributesActions._removeLostKPPoint());
		},
		addLostKPPoints: (value: number) => {
			dispatch(AttributesActions._addLostKPPoints(value));
		},
		openAddPermanentEnergyLoss: (energy: 'LP' | 'AE' | 'KP') => {
			dispatch(SubwindowsActions.openAddPermanentEnergyLoss(energy));
		},
		closeAddPermanentEnergyLoss: () => {
			dispatch(SubwindowsActions.closeAddPermanentEnergyLoss());
		},
		openEditPermanentEnergy: (energy: 'LP' | 'AE' | 'KP') => {
			dispatch(SubwindowsActions.openEditPermanentEnergy(energy));
		},
		closeEditPermanentEnergy: () => {
			dispatch(SubwindowsActions.closeEditPermanentEnergy());
		},
		setAdjustmentId: (id: string) => {
			dispatch(AttributesActions.setAdjustmentId(id));
		}
	};
}

export const AttributesContainer = connect<AttributesStateProps, AttributesDispatchProps, AttributesOwnProps>(mapStateToProps, mapDispatchToProps)(Attributes);
