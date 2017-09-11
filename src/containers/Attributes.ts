import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as AttributesActions from '../actions/AttributesActions';
import { AppState } from '../reducers/app';
import { getForView, getSum } from '../selectors/attributeSelectors';
import { getStartEl } from '../selectors/elSelectors';
import { getPhase } from '../selectors/phaseSelectors';
import { getDerivedCharacteristics } from '../utils/derivedCharacteristics';
import { Attributes, AttributesDispatchProps, AttributesOwnProps, AttributesStateProps } from '../views/attributes/Attributes';

function mapStateToProps(state: AppState) {
	return {
		attributes: getForView(state),
		phase: getPhase(state),
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
			const action = AttributesActions._addLifePoint();
			if (action) {
				dispatch(action);
			}
		},
		addArcaneEnergyPoint: () => {
			const action = AttributesActions._addArcaneEnergyPoint();
			if (action) {
				dispatch(action);
			}
		},
		addKarmaPoint: () => {
			const action = AttributesActions._addKarmaPoint();
			if (action) {
				dispatch(action);
			}
		},
		addBoughtBackAEPoint: () => {
			const action = AttributesActions._addBoughtBackAEPoint();
			if (action) {
				dispatch(action);
			}
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
			const action = AttributesActions._addBoughtBackKPPoint();
			if (action) {
				dispatch(action);
			}
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
