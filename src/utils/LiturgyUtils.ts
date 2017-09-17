import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { get } from '../selectors/dependentInstancesSelectors';
import { getStart } from '../selectors/elSelectors';
import { AdvantageInstance, AttributeInstance, BlessingInstance, LiturgyInstance, SpecialAbilityInstance, ToListById } from '../types/data.d';
import { getSids } from './ActivatableUtils';

export function isOwnTradition(state: DependentInstancesState, obj: LiturgyInstance | BlessingInstance): boolean {
	const SA = get(state, 'SA_86') as SpecialAbilityInstance;
	return obj.tradition.some(e => e === 1 || e === getSids(SA)[0] as number + 1);
}

export function isIncreasable(state: CurrentHeroInstanceState, obj: LiturgyInstance): boolean {
	const { dependent } = state;
	let max = 0;
	const bonus = (get(dependent, 'ADV_16') as AdvantageInstance).active.filter(e => e === obj.id).length;

	if (state.phase < 3) {
		max = getStart(state.el).maxSkillRating;
	}
	else {
		const checkValues = obj.check.map((attr, i) => i > 2 ? 0 : (get(dependent, attr) as AttributeInstance).value);
		max = Math.max(...checkValues) + 2;
	}

	const tradition = get(dependent, 'SA_86') as SpecialAbilityInstance;
	const aspectKnowledge = get(dependent, 'SA_87') as SpecialAbilityInstance;
	if (!getSids(aspectKnowledge).some(e => obj.aspects.includes(e as number)) && !getSids(tradition).includes(13)) {
		max = Math.min(14, max);
	}

	return obj.value < max + bonus;
}

export function isDecreasable(state: CurrentHeroInstanceState, obj: LiturgyInstance): boolean {
	const { dependent } = state;
	const activeAspectKnowledge = getSids(get(dependent, 'SA_87') as SpecialAbilityInstance);
	if (activeAspectKnowledge.some((e: number) => obj.aspects.includes(e))) {
		const counter = getAspectCounter(dependent.liturgies);
		const countedLowestWithProperty = obj.aspects.reduce((n, aspect) => {
			const counted = counter.get(aspect);
			if (activeAspectKnowledge.includes(aspect) && typeof counted === 'number') {
				return Math.min(counted, n);
			}
			return n;
		}, 4);
		return obj.value !== 10 || countedLowestWithProperty > 3;
	}
	return true;
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
