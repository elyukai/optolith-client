import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';

var _fighters = [];
var _fightersIdIndex = [];
var _status = [1, 12];
var _online = '';
var _edit = -1;
var _editCast = '';
var _editDuplicate = '';
var _options = {
	hideDeac: true,
	hideEnemies: false
};

function getUsedPhases() {
	var iniArray = [];
	for (let i = 0; i < _fighters.length; i++) {
		if (!_fighters[i].deac) {
			if (iniArray.indexOf(_fighters[i].init) == -1 && _fighters[i].init > 0) {
				iniArray.push(_fighters[i].init);
			}
			if (iniArray.indexOf(_fighters[i].init - 8) == -1 && (_fighters[i].init - 8) > 0) {
				iniArray.push(_fighters[i].init - 8);
			}
		}
	}
	iniArray.sort(function(a, b){
		return b - a;
	});
	return iniArray;
}

function getMaxIni() {
	var maxIni = 0;
	for (let i = 0; i < _fighters.length; i++) {
		if (!_fighters[i].deac && _fighters[i].init > maxIni) {
			maxIni = _fighters[i].init;
		}
	}
	return maxIni;
}

function loadData() {
	var data = _online;
	if (data === '' || data === undefined) {
		if (localStorage['lastUrl'] !== '') data = localStorage['lastUrl'];
		else return;
	}
	data = unescape(decodeURI(data)).split('?')[1];
	var params = data.split('&');
	var fighters = params[0].split('=')[1].split('$');
	var status = params[1].split('=')[1].split(',');
	_fighters = [];
	_status = [];
	for (let i = 0; i < fighters.length; i++) {
		var fighterString = fighters[i].split(",");
		var fighter = {
			id: i,
			name: fighterString[0],
			type: fighterString[1],
			ib: parseInt(fighterString[2]),
			init: parseInt(fighterString[3]),
			lec: parseInt(fighterString[4]),
			le: parseInt(fighterString[5]),
			auc: parseInt(fighterString[6]),
			au: parseInt(fighterString[7]),
			aec: parseInt(fighterString[8]),
			ae: parseInt(fighterString[9]),
			kec: parseInt(fighterString[10]),
			ke: parseInt(fighterString[11]),
			aktm: parseInt(fighterString[12]),
			aktv: parseInt(fighterString[13]),
			faktv: parseInt(fighterString[14]),
			cast: parseInt(fighterString[15]),
			deac: fighterString[16] == 'true' ? true : false
		};
		fighter.faktm = fighter.init >= 20 ? Math.floor(fighter.init / 10) - 1 : 0;
		_fighters.push(fighter);
		_fightersIdIndex.push(i);
	}
	_status = [parseInt(status[0]), parseInt(status[1])];
	_online = '';
}

function previousPhase() {
	let usedPhases = getUsedPhases();
	let usedIndex = usedPhases.indexOf(_status[1]);
	if (usedIndex === 0 && _status[0] > 1) {
		_status[0]--;
		_status[1] = usedPhases[usedPhases.length - 1];
	} else {
		_status[1] = usedPhases[usedIndex - 1];
	}
}

function nextPhase() {
	let usedPhases = getUsedPhases();
	let usedIndex = usedPhases.indexOf(_status[1]);
	if (usedIndex == usedPhases.length - 1) {
		_status[0]++;
		_status[1] = usedPhases[0];
		for (let i=0; i < _fighters.length; i++) {
			_fighters[i].aktv = 0;
			_fighters[i].faktv = 0;
		}
	} else {
		_status[1] = usedPhases[usedIndex + 1];
	}
}

function addCast() {
	if (typeof _editCast === 'number' && _editCast !== 0) {
		let index = _fightersIdIndex[_edit];
		_fighters[index].cast += parseInt(_editCast);
		if (_fighters[index].cast <= 0) {
			_fighters[index].cast = 0;
		}
		_editCast = '';
	}
}

function removeCast() {
	let index = _fightersIdIndex[_edit];
	_fighters[index].cast = 0;
}

function decreaseEndurance(id) {
	var index = _fightersIdIndex[id];
	if (_fighters[index].auc > 0) {
		_fighters[index].auc--;
	}
}

function decreaseActions(id) {
	var index = _fightersIdIndex[id];
	var fighter = _fighters[index];
	if ((2 + fighter.aktm - fighter.aktv) > 0) {
		if (fighter.cast > 0) {
			_fighters[index].cast--;
		}
		_fighters[index].aktv++;
	}
}

