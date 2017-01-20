/// <reference path="../data.d.ts" />

import { ATTRIBUTES, COMBAT_TECHNIQUES, LITURGIES, SPELLS, TALENTS } from '../constants/Categories';

interface Abilities {
	[id: string]: Attribute | Advantage | CombatTechnique | Disadvantage | Liturgy | SpecialAbility | Spell | Talent;
}

export const getAttributeValuesSum = (abilities: Abilities) => {
	return Object.keys(abilities).reduce((a,key) => {
		return abilities[key].category === ATTRIBUTES ? a + (abilities[key] as Attribute).value : a;
	}, 0);
};

export const isIncreasable = (abilities: Abilities, id: string, phase: number, el: ExperienceLevel): boolean => {
	switch (abilities[id].category) {
		case ATTRIBUTES:
			if (phase < 3) {
				let max = getAttributeValuesSum(abilities) >= el.maxTotalAttributeValues ? 0 : el.maxAttributeValue + (abilities[id] as Attribute).mod;
				return (abilities[id] as Attribute).value < max;
			} else {
				return true;
			}

		case COMBAT_TECHNIQUES: {
			let max = 0;
			let bonus = (<string[]>(<Advantage>abilities['ADV_17']).active).includes(id) ? 1 : 0;

			if (phase < 3) {
				max = el.maxCombatTechniqueRating;
			} else {
				max = CombatTechniquesStore.getMaxPrimaryAttributeValueByID(abilities[id].primary) + 2;
			}

			return abilities[id].value < max + bonus;
		}

		case LITURGIES: {
			let max = 0;
			let bonus = get('ADV_16').active.filter(e => e === abilities[id].id).length;

			if (phase < 3) {
				max = el.max_skill;
			} else {
				let checkValues = abilities[id].check.map(attr => get(attr).value);
				max = Math.max(...checkValues) + 2;
			}

			if (!get('SA_103').active.includes(abilities[id].aspect)) {
				max = Math.min(14, max);
			}

			return abilities[id].value < max + bonus;
		}

		case SPELLS: {
			let max = 0;
			let bonus = get('ADV_16').active.filter(e => e === abilities[id].id).length;

			if (phase < 3) {
				max = el.max_skill;
			} else {
				let checkValues = abilities[id].check.map(attr => get(attr).value);
				max = Math.max(...checkValues) + 2;
			}

			if (!get('SA_88').active.includes(abilities[id].property)) {
				max = Math.min(14, max);
			}

			return abilities[id].value < max + bonus;
		}

		case TALENTS: {
			let max = 0;
			let bonus = get('ADV_16').active.filter(e => e === abilities[id].id).length;

			if (phase < 3) {
				max = el.max_skill;
			} else {
				let checkValues = abilities[id].check.map(attr => get(attr).value);
				max = Math.max(...checkValues) + 2;
			}

			return abilities[id].value < max + bonus;
		}
	}
	return false;
};
