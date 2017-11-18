import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as CultureActions from '../actions/CultureActions';
import { AppState } from '../reducers/app';
import { getAllCultures, getCommonCultures } from '../selectors/rcpSelectors';
import { getCurrentCultureId } from '../selectors/stateSelectors';
import { getCulturesSortOrder, getCulturesValueVisibility, getCulturesVisibilityFilter } from '../selectors/uisettingsSelectors';
import { Cultures, CulturesDispatchProps, CulturesOwnProps, CulturesStateProps } from '../views/rcp/Cultures';

function mapStateToProps(state: AppState) {
	return {
		areValuesVisible: getCulturesValueVisibility(state),
		commonCultures: getCommonCultures(state),
		cultures: getAllCultures(state),
		currentId: getCurrentCultureId(state),
		sortOrder: getCulturesSortOrder(state),
		visibilityFilter: getCulturesVisibilityFilter(state),
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
		}
	};
}

export const CulturesContainer = connect<CulturesStateProps, CulturesDispatchProps, CulturesOwnProps>(mapStateToProps, mapDispatchToProps)(Cultures);
