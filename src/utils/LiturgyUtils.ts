import { LITURGIES } from '../constants/Categories';
import { WikiState } from '../reducers/wikiReducer';
import { AdvantageInstance, AttributeInstance, BlessingInstance, LiturgyInstance, SpecialAbilityInstance, ToListById } from '../types/data.d';
import { RequiresIncreasableObject } from '../types/reusable.d';
import { ExperienceLevel, SpecialAbility } from '../types/wiki';
import { getSids } from './ActivatableUtils';
import { getFlatPrerequisites } from './RequirementUtils';
import { getWikiEntry } from './WikiUtils';

export function isOwnTradition(tradition: SpecialAbilityInstance, obj: LiturgyInstance | BlessingInstance): boolean {
	const isBaseTradition = obj.tradition.some(e => e === 1 || e === getNumericBlessedTraditionIdByInstanceId(tradition.id) + 1);
	const isSpecial = obj.category === LITURGIES || !getUnavailableBlessingsForTradition(tradition.id).includes(obj.id);
	return isBaseTradition && isSpecial;
}

export function isIncreasable(tradition: SpecialAbilityInstance, obj: LiturgyInstance, startEL: ExperienceLevel, phase: number, attributes: Map<string, AttributeInstance>, exceptionalSkill: AdvantageInstance, aspectKnowledge: SpecialAbilityInstance): boolean {
	let max = 0;
	const bonus = exceptionalSkill.active.filter(e => e === obj.id).length;

	if (phase < 3) {
		max = startEL.maxSkillRating;
	}
	else {
		const checkValues = obj.check.map(id => attributes.get(id)!.value);
		max = Math.max(...checkValues) + 2;
	}

	const activeAspects = getSids(aspectKnowledge) as number[];
	const hasActiveAspect = activeAspects.some(e => obj.aspects.includes(e));
	const noNamelessTradition = tradition.id !== 'SA_693';

	if (!hasActiveAspect && noNamelessTradition) {
		max = Math.min(14, max);
	}

	return obj.value < max + bonus;
}

export function isDecreasable(wiki: WikiState, obj: LiturgyInstance, liturgicalChants: Map<string, LiturgyInstance>, aspectKnowledge: SpecialAbilityInstance): boolean {
	const dependencies = obj.dependencies.map(e => {
		if (typeof e === 'object') {
			const target = getWikiEntry(wiki, e.origin) as SpecialAbility;
			const req = getFlatPrerequisites(target.prerequisites).find(r => {
				return typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin);
			}) as RequiresIncreasableObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(id => liturgicalChants.get(id)!.value >= e.value);
				return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? 0 : e.value;
			}
			return 0;
		}
		return e;
	});

	const valid = obj.value < 1 ? !dependencies.includes(true) : obj.value > dependencies.reduce((m, d) => typeof d === 'number' && d > m ? d : m, 0);

	const activeAspectKnowledge = getSids(aspectKnowledge) as number[];
	if (activeAspectKnowledge.some(e => obj.aspects.includes(e))) {
		const counter = getAspectCounter(liturgicalChants);
		const countedLowestWithProperty = obj.aspects.reduce((n, aspect) => {
			const counted = counter.get(aspect);
			if (activeAspectKnowledge.includes(aspect) && typeof counted === 'number') {
				return Math.min(counted, n);
			}
			return n;
		}, 4);
		return (obj.value !== 10 || countedLowestWithProperty > 3) && valid;
	}
	return valid;
}

export function getAspectCounter(liturgies: Map<string, LiturgyInstance>) {
	return [...liturgies.values()].filter(e => e.value >= 10).reduce((a, b) => {
		for (const aspect of b.aspects) {
			const existing = a.get(aspect);
			if (typeof existing === 'number') {
				a.set(aspect, existing + 1);
			}
			else {
				a.set(aspect, 1);
			}
		}
		return a;
	}, new Map<number, number>());
}

export function reset(obj: LiturgyInstance): LiturgyInstance {
	return {
		...obj,
		active: false,
		dependencies: [],
		value: 0,
	};
}

