import { SkillDependent } from '../activeEntries/SkillDependent';
import { fromDefault, makeGetters } from '../structures/Record';
import { SkillCreator } from '../wikiData/SkillCreator';
import { SkillCombined } from './SkillCombined';
import { IncreasableWithRequirements } from './viewTypeHelpers';

export interface SkillWithRequirements extends SkillCombined, IncreasableWithRequirements { }

const SkillWithRequirements =
  fromDefault<SkillWithRequirements> ({
    wikiEntry: SkillCreator .default,
    stateEntry: SkillDependent .default,
    isIncreasable: false,
    isDecreasable: false,
  })

export const SkillWithRequirementsG = makeGetters (SkillWithRequirements)
