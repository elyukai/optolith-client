import { last } from 'lodash';
import { createSelector } from 'reselect';
import { BLESSINGS, LITURGIES } from '../constants/Categories';
import { AppState } from '../reducers/app';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { BlessingInstance, LiturgyInstance } from '../types/data.d';
import { Liturgy } from '../types/view.d';
import { getSids } from '../utils/ActivatableUtils';
import { getAspectsOfTradition } from '../utils/LiturgyUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getAllByCategory, getDependent } from './dependentInstancesSelectors';
import { getElState, getStart } from './elSelectors';
import { getPhase, getSpecialAbilities } from './stateSelectors';

export const get = (state: Map<string, LiturgyInstance>, id: string) => state.get(id);
export { get as getLiturgy };
export const getBlessingsState = (state: AppState) => state.currentHero.present.dependent.blessings;
export const getLiturgiesState = (state: AppState) => state.currentHero.present.dependent.liturgies;

export function getForSave(state: DependentInstancesState) {
	const active: { [id: string]: number } = {};
	for (const skill of getAllByCategory(state, LITURGIES) as LiturgyInstance[]) {
		const { id, active: isActive, value } = skill;
		if (isActive) {
			active[id] = value;
		}
	}
	return active;
}

export function getBlessingsForSave(state: DependentInstancesState) {
	return (getAllByCategory(state, BLESSINGS) as BlessingInstance[]).reduce<string[]>((arr, e) => {
		if (e.active) {
			return [...arr, e.id];
		}
		return arr;
	}, []);
}

export function isActivationDisabled(state: AppState) {
	const maxSpellsLiturgies = getStart(getElState(state)).maxSpellsLiturgies;
	return getPhase(state) < 3 && (getAllByCategory(getDependent(state), LITURGIES) as LiturgyInstance[]).filter(e => e.gr < 3 && e.active).length >= maxSpellsLiturgies;
}

export const getBlessingsForSheet = createSelector(
	getBlessingsState,
	blessings => [...blessings.values()].filter(e => e.active)
);

export const getLiturgiesForSheet = createSelector(
	getLiturgiesState,
	mapGetToSlice(getSpecialAbilities, 'SA_86'),
	(liturgies, tradition) => {
		const array: Liturgy[] = [];
		for (const [id, entry] of liturgies) {
			const { ic, name, active, value, check, checkmod, aspects, category } = entry;
			const traditionId = last(getSids(tradition!)) as number;
			const availableAspects = traditionId && getAspectsOfTradition(traditionId + 1);
			if (active) {
				array.push({
					id,
					name,
					value,
					ic,
					check,
					checkmod,
					aspects: aspects.filter(e => availableAspects && availableAspects.includes(e)),
					category
				});
			}
		}
		return array;
	}
);
