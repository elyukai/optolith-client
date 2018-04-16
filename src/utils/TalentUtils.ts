import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { get } from '../selectors/dependentInstancesSelectors';
import { getStart } from '../selectors/elSelectors';
import { AdvantageInstance, AttributeInstance, RequirementObject, SpecialAbilityInstance, TalentInstance, ToListById } from '../types/data.d';
import { isActive } from './ActivatableUtils';
import { getFlatPrerequisites } from './RequirementUtils';

export function isIncreasable(state: CurrentHeroInstanceState, obj: TalentInstance): boolean {
	const { dependent } = state;
	let max = 0;
	const bonus = (get(dependent, 'ADV_16') as AdvantageInstance).active.filter(e => e.sid === obj.id).length;

	if (state.phase < 3) {
		max = getStart(state.el).maxSkillRating;
	} else {
		const checkValues = obj.check.map(attr => (get(dependent, attr) as AttributeInstance).value);
		max = Math.max(...checkValues) + 2;
	}

	return obj.value < max + bonus;
}

export function isDecreasable(state: CurrentHeroInstanceState, obj: TalentInstance): boolean {
	const { dependent } = state;
	const SA_17_REQ = isActive(get(dependent, 'SA_17') as SpecialAbilityInstance) && (get(dependent, 'TAL_51') as TalentInstance).value + (get(dependent, 'TAL_55') as TalentInstance).value < 12;

	const dependencies = obj.dependencies.map(e => {
		if (typeof e !== 'number') {
			const target = get(dependent, e.origin) as SpecialAbilityInstance;
			const req = getFlatPrerequisites(target.reqs).find(r => typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin)) as RequirementObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(id => (get(dependent, id) as TalentInstance).value >= e.value);
				return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? 0 : e.value;
			}
			return 0;
		}
		return e;
	});

	return (['TAL_51', 'TAL_55'].includes(obj.id) && SA_17_REQ) || obj.value > Math.max(0, ...dependencies);
}

export function isTyp(rating: ToListById<string>, obj: TalentInstance): boolean {
	return rating[obj.id] === 'TYP';
}

export function isUntyp(rating: ToListById<string>, obj: TalentInstance): boolean {
	return rating[obj.id] === 'UNTYP';
}

export function reset(obj: TalentInstance): TalentInstance {
	return {
		...obj,
		dependencies: [],
		value: 0,
	};
}

export function getRoutineValue(sr: number, attributeValues: number[]): [number, boolean] | undefined {
	if (sr > 0 ) {
		const lessAttrPoints = attributeValues.map(e => e < 13 ? 13 - e : 0).reduce((a, b) => a + b, 0);
		const flatRoutineLevel = Math.floor((sr - 1) / 3);
		const checkMod = flatRoutineLevel * -1 + 3;
		const dependentCheckMod = checkMod + lessAttrPoints;
		return dependentCheckMod < 4 ? [ dependentCheckMod, lessAttrPoints > 0 ] as [number, boolean] : undefined;
	}
	return;
}
