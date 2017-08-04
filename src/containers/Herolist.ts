import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as FileActions from '../actions/FileActions';
import * as HerolistActions from '../actions/HerolistActions';
import * as LocationActions from '../actions/LocationActions';
import { AppState } from '../reducers/app';
import { getPresent } from '../selectors/currentHeroSelectors';
import { getCurrentId, getHeroesArray, getUsers } from '../selectors/herolistSelectors';
import { getHerolistSortOrder, getHerolistVisibilityFilter } from '../selectors/uisettingsSelectors';
import { Herolist, HerolistDispatchProps, HerolistOwnProps, HerolistStateProps } from '../views/herolist/Herolist';

function mapStateToProps(state: AppState) {
	return {
		currentHero: getPresent(state),
		currentHeroId: getCurrentId(state),
		list: getHeroesArray(state),
		users: getUsers(state),
		sortOrder: getHerolistSortOrder(state),
		visibilityFilter: getHerolistVisibilityFilter(state)
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>, props: HerolistOwnProps) {
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
				dispatch(HerolistActions.exportHeroValidate(id, props.locale));
			}
		},
		deleteHero(id?: string) {
			if (id) {
				dispatch(HerolistActions._deleteHero(id));
			}
		},
		duplicateHero(id?: string) {
			if (id) {
				dispatch(HerolistActions._duplicateHero(id));
			}
		},
		showHeroCreation() {
			dispatch(HerolistActions.showHeroCreation());
		},
		importHero() {
			dispatch(FileActions.requestHeroImport(props.locale));
		},
		setSortOrder(id: string) {
			dispatch(HerolistActions._setSortOrder(id));
		},
		setVisibilityFilter(id: string) {
			dispatch(HerolistActions._setVisibilityFilter(id));
		}
	};
}

export const HerolistContainer = connect<HerolistStateProps, HerolistDispatchProps, HerolistOwnProps>(mapStateToProps, mapDispatchToProps)(Herolist);
