/// <reference path="../actions/Actions.d.ts" />
/// <reference path="../data.d.ts" />

type Action = ReceiveDataTablesAction | ReceiveHeroDataAction | CreateHeroAction | AddAttributePointAction | RemoveAttributePointAction | AddCombatTechniquePointAction | RemoveCombatTechniquePointAction | ActivateDisAdvAction | DeactivateDisAdvAction | SetDisAdvTierAction | ActivateLiturgyAction | AddLiturgyPointAction | DeactivateLiturgyAction | RemoveLiturgyPointAction | ActivateSpecialAbilityAction | DeactivateSpecialAbilityAction | SetSpecialAbilityTierAction | ActivateSpellAction | AddSpellPointAction | DeactivateSpellAction | RemoveSpellPointAction | AddTalentPointAction | RemoveTalentPointAction | SetSelectionsAction;

import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import CultureStore from './CultureStore';
import HistoryStore from './HistoryStore';
import init from '../utils/init';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import RaceStore from './RaceStore';
import RequirementsStore from './RequirementsStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';

let _byId: {
	[id: string]: AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance | AttributeInstance | CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance | RaceInstance | CultureInstance | ProfessionInstance | ProfessionVariantInstance;
} = {};
let _allIds: string[] = [];

function _activate(id: string) {
	(_byId[id] as LiturgyInstance | SpellInstance).active = true;
}

function _deactivate(id: string) {
	(_byId[id] as LiturgyInstance | SpellInstance).active = false;
}

function _addPoint(id: string) {
	(_byId[id] as AttributeInstance | CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance).addPoint();
}

function _removePoint(id: string) {
	(_byId[id] as AttributeInstance | CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance).removePoint();
}

function _setValue(id: string, value: number) {
	(_byId[id] as AttributeInstance | CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance).set(value);
}

function _addSR(id: string, value: number) {
	(_byId[id] as AttributeInstance | CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance).add(value);
}

function _activateDASA(id: string, args: ActivateArgs) {
	(_byId[id] as AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance).activate(args);
}

function _deactivateDASA(id: string, index: number) {
	(_byId[id] as AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance).deactivate(index);
}

function _updateTier(id: string, index: number, tier: number) {
	(_byId[id] as AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance).setTier(index, tier);
}

function _init(data: RawData) {
	_byId = init(data);
	_allIds = Object.keys(_byId);
}

function _updateAll({ attr, talents, ct, spells, chants, disadv, activatable }: Hero & HeroRest) {
	attr.values.forEach(e => {
		const [ id, value, mod ] = e;
		_setValue(id, value);
		(_byId[id] as AttributeInstance).mod = mod;
	});
	const flatSkills = { ...talents.active, ...ct.active };
	Object.keys(flatSkills).forEach(id => {
		_setValue(id, flatSkills[id]);
	});
	const activateSkills = { ...spells.active, ...chants.active };
	Object.keys(activateSkills).forEach(id => {
		const value = activateSkills[id];
		_activate(id);
		if (value !== null) {
			_setValue(id, value);
		}
	});
	Object.keys(activatable).forEach(id => {
		const values = activatable[id];
		type Activatable = AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance;
		(_byId[id] as Activatable).active = values;
		switch (id) {
			case 'ADV_4':
			case 'ADV_16':
			case 'DISADV_48':
				values.forEach(p => (_byId[id] as Activatable).addDependencies([], p.sid as string));
				break;
			case 'SA_10': {
				const counter = new Map();
				values.forEach(p => {
					if (counter.has(p.sid)) {
						counter.set(p.sid, counter.get(p.sid) + 1);
					} else {
						counter.set(p.sid, 1);
					}
					(_byId[id] as Activatable).addDependencies([{ id: p.sid, sid: counter.get(p.sid) * 6 } as RequirementObject]);
				});
				break;
			}
			default:
				values.forEach(() => (_byId[id] as Activatable).addDependencies());
		}
	});
}

