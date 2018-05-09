import * as Data from '../types/data.d';

export const isActivatableDependent = (
  entry: Data.Dependent | undefined
): entry is Data.ActivatableDependent =>
  typeof entry === 'object' &&
  entry.hasOwnProperty('active') &&
  !entry.hasOwnProperty('value');

export const isActivatableSkillDependent = (
  entry: Data.Dependent | undefined
): entry is Data.ActivatableSkillDependent =>
  typeof entry === 'object' &&
  entry.hasOwnProperty('value') &&
  entry.hasOwnProperty('active');

export const isDependentSkill = (
  entry: Data.Dependent | undefined
): entry is Data.SkillDependent =>
  typeof entry === 'object' &&
  entry.hasOwnProperty('value') &&
  !entry.hasOwnProperty('mod') &&
  !entry.hasOwnProperty('active');

export const isDependentSkillExtended = (
  entry: Data.Dependent | undefined
): entry is Data.ExtendedSkillDependent =>
  typeof entry === 'object' &&
  entry.hasOwnProperty('value') &&
  !entry.hasOwnProperty('mod');
