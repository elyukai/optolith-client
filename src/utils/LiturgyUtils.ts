import ELStore from '../stores/ELStore';
import { get } from '../stores/ListStore';
import LiturgiesStore from '../stores/LiturgiesStore';
import PhaseStore from '../stores/PhaseStore';
import { getSids } from './ActivatableUtils';

export function isOwnTradition(obj: LiturgyInstance): boolean {
	const SA = get('SA_102') as SpecialAbilityInstance;
	return obj.tradition.some(e => e === 1 || e === getSids(SA)[0] as number + 1);
}

export function isIncreasable(obj: LiturgyInstance): boolean {
	let max = 0;
	const bonus = (get('ADV_16') as AdvantageInstance).active.filter(e => e === obj.id).length;

	if (PhaseStore.get() < 3) {
		max = ELStore.getStart().maxSkillRating;
	} else {
		const checkValues = obj.check.map((attr, i) => i > 2 ? 0 : (get(attr) as AttributeInstance).value);
		max = Math.max(...checkValues) + 2;
	}

	if (!(get('SA_103') as SpecialAbilityInstance).active.includes(obj.aspects)) {
		max = Math.min(14, max);
	}

	return obj.value < max + bonus;
}

export function isDecreasable(obj: LiturgyInstance): boolean {
	if ((get('SA_103') as SpecialAbilityInstance).active.includes(obj.aspects)) {
		const counter = LiturgiesStore.getAspectCounter();

		return !(counter.get(obj.aspects) <= 3 && obj.value <= 10 && obj.gr !== 5);
	}
	return true;
}

export function reset(obj: LiturgyInstance): LiturgyInstance {
	return {
		...obj,
		active: false,
		dependencies: [],
		value: 0,
	};
}
