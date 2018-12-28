import { Skill } from '../../types/wiki';
import { SkillDependent } from '../activeEntries/skillDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { SkillCreator } from '../wikiData/SkillCreator';

export interface SkillCombined {
  wikiEntry: Record<Skill>
  stateEntry: Record<SkillDependent>
}

export const SkillCombined =
  fromDefault<SkillCombined> ({
    wikiEntry: SkillCreator .default,
    stateEntry: SkillDependent .default,
  })

export const SkillCombinedG = makeGetters (SkillCombined)
