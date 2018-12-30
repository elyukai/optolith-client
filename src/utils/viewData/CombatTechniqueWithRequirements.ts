import { SkillDependent } from '../activeEntries/SkillDependent';
import { Nothing } from '../structures/Maybe';
import { fromDefault } from '../structures/Record';
import { CombatTechnique } from '../wikiData/CombatTechnique';
import { CombatTechniqueWithAttackParryBase } from './CombatTechniqueWithAttackParryBase';

export interface CombatTechniqueWithRequirements extends CombatTechniqueWithAttackParryBase {
  max: number
  min: number
}

export const CombatTechniqueWithRequirements =
  fromDefault<CombatTechniqueWithRequirements> ({
    wikiEntry: CombatTechnique .default,
    stateEntry: SkillDependent .default,
    at: 0,
    pa: Nothing,
    max: 0,
    min: 0,
  })
