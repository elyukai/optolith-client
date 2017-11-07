import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as AttributesActions from '../actions/AttributesActions';
import { AppState } from '../reducers/app';
import { getForView, getSum } from '../selectors/attributeSelectors';
import { getStartEl } from '../selectors/elSelectors';
import { isInCharacterCreation, isRemovingEnabled } from '../selectors/phaseSelectors';
import { getDerivedCharacteristics } from '../utils/derivedCharacteristics';
import { Attributes, AttributesDispatchProps, AttributesOwnProps, AttributesStateProps } from '../views/attributes/Attributes';

function mapStateToProps(state: AppState) {
	return {
		attributes: getForView(state),
		isInCharacterCreation: isInCharacterCreation(state),
		isRemovingEnabled: isRemovingEnabled(state),
		derived: getDerivedCharacteristics(state),
		maxTotalAttributeValues: getStartEl(state).maxTotalAttributeValues,
		sum: getSum(state)
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
		}
	};
}

export const AttributesContainer = connect<AttributesStateProps, AttributesDispatchProps, AttributesOwnProps>(mapStateToProps, mapDispatchToProps)(Attributes);
