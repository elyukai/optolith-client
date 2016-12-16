import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import ActionTypes from '../constants/ActionTypes';
import AuthStore from './AuthStore';

var _currentTab = 'herolist';
var _currentSection = 'main';

function _updateTab(tab) {
	_currentTab = tab;
}

function _updateSection(section, tab) {
	const before = _currentSection;
	
	_currentSection = section;

	if (tab)
		_updateTab(tab);
	else switch (section) {
		case 'main':
			if (before === 'hero') {
				if (AuthStore.getID() === null) {
					_currentTab = 'home';
				} else {
					_currentTab = 'herolist';
				}
			} else if (before === 'group') {
				_currentTab = 'grouplist';
			}
			break;
		case 'hero':
			_currentTab = 'profile';
			break;
		case 'group':
			_currentTab = 'master';
			break;
	}
}

class _TabStore extends Store {

	getAll() {
		return {
			section: _currentSection,
			tab: _currentTab
		};
	}
	
	getCurrentID() {
		return _currentTab;
	}
	
	getCurrentSID() {
		return _currentSection;
	}

}

const TabStore = new _TabStore();

TabStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.actionType ) {
		
		case ActionTypes.SHOW_TAB:
			_updateTab(payload.tab);
			break;
		
		case ActionTypes.SHOW_TAB_SECTION:
			_updateSection(payload.section);
			break;

		case ActionTypes.REGISTRATION_SUCCESS:
			_updateTab('confirmRegistration');
			break;

		case ActionTypes.LOGOUT_SUCCESS:
		case ActionTypes.CLEAR_HERO:
			_updateTab('home');
			break;
			
		case ActionTypes.CREATE_NEW_HERO:
			_updateSection('hero', 'rcp');
			break;
			
		case ActionTypes.RECEIVE_HERO:
			_updateSection('hero', 'profile');
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_updateTab('attributes');
			break;
			
		case ActionTypes.CLEAR_ACCOUNT:
			_updateTab('login');
			break;
			
		default:
			return true;
	}
	
	TabStore.emitChange();

	return true;

});

export default TabStore;
