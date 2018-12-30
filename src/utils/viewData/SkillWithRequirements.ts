import { SkillDependent } from '../activeEntries/SkillDependent';
import { fromDefault } from '../structures/Record';
import { Skill } from '../wikiData/Skill';
import { SkillCombined } from './SkillCombined';
import { IncreasableWithRequirements } from './viewTypeHelpers';

export interface SkillWithRequirements extends SkillCombined, IncreasableWithRequirements { }

const SkillWithRequirements =
  fromDefault<SkillWithRequirements> ({
    wikiEntry: Skill .default,
    stateEntry: SkillDependent .default,
    isIncreasable: false,
    isDecreasable: false,
  })
