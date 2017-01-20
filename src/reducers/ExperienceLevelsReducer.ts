/// <reference path="../data.d.ts" />
/// <reference path="../raw.d.ts" />

import { RECEIVE_DATA_TABLES, RECEIVE_HERO_DATA, CREATE_HERO } from '../constants/ActionTypes';
import { CreateHeroAction } from '../actions/HerolistActions';
import { ReceiveDataTablesAction, ReceiveHeroDataAction } from '../actions/ServerActions';

type Action = ReceiveDataTablesAction | ReceiveHeroDataAction | CreateHeroAction;

export interface ExperienceLevelsState {
	readonly byId: {
		[id: string]: ExperienceLevel;
	};
	readonly allIds: string[];
	readonly startId: string;
}

const initialState = <ExperienceLevelsState>{
	byId: {},
	allIds: [],
	startId: 'EL_0'
};

function init({ id, name, ap, max_attr, max_skill, max_combattech, max_attrsum, max_spells_liturgies, max_unfamiliar_spells }: RawExperienceLevel): ExperienceLevel {
	return {
		id,
		name,
		ap,
		maxAttributeValue: max_attr,
		maxSkillRating: max_skill,
		maxCombatTechniqueRating: max_combattech,
		maxTotalAttributeValues: max_attrsum,
		maxSpellsLiturgies: max_spells_liturgies,
		maxUnfamiliarSpells: max_unfamiliar_spells
	}
}

export default (state: ExperienceLevelsState = initialState, action: Action): ExperienceLevelsState => {
	switch (action.type) {
		case RECEIVE_DATA_TABLES: {
			const byId: { [id: string]: ExperienceLevel } = {};
			const allIds: string[] = [];
			for (const id in action.payload.data.el) {
				byId[id] = init(action.payload.data.el[id]);
				allIds.push(id);
			}
			return { ...state, byId, allIds };
		}

		case RECEIVE_HERO_DATA:
			return { ...state, startId: action.payload.data.el };

		case CREATE_HERO:
			return { ...state, startId: action.payload.el };

		default:
			return state;
	}
}
