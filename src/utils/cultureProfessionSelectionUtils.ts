import * as Wiki from '../types/wiki.d';

export const isSpecialisationSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Wiki.ProfessionSelection | undefined,
): options is Wiki.SpecializationSelection => {
  return id === 'SPECIALISATION' && typeof options === 'object';
};

export const isCursesSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Wiki.ProfessionSelection | undefined,
): options is Wiki.CursesSelection => {
  return id === 'CURSES' && typeof options === 'object';
};

export const isCantripsSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Wiki.ProfessionSelection | undefined,
): options is Wiki.CantripsSelection => {
  return id === 'CANTRIPS' && typeof options === 'object';
};

export const isCombatTechniquesSecondSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Wiki.ProfessionSelection | undefined,
): options is Wiki.CombatTechniquesSecondSelection => {
  return id === 'COMBAT_TECHNIQUES_SECOND' && typeof options === 'object';
};

export const isCombatTechniquesSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Wiki.ProfessionSelection | undefined,
): options is Wiki.CombatTechniquesSelection => {
  return id === 'COMBAT_TECHNIQUES' && typeof options === 'object';
};

export const isLanguagesScriptsSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Wiki.ProfessionSelection | undefined,
): options is Wiki.LanguagesScriptsSelection => {
  return id === 'LANGUAGES_SCRIPTS' && typeof options === 'object';
};

export const isSkillsSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Wiki.ProfessionSelection | undefined,
): options is Wiki.SkillsSelection => {
  return id === 'SKILLS' && typeof options === 'object';
};
