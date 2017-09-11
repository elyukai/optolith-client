import { AppState } from '../reducers/app';

export const getEnergies = (state: AppState) => state.currentHero.present.energies;
export const getAddedLifePoints = (state: AppState) => state.currentHero.present.energies.addedLifePoints;
export const getAddedArcaneEnergyPoints = (state: AppState) => state.currentHero.present.energies.addedArcaneEnergy;
export const getAddedKarmaPoints = (state: AppState) => state.currentHero.present.energies.addedKarmaPoints;
