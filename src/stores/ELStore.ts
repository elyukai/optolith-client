import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';

type Action = CreateHeroAction | ReceiveHeroDataAction | ReceiveDataTablesAction;

class ELStoreStatic extends Store {
	private byId: { [id: string]: ExperienceLevel } = {};
	private allIds: string[];
	private start = 'EL_0';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.CREATE_HERO:
					this.update(action.payload.el);
					break;

				case ActionTypes.RECEIVE_HERO_DATA:
					this.update(action.payload.data.el);
					break;

				case ActionTypes.RECEIVE_DATA_TABLES:
					this.init(action.payload.data.el);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	get(id: string) {
		return this.byId[id];
	}

	getAll() {
		return this.byId;
	}

	getStartID() {
		return this.start;
	}

	getStart() {
		return this.get(this.getStartID());
	}

	private init(el: { [id: string]: RawExperienceLevel }) {
		this.allIds = Object.keys(el);
		this.allIds.forEach(e => {
			const {
				id,
				name,
				ap,
				max_attr,
				max_skill,
				max_combattech,
				max_attrsum,
				max_spells_liturgies,
				max_unfamiliar_spells,
			} = el[e];
			this.byId[e] = {
				id,
				name,
				ap,
				maxAttributeValue: max_attr,
				maxCombatTechniqueRating: max_combattech,
				maxSkillRating: max_skill,
				maxSpellsLiturgies: max_spells_liturgies,
				maxTotalAttributeValues: max_attrsum,
				maxUnfamiliarSpells: max_unfamiliar_spells,
			};
		});
	}

	private update(el: string) {
		this.start = el;
	}
}

const ELStore = new ELStoreStatic();

export default ELStore;
