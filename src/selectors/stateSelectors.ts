import { AppState } from '../reducers/app';

export const getCurrentHeroPresent = (state: AppState) => state.currentHero.present;

export const getAdvantages = (state: AppState) => state.currentHero.present.dependent.advantages;
export const getAttributes = (state: AppState) => state.currentHero.present.dependent.attributes;
export const getCantrips = (state: AppState) => state.currentHero.present.dependent.cantrips;
export const getCombatTechniques = (state: AppState) => state.currentHero.present.dependent.combatTechniques;
export const getDisadvantages = (state: AppState) => state.currentHero.present.dependent.disadvantages;
export const getSkills = (state: AppState) => state.currentHero.present.dependent.talents;
export const getSpecialAbilities = (state: AppState) => state.currentHero.present.dependent.specialAbilities;
export const getSpells = (state: AppState) => state.currentHero.present.dependent.spells;

export const getProfile = (state: AppState) => state.currentHero.present.profile;
export const getCultureAreaKnowledge = (state: AppState) => state.currentHero.present.profile.cultureAreaKnowledge;
export const getSex = (state: AppState) => state.currentHero.present.profile.sex;
