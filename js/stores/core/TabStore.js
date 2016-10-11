import AppDispatcher from '../../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../../constants/ActionTypes';
import PhaseStore from '../PhaseStore';

var _currentTab = 'profile';
var _currentSection = 'hero';

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
			if (before === 'hero')
				_currentTab = 'herolist';
			else if (before === 'group')
				_currentTab = 'grouplist';
			break;
		case 'hero':
			_currentTab = 'profile';
			break;
		case 'group':
			_currentTab = 'master';
			break;
	}
}

function _updateByPhase() {
	switch (PhaseStore.get()) {
		case 1:
			_currentTab = 'rcp';
			break;
		case 2:
			_currentTab = 'attributes';
			break;
		case 3:
			_currentTab = 'profile';
			break;
		case 4:
			_currentTab = 'profile';
			break;
	}
}

var TabStore = Object.assign({}, EventEmitter.prototype, {
	
	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	
	getCurrentID: function() {
		return _currentTab;
	},
	
	getCurrentSID: function() {
		return _currentSection;
	}

});

TabStore.dispatchToken = AppDispatcher.register( function( payload ) {

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
			
		case ActionTypes.RECEIVE_ACCOUNT:
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
