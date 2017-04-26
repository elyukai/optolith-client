import { ELStore } from '../stores/ELStore';
import { get } from '../stores/ListStore';
import { PhaseStore } from '../stores/PhaseStore';
import { SpellsStore } from '../stores/SpellsStore';
import { AdvantageInstance, AttributeInstance, CantripInstance, SpecialAbilityInstance, SpellInstance } from '../types/data.d';
import { getSids } from './ActivatableUtils';

export function isOwnTradition(obj: SpellInstance | CantripInstance): boolean {
	const SA = get('SA_86') as SpecialAbilityInstance;
	return obj.tradition.some(e => e === 1 || e === getSids(SA)[0] as number + 1);
}

export function isIncreasable(obj: SpellInstance): boolean {
	let max = 0;
	const bonus = (get('ADV_16') as AdvantageInstance).active.filter(e => e === obj.id).length;

	if (PhaseStore.get() < 3) {
		max = ELStore.getStart().maxSkillRating;
	} else {
		const checkValues = obj.check.map((attr, i) => i > 2 ? 0 : (get(attr) as AttributeInstance).value);
		max = Math.max(...checkValues) + 2;
	}

	if (!(get('SA_88') as SpecialAbilityInstance).active.includes(obj.property)) {
		max = Math.min(14, max);
	}

	return obj.value < max + bonus;
}

export function isDecreasable(obj: SpellInstance): boolean {
	switch (obj.id) {
		case 'SPELL_28': {
			const SPELL_48 = get('SPELL_48') as SpellInstance;
			if (SPELL_48.active) {
				return obj.value > 10;
			}
			break;
		}
		case 'SPELL_48': {
			const SPELL_47 = get('SPELL_47') as SpellInstance;
			if (SPELL_47.active) {
				return obj.value > 12;
			}
			break;
		}
		case 'SPELL_22': {
			const SPELL_50 = get('SPELL_50') as SpellInstance;
			if (SPELL_50.active) {
				return obj.value > 10;
			}
			break;
		}
		case 'SPELL_50': {
			const SPELL_49 = get('SPELL_49') as SpellInstance;
			if (SPELL_49.active) {
				return obj.value > 12;
			}
			break;
		}
	}
	if ((get('SA_88') as SpecialAbilityInstance).active.includes(obj.property)) {
		const counter = SpellsStore.getPropertyCounter();

		return !(counter.get(obj.property) <= 3 && obj.value <= 10 && obj.gr !== 5);
	}
	return true;
}

export function isActivatable(obj: SpellInstance | CantripInstance): boolean {
	switch (obj.id) {
		case 'SPELL_48': {
			const SPELL_28 = get('SPELL_28') as SpellInstance;
			return SPELL_28.active && SPELL_28.value >= 10;
		}
		case 'SPELL_47': {
			const SPELL_48 = get('SPELL_48') as SpellInstance;
			return SPELL_48.active && SPELL_48.value >= 12;
		}
		case 'SPELL_50': {
			const SPELL_22 = get('SPELL_22') as SpellInstance;
			return SPELL_22.active && SPELL_22.value >= 10;
		}
		case 'SPELL_49': {
			const SPELL_50 = get('SPELL_50') as SpellInstance;
			return SPELL_50.active && SPELL_50.value >= 12;
		}
	}
	return true;
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
