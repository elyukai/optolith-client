import { CultureStore } from '../stores/CultureStore';
import { ELStore } from '../stores/ELStore';
import { get } from '../stores/ListStore';
import { PhaseStore } from '../stores/PhaseStore';
import { AdvantageInstance, AttributeInstance, RequirementObject, SpecialAbilityInstance, TalentInstance } from '../types/data.d';
import { isActive } from './ActivatableUtils';

export function isIncreasable(obj: TalentInstance): boolean {
	let max = 0;
	const bonus = (get('ADV_16') as AdvantageInstance).active.filter(e => e === obj.id).length;

	if (PhaseStore.get() < 3) {
		max = ELStore.getStart().maxSkillRating;
	} else {
		const checkValues = obj.check.map(attr => (get(attr) as AttributeInstance).value);
		max = Math.max(...checkValues) + 2;
	}

	return obj.value < max + bonus;
}

export function isDecreasable(obj: TalentInstance): boolean {
	const SA_18_REQ = isActive(get('SA_18') as SpecialAbilityInstance) && (get('TAL_51') as TalentInstance).value + (get('TAL_55') as TalentInstance).value < 12;

	const dependencies = obj.dependencies.map(e => {
		if (typeof e !== 'number') {
			const target = get(e.origin) as SpecialAbilityInstance;
			const req = target.reqs.find(r => typeof r !== 'string' && Array.isArray(r.id) && r.id.includes(e.origin)) as RequirementObject | undefined;
			if (req) {
				const resultOfAll = (req.id as string[]).map(id => (get(id) as TalentInstance).value >= e.value);
				return resultOfAll.reduce((a, b) => b ? a + 1 : a, 0) > 1 ? 0 : e.value;
			}
			return 0;
		}
		return e;
	});

	return (['TAL_51', 'TAL_55'].includes(obj.id) && SA_18_REQ) || obj.value > Math.max(0, ...dependencies);
}

export function isTyp(obj: TalentInstance): boolean {
	const culture = CultureStore.getCurrent();
	return culture!.typicalTalents.includes(obj.id);
}

export function isUntyp(obj: TalentInstance): boolean {
	const culture = CultureStore.getCurrent();
	return culture!.untypicalTalents.includes(obj.id);
}

export function reset(obj: TalentInstance): TalentInstance {
	return {
		...obj,
		dependencies: [],
		value: 0,
	};
}
