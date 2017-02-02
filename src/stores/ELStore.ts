import * as ActionTypes from '../constants/ActionTypes';
import Store from './Store';

type Action = CreateHeroAction | ReceiveHeroDataAction | ReceiveDataTablesAction;

const _byId: { [id: string]: ExperienceLevel } = {};
let _allIds: string[];
let _start = 'EL_0';

function _init(el: { [id: string]: RawExperienceLevel }) {
	_allIds = Object.keys(el);
	_allIds.forEach(e => {
		const {
			id,
			name,
			ap,
			max_attr,
			max_skill,
			max_combattech,
			max_attrsum,
			max_spells_liturgies,
			max_unfamiliar_spells
		} = el[e];
		_byId[e] = {
			id,
			name,
			ap,
			maxAttributeValue: max_attr,
			maxSkillRating: max_skill,
			maxCombatTechniqueRating: max_combattech,
			maxTotalAttributeValues: max_attrsum,
			maxSpellsLiturgies: max_spells_liturgies,
			maxUnfamiliarSpells: max_unfamiliar_spells,
		};
	});
}

function _update(el: string) {
	_start = el;
}

class ELStoreStatic extends Store {

	get(id: string) {
		return _byId[id];
	}

	getAll() {
		return _byId;
	}

	getStartID() {
		return _start;
	}

	getStart() {
		return this.get(this.getStartID());
	}

}

const ELStore = new ELStoreStatic((action: Action) => {
	switch(action.type) {
		case ActionTypes.CREATE_HERO:
			_update(action.payload.el);
			break;

		case ActionTypes.RECEIVE_HERO_DATA:
			_update(action.payload.data.el);
			break;

		case ActionTypes.RECEIVE_DATA_TABLES:
			_init(action.payload.data.el);
			break;

		default:
			return true;
	}

	ELStore.emitChange();
	return true;
});

export default ELStore;
