import { CurrentHeroState } from '../reducers/currentHero';
import { get } from '../reducers/dependentInstances';
import { getStart } from '../reducers/el';
import { AdvantageInstance, AttributeInstance, CultureInstance, RequirementObject, SpecialAbilityInstance, TalentInstance } from '../types/data.d';
import { isActive } from './ActivatableUtils';

export function isIncreasable(state: CurrentHeroState, obj: TalentInstance): boolean {
	const { dependent } = state;
	let max = 0;
	const bonus = (get(dependent, 'ADV_16') as AdvantageInstance).active.filter(e => e === obj.id).length;

	if (state.phase < 3) {
		max = getStart(state.el).maxSkillRating;
	} else {
		const checkValues = obj.check.map(attr => (get(dependent, attr) as AttributeInstance).value);
		max = Math.max(...checkValues) + 2;
	}

	return obj.value < max + bonus;
}

export function isDecreasable(state: CurrentHeroState, obj: TalentInstance): boolean {
	const { dependent } = state;
	const SA_18_REQ = isActive(get(dependent, 'SA_18') as SpecialAbilityInstance) && (get(dependent, 'TAL_51') as TalentInstance).value + (get(dependent, 'TAL_55') as TalentInstance).value < 12;

	const dependencies = obj.dependencies.map(e => {
		if (typeof e !== 'number') {
			const target = get(dependent, e.origin) as SpecialAbilityInstance;
			const req = target.reqs.find(r => typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin)) as RequirementObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(id => (get(dependent, id) as TalentInstance).value >= e.value);
				return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? 0 : e.value;
			}
			return 0;
		}
		return e;
	});

	return (['TAL_51', 'TAL_55'].includes(obj.id) && SA_18_REQ) || obj.value > Math.max(0, ...dependencies);
}

export function isTyp(state: CurrentHeroState, obj: TalentInstance): boolean {
	const culture = typeof state.rcp.culture === 'string' && get(state.dependent, state.rcp.culture) as CultureInstance;
	return typeof culture === 'object' && culture.typicalTalents.includes(obj.id);
}

export function isUntyp(state: CurrentHeroState, obj: TalentInstance): boolean {
	const culture = typeof state.rcp.culture === 'string' && get(state.dependent, state.rcp.culture) as CultureInstance;
	return typeof culture === 'object' && culture.untypicalTalents.includes(obj.id);
}

export function reset(obj: TalentInstance): TalentInstance {
	return {
		...obj,
		dependencies: [],
		value: 0,
	};
}
