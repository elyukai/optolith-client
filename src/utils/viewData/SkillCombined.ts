import { SkillDependent } from '../../types/data';
import { Skill } from '../../types/wiki';
import { SkillDependentCreator } from '../activeEntries/skillDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { SkillCreator } from '../wikiData/SkillCreator';

export interface SkillCombined {
  wikiEntry: Record<Skill>
  stateEntry: Record<SkillDependent>
}

export const SkillCombined =
  fromDefault<SkillCombined> ({
    wikiEntry: SkillCreator .default,
    stateEntry: SkillDependentCreator .default,
  })

export const SkillCombinedG = makeGetters (SkillCombined)
