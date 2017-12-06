import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { setWikiCategory1, setWikiCategory2, setWikiFilter, setWikiFilterAll } from '../actions/WikiActions';
import { AppState } from '../reducers/app';
import { getAllProfessions } from '../selectors/rcpSelectors';
import { getSex, getWikiCategory1, getWikiCategory2, getWikiFilter, getWikiFilterAll } from '../selectors/stateSelectors';
import { Wiki, WikiDispatchProps, WikiOwnProps, WikiStateProps } from '../views/wiki/Wiki';

function mapStateToProps(state: AppState) {
	return {
		filterText: getWikiFilter(state),
		filterAllText: getWikiFilterAll(state),
		category1: getWikiCategory1(state),
		category2: getWikiCategory2(state),
		professions: getAllProfessions(state),
		sex: getSex(state)!,
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		setCategory1(category: string) {
			dispatch(setWikiCategory1(category));
		},
		setCategory2(category: string) {
			dispatch(setWikiCategory2(category));
		},
		setFilter(filterText: string) {
			dispatch(setWikiFilter(filterText));
		},
		setFilterAll(filterText: string) {
			dispatch(setWikiFilterAll(filterText));
		}
	};
}

export const WikiContainer = connect<WikiStateProps, WikiDispatchProps, WikiOwnProps>(mapStateToProps, mapDispatchToProps)(Wiki);
