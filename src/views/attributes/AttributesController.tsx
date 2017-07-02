import { connect, Dispatch } from 'react-redux';
import * as AttributesActions from '../../actions/AttributesActions';
import { ATTRIBUTES } from '../../constants/Categories';
import { AppState } from '../../reducers/app';
import { getAllByCategory } from '../../reducers/dependentInstances';
import { getStart } from '../../reducers/el';
import { AttributeInstance } from '../../types/data.d';
import { getSum } from '../../utils/AttributeUtils';
import { getAll } from '../../utils/derivedCharacteristics';
import { Attributes } from './Attributes';

function mapStateToProps(state: AppState) {
	const { currentHero } = state;
	const attributes = getAllByCategory(currentHero.present.dependent, ATTRIBUTES) as AttributeInstance[];
	return {
		attributes,
		el: getStart(currentHero.present.el),
		phase: currentHero.present.phase,
		derived: getAll(state.currentHero),
		sum: getSum(attributes)
	};
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
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

export const AttributesController = connect(mapStateToProps, mapDispatchToProps)(Attributes);
