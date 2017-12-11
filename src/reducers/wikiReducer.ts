import { ReceiveInitialDataAction } from '../actions/IOActions';
import * as ActionTypes from '../constants/ActionTypes';
import { Advantage, Blessing, Book, Cantrip, Culture, Disadvantage, ExperienceLevel, ItemTemplate, LiturgicalChant, Profession, ProfessionVariant, Race, RaceVariant, Skill, SpecialAbility, Spell } from '../types/wiki';

type Action = ReceiveInitialDataAction;

export interface WikiState {
	books: Map<string, Book>;
	experienceLevels: Map<string, ExperienceLevel>;
	races: Map<string, Race>;
	raceVariants: Map<string, RaceVariant>;
	cultures: Map<string, Culture>;
	professions: Map<string, Profession>;
	professionVariants: Map<string, ProfessionVariant>;
	advantages: Map<string, Advantage>;
	disadvantages: Map<string, Disadvantage>;
	specialAbilties: Map<string, SpecialAbility>;
	skills: Map<string, Skill>;
	spells: Map<string, Spell>;
	cantrips: Map<string, Cantrip>;
	liturgicalChants: Map<string, LiturgicalChant>;
	blessings: Map<string, Blessing>;
	itemTemplates: Map<string, ItemTemplate>;
}

const initialState: WikiState = {
	books: new Map(),
	experienceLevels: new Map(),
	races: new Map(),
	raceVariants: new Map(),
	cultures: new Map(),
	professions: new Map(),
	professionVariants: new Map(),
	advantages: new Map(),
	disadvantages: new Map(),
	specialAbilties: new Map(),
	skills: new Map(),
	spells: new Map(),
	cantrips: new Map(),
	liturgicalChants: new Map(),
	blessings: new Map(),
	itemTemplates: new Map(),
};

export function wiki(state: WikiState = initialState, action: Action): WikiState {
	switch (action.type) {
		case ActionTypes.RECEIVE_INITIAL_DATA:
			return action.payload.data.phase;

		default:
			return state;
	}
}