function decreaseFreeActions(id) {
	var index = _fightersIdIndex[id];
	var fighter = _fighters[index];
	if ((2 + fighter.faktm - fighter.faktv) > 0) {
		_fighters[index].faktv++;
	}
}

function updateState() {
	let index = _fightersIdIndex[_edit];
	_fighters[index].deac = !_fighters[index].deac;
}

function startEdit(id) {
	_edit = parseInt(id);
	_editCast = '';
	_editDuplicate = '';
}

function updateEditValue(tag, value) {
	let index = _fightersIdIndex[_edit];
	if (tag == 'name' || tag == 'type') {
		_fighters[index][tag] = value;
	} else {
		_fighters[index][tag] = value !== '' ? parseInt(value) : '';
	}
}

function updateEditCastValue(value) {
	_editCast = value !== '' ? parseInt(value) : '';
}

function updateEditDuplicateValue(value) {
	_editDuplicate = value !== '' ? parseInt(value) : '';
}

function endEdit() {
	let index = _fightersIdIndex[_edit];
	let fighter = _fighters[index];
	if (fighter.init >= 20) {
		_fighters[index].faktm = Math.floor(fighter.init / 10) - 1;
	} else {
		_fighters[index].faktm = 0;
	}
	_edit = -1;
	_fighters.sort(function(a, b) {
		if (a.init > b.init || (a.init == b.init && a.ib > b.ib)) {
			return -1;
		} else if (a.init < b.init || (a.init == b.init && a.ib < b.ib)) {
			return 1;
		} else {
			return 0;
		}
	});
	for (let i = 0; i < _fighters.length; i++) {
		_fightersIdIndex[_fighters[i].id] = i;
	}
}

function addFighter() {
	let index = _fighters.length;
	_fightersIdIndex.push(index);
	_fighters.push({
		id: index,
		name: 'Unbenannt',
		type: 'h',
		init: '',
		ib: '',
		aktm: '',
		aktv: 0,
		faktv: 0,
		lec: '',
		le: '',
		auc: '',
		au: '',
		aec: 0,
		ae: 0,
		kec: 0,
		ke: 0,
		cast: 0
	});
	_edit = index;
}

function duplicateFighter() {
	if (typeof _editDuplicate === 'number' && _editDuplicate !== 0) {
		let index = _fighters.length;
		var fighter = _fighters[index];
		var times = _editDuplicate;
		if (fighter.init >= 20) {
			_fighters[index].faktm = Math.floor(fighter.init / 10) - 1;
		} else {
			_fighters[index].faktm = 0;
		}
		if (times > 0) {
			for (var i=0; i < times; i++) {
				var duplicate = JSON.parse(JSON.stringify(_fighters[index]));
				duplicate.name += ' ' + (i + 2);
				duplicate.id = _fighters.length;
				_fightersIdIndex.push(_fighters.length);
				_fighters.push(duplicate);
			}
			_fighters[index].name += ' 1';
			_editDuplicate = '';
		}
	}
}

function destroyFighter() {
	let index = _fightersIdIndex[_edit];
	_fighters.splice(index, 1);
	_fightersIdIndex = [];
	for (let i = 0; i < _fighters.length; i++) {
		_fighters[i].id = i;
		_fightersIdIndex[i] = i;
	}
	_edit = -1;
}

function updateOnline(value) {
	_online = value;
}

function resetPhases() {
	_status = [1, getMaxIni()];
	for (var i=0; i < _fighters.length; i++) {
		_fighters[i].aktv = 0;
		_fighters[i].faktv = 0;
		_fighters[i].cast = 0;
	}
}

function resetHealth() {
	for (var i=0; i < _fighters.length; i++) {
		_fighters[i].lec = _fighters[i].le;
		_fighters[i].auc = _fighters[i].au;
		_fighters[i].aec = _fighters[i].ae;
		_fighters[i].kec = _fighters[i].ke;
	}
}

function reset() {
	_fighters = [];
	_fightersIdIndex = [];
	_status = [1, 1];
}

