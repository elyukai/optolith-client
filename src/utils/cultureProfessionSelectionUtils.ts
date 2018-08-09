import * as Wiki from '../types/wiki';
import { Just, Maybe, Record } from './dataUtils';

export const isSpecialisationSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Maybe<Wiki.ProfessionSelection>,
): options is Just<Record<Wiki.SpecializationSelection>> => {
  return id === 'SPECIALISATION' && typeof options === 'object';
};

export const isCursesSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Maybe<Wiki.ProfessionSelection>,
): options is Just<Record<Wiki.CursesSelection>> => {
  return id === 'CURSES' && typeof options === 'object';
};

export const isCantripsSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Maybe<Wiki.ProfessionSelection>,
): options is Just<Record<Wiki.CantripsSelection>> => {
  return id === 'CANTRIPS' && typeof options === 'object';
};

export const isCombatTechniquesSecondSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Maybe<Wiki.ProfessionSelection>,
): options is Just<Record<Wiki.CombatTechniquesSecondSelection>> => {
  return id === 'COMBAT_TECHNIQUES_SECOND' && typeof options === 'object';
};

export const isCombatTechniquesSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Maybe<Wiki.ProfessionSelection>,
): options is Just<Record<Wiki.CombatTechniquesSelection>> => {
  return id === 'COMBAT_TECHNIQUES' && typeof options === 'object';
};

export const isLanguagesScriptsSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Maybe<Wiki.ProfessionSelection>,
): options is Just<Record<Wiki.LanguagesScriptsSelection>> => {
  return id === 'LANGUAGES_SCRIPTS' && typeof options === 'object';
};

export const isSkillsSelection = (
  id: Wiki.ProfessionSelectionIds,
  options: Maybe<Wiki.ProfessionSelection>,
): options is Just<Record<Wiki.SkillsSelection>> => {
  return id === 'SKILLS' && typeof options === 'object';
};
