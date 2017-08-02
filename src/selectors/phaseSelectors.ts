import { AppState } from '../reducers/app';

export const getPhase = (state: AppState) => state.currentHero.present.phase;
