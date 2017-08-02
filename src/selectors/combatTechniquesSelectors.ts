import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { AttributeInstance, CombatTechniqueInstance } from '../types/data.d';
import { CombatTechnique } from '../types/view.d';
import { getAttributes, getMaxAttributeValueByID } from './attributeSelectors';

export const getCombatTechniques = (state: AppState) => state.currentHero.present.dependent.combatTechniques;

export const getForSave = createSelector(
	[ getCombatTechniques ],
	combatTechniques => {
		const active: { [id: string]: number } = {};
		for (const [id, { value }] of combatTechniques) {
			if (value > 6) {
				active[id] = value;
			}
		}
		return active;
	}
);

export const getForSheet = createSelector(
	[ getCombatTechniques, getAttributes ],
	(combatTechniques, attributes) => {
		const array: CombatTechnique[] = [];
		for (const [id, entry] of combatTechniques) {
			const { ic, name, primary, value } = entry;
			array.push({
				id,
				name,
				value,
				primary,
				ic,
				at: getAt(attributes, entry),
				pa: getPa(attributes, entry)
			});
		}
		return array;
	}
);

function getAt(attributes: Map<string, AttributeInstance>, obj: CombatTechniqueInstance): number {
	const array = obj.gr === 2 ? obj.primary : ['ATTR_1'];
	const mod = getPrimaryAttributeMod(attributes, array);
	return obj.value + mod;
}

function getPa(attributes: Map<string, AttributeInstance>, obj: CombatTechniqueInstance): number | undefined {
	const mod = getPrimaryAttributeMod(attributes, obj.primary);
	return obj.gr === 2 || obj.id === 'CT_6' || obj.id === 'CT_8' ? undefined : Math.round(obj.value / 2) + mod;
}

function getPrimaryAttributeMod(attributes: Map<string, AttributeInstance>, ids: string[]) {
	return Math.max(Math.floor((getMaxAttributeValueByID(attributes, ids) - 8) / 3), 0);
}
