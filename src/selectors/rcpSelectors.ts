import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { CultureInstance, ProfessionInstance, ProfessionVariantInstance, RaceInstance} from '../types/data.d';
import { get, getDependent } from './dependentInstancesSelectors';

export const getCurrentRaceId = (state: AppState) => state.currentHero.present.rcp.race;
export const getCurrentCultureId = (state: AppState) => state.currentHero.present.rcp.culture;
export const getCurrentProfessionId = (state: AppState) => state.currentHero.present.rcp.profession;
export const getCurrentProfessionVariantId = (state: AppState) => state.currentHero.present.rcp.professionVariant;

export const getCurrentRace = createSelector(
	[ getDependent, getCurrentRaceId ],
	(dependent, raceId) => raceId ? get(dependent, raceId) as RaceInstance : undefined
);

export const getCurrentCulture = createSelector(
	[ getDependent, getCurrentCultureId ],
	(dependent, cultureId) => cultureId ? get(dependent, cultureId) as CultureInstance : undefined
);

export const getCurrentProfession = createSelector(
	[ getDependent, getCurrentProfessionId ],
	(dependent, professionId) => professionId ? get(dependent, professionId) as ProfessionInstance : undefined
);

export const getCurrentProfessionVariant = createSelector(
	[ getDependent, getCurrentProfessionVariantId ],
	(dependent, professionVariantId) => professionVariantId ? get(dependent, professionVariantId) as ProfessionVariantInstance : undefined
);
