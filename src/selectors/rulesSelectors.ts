import { AppState } from '../reducers/app';

export const getRules = (state: AppState) => state.currentHero.present.rules;
export const getAttributeValueLimit = (state: AppState) => state.currentHero.present.rules.attributeValueLimit;
export const getHigherParadeValues = (state: AppState) => state.currentHero.present.rules.higherParadeValues;