function _assignRCP(selections: Selections) {
	const race = RaceStore.getCurrent();
	const culture = CultureStore.getCurrent();
	const profession = ProfessionStore.getCurrent();
	const professionVariant = ProfessionVariantStore.getCurrent();

	let addSRList = [];
	let addSRActivateList = [];
	let disadvs = new Set();
	let sas = new Set();
	let langs = new Map();
	let litcs = new Set();

	const addSA = e => {
		let [ id, value, ...options ] = e;
		if (!value) {
			sas = new Set([...sas].filter(e => e[0] !== id));
		} else {
			sas.add([ id, ...options ]);
		}
	};

	if (selections.useCulturePackage) {
		addSRList.push(...culture.talents);
	}
	if (selections.spec !== null) {
		sas.add([ 'SA_10', selections.map.get('spec')[0], selections.spec ]);
	}
	langs.set(culture.languages.length > 1 ? selections.lang : culture.languages[0], 4);
	if (selections.buyLiteracy) {
		litcs.add(culture.scripts.length > 1 ? selections.litc : culture.scripts[0]);
	}
	selections.langLitc.forEach((value, key) => {
		let [ category, id ] = key.split('_');
		if (category === 'LANG') {
			langs.set(parseInt(id), value / 2);
		} else {
			litcs.add(parseInt(id));
		}
	});
	race.attributes.forEach(e => {
		let [ mod, id ] = e;
		_byId[id].mod += mod;
	});
	race.autoAdvantages.forEach(e => {
		let [ id ] = e;
		disadvs.add(id);
	});
	addSRList.push(...profession.talents);
	addSRList.push(...profession.combatTechniques);
	addSRActivateList.push(...profession.spells);
	addSRActivateList.push(...profession.liturgies);
	profession.specialAbilities.forEach(addSA);
	if (professionVariant) {
		addSRList.push(...professionVariant.talents);
		addSRList.push(...professionVariant.combatTechniques);
		professionVariant.specialAbilities.forEach(addSA);
	}

	Array.from(selections.combattech).forEach(e => {
		addSRList.push([e, selections.map.get('ct')[1]]);
	});
	Array.from(selections.cantrips).forEach(e => {
		addSRList.push([e, null]);
	});
	Array.from(selections.curses).forEach(e => {
		addSRList.push(e);
	});

	_byId[selections.attrSel].mod = race.attributeSelection[0] || 0;
	addSRList.forEach(e => _addSR(...e));
	addSRActivateList.forEach(e => {
		_activate(e[0]);
		if (e[1] !== null) {
			_setValue(e[0], e[1]);
		}
	});
	disadvs.forEach(id => {
		_activate(id);
		_byId[id].addDependencies();
	});
	sas.forEach(e => {
		let [ id, ...options ] = e;
		let obj = _byId[id];
		let addreq = [];

		if (options.length === 0) {
			_activate(id);
		} else {
			if (obj.tiers !== null && obj.tiers) {
				if (obj.max === null) {
					_activate(id);
					obj.tier = options[0];
				} else {
					obj.active.push(options.reverse());
				}
			} else if (obj.sel.length > 0) {
				if (obj.max === null) {
					_activate(id);
					obj.sid = options[0];
				} else if (obj.id === 'SA_10') {
					obj.active.push([options[0], Number.isInteger(options[1]) ? options[1] + 1 : options[1]]);
					addreq.push([options[0], obj.active.filter(e => e[0] === options[0]).length * 6]);
				} else if (options.length > 1) {
					obj.active.push(options.reverse());
				} else {
					obj.active.push(options[0]);
				}
			}
		}
		obj.addDependencies(addreq);
	});
	(_byId['SA_28'] as SpecialAbilityInstance).active.push(...litcs);
	(_byId['SA_30'] as SpecialAbilityInstance).active.push(...langs);
}

function _clear() {
	for (const id in _byId) {
		const e = _byId[id] as AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance | AttributeInstance | CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance;
		if (e.reset) {
			e.reset();
		}
	}
}

