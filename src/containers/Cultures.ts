import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as CultureActions from '../actions/CultureActions';
import { AppState } from '../reducers/app';
import { getFilteredCultures } from '../selectors/rcpSelectors';
import { getCulturesFilterText, getCurrentCultureId } from '../selectors/stateSelectors';
import { getCulturesSortOrder, getCulturesVisibilityFilter } from '../selectors/uisettingsSelectors';
import { Cultures, CulturesDispatchProps, CulturesOwnProps, CulturesStateProps } from '../views/rcp/Cultures';

function mapStateToProps(state: AppState) {
	return {
		cultures: getFilteredCultures(state),
		currentId: getCurrentCultureId(state),
		sortOrder: getCulturesSortOrder(state),
		visibilityFilter: getCulturesVisibilityFilter(state),
		filterText: getCulturesFilterText(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		selectCulture(id: string) {
			dispatch(CultureActions._selectCulture(id));
		},
		setSortOrder(sortOrder: string) {
			dispatch(CultureActions._setSortOrder(sortOrder));
		},
		setVisibilityFilter(sortOrder: string) {
			dispatch(CultureActions._setVisibilityFilter(sortOrder));
		},
		switchValueVisibilityFilter() {
			dispatch(CultureActions._switchValueVisibilityFilter());
		},
		setFilterText(filterText: string) {
			dispatch(CultureActions.setFilterText(filterText));
		},
	};
}

export const CulturesContainer = connect<CulturesStateProps, CulturesDispatchProps, CulturesOwnProps>(mapStateToProps, mapDispatchToProps)(Cultures);
