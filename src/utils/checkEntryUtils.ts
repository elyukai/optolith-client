import * as Data from '../types/data.d';

export const isActivatableDependentSkill = (
  entry: Data.ExtendedSkillDependent
): entry is Data.ActivatableSkillDependent => entry.hasOwnProperty('active');
