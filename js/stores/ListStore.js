import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import ActionTypes from '../constants/ActionTypes';

var _list = {};

function _activate(id) {
	_list[id].active = true;
}

function _deactivate(id) {
	_list[id].active = false;
}

function _addPoint(id) {
	_list[id].fw++;
}

function _removePoint(id) {
	_list[id].fw--;
}

function _addAttrPoint(id) {
	_list[id].value++;
}

function _removeAttrPoint(id) {
	_list[id].value--;
}

function _addDependencies(reqs, sel) {
	reqs.forEach(req => {
		let [ id, value, option ] = req;
		if (id === 'auto_req' || option === 'TAL_GR_2') return;
		else if (id === 'ATTR_PRIMARY') {
			id = this.getPrimaryAttrID(option);
			_list[id].dependencies.push(value);
		}
		else {
			let sid;
			if (typeof option !== 'undefined') {
				if (Number.isNaN(parseInt(option))) {
					if (option === 'sel') {
						sid = sel;
					} else {
						sid = option;
					}
				} else {
					sid = parseInt(option);
				}
			} else {
				sid = value;
			}
			_list[id].dependencies.push(sid);
		}
	});
}

function _removeDependencies(reqs, sel) {
	reqs.forEach(req => {
		let [ id, value, option ] = req;
		if (id === 'auto_req' || option === 'TAL_GR_2') return;
		else if (id === 'ATTR_PRIMARY') {
			id = this.getPrimaryAttrID(option);
			for (let i = 0; i < _list[id].dependencies.length; i++)
				if (_list[id].dependencies[i] === value) {
					_list[id].dependencies.splice(i, 1);
					break;
				}
		}
		else {
			let sid;
			if (typeof option !== 'undefined') {
				if (Number.isNaN(parseInt(option))) {
					if (option === 'sel') {
						sid = sel;
					} else {
						sid = option;
					}
				} else {
					sid = parseInt(option);
				}
			} else {
				sid = value;
			}
			for (let i = 0; i < _list[id].dependencies.length; i++)
				if (_list[id].dependencies[i] === sid) {
					_list[id].dependencies.splice(i, 1);
					break;
				}
		}
	});
}
	
var ListStore = Object.assign({}, EventEmitter.prototype, {

	init: function(...obj) {
		_list = Object.assign(_list, ...obj);
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

	set: function(id, obj) {
		_list[id] = obj;
	},

	setSR: function(id, value) {
		_list[id].fw = value;
	},

	setProperty: function(id, property, value) {
		if (value === undefined) {
			delete _list[id][property];
		} else {
			_list[id][property] = value;
		}
	},

	addToProperty: function(id, property, value) {
		_list[id][property] += value;
	},

	addSR: function(id, value) {
		this.addToProperty(id, 'fw', value);
	},

	addDependencies: function(reqs, sel) {
		_addDependencies(reqs, sel);
	},

	removeDependencies: function(reqs, sel) {
		_removeDependencies(reqs, sel);
	},

	activate: function(id) {
		_activate(id);
	},

	deactivate: function(id) {
		_deactivate(id);
	},

	addPoint: function(id) {
		_addPoint(id);
	},

	removePoint: function(id) {
		_removePoint(id);
	},

	addAttrPoint: function(id) {
		_addAttrPoint(id);
	},

	removeAttrPoint: function(id) {
		_removeAttrPoint(id);
	},

	get: function(id) {
		return _list[id];
	},

	getPrimaryAttrID: function(type) {
		var attr;
		if (type === 1 && this.get('SA_86')) {
			switch (this.get('SA_86').sid) {
				case 1:
					attr = 'ATTR_2';
					break;
				case 2:
					attr = 'ATTR_4';
					break;
				case 3:
					attr = 'ATTR_3';
					break;
			}
		} else if (type === 2 && this.get('SA_102')) {
			switch (this.get('SA_102').sid) {
				case 1:
					attr = 'ATTR_2';
					break;
				case 2:
					attr = 'ATTR_1';
					break;
				case 3:
					attr = 'ATTR_1';
					break;
				case 4:
					attr = 'ATTR_2';
					break;
				case 5:
					attr = 'ATTR_3';
					break;
				case 6:
					attr = 'ATTR_3';
					break;
			}
		}
		return attr || 'ATTR_0';
	},

	getPrimaryAttr: function(type) {
		return this.get(this.getPrimaryAttrID(type));
	},

	getAll: function() {
		return _list;
	},

	getAllByCategory: function(...categories) {
		var list = [];
		for (let id in _list) {
			if (categories.indexOf(_list[id].category) > -1) list.push(_list[id]);
		}
		return list;
	},

	getObjByCategory: function(...categories) {
		var list = {};
		for (let id in _list) {
			if (categories.indexOf(_list[id].category) > -1) list[id] = _list[id];
		}
		return list;
	},

	getAllByCategoryGroup: function(category, gr) {
		var list = [];
		for (let id in _list) {
			if (_list[id].category === category && _list[id].gr === gr) list.push(_list[id]);
		}
		return list;
	}

});

export default ListStore;
