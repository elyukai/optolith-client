import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as HerolistActions from '../actions/HerolistActions';
import * as IOActions from '../actions/IOActions';
import * as LocationActions from '../actions/LocationActions';
import * as SubwindowsActions from '../actions/SubwindowsActions';
import { AppState } from '../reducers/app';
import { getSortedBooks } from '../selectors/bookSelectors';
import { getPresent } from '../selectors/currentHeroSelectors';
import { getCurrentId, getHeroesArray, getUsers } from '../selectors/herolistSelectors';
import { getWikiExperienceLevels, isCharacterCreatorOpen } from '../selectors/stateSelectors';
import { getHerolistSortOrder, getHerolistVisibilityFilter } from '../selectors/uisettingsSelectors';
import { Herolist, HerolistDispatchProps, HerolistOwnProps, HerolistStateProps } from '../views/herolist/Herolist';

function mapStateToProps(state: AppState, props?: HerolistOwnProps) {
	return {
		currentHero: getPresent(state),
		currentHeroId: getCurrentId(state),
		experienceLevels: getWikiExperienceLevels(state),
		list: getHeroesArray(state),
		users: getUsers(state),
		sortOrder: getHerolistSortOrder(state),
		visibilityFilter: getHerolistVisibilityFilter(state),
		isCharacterCreatorOpen: isCharacterCreatorOpen(state),
		sortedBooks: getSortedBooks(state, props!),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		loadHero(id?: string) {
			if (id) {
				dispatch(HerolistActions.loadHeroValidate(id));
			}
		},
		showHero() {
			dispatch(LocationActions._setTab('profile'));
		},
		saveHeroAsJSON(id?: string) {
			if (id) {
				dispatch(HerolistActions.exportHeroValidate(id));
			}
		},
		deleteHero(id?: string) {
			if (id) {
				dispatch(HerolistActions.deleteHeroValidate(id));
			}
		},
		duplicateHero(id?: string) {
			if (id) {
				dispatch(HerolistActions._duplicateHero(id));
			}
		},
		createHero(name: string, sex: 'm' | 'f', el: string, enableAllRuleBooks: boolean, enabledRuleBooks: Set<string>) {
			dispatch(HerolistActions._createHero(name, sex, el, enableAllRuleBooks, enabledRuleBooks));
		},
		importHero() {
			dispatch(IOActions.requestHeroImport());
		},
		setSortOrder(id: string) {
			dispatch(HerolistActions._setSortOrder(id));
		},
		setVisibilityFilter(id: string) {
			dispatch(HerolistActions._setVisibilityFilter(id));
		},
		openCharacterCreator() {
			dispatch(SubwindowsActions.openCharacterCreator());
		},
		closeCharacterCreator() {
			dispatch(SubwindowsActions.closeCharacterCreator());
		},
	};
}

export const HerolistContainer = connect<HerolistStateProps, HerolistDispatchProps, HerolistOwnProps>(mapStateToProps, mapDispatchToProps)(Herolist);
