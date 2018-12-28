import { SkillDependent } from '../activeEntries/SkillDependent';
import { fromDefault, makeGetters, Record } from '../structures/Record';
import { Skill } from '../wikiData/Skill';

export interface SkillCombined {
  wikiEntry: Record<Skill>
  stateEntry: Record<SkillDependent>
}

export const SkillCombined =
  fromDefault<SkillCombined> ({
    wikiEntry: Skill .default,
    stateEntry: SkillDependent .default,
  })

export const SkillCombinedG = makeGetters (SkillCombined)
