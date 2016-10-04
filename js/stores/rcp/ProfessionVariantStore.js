import AppDispatcher from '../../dispatcher/AppDispatcher';
import CultureStore from './CultureStore';
import { EventEmitter } from 'events';
import ProfessionStore from './ProfessionStore';
import ActionTypes from '../../constants/ActionTypes';

var _currentID = null;
var _professionVariants = [];

function _updateCurrentID(id) {
	_currentID = id;
}

var ProfessionVariantStore = Object.assign({}, EventEmitter.prototype, {

	init: function(rawProfessionVariants) {
		for (let id in rawProfessionVariants) {
			let obj = rawProfessionVariants[id];

			obj.sa = obj.sa.map(e => {
				e[0] = `SA_${e[0]}`;
				return e;
			});
			obj.combattech = obj.combattech.map(e => {
				e[0] = `CT_${e[0]}`;
				return e;
			});
			obj.talents = obj.talents.map(e => {
				e[0] = `TAL_${e[0]}`;
				return e;
			});

			rawProfessionVariants[id] = obj;
		}
		_professionVariants = rawProfessionVariants;
	},

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	get: function(id) {
		return _professionVariants[id];
	},

	getAll: function() {
		return _professionVariants;
	},

	getAllForView: function() {
		var professionID = ProfessionStore.getCurrentID();
		if (professionID !== null) {
			var profession = ProfessionStore.get(professionID);
			if (profession.vars[0] !== null) {
				var professionVariants = [{
					name: 'Keine Variante',
					value: null
				}];
				for (let id in _professionVariants) {
					if (profession.vars.indexOf(id) > -1) {
						if (_professionVariants[id].pre_req !== null) {
							var reqsPassed = true;
							var cultureID = CultureStore.getCurrentID();
							for (let req of _professionVariants[id].pre_req) {
								if (req[0] === 'c' && req[1].indexOf('C_' + cultureID) === -1) {
									reqsPassed = false;
									break;
								}
							}
							if (!reqsPassed) continue;
						}
						professionVariants.push({
							name: `${_professionVariants[id].name} (${profession.ap + _professionVariants[id].ap} AP)`,
							value: _professionVariants[id].id
						});
					}
				}
				return professionVariants;
			}
			return [];
		}
	},

	getCurrentID: function() {
		return _currentID;
	},

	getCurrent: function() {
		return this.get(this.getCurrentID());
	},

	getCurrentName: function() {
		return this.getCurrent() !== undefined ? this.getCurrent().name : null;
	},

	getNameByID: function(id) {
		return this.get(id) !== undefined ? this.get(id).name : null;
	}

});

ProfessionVariantStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.SELECT_RACE:
		case ActionTypes.SELECT_CULTURE:
		case ActionTypes.SELECT_PROFESSION:
			_updateCurrentID(null);
			break;

		case ActionTypes.SELECT_PROFESSION_VARIANT:
			_updateCurrentID(payload.professionVariantID);
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			ProfessionVariantStore.init(payload.professionVariants);
			break;

		default:
			return true;
	}

	ProfessionVariantStore.emitChange();

	return true;

});

export default ProfessionVariantStore;
