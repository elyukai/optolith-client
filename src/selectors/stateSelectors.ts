import { AppState } from '../reducers/app';

export const getCurrentTab = (state: AppState) => state.ui.location.tab;

export const getLocaleMessages = (state: AppState) => state.locale.messages;
export const getLocaleId = (state: AppState) => state.locale.id;
export const getLocaleType = (state: AppState) => state.locale.type;

export const getCurrentHeroPresent = (state: AppState) => state.currentHero.present;

export const getAdvantages = (state: AppState) => state.currentHero.present.dependent.advantages;
export const getAttributes = (state: AppState) => state.currentHero.present.dependent.attributes;
export const getCantrips = (state: AppState) => state.currentHero.present.dependent.cantrips;
export const getCombatTechniques = (state: AppState) => state.currentHero.present.dependent.combatTechniques;
export const getCultures = (state: AppState) => state.currentHero.present.dependent.cultures;
export const getDisadvantages = (state: AppState) => state.currentHero.present.dependent.disadvantages;
export const getProfessions = (state: AppState) => state.currentHero.present.dependent.professions;
export const getProfessionVariants = (state: AppState) => state.currentHero.present.dependent.professionVariants;
export const getRaces = (state: AppState) => state.currentHero.present.dependent.races;
export const getSkills = (state: AppState) => state.currentHero.present.dependent.talents;
export const getSpecialAbilities = (state: AppState) => state.currentHero.present.dependent.specialAbilities;
export const getSpells = (state: AppState) => state.currentHero.present.dependent.spells;

export const getProfile = (state: AppState) => state.currentHero.present.profile;
export const getCultureAreaKnowledge = (state: AppState) => state.currentHero.present.profile.cultureAreaKnowledge;
export const getSex = (state: AppState) => state.currentHero.present.profile.sex;

export const getCurrentRaceId = (state: AppState) => state.currentHero.present.rcp.race;
export const getCurrentCultureId = (state: AppState) => state.currentHero.present.rcp.culture;
export const getCurrentProfessionId = (state: AppState) => state.currentHero.present.rcp.profession;
export const getCurrentProfessionVariantId = (state: AppState) => state.currentHero.present.rcp.professionVariant;

export const getPhase = (state: AppState) => state.currentHero.present.phase;
