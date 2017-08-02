import { AppState } from '../reducers/app';

export const getProfile = (state: AppState) => state.currentHero.present.profile;
export const getCultureAreaKnowledge = (state: AppState) => getProfile(state).cultureAreaKnowledge;
