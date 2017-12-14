import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as HerolistActions from '../actions/HerolistActions';
import * as IOActions from '../actions/IOActions';
import * as LocationActions from '../actions/LocationActions';
import * as SubwindowsActions from '../actions/SubwindowsActions';
import { AppState } from '../reducers/app';
import { getPresent } from '../selectors/currentHeroSelectors';
import { getAll } from '../selectors/elSelectors';
import { getCurrentId, getHeroesArray, getUsers } from '../selectors/herolistSelectors';
import { isCharacterCreatorOpen } from '../selectors/stateSelectors';
import { getHerolistSortOrder, getHerolistVisibilityFilter } from '../selectors/uisettingsSelectors';
import { Herolist, HerolistDispatchProps, HerolistOwnProps, HerolistStateProps } from '../views/herolist/Herolist';

function mapStateToProps(state: AppState) {
	return {
		currentHero: getPresent(state),
		currentHeroId: getCurrentId(state),
		elList: getAll(state),
		list: getHeroesArray(state),
		users: getUsers(state),
		sortOrder: getHerolistSortOrder(state),
		visibilityFilter: getHerolistVisibilityFilter(state),
		isCharacterCreatorOpen: isCharacterCreatorOpen(state),
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
			dispatch(LocationActions._setSection('hero'));
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
		createHero(name: string, sex: 'm' | 'f', el: string) {
			dispatch(HerolistActions._createHero(name, sex, el));
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
