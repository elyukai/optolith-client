import { last } from 'lodash';
import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as LiturgiesActions from '../actions/LiturgiesActions';
import { BLESSINGS, LITURGIES } from '../constants/Categories';
import { AppState } from '../reducers/app';
import { getPresent } from '../selectors/currentHeroSelectors';
import { get, getAllByCategory, getDependent } from '../selectors/dependentInstancesSelectors';
import { isActivationDisabled } from '../selectors/liturgiesSelectors';
import { getPhase } from '../selectors/phaseSelectors';
import { getEnableActiveItemHints, getLiturgiesSortOrder } from '../selectors/uisettingsSelectors';
import { BlessingInstance, LiturgyInstance, SpecialAbilityInstance } from '../types/data.d';
import { getSids } from '../utils/ActivatableUtils';
import { DCIds, get as getDerivedCharacteristic } from '../utils/derivedCharacteristics';
import { Liturgies, LiturgiesDispatchProps, LiturgiesOwnProps, LiturgiesStateProps } from '../views/skills/Liturgies';

function mapStateToProps(state: AppState) {
	return {
		addChantsDisabled: isActivationDisabled(state),
		currentHero: getPresent(state),
		enableActiveItemHints: getEnableActiveItemHints(state),
		list: getAllByCategory(getDependent(state), LITURGIES, BLESSINGS) as (LiturgyInstance | BlessingInstance)[],
		phase: getPhase(state),
		sortOrder: getLiturgiesSortOrder(state),
		traditionId: last(getSids(get(getDependent(state), 'SA_102') as SpecialAbilityInstance)) as number,
		get(id: string) {
			return get(getDependent(state), id);
		},
		getDerivedCharacteristic(id: DCIds) {
			return getDerivedCharacteristic(getPresent(state), id);
		},
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		addPoint(id: string) {
			dispatch(LiturgiesActions._addPoint(id));
		},
		addToList(id: string) {
			dispatch(LiturgiesActions._addToList(id));
		},
		addBlessingToList(id: string) {
			dispatch(LiturgiesActions._addBlessingToList(id));
		},
		removePoint(id: string) {
			dispatch(LiturgiesActions._removePoint(id));
		},
		removeFromList(id: string) {
			dispatch(LiturgiesActions._removeFromList(id));
		},
		removeBlessingFromList(id: string) {
			dispatch(LiturgiesActions._removeBlessingFromList(id));
		},
		setSortOrder(sortOrder: string) {
			dispatch(LiturgiesActions._setSortOrder(sortOrder));
		},
		switchActiveItemHints() {
			dispatch(ConfigActions._switchEnableActiveItemHints());
		}
	};
}

export const LiturgiesContainer = connect<LiturgiesStateProps, LiturgiesDispatchProps, LiturgiesOwnProps>(mapStateToProps, mapDispatchToProps)(Liturgies);
