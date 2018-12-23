import { ExperienceLevel } from '../../types/wiki';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredFunction } from './sub/typeHelpers';

const ExperienceLevelCreator =
  fromDefault<ExperienceLevel> ({
    id: '',
    name: '',
    ap: 0,
    maxAttributeValue: 0,
    maxSkillRating: 0,
    maxCombatTechniqueRating: 0,
    maxTotalAttributeValues: 0,
    maxSpellsLiturgies: 0,
    maxUnfamiliarSpells: 0,
  })

export const ExperienceLevelG = makeGetters (ExperienceLevelCreator)

export const createExperienceLevel: RequiredFunction<ExperienceLevel> = ExperienceLevelCreator
