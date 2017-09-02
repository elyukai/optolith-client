import { AppState } from '../reducers/app';

export const getEnergies = (state: AppState) => state.currentHero.present.energies;