export function resetBlessing(obj: BlessingInstance): BlessingInstance {
	return {
		...obj,
		active: false,
		dependencies: []
	};
}

const traditionsByAspect: ToListById<number> = { 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 4, 7: 4, 8: 5, 9: 5, 10: 6, 11: 6, 12: 7, 13: 7, 14: 8, 15: 8, 16: 9, 17: 9, 18: 10, 19: 10, 20: 11, 21: 11, 22: 12, 23: 12, 24: 13, 25: 13, 26: 15, 27: 15, 28: 16, 29: 16, 30: 17, 31: 17, 32: 18, 33: 18, 34: 19, 35: 19 };

/**
 * Returns the tradition id used by chants. To get the tradition SId for the actual special ability, you have to decrease the return value by 1.
 * @param aspectId The id used for chants or Aspect Knowledge.
 */
export function getTraditionOfAspect(aspectId: number): number {
	return traditionsByAspect[aspectId];
}

const aspectsByTradition: ToListById<number[]> = { 1: [1], 2: [2, 3], 3: [4, 5], 4: [6, 7], 5: [8, 9], 6: [10, 11], 7: [12, 13], 8: [14, 15], 9: [16, 17], 10: [18, 19], 11: [20, 21], 12: [22, 23], 13: [24, 25], 14: [], 15: [26, 27], 16: [28, 29], 17: [30, 31], 18: [32, 33], 19: [34, 35] };

/**
 * Return the aspect ids used for chants and Aspect Knowledge.
 * @param traditionId The id used by chants. If you only have the SId from the actual special ability, you have to increase the value by 1.
 */
export function getAspectsOfTradition(traditionId: number): number[] {
	const add = traditionId > 1 ? [1] : [];
	return [...add, ...aspectsByTradition[traditionId]];
}

const traditionIdByNumericId = new Map([
	[1, 'SA_86'],
	[2, 'SA_682'],
	[3, 'SA_683'],
	[4, 'SA_684'],
	[5, 'SA_685'],
	[6, 'SA_686'],
	[7, 'SA_687'],
	[8, 'SA_688'],
	[9, 'SA_689'],
	[10, 'SA_690'],
	[11, 'SA_691'],
	[12, 'SA_692'],
	[13, 'SA_693'],
	[14, 'SA_694'],
	[15, 'SA_695'],
	[16, 'SA_696'],
	[17, 'SA_697'],
	[18, 'SA_698'],
]);

const numericIdByTraditionId = new Map([
	['SA_86', 1],
	['SA_682', 2],
	['SA_683', 3],
	['SA_684', 4],
	['SA_685', 5],
	['SA_686', 6],
	['SA_687', 7],
	['SA_688', 8],
	['SA_689', 9],
	['SA_690', 10],
	['SA_691', 11],
	['SA_692', 12],
	['SA_693', 13],
	['SA_694', 14],
	['SA_695', 15],
	['SA_696', 16],
	['SA_697', 17],
	['SA_698', 18],
]);

export function isBlessedTraditionId(id: string): boolean {
	return numericIdByTraditionId.has(id);
}

export function getBlessedTraditionInstanceIdByNumericId(id: number): string {
	return traditionIdByNumericId.get(id)!;
}

export function getNumericBlessedTraditionIdByInstanceId(id: string): number {
	return numericIdByTraditionId.get(id)!;
}

const unavailableBlessingsByTradition = new Map([
	['SA_694', ['BLESSING_1', 'BLESSING_5', 'BLESSING_12']],
	['SA_695', ['BLESSING_4', 'BLESSING_11', 'BLESSING_12']],
	['SA_696', ['BLESSING_3', 'BLESSING_6', 'BLESSING_7']],
	['SA_697', ['BLESSING_2', 'BLESSING_8', 'BLESSING_10']],
	['SA_698', ['BLESSING_2', 'BLESSING_3', 'BLESSING_9']],
])

function getUnavailableBlessingsForTradition(traditionId: string): string[] {
	return unavailableBlessingsByTradition.get(traditionId) || [];
}