const ListStore = new Store((action: Action) => {
	AppDispatcher.waitFor([RequirementsStore.dispatchToken, HistoryStore.dispatchToken]);
	if (action.undoAction) {
		switch( action.type ) {
			case ActionTypes.ACTIVATE_SPELL:
			case ActionTypes.ACTIVATE_LITURGY:
				_deactivate(action.payload.id);
				break;

			case ActionTypes.DEACTIVATE_SPELL:
			case ActionTypes.DEACTIVATE_LITURGY:
				_activate(action.payload.id);
				break;

			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				console.debug('UNDO for ' + action.type + ' not yet implemented.\nFind a solution how to implement this feature. It has to be implemented for the first release.');
				break;

			case ActionTypes.SET_DISADV_TIER:
			case ActionTypes.SET_SPECIALABILITY_TIER:
				_updateTier(action.payload.id, action.payload.sid, action.payload.tier);
				break;

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.ADD_TALENT_POINT:
			case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
			case ActionTypes.ADD_SPELL_POINT:
			case ActionTypes.ADD_LITURGY_POINT:
				_removePoint(action.payload.id);
				break;

			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_TALENT_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_SPELL_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT:
				_addPoint(action.payload.id);
				break;

			default:
				return true;
		}
	}
	else {
		switch(action.type) {
			case ActionTypes.RECEIVE_DATA_TABLES:
				_init(action.payload.data);
				break;

			case ActionTypes.RECEIVE_HERO_DATA:
				_updateAll(action.payload.data);
				break;

			case ActionTypes.ASSIGN_RCP_OPTIONS:
				_assignRCP(action.payload);
				break;

			case ActionTypes.CREATE_HERO:
				_clear();
				break;

			case ActionTypes.ACTIVATE_SPELL:
			case ActionTypes.ACTIVATE_LITURGY:
				if (RequirementsStore.isValid()) {
					_activate(action.payload.id);
				}
				break;

			case ActionTypes.DEACTIVATE_SPELL:
			case ActionTypes.DEACTIVATE_LITURGY:
				if (RequirementsStore.isValid()) {
					_deactivate(action.payload.id);
				}
				break;

			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
				if (RequirementsStore.isValid()) {
					_activateDASA(action.payload.id, action.payload);
				}
				break;

			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				if (RequirementsStore.isValid()) {
					_deactivateDASA(action.payload.id, action.payload.index);
				}
				break;

			case ActionTypes.SET_DISADV_TIER:
			case ActionTypes.SET_SPECIALABILITY_TIER:
				if (RequirementsStore.isValid()) {
					_updateTier(action.payload.id, action.payload.index, action.payload.tier);
				}
				break;

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.ADD_TALENT_POINT:
			case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
			case ActionTypes.ADD_SPELL_POINT:
			case ActionTypes.ADD_LITURGY_POINT:
				if (RequirementsStore.isValid()) {
					_addPoint(action.payload.id);
				}
				break;

			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_TALENT_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_SPELL_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT:
				if (RequirementsStore.isValid()) {
					_removePoint(action.payload.id);
				}
				break;

			default:
				return true;
		}
	}

	ListStore.emitChange();

	return true;

});

export default ListStore;

export const get = (id: string) => {
	switch (id) {
		case 'COU':
			return _byId['ATTR_1'];
		case 'SGC':
			return _byId['ATTR_2'];
		case 'INT':
			return _byId['ATTR_3'];
		case 'CHA':
			return _byId['ATTR_4'];
		case 'DEX':
			return _byId['ATTR_5'];
		case 'AGI':
			return _byId['ATTR_6'];
		case 'CON':
			return _byId['ATTR_7'];
		case 'STR':
			return _byId['ATTR_8'];

		default:
			return _byId[id];
	}
};

export const getObjByCategory = (...categories: Category[]) => {
	const list: { [id: string]: AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance | AttributeInstance | CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance | RaceInstance | CultureInstance | ProfessionInstance | ProfessionVariantInstance } = {};
	for (const id in _byId) {
		const obj = _byId[id];
		if (categories.includes(obj.category)) {
			list[id] = obj;
		}
	}
	return list;
};

export const getObjByCategoryGroup = (category: Category, ...gr: number[]) => {
	const list: { [id: string]: TalentInstance | CombatTechniqueInstance | SpellInstance | LiturgyInstance | SpecialAbilityInstance } = {};
	for (const id in _byId) {
		const obj = _byId[id] as TalentInstance | CombatTechniqueInstance | SpellInstance | LiturgyInstance | SpecialAbilityInstance;
		if (obj.category === category && gr.includes(obj.gr)) {
			list[id] = obj;
		}
	}
	return list;
};

export const getAllByCategory = (...categories: Category[]) => {
	const list = [];
	for (const id in _byId) {
		const obj = _byId[id];
		if (categories.includes(obj.category)) {
			list.push(obj);
		}
	}
	return list;
};

export const getAllByCategoryGroup = (category: Category, ...gr: number[]) => {
	const list = [];
	for (const id in _byId) {
		const obj = _byId[id] as TalentInstance | CombatTechniqueInstance | SpellInstance | LiturgyInstance | SpecialAbilityInstance;
		if (obj.category === category && gr.includes(obj.gr)) {
			list.push(obj);
		}
	}
	return list;
};

export const getPrimaryAttrID = (type: 1 | 2) => {
	let attr;
	if (type === 1) {
		switch ((get('SA_86') as SpecialAbilityInstance).sid[0]) {
			case 1:
				attr = 'SGC';
				break;
			case 2:
				attr = 'CHA';
				break;
			case 3:
				attr = 'INT';
				break;
		}
	} else if (type === 2) {
		switch ((get('SA_102') as SpecialAbilityInstance).sid[0]) {
			case 1:
				attr = 'SGC';
				break;
			case 2:
				attr = 'COU';
				break;
			case 3:
				attr = 'COU';
				break;
			case 4:
				attr = 'SGC';
				break;
			case 5:
				attr = 'INT';
				break;
			case 6:
				attr = 'INT';
				break;
		}
	}
	return attr || 'ATTR_0';
};

export const getPrimaryAttr = (type: 1 | 2) => get(getPrimaryAttrID(type));
