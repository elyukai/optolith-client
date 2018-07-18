import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as AttributesActions from '../actions/AttributesActions';
import * as SubwindowsActions from '../actions/SubwindowsActions';
import { AppState } from '../reducers/app';
import { getAdjustmentValue, getAvailableAdjustmentIds, getCurrentAdjustmentId, getForView, getSum } from '../selectors/attributeSelectors';
import { getDerivedCharacteristics } from '../selectors/derivedCharacteristicsSelectors';
import { getStartEl } from '../selectors/elSelectors';
import { isInCharacterCreation, isRemovingEnabled } from '../selectors/phaseSelectors';
import { getAddPermanentEnergy, getEditPermanentEnergy } from '../selectors/stateSelectors';
import { Attributes, AttributesDispatchProps, AttributesOwnProps, AttributesStateProps } from '../views/attributes/Attributes';

function mapStateToProps(state: AppState) {
	return {
		adjustmentValue: getAdjustmentValue(state),
		attributes: getForView(state),
		availableAttributeIds: getAvailableAdjustmentIds(state),
		currentAttributeId: getCurrentAdjustmentId(state),
		isInCharacterCreation: isInCharacterCreation(state),
		isRemovingEnabled: isRemovingEnabled(state),
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
				dispatch<any>(action);
			}
		},
		removePoint: (id: string) => {
			dispatch<any>(AttributesActions._removePoint(id));
		},
		addLifePoint: () => {
			dispatch<any>(AttributesActions._addLifePoint());
		},
		addArcaneEnergyPoint: () => {
			dispatch<any>(AttributesActions._addArcaneEnergyPoint());
		},
		addKarmaPoint: () => {
			dispatch<any>(AttributesActions._addKarmaPoint());
		},
		removeLifePoint: () => {
			dispatch<any>(AttributesActions.removeLifePoint());
		},
		removeArcaneEnergyPoint: () => {
			dispatch<any>(AttributesActions.removeArcaneEnergyPoint());
		},
		removeKarmaPoint: () => {
			dispatch<any>(AttributesActions.removeKarmaPoint());
		},
		addLostLPPoint: () => {
			dispatch<any>(AttributesActions._addLostLPPoint());
		},
		removeLostLPPoint: () => {
			dispatch<any>(AttributesActions._removeLostLPPoint());
		},
		addLostLPPoints: (value: number) => {
			dispatch<any>(AttributesActions._addLostLPPoints(value));
		},
		addBoughtBackAEPoint: () => {
			dispatch<any>(AttributesActions._addBoughtBackAEPoint());
		},
		removeBoughtBackAEPoint: () => {
			dispatch<any>(AttributesActions._removeBoughtBackAEPoint());
		},
		addLostAEPoint: () => {
			dispatch<any>(AttributesActions._addLostAEPoint());
		},
		removeLostAEPoint: () => {
			dispatch<any>(AttributesActions._removeLostAEPoint());
		},
		addLostAEPoints: (value: number) => {
			dispatch<any>(AttributesActions._addLostAEPoints(value));
		},
		addBoughtBackKPPoint: () => {
			dispatch<any>(AttributesActions._addBoughtBackKPPoint());
		},
		removeBoughtBackKPPoint: () => {
			dispatch<any>(AttributesActions._removeBoughtBackKPPoint());
		},
		addLostKPPoint: () => {
			dispatch<any>(AttributesActions._addLostKPPoint());
		},
		removeLostKPPoint: () => {
			dispatch<any>(AttributesActions._removeLostKPPoint());
		},
		addLostKPPoints: (value: number) => {
			dispatch<any>(AttributesActions._addLostKPPoints(value));
		},
		openAddPermanentEnergyLoss: (energy: 'LP' | 'AE' | 'KP') => {
			dispatch<any>(SubwindowsActions.openAddPermanentEnergyLoss(energy));
		},
		closeAddPermanentEnergyLoss: () => {
			dispatch<any>(SubwindowsActions.closeAddPermanentEnergyLoss());
		},
		openEditPermanentEnergy: (energy: 'LP' | 'AE' | 'KP') => {
			dispatch<any>(SubwindowsActions.openEditPermanentEnergy(energy));
		},
		closeEditPermanentEnergy: () => {
			dispatch<any>(SubwindowsActions.closeEditPermanentEnergy());
		},
		setAdjustmentId: (id: string) => {
			dispatch<any>(AttributesActions.setAdjustmentId(id));
		}
	};
}

export const AttributesContainer = connect<AttributesStateProps, AttributesDispatchProps, AttributesOwnProps>(mapStateToProps, mapDispatchToProps)(Attributes);