function save() {
	var stringArray = '';
	for (var i=0; i < _fighters.length; i++) {
		var fighter = [
			_fighters[i].name,
			_fighters[i].type,
			_fighters[i].ib,
			_fighters[i].init,
			_fighters[i].lec,
			_fighters[i].le,
			_fighters[i].auc,
			_fighters[i].au,
			_fighters[i].aec,
			_fighters[i].ae,
			_fighters[i].kec,
			_fighters[i].ke,
			_fighters[i].aktm,
			_fighters[i].aktv,
			_fighters[i].faktv,
			_fighters[i].cast,
			_fighters[i].deac
		];
		stringArray += fighter;
		if (i < (_fighters.length - 1)) {
			stringArray += '$';
		}
	}
	_online = 'http://www.dsa-sh.de/gameapp/?group=' + stringArray + '&status=' + _status;
	localStorage["lastUrl"] = _online;
}

function updateOption(option) {
	_options[option] = !_options[option];
}

class _InGameStore extends Store {

	getIni() {
		return getMaxIni();
	}

	getIniArray() {
		const maxIni = getMaxIni();
		var iniArray = [];
		for (let i = maxIni; i > 0; i--) {
			iniArray.push(i);
		}
		return iniArray;
	}

	getUsedPhases() {
		return getUsedPhases();
	}

	getOptions() {
		return _options;
	}

	getFighters() {
		return _fighters;
	}

	getFighterByID(id) {
		return _fighters[_fightersIdIndex[id]];
	}

	getFighterIndex(id) {
		return _fightersIdIndex[id];
	}

	getEditIndex() {
		if (_edit > -1) return this.getFighterIndex(_edit);
		return -1;
	}

	getStatus() {
		return _status;
	}

	getOnline() {
		return _online;
	}

	getEdit() {
		return _edit;
	}

	getEditCast() {
		return _editCast;
	}

	getEditDuplicate() {
		return _editDuplicate;
	}

}

const InGameStore = new _InGameStore();

InGameStore.dispatchToken = AppDispatcher.register(payload => {

	switch( payload.type ) {

		case ActionTypes.LOAD_RAW_INGAME_DATA:
			loadData();
			break;

		case ActionTypes.INGAME_PREVIOUS_PHASE:
			previousPhase();
			break;

		case ActionTypes.INGAME_NEXT_PHASE:
			nextPhase();
			break;

		case ActionTypes.UPDATE_INGAME_CAST:
			addCast();
			break;

		case ActionTypes.CANCEL_INGAME_CAST:
			removeCast();
			break;

		case ActionTypes.INGAME_USE_ENDURANCE:
			decreaseEndurance(payload.id);
			break;

		case ActionTypes.INGAME_USE_ACTION:
			decreaseActions(payload.id);
			break;

		case ActionTypes.INGAME_USE_FREE_ACTION:
			decreaseFreeActions(payload.id);
			break;

		case ActionTypes.INGAME_ACTIVATE_FIGHTER:
		case ActionTypes.INGAME_DEACTIVATE_FIGHTER:
			updateState();
			break;

		case ActionTypes.INGAME_EDIT_START:
			startEdit(payload.id);
			break;

		case ActionTypes.INGAME_EDIT_UPDATE_VALUE:
			updateEditValue(payload.tag, payload.value);
			break;

		case ActionTypes.INGAME_EDIT_UPDATE_CAST_VALUE:
			updateEditCastValue(payload.value);
			break;

		case ActionTypes.INGAME_EDIT_UPDATE_DUPLICATE_VALUE:
			updateEditDuplicateValue(payload.value);
			break;

		case ActionTypes.INGAME_EDIT_END:
			endEdit();
			break;

		case ActionTypes.INGAME_ADD_FIGHTER:
			addFighter();
			break;

		case ActionTypes.INGAME_DUPLICATE_FIGHTER:
			duplicateFighter();
			break;

		case ActionTypes.INGAME_REMOVE_FIGHTER:
			destroyFighter();
			break;

		case ActionTypes.INGAME_UPDATE_ONLINE_LINK:
			updateOnline(payload.value);
			break;

		case ActionTypes.INGAME_RESET_PHASES:
			resetPhases();
			break;

		case ActionTypes.INGAME_RESET_HEALTH:
			resetHealth();
			break;

		case ActionTypes.INGAME_RESET_ALL:
			reset();
			break;

		case ActionTypes.INGAME_SAVE:
			save();
			break;

		case ActionTypes.INGAME_SWITCH_OPTION:
			updateOption(payload.option);
			break;

		default:
			return true;
	}

	InGameStore.emitChange();

	return true;

});

export default InGameStore;
