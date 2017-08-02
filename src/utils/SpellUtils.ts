import { SPELLS } from '../constants/Categories';
import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { get, getAllByCategory } from '../selectors/dependentInstancesSelectors';
import { getStart } from '../selectors/elSelectors';
import { AbilityInstanceExtended, AdvantageInstance, AttributeInstance, CantripInstance, SpecialAbilityInstance, SpellInstance } from '../types/data.d';
import { RequiresIncreasableObject } from '../types/requirements.d';
import { getSids } from './ActivatableUtils';
import { addDependencies, removeDependencies } from './DependentUtils';

export function isOwnTradition(state: DependentInstancesState, obj: SpellInstance | CantripInstance): boolean {
	const SA = get(state, 'SA_86') as SpecialAbilityInstance;
	return obj.tradition.some(e => e === 1 || e === getSids(SA)[0] as number + 1);
}

export function isIncreasable(state: CurrentHeroInstanceState, obj: SpellInstance): boolean {
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

	if (!getSids(get(dependent, 'SA_88') as SpecialAbilityInstance).includes(obj.property)) {
		max = Math.min(14, max);
	}

	return obj.value < max + bonus;
}

export function isDecreasable(state: CurrentHeroInstanceState, obj: SpellInstance): boolean {
	const { dependent } = state;
	const dependencies = obj.dependencies.map(e => {
		if (typeof e === 'object') {
			const target = get(dependent, e.origin) as SpecialAbilityInstance;
			const req = target.reqs.find(r => typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin)) as RequiresIncreasableObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(id => (get(dependent, id) as SpellInstance).value >= e.value);
				return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? 0 : e.value;
			}
			return 0;
		}
		return e;
	});

	const valid = obj.value < 1 ? !dependencies.includes(true) : obj.value > dependencies.reduce((m, d) => typeof d === 'number' && d > m ? d : m, 0);

	if (getSids(get(dependent, 'SA_88') as SpecialAbilityInstance).includes(obj.property)) {
		const counter = getPropertyCounter(dependent);
		const countedWithProperty = counter.get(obj.property);
		return !(countedWithProperty && countedWithProperty <= 3 && obj.value <= 10 && obj.gr !== 5) && valid;
	}

	return valid;
}

export function getPropertyCounter(state: DependentInstancesState) {
	return (getAllByCategory(state, SPELLS) as SpellInstance[]).filter(e => e.value >= 10).reduce((a, b) => {
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

export function activate(state: DependentInstancesState, obj: SpellInstance): Map<string, AbilityInstanceExtended> {
	return addDependencies(state, {...obj, active: true});
}

export function activateCantrip(state: DependentInstancesState, obj: CantripInstance): Map<string, AbilityInstanceExtended> {
	return addDependencies(state, {...obj, active: true});
}

export function deactivate(state: DependentInstancesState, obj: SpellInstance): Map<string, AbilityInstanceExtended> {
	return removeDependencies(state, {...obj, active: false});
}

export function deactivateCantrip(state: DependentInstancesState, obj: CantripInstance): Map<string, AbilityInstanceExtended> {
	return removeDependencies(state, {...obj, active: false});
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
