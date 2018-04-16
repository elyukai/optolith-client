import { WikiState } from '../reducers/wikiReducer';
import { AdvantageInstance, AttributeInstance, CantripInstance, SpecialAbilityInstance, SpellInstance } from '../types/data.d';
import { RequiresIncreasableObject } from '../types/reusable.d';
import { ExperienceLevel, SpecialAbility } from '../types/wiki';
import { getSids } from './ActivatableUtils';
import { getFlatPrerequisites } from './RequirementUtils';
import { getWikiEntry } from './WikiUtils';

export function isOwnTradition(tradition: SpecialAbilityInstance[], obj: SpellInstance | CantripInstance): boolean {
	return obj.tradition.some(e => e === 1 || !!tradition.find(t => e === getNumericMagicalTraditionIdByInstanceId(t.id) + 1));
}

export function isIncreasable(obj: SpellInstance, startEL: ExperienceLevel, phase: number, attributes: Map<string, AttributeInstance>, exceptionalSkill: AdvantageInstance, propertyKnowledge: SpecialAbilityInstance): boolean {
	let max = 0;
	const bonus = exceptionalSkill.active.filter(e => e === obj.id).length;

	if (phase < 3) {
		max = startEL.maxSkillRating;
	}
	else {
		const checkValues = obj.check.map(id => attributes.get(id)!.value);
		max = Math.max(...checkValues) + 2;
	}

	if (!getSids(propertyKnowledge).includes(obj.property)) {
		max = Math.min(14, max);
	}

	return obj.value < max + bonus;
}

export function isDecreasable(wiki: WikiState, obj: SpellInstance, spells: Map<string, SpellInstance>, propertyKnowledge: SpecialAbilityInstance): boolean {
	const dependencies = obj.dependencies.map(e => {
		if (typeof e === 'object') {
			const target = getWikiEntry(wiki, e.origin) as SpecialAbility;
			const req = getFlatPrerequisites(target.prerequisites).find(r => {
				return typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin);
			}) as RequiresIncreasableObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(id => spells.get(id)!.value >= e.value);
				return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? 0 : e.value;
			}
			return 0;
		}
		return e;
	});

	const valid = obj.value < 1 ? !dependencies.includes(true) : obj.value > dependencies.reduce((m, d) => typeof d === 'number' && d > m ? d : m, 0);

	if (getSids(propertyKnowledge).includes(obj.property)) {
		const counter = getPropertyCounter(spells);
		const countedWithProperty = counter.get(obj.property);
		return (obj.value !== 10 || typeof countedWithProperty === 'number' && countedWithProperty > 3) && valid;
	}

	return valid;
}

export function getPropertyCounter(spells: Map<string, SpellInstance>) {
	return [...spells.values()].filter(e => e.value >= 10).reduce((a, b) => {
		const existing = a.get(b.property);
		if (typeof existing === 'number') {
			a.set(b.property, existing + 1);
		}
		else {
			a.set(b.property, 1);
		}
		return a;
	}, new Map<number, number>());
}

export function reset(obj: SpellInstance): SpellInstance {
	return {
		...obj,
		active: false,
		dependencies: [],
		value: 0
	};
}

export function resetCantrip(obj: CantripInstance): CantripInstance {
	return {
		...obj,
		active: false,
		dependencies: []
	};
}

export const traditionIdByNumericId = new Map([
	[1, 'SA_70'],
	[2, 'SA_255'],
	[3, 'SA_345'],
	[4, 'SA_346'],
	[5, 'SA_676'],
	[6, 'SA_677'],
	[7, 'SA_678'],
	[8, 'SA_679'],
	[9, 'SA_680'],
	[10, 'SA_681'],
]);

export const numericIdByTraditionId = new Map([
	['SA_70', 1],
	['SA_255', 2],
	['SA_345', 3],
	['SA_346', 4],
	['SA_676', 5],
	['SA_677', 6],
	['SA_678', 7],
	['SA_679', 8],
	['SA_680', 9],
	['SA_681', 10],
]);

export function isMagicalTraditionId(id: string): boolean {
	return numericIdByTraditionId.has(id);
}

export function getMagicalTraditionInstanceIdByNumericId(id: number): string {
	return traditionIdByNumericId.get(id)!;
}

export function getNumericMagicalTraditionIdByInstanceId(id: string): number {
	return numericIdByTraditionId.get(id)!;
}
