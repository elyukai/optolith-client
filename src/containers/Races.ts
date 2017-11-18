import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as RaceActions from '../actions/RaceActions';
import { AppState } from '../reducers/app';
import { getAllRaces } from '../selectors/rcpSelectors';
import { getCurrentRaceId, getCurrentRaceVariantId } from '../selectors/stateSelectors';
import { getRacesSortOrder, getRacesValueVisibility } from '../selectors/uisettingsSelectors';
import { Races, RacesDispatchProps, RacesOwnProps, RacesStateProps } from '../views/rcp/Races';

function mapStateToProps(state: AppState) {
	return {
		areValuesVisible: getRacesValueVisibility(state),
		currentId: getCurrentRaceId(state),
		currentVariantId: getCurrentRaceVariantId(state),
		races: getAllRaces(state),
		sortOrder: getRacesSortOrder(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		selectRace(id: string, variantId?: string) {
			dispatch(RaceActions._selectRace(id, variantId));
		},
		selectRaceVariant(id: string) {
			dispatch(RaceActions.setRaceVariant(id));
		},
		setSortOrder(sortOrder: string) {
			dispatch(RaceActions._setRacesSortOrder(sortOrder));
		},
		switchValueVisibilityFilter() {
			dispatch(RaceActions._switchRaceValueVisibilityFilter());
		}
	};
}

export const RacesContainer = connect<RacesStateProps, RacesDispatchProps, RacesOwnProps>(mapStateToProps, mapDispatchToProps)(Races);
