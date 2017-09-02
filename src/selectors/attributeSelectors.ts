import { last } from 'lodash';
import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { AttributeInstance, ExperienceLevel, RequirementObject, SkillOptionalDependency, SpecialAbilityInstance, TalentInstance } from '../types/data.d';
import { Attribute, AttributeWithRequirements } from '../types/view.d';
import * as ActivatableUtils from '../utils/ActivatableUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getSpecialAbilities } from './activatableSelectors';
import { getCurrentEl, getStartEl } from './elSelectors';
import { getEnergies } from './energiesSelectors';
import { getPhase } from './phaseSelectors';
import { getAttributeValueLimit } from './rulesSelectors';
import { getTalents } from './talentsSelectors';

export const getAttributes = (state: AppState) => state.currentHero.present.dependent.attributes;

export const getForSave = createSelector(
	[ getAttributes, getEnergies ],
	(attributes, energies) => {
		const {
			addedArcaneEnergy: ae,
			addedKarmaPoints: kp,
			addedLifePoints: lp,
			permanentArcaneEnergy: permanentAE,
			permanentKarmaPoints: permanentKP
		} = energies;
		return {
			values: [...attributes.values()].map(e => [e.id, e.value, e.mod] as [string, number, number]),
			ae,
			kp,
			lp,
			permanentAE,
			permanentKP
		};
	}
);

export const getSum = createSelector(
	[ getAttributes ],
	attributes => [...attributes.values()].reduce((sum, { value }) => sum + value, 0)
);

export const getForView = createSelector(
	getAttributes,
	getStartEl,
	getCurrentEl,
	getPhase,
	getAttributeValueLimit,
	getSpecialAbilities,
	getTalents,
	(attributes, startEl, currentEl, phase, attributeValueLimit, specialAbilities, talents) => {
		const array: AttributeWithRequirements[] = [];
		for (const [id, entry] of attributes) {
			const { mod, name, short, value, dependencies } = entry;
			const max = getMax(startEl, currentEl, phase, mod, attributeValueLimit);
			const min = getMin(dependencies, specialAbilities, talents);
			array.push({
				id,
				name,
				short,
				value,
				max,
				min
			});
		}
		return array;
	}
);

export const getForSheet = createSelector(
	[ getAttributes ],
	attributes => {
		const array: Attribute[] = [];
		for (const [id, entry] of attributes) {
			const { name, short, value } = entry;
			array.push({
				id,
				name,
				short,
				value
			});
		}
		return array;
	}
);

function getMax(startEl: ExperienceLevel, currentEl: ExperienceLevel | undefined, phase: number, mod: number, attributeValueLimit: boolean): number | undefined {
	if (phase < 3) {
		return startEl.maxAttributeValue + mod;
	}
	else if (attributeValueLimit === true) {
		return currentEl && currentEl.maxAttributeValue + 2;
	}
	return;
}

function getMin(dependencies: (number | SkillOptionalDependency)[], specialAbilities: Map<string, SpecialAbilityInstance>, talents: Map<string, TalentInstance>): number {
	return Math.max(8, ...dependencies.map(e => {
		if (typeof e !== 'number') {
			const target = specialAbilities.get(e.origin)!;
			const req = target.reqs.find(r => typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin)) as RequirementObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(id => talents.get(id)!.value >= e.value);
				return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? 0 : e.value;
			}
			return 0;
		}
		return e;
	}));
}

export function getMaxAttributeValueByID(attributes: Map<string, AttributeInstance>, ids: string[]) {
	return ids.reduce((a, b) => Math.max(a, attributes.get(b)!.value), 0);
}

export const getPrimaryMagicalAttributeForSheet = createSelector(
	[ mapGetToSlice(getSpecialAbilities, 'SA_86'), getAttributes ],
	(tradition, attributes) => {
		const id = getPrimaryAttributeId(tradition!);
		return (id && attributes.get(id)!.short)!;
	}
);

export const getPrimaryMagicalAttribute = createSelector(
	[ mapGetToSlice(getSpecialAbilities, 'SA_86'), getAttributes ],
	(tradition, attributes) => {
		return tradition && ActivatableUtils.getSids(tradition).reduce<AttributeInstance | undefined>((highestAttribute, sid) => {
			let attribute;
			switch (sid) {
				case 1:
				case 4:
				case 10:
					attribute = attributes.get('ATTR_2');
					break;
				case 3:
					attribute = attributes.get('ATTR_3');
					break;
				case 2:
				case 5:
				case 6:
				case 7:
					attribute = attributes.get('ATTR_4');
					break;
			}
			if (attribute && (!highestAttribute || highestAttribute.value < attribute.value)) {
				return attribute;
			}
			return;
		}, undefined);
	}
);

export const getPrimaryBlessedAttributeForSheet = createSelector(
	[ mapGetToSlice(getSpecialAbilities, 'SA_102'), getAttributes ],
	(tradition, attributes) => {
		const id = getPrimaryAttributeId(tradition!);
		return (id && attributes.get(id)!.short)!;
	}
);

export function getPrimaryAttributeId(specialAbilitiesState: Map<string, SpecialAbilityInstance>, type: 1 | 2): string | undefined;
export function getPrimaryAttributeId(traditionInstance: SpecialAbilityInstance): string | undefined;
export function getPrimaryAttributeId(traditionInstance: SpecialAbilityInstance | Map<string, SpecialAbilityInstance>, type?: 1 | 2): string | undefined {
	const isInstance = (obj: SpecialAbilityInstance | Map<string, SpecialAbilityInstance>): obj is SpecialAbilityInstance => obj.hasOwnProperty('category');
	const tradition = isInstance(traditionInstance) ? traditionInstance : traditionInstance.get(type === 1 ? 'SA_86' : 'SA_102')!;
	const sid = last(ActivatableUtils.getSids(tradition));
	if (tradition.id === 'SA_86') {
		switch (sid) {
			case 1:
			case 4:
			case 10:
				return 'ATTR_2';
			case 3:
				return 'ATTR_3';
			case 2:
			case 5:
			case 6:
			case 7:
				return 'ATTR_4';
		}
	}
	else if (tradition.id === 'SA_102') {
		switch (sid) {
			case 2:
			case 3:
				return 'ATTR_1';
			case 1:
			case 4:
				return 'ATTR_2';
			case 5:
			case 6:
				return 'ATTR_3';
		}
	}
	return;
}

export const getCarryingCapacity = createSelector(
	mapGetToSlice(getAttributes, 'ATTR_8'),
	strength => {
		return strength!.value * 2;
	}
);
