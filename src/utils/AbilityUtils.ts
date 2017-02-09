/// <reference path="../raw.d.ts" />

import { ADVANTAGES, ATTRIBUTES, COMBAT_TECHNIQUES, DISADVANTAGES, LITURGIES, SPECIAL_ABILITIES, SPELLS, TALENTS } from '../constants/Categories';
import Store from '../stores/RStore';

const getAbilityList = () => {
	const state = Store.getState();
	return state && state.hero && state.hero.abilities;
};

export const get = (id: string) => {
	const state = getAbilityList();
	const target = (id: string) => state && state.byId[id];
	switch (id) {
		case 'COU':
			return target('ATTR_1');
		case 'SGC':
			return target('ATTR_2');
		case 'INT':
			return target('ATTR_3');
		case 'CHA':
			return target('ATTR_4');
		case 'DEX':
			return target('ATTR_5');
		case 'AGI':
			return target('ATTR_6');
		case 'CON':
			return target('ATTR_7');
		case 'STR':
			return target('ATTR_8');

		default:
			return target(id);
	}
};

type AbilitiesObject = {
	[id: string]: AttributeInstance | AdvantageInstance | CombatTechniqueInstance | DisadvantageInstance | LiturgyInstance | SpecialAbilityInstance | SpellInstance | TalentInstance
};

type AbilitiesList = (AttributeInstance | AdvantageInstance | CombatTechniqueInstance | DisadvantageInstance | LiturgyInstance | SpecialAbilityInstance | SpellInstance | TalentInstance)[];

type CategoryWithGroups = COMBAT_TECHNIQUES | LITURGIES | SPECIAL_ABILITIES | SPELLS | TALENTS;
type Category = ADVANTAGES | ATTRIBUTES | DISADVANTAGES | CategoryWithGroups;

export const getObjByCategory = (...categories: Category[]) => {
	const state = getAbilityList();
	if (state) {
		const byId = state.byId;
		let list: AbilitiesObject = {};
		Object.keys(byId).forEach(id => {
			const obj = byId[id];
			if (categories.includes(obj.category)) {
				list[id] = obj;
			}
		})
		return list;
	}
	return {};
};

export const getObjByCategoryGroup = (category: CategoryWithGroups, ...gr: number[]) => {
	const state = getAbilityList();
	if (state) {
		const byId = state.byId;
		let list: AbilitiesObject = {};
		Object.keys(byId).forEach(id => {
			const obj = byId[id];
			if (obj.category === category && gr.includes(obj.gr)) {
				list[id] = obj;
			}
		})
		return list;
	}
	return {};
};

export const getAllByCategory = (...categories: Category[]) => {
	const state = getAbilityList();
	if (state) {
		const byId = state.byId;
		return Object.keys(byId).filter(e => categories.includes(byId[e].category)).map(e => byId[e]);
	}
	return [];
};

export const getAllByCategoryGroup = (category: CategoryWithGroups, ...gr: number[]) => {
	const state = getAbilityList();
	if (state) {
		const byId = state.byId;
		return Object.keys(byId).map(e => byId[e]).filter(e => category === e.category && gr.includes(e.gr));
	}
	return [];
};

export const getPrimaryAttrID = (type: 1 | 2) => {
	let attr;
	const arcane = <SpecialAbilityInstance>get('SA_86');
	const karma = <SpecialAbilityInstance>get('SA_102');
	if (type === 1 && arcane) {
		switch (arcane.sid) {
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
	} else if (type === 2 && karma) {
		switch (karma.sid) {
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
